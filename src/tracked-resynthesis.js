import {partialLimit} from '../labs/oscillator/src/voice-counts.js';
import {TOP_HZ, topGain, sourceWave} from './resynthesis-wave.js';
// The source provides measurements only. All audio comes from the tracked voices.
import {FFT} from '../labs/oscillator/src/fft.js';
import {
  TARGET_SAMPLE_RATE as RATE, MAX_SOUND_DURATION_SECONDS, clamp, effectiveBaseFrequency,
  valueAt, partialDeviationFromNorm, deviationAmountFromCurveY, slopeDbFromNorm,
  resynthesisPan, harmonicBend, outputChannelCount, sourceLayoutRatio, parseMultipliers, modulationAmountAt
} from '../labs/oscillator/src/oscillator-core.js';

const WINDOW = 4096, SIZE = 8192, HOP = 240;
const TAU = 2 * Math.PI;
const hann = Float64Array.from({length: WINDOW}, (_, i) => .5 - .5 * Math.cos(TAU * i / (WINDOW - 1)));

// Signed response of a centered Hann window, in units of FFT bins. The sign
// and phase distinguish leakage from a weaker neighboring sinusoid.
function hannResponse(bins) {
  const x = Math.abs(bins) * (WINDOW - 1) / SIZE;
  if (x < 1e-8) return 1;
  if (Math.abs(x - 1) < 1e-8) return .5;
  return Math.sin(Math.PI * x) / (Math.PI * x * (1 - x*x));
}

function explainedByWindow(bin, peak, real, imag) {
  const distance = Math.abs(bin - peak.center);
  if (distance < 2 * SIZE / (WINDOW - 1) || distance > 20) return false;
  let error = 0, observed = 0;
  for (let k = bin - 1; k <= bin + 1; k++) {
    const angle = -Math.PI * (WINDOW - 1) / SIZE * (k - peak.bin);
    const gain = hannResponse(k - peak.center);
    const c = Math.cos(angle), s = Math.sin(angle);
    const re = gain * (peak.re * c - peak.im * s);
    const im = gain * (peak.re * s + peak.im * c);
    error += (real[k]-re) ** 2 + (imag[k]-im) ** 2;
    observed += real[k] ** 2 + imag[k] ** 2;
  }
  // Leave ambiguous or overlapping components for the existing tracker.
  return error < .04 * observed;
}

class PeakAnalyzer {
  constructor() {
    this.fft = new FFT(SIZE);
    this.real = new Float64Array(SIZE);
    this.imag = new Float64Array(SIZE);
    this.magnitude = new Float64Array(SIZE / 2 + 1);
  }

  peaks(left, right, center, count) {
    const {real, imag, magnitude} = this;
    real.fill(0);
    imag.fill(0);
    const start = center - WINDOW / 2;
    for (let i = Math.max(0, -start); i < Math.min(WINDOW, left.length - start); i++) {
      real[i] = (left[start + i] + right[start + i]) * .5 * hann[i];
    }
    this.fft.transform(real, imag);
    let maximum = 0;
    for (let i = 0; i < magnitude.length; i++) {
      magnitude[i] = Math.sqrt(real[i] ** 2 + imag[i] ** 2);
      maximum = Math.max(maximum, magnitude[i]);
    }
    const threshold = Math.max(1e-7, maximum * .002);
    const bins = [];
    for (let i = Math.ceil(35 * SIZE / RATE); i < 18000 * SIZE / RATE; i++) {
      const peak = magnitude[i];
      if (peak > threshold && peak > magnitude[i-1] && peak >= magnitude[i+1]) bins.push(i);
    }
    bins.sort((a, b) => magnitude[b] - magnitude[a]);
    const peaks = [];
    for (const i of bins) {
      if (peaks.some(p => p.amplitude > 20 * magnitude[i] && explainedByWindow(i, p, real, imag))) continue;
      const [l, m, r] = [i-1, i, i+1].map(k => Math.log(Math.max(1e-15, magnitude[k])));
      const offset = clamp(.5 * (l-r) / Math.min(-1e-12, l-2*m+r), -.5, .5);
      const center = i + offset, response = hannResponse(offset);
      peaks.push({hz: center * RATE / SIZE, amplitude: Math.exp(m - .25*(l-r)*offset),
        bin: i, center, re: real[i]/response, im: imag[i]/response});
      if (peaks.length === count) break;
    }
    return peaks;
  }
}

function matchPeaks(voices, peaks) {
  const pairs = [];
  for (const voice of voices) {
    voice.peak = null;
    if (!voice.active) continue;
    for (const peak of peaks) {
      const cost = Math.abs(voice.hz - peak.hz) / (12 + .035 * peak.hz);
      if (cost <= 1) pairs.push({voice, peak, cost});
    }
  }
  pairs.sort((a,b) => a.cost - b.cost);
  const used = new Set();
  for (const {voice, peak} of pairs) {
    if (voice.peak || used.has(peak)) continue;
    voice.peak = peak;
    used.add(peak);
  }
  const free = voices.filter(v => !v.active);
  let slot = 0;
  for (const peak of peaks) {
    if (slot === free.length) break;
    if (!used.has(peak)) free[slot++].peak = peak;
  }
}

function sourceRms(left, right, center) {
  const start = Math.max(0, center - 480), end = Math.min(left.length, center + 480);
  let power = 0;
  for (let i = start; i < end; i++) power += left[i] ** 2 + right[i] ** 2;
  return Math.sqrt(power / Math.max(1, 2 * (end - start)));
}

export async function trackedResynthesis(packet, settings, {signal, onProgress, cooperative = true} = {}) {
  if (packet.sampleRate !== RATE) throw new RangeError('File Resynthesis requires 48 kHz input.');
  if (!(settings.durationSeconds > 0 && Number.isFinite(settings.durationSeconds))) throw new RangeError('Choose an Output Duration above 0 sec.');
  const frames = Math.ceil(RATE * clamp(settings.durationSeconds, 1, MAX_SOUND_DURATION_SECONDS));
  const channels = Array.from({length: outputChannelCount(settings.format)}, () => new Float32Array(frames));
  const [left, right = left] = packet.channels;
  const end = Math.min(frames, left.length);
  const analyzer = new PeakAnalyzer();
  const analysis = settings.analysisResult;
  if (!analysis?.partials?.length) throw new Error('No analyzed source partials.');
  const reference = clamp(analysis.fundamentalEstimate, 20, 4000);
  const waveform = settings.waveform || 'sine', mode = settings.modulationMode || 'off';
  const modRatio = clamp(Number(settings.modulationRatio) || 1, .25, 8);
  const multipliers = settings.sourceLayout === 'multiplier' ? parseMultipliers(settings.multiplierText) : null;
  const count = partialLimit(analysis.analysis?.requestedPartials);
  const voices = Array.from({length: count}, (_, i) => {
    const angle = (resynthesisPan(i, count) + 1) * Math.PI / 4;
    return {hz: 0, frequency: 0, amplitude: 0, phase: 0, modPhase: 0, active: false,
      bend: harmonicBend(i), left: Math.cos(angle), right: Math.sin(angle)};
  });
  let envelope = sourceRms(left, right, 0), lastProgress = -1, lastYield = performance.now();
  for (let frame = 0; frame < end; frame += HOP) {
    signal?.throwIfAborted();
    const peaks = analyzer.peaks(left, right, frame, count);
    matchPeaks(voices, peaks);
    const norm = Math.sqrt(voices.reduce((sum,v) => sum + (v.peak?.amplitude || 0) ** 2, 0)) || 1;
    const t = frame / frames;
    const base = effectiveBaseFrequency(settings, t);
    const deviation = partialDeviationFromNorm(deviationAmountFromCurveY(valueAt(settings.curves.deviation, t)));
    const slope = slopeDbFromNorm(valueAt(settings.curves.slope, t));
    const samples = Math.min(HOP, end - frame);
    const amount = modulationAmountAt(settings, t);
    const amountStep = (modulationAmountAt(settings, (frame + samples) / frames) - amount) / samples;
    for (const v of voices) {
      if (v.peak) v.hz = v.peak.hz;
      const ratio = sourceLayoutRatio(v.hz / reference, settings.sourceLayout, multipliers);
      const frequency = v.hz ? base * Math.max(.125, ratio + deviation * v.bend) : 0;
      const gain = clamp(10 ** (slope * Math.log2(Math.max(1e-6, frequency / base)) / 20), .03, 1.8);
      const amplitude = (v.peak?.amplitude || 0) / norm * gain * topGain(v.hz);
      if (!v.active && v.peak) v.frequency = frequency;
      const df = (frequency - v.frequency) / HOP, da = (amplitude - v.amplitude) / HOP;
      let phase = v.phase, modPhase = v.modPhase;
      if ((v.amplitude || amplitude) && Math.min(v.frequency, frequency) < TOP_HZ) {
        for (let j = 1; j <= samples; j++) {
          const hz = v.frequency + df*j;
          phase += hz * TAU / RATE;
          modPhase += hz * modRatio * TAU / RATE;
          const wave = sourceWave(waveform, phase, hz, mode, amount + amountStep*j, modPhase, hz * modRatio);
          const sample = wave * (v.amplitude + da*j);
          channels[0][frame+j-1] += sample * v.left;
          if (channels[1]) channels[1][frame+j-1] += sample * v.right;
        }
      } else {
        const advance = (samples*v.frequency + df*samples*(samples+1)/2) * TAU / RATE;
        phase += advance;
        modPhase += advance * modRatio;
      }
      v.phase = phase % TAU;
      v.modPhase = modPhase % TAU;
      v.active = Boolean(v.peak);
      v.frequency = frequency;
      v.amplitude = amplitude;
    }
    const rms = sourceRms(left, right, frame + HOP);
    const tau = rms > envelope ? .006 : .032;
    const next = rms + (envelope - rms) * Math.exp(-HOP / (tau * RATE));
    for (let j = 0; j < samples; j++) {
      // Unit-energy sines with equal-power stereo panning have 0.5 RMS per channel on average.
      const edge = end < frames ? Math.min(1, (end - 1 - frame - j) / 480) : 1;
      const gain = 2 * (envelope + (next-envelope) * j/HOP) * edge;
      for (const channel of channels) channel[frame+j] *= gain;
    }
    envelope = next;
    const progress = .85 * frame/end;
    if (progress - lastProgress > .01) { onProgress?.(progress); lastProgress = progress; }
    if (cooperative && performance.now() - lastYield > 12) {
      await new Promise(resolve => setTimeout(resolve, 0));
      lastYield = performance.now();
    }
  }
  return channels;
}
