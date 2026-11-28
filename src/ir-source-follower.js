// Source measurements change only the amplitude of the configured oscillators.
import {FFT} from '../labs/oscillator/src/fft.js';
import {TARGET_SAMPLE_RATE as RATE, prepareStackRender, stackFrequencies} from '../labs/oscillator/src/oscillator-core.js';

const HOP = 240, WINDOW = 2048, FFT_SIZE = 4096;
const ATTACK = Math.exp(-HOP / (RATE * .008));
const RELEASE = Math.exp(-HOP / (RATE * .035));
const smooth = (previous, next) => next + (previous - next) * (next > previous ? ATTACK : RELEASE);
const hann = Float64Array.from({length:WINDOW}, (_, i) => .5 - .5 * Math.cos(2 * Math.PI * i / (WINDOW - 1)));

// Accumulate bin power once on a log-frequency grid, shared by all voices.
const STEPS = 48, SIGMA = .26 * STEPS, RADIUS = Math.ceil(5 * SIGMA);
const GRID_LENGTH = Math.ceil(STEPS * Math.log2(RATE / 2)) + 2;
const positions = Float64Array.from({length:FFT_SIZE / 2 + 1}, (_, bin) =>
  STEPS * Math.log2(Math.max(1, bin * RATE / FFT_SIZE)));
const kernel = Float64Array.from({length:RADIUS * 2 + 1}, (_, i) =>
  Math.exp(-.5 * ((i - RADIUS) / SIGMA) ** 2));

function envelope(left, right, length) {
  const values = new Float64Array(Math.ceil(length / HOP) + 1);
  let maximum = 0;
  for (let j = 0; j < values.length; j++) {
    const center = j * HOP;
    const start = Math.max(0, center - 480), end = Math.min(left.length, center + 480);
    let power = 0;
    for (let i = start; i < end; i++) power += left[i] ** 2 + right[i] ** 2;
    const rms = Math.sqrt(power / Math.max(1, 2 * (end - start)));
    values[j] = j ? smooth(values[j-1], rms) : rms;
    maximum = Math.max(maximum, values[j]);
  }
  if (maximum) for (let j = 0; j < values.length; j++) values[j] /= maximum;
  return values;
}

export function createIRSourceFollower(packet, settings, frames) {
  if (packet.sampleRate !== RATE) throw new Error('Oscillator + File IR requires 48 kHz input.');
  const [left, right = left] = packet.channels;
  const length = Math.min(left.length, frames);
  const levels = envelope(left, right, length);
  const fft = new FFT(FFT_SIZE), real = new Float64Array(FFT_SIZE), imag = new Float64Array(FFT_SIZE);
  const grid = new Float64Array(GRID_LENGTH), bandCache = new Float64Array(GRID_LENGTH);
  const analysisBank = prepareStackRender(settings);
  const measured = new Float64Array(analysisBank.count);
  let current = new Float64Array(analysisBank.count), next = current.slice();

  function bandPower(bin) {
    if (bandCache[bin] >= 0) return bandCache[bin];
    let sum = 0;
    const first = Math.max(0, bin - RADIUS), last = Math.min(grid.length - 1, bin + RADIUS);
    for (let k = first; k <= last; k++) sum += grid[k] * kernel[k - bin + RADIUS];
    bandCache[bin] = sum;
    return sum;
  }

  function measure(center, gains) {
    real.fill(0);
    imag.fill(0);
    const start = center - WINDOW / 2;
    const first = Math.max(0, -start), last = Math.min(WINDOW, left.length - start);
    let midPower = 0, stereoPower = 0;
    for (let i = first; i < last; i++) {
      const l = left[start+i], r = right[start+i];
      real[i] = (l + r) * .5 * hann[i];
      midPower += real[i] ** 2;
      stereoPower += (l*l + r*r) * hann[i] ** 2;
    }
    // Retain spectral detail for stereo recordings whose channels cancel in mono.
    if (midPower < stereoPower * 1e-8) {
      for (let i = first; i < last; i++) real[i] = (left[start+i] - right[start+i]) * .5 * hann[i];
    }
    fft.transform(real, imag);
    bandCache.fill(-1);
    grid.fill(0);
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i], bin = Math.floor(pos), fraction = pos - bin;
      const power = real[i] ** 2 + imag[i] ** 2;
      grid[bin] += power * (1 - fraction);
      grid[bin+1] += power * fraction;
    }
    const voices = stackFrequencies(settings, Math.min(1, center / frames), RATE, null, analysisBank);
    let strongest = 1e-9;
    for (const {index, frequency} of voices) {
      const pos = STEPS * Math.log2(Math.max(1,frequency)), bin = Math.floor(pos);
      const power = bandPower(bin) + (pos - bin) * (bandPower(bin+1) - bandPower(bin));
      const amplitude = Math.sqrt(Math.max(0, power));
      measured[index] = center ? smooth(measured[index], amplitude) : amplitude;
      strongest = Math.max(strongest, measured[index]);
    }
    let before = 0, after = 0;
    gains.fill(1);
    for (const {index, amplitude} of voices) {
      const gain = .12 + .88 * (measured[index] / strongest) ** .7;
      gains[index] = gain;
      before += amplitude ** 2;
      after += (amplitude * gain) ** 2;
    }
    const correction = after ? Math.sqrt(before / after) : 1;
    for (const {index} of voices) gains[index] *= correction;
  }

  measure(0, next);
  return {
    length, current, next, fraction:0,
    update(frame) {
      const offset = frame % HOP;
      if (!offset) {
        [current, next] = [next, current];
        measure(frame + HOP, next);
        this.current = current;
        this.next = next;
      }
      const hop = Math.floor(frame / HOP);
      this.fraction = offset / HOP;
      return levels[hop] + this.fraction * (levels[hop+1] - levels[hop]);
    }
  };
}
