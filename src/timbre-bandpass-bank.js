// Parallel, unity-peak state-variable bandpasses in the Hub's Timbre renderer.
import {BANDPASS_BANK_COUNTS, resonatorFrequencyFromNorm, RESONATOR_DEFAULTS} from './timbre-resonator.js';

const LOW_HARMONIC_GAIN = 10 ** (3 / 20);
const ORIGINAL_HARMONIC_PROFILE = 'harmonic-456-v1';
const ORIGINAL_BRIGHT_PROFILE = 'harmonic-456-bright-v2';
const STEEP_BRIGHT_PROFILE = 'harmonic-456-bright-v3';
const BASS_PROFILE = 'harmonic-456-bass-v4';
export const HARMONIC_BANK_PROFILE = 'bank-clarity-v5';
const usesBassFloor = profile => profile === BASS_PROFILE || profile === HARMONIC_BANK_PROFILE;
// Below this center, retain a minimum bandwidth of 300 / Q Hz.
const BASS_BANDWIDTH_REFERENCE_HZ = 300;
export const PIANO_BANK_PROFILE = 'piano-mf-v1';
// Relative partial energy in dB, 80–480 ms after onset, from Iowa's
// Piano.mf.A2/A3/A4 recordings (theremin.music.uiowa.edu/MISpiano.html).
// Keep consecutive measured partials above a 12 dB local noise margin.
const PIANO_PARTIAL_DB = [
  [0.0, -0.61, 1.32, -2.97, -8.91, -1.74, -6.32, -13.06, -8.23, -13.59, -24.77, -18.96, -17.87, -13.5, -24.53, -25.27], // A2
  [0.0, -3.62, -2.69, -6.44, -23.01, -4.69, -9.7, -30.0, -31.46, -39.5, -38.97, -36.94, -45.65, -49.35, -54.82], // A3
  [0.0, -9.64, -17.89, -21.94, -31.74, -35.18, -39.67, -49.59], // A4
];

function partialGain(db, ratio) {
  const last = db.length;
  if (ratio >= last) {
    // Beyond the measured range this is a design choice: -12 dB/octave.
    return 10 ** ((db[last - 1] - 12 * Math.log2(ratio / last)) / 20);
  }
  const n = Math.floor(ratio);
  const t = Math.log(ratio / n) / Math.log((n + 1) / n);
  return 10 ** ((db[n - 1] + t * (db[n] - db[n - 1])) / 20);
}

// Relative wet gains for partials 1–8. Partials 4:5:6 carry a just major triad.
const HARMONIC_GAIN_DB = [-24, -24, -8, -4, 0, -2, -18, -15];
function harmonicWeight(partial) {
  const db = HARMONIC_GAIN_DB[partial - 1] ?? -20 - 12 * Math.log2(partial / 8);
  return 10 ** (db / 20);
}

function pianoWeights(bands) {
  return PIANO_PARTIAL_DB.map(db => {
    const gains = bands.map(b => partialGain(db, b.ratio));
    const norm = Math.hypot(...gains);
    return gains.map(gain => gain / norm);
  });
}

const MIN_Q = 24;
const MAX_Q = 240;
export const DEFAULT_BANK_Q = 120;
export const bankQFromNorm = y => MIN_Q * (MAX_Q / MIN_Q) ** Math.max(0, Math.min(1, y));
export const bankQToNorm = q => Math.log(q / MIN_Q) / Math.log(MAX_Q / MIN_Q);

export function bankTailSeconds(curves, settings, rate) {
  if (!settings.resonatorEnabled || !settings.chainOrder?.includes('resonator')) return 0;
  const lowestHz = curves.resonatorFrequency?.length
    ? resonatorFrequencyFromNorm(Math.min(...curves.resonatorFrequency.map(p => p.y)), settings.bankFrequencyMinHz) : RESONATOR_DEFAULTS.frequencyHz;
  const decayHz = usesBassFloor(settings.bankProfile) ? Math.max(BASS_BANDWIDTH_REFERENCE_HZ, lowestHz) : lowestHz;
  const q = curves.resonatorQ?.length ? Math.max(...curves.resonatorQ.map(p => bankQFromNorm(p.y))) : DEFAULT_BANK_Q;
  // The slowest pole occurs at the smallest sin(w) over the usable band.
  const minSin = Math.min(Math.sin(2 * Math.PI * Math.min(decayHz / rate, 0.45)), Math.sin(0.9 * Math.PI));
  return Math.log(1000) * 2 * q / (rate * minSin) + 0.05;
}

// Fixed half-power edges, independent of the moving bank's frequency, spacing and Q.
function createBrightnessBand(rate, steepLowEdge) {
  const upperHz = Math.min(8000, rate * 0.45);
  if (upperHz <= 4000) return null;
  const low = Math.tan(Math.PI * 4000 / rate);
  const high = Math.tan(Math.PI * upperHz / rate);
  const g = Math.sqrt(low * high);
  const k = (high - low) / g;
  const a1 = 1 / (1 + g * (g + k));
  // Only the fixed parallel branch gets this fourth-order Butterworth high-pass.
  const highpass = [];
  if (steepLowEdge) {
    const w = Math.tan(Math.PI * 3700 / rate);
    for (const k of [2 * Math.cos(Math.PI / 8), 2 * Math.cos(3 * Math.PI / 8)]) {
      const b0 = 1 / (1 + k * w + w * w);
      highpass.push({b0, a1: 2 * (w * w - 1) * b0, a2: (1 - k * w + w * w) * b0,
        left: {z1: 0, z2: 0}, right: {z1: 0, z2: 0}});
    }
  }
  return {highpass, a1, a2: g * a1, a3: g * g * a1, level: k * 10 ** (-22 / 20),
    left: {s1: 0, s2: 0}, right: {s1: 0, s2: 0}};
}

const MULTIPLIERS = [1, 1.5, 2, 2.5];

function layoutRatio(layout, index, count) {
  if (layout === 'twoOctaves') return 4 ** (index / (count - 1));
  if (layout === 'odd') return 2 * index + 1;
  // Group equal ratios so a Spacing sweep opens them in frequency order.
  if (layout === 'multiplier') return MULTIPLIERS[Math.floor(index * MULTIPLIERS.length / count)];
  return index + 1;
}

export function createBandpassBank(rate, count, layout, emphasizeLowHarmonics = false, profile = null) {
  if (!BANDPASS_BANK_COUNTS.includes(count)) throw new RangeError('Unsupported Bandpass Bank count.');
  const hasBrightness = usesBassFloor(profile) || profile === STEEP_BRIGHT_PROFILE || profile === ORIGINAL_BRIGHT_PROFILE;
  const harmonicProfile = hasBrightness || profile === ORIGINAL_HARMONIC_PROFILE;
  const voiced = layout === 'harmonic' && harmonicProfile;
  const clearLayout = profile === HARMONIC_BANK_PROFILE && (layout === 'odd' || layout === 'multiplier');
  const bands = Array.from({length: count}, (_, i) => {
    const ratio = layoutRatio(layout, i, count);
    let weight = voiced ? harmonicWeight(i + 1) : 1 / Math.sqrt(i + 1);
    if (layout === 'multiplier') {
      weight = clearLayout ? Math.sqrt(ratio / 2.5) : 1 / Math.sqrt(ratio);
    }
    if (clearLayout) {
      if (ratio === 1) weight *= 0.55;
      else if (layout === 'odd') weight = Math.min(1, Math.sqrt(5 / ratio));
    }
    return {ratio, weight,
      a1: 0, a2: 0, a3: 0, level: 0,
      left: {s1: 0, s2: 0}, right: {s1: 0, s2: 0}};
  });
  // At neutral spacing duplicate filters add coherently, not in quadrature.
  const copies = layout === 'multiplier' ? count / MULTIPLIERS.length : 1;
  const normalization = 1 / (Math.hypot(...bands.map(b => b.weight)) * Math.sqrt(copies));
  const usePiano = (layout === 'harmonic' || layout === 'twoOctaves') &&
    (profile === PIANO_BANK_PROFILE || (!voiced && harmonicProfile));
  const piano = usePiano ? pianoWeights(bands) : null;
  if (!voiced && !piano && emphasizeLowHarmonics) {
    for (const band of bands) {
      if (band.ratio <= 8) band.weight *= LOW_HARMONIC_GAIN;
    }
  }
  const brightness = voiced && hasBrightness ? createBrightnessBand(rate, profile !== ORIGINAL_BRIGHT_PROFILE) : null;
  return {bands, brightness, clearLayout, bassBandwidthFloor: usesBassFloor(profile), rate, normalization: piano ? 1 : normalization, piano,
    frequency: 0, q: 0, spacing: 0.5, smooth: 1 - Math.exp(-1 / (0.01 * rate))};
}

export function tuneBandpassBank(bank, frequency, q, spacing = 0.5) {
  const first = bank.frequency === 0;
  if (bank.frequency === frequency && bank.q === q && bank.spacing === spacing) return;
  const glide = (old, target) => first || Math.abs(old - target) < 1e-8 ? target : old + bank.smooth * (target - old);
  bank.frequency = glide(bank.frequency, frequency);
  bank.q = glide(bank.q, q);
  bank.spacing = glide(bank.spacing, spacing);
  // Scale offsets from the first band. Above center, blend toward a 10 Hz grid.
  const layoutScale = 2 * (1 - bank.spacing);
  const tightStep = 10 * Math.max(0, 2 * bank.spacing - 1);
  const inverseQ = 1 / bank.q;
  // Shorter resonance trails at neutral spacing; more damping as bands converge.
  const bandwidthReference = bank.clearLayout
    ? 1200 + 1200 * Math.max(0, 2 * bank.spacing - 1) : BASS_BANDWIDTH_REFERENCE_HZ;
  // Blend the normalized anchor gains by pitch and hold the nearest anchor
  // outside A2–A4. Frequency and Q still control the original band positions.
  const octave = bank.piano ? Math.max(0, Math.min(2, Math.log2(bank.frequency / 110))) : 0;
  const anchor = Math.min(1, Math.floor(octave));
  for (let i = 0; i < bank.bands.length; i++) {
    const b = bank.bands[i];
    if (bank.piano) {
      const lo = bank.piano[anchor][i];
      b.weight = lo + (octave - anchor) * (bank.piano[anchor + 1][i] - lo);
    }
    const layoutHz = bank.frequency * b.ratio;
    const hz = bank.spacing === 0.5 ? layoutHz
      : bank.frequency + (layoutHz - bank.frequency) * layoutScale + i * tightStep;
    const fade = Math.min(1, Math.max(0, (hz / bank.rate - 0.4) / 0.05));
    const g = Math.tan(Math.PI * Math.min(0.45, hz / bank.rate));
    const k = bank.bassBandwidthFloor && hz < bandwidthReference
      ? Math.min(Math.SQRT2, inverseQ * bandwidthReference / hz) : inverseQ;
    b.a1 = 1 / (1 + g * (g + k));
    b.a2 = g * b.a1;
    b.a3 = g * b.a2;
    b.level = k * b.weight * bank.normalization * (1 - fade * fade * (3 - 2 * fade));
  }
}

function bandOutput(input, b, channel) {
  const s = b[channel];
  const v3 = input - s.s2;
  const v1 = b.a1 * s.s1 + b.a2 * v3;
  const v2 = s.s2 + b.a2 * s.s1 + b.a3 * v3;
  s.s1 = 2 * v1 - s.s1;
  s.s2 = 2 * v2 - s.s2;
  return b.level * v1;
}

export function filterBankChannel(input, bank, channel) {
  let wet = 0;
  for (const band of bank.bands) wet += bandOutput(input, band, channel);
  if (!bank.brightness) return wet;
  let bright = bandOutput(input, bank.brightness, channel);
  for (const stage of bank.brightness.highpass) {
    const state = stage[channel];
    const feed = stage.b0 * bright;
    const out = feed + state.z1;
    state.z1 = -2 * feed - stage.a1 * out + state.z2;
    state.z2 = feed - stage.a2 * out;
    bright = out;
  }
  return wet + bright;
}
