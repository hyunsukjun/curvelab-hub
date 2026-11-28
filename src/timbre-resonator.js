// Hub-only modal resonator. The existing individual Labs and their DSP stay separate.
export const RESONATOR_PRESETS = Object.freeze({
  harmonic: Object.freeze({label: 'Harmonic', ratios: Object.freeze([1, 2, 3])}),
  open: Object.freeze({label: 'Open', ratios: Object.freeze([1, 1.5, 2])}),
  metallic: Object.freeze({label: 'Metallic', ratios: Object.freeze([1, Math.SQRT2, Math.E])}),
});
export const RESONATOR_DEFAULTS = Object.freeze({frequencyHz: 440, decaySeconds: 0.25, mix: 0.2, count: 8, preset: 'harmonic'});
export const RESONATOR_COUNTS = Object.freeze([4, 8, 16, 32]);
export const BANDPASS_BANK_COUNTS = Object.freeze([...RESONATOR_COUNTS, 64, 128]);
const EXTENDED_MODAL_LAYOUTS = Object.freeze({
  harmonic: {label: 'Harmonic'},
  twoOctaves: {label: 'Two octaves'},
});

export function resonatorCountFor(settings = {}) {
  const count = settings.resonatorCount;
  if (settings.resonatorModel === 'bandpass') {
    return BANDPASS_BANK_COUNTS.includes(count) ? count : RESONATOR_DEFAULTS.count;
  }
  if (count === 3 || RESONATOR_COUNTS.includes(count)) return count;
  // Recipes from the three-mode release have a preset but no count.
  if (count == null && (settings.resonatorPreset != null || settings.resonatorEnabled)) return 3;
  return RESONATOR_DEFAULTS.count;
}

const BANK_LAYOUTS = Object.freeze({
  harmonic: {label: 'Harmonic'},
  odd: {label: 'Odd Harmonics'},
  multiplier: {label: 'Multiplier'},
});

export function resonatorLayouts(count, isBank, selected) {
  if (!isBank) return count === 3 ? RESONATOR_PRESETS : EXTENDED_MODAL_LAYOUTS;
  if (selected === 'twoOctaves') return {...BANK_LAYOUTS, twoOctaves: {label: 'Two octaves (legacy)'}};
  return BANK_LAYOUTS;
}

function bankRatios(count) {
  if (count === 3) return RESONATOR_PRESETS;
  return {
    harmonic: {ratios: Array.from({length: count}, (_, i) => i + 1)},
    twoOctaves: {ratios: Array.from({length: count}, (_, i) => 4 ** (i / (count - 1)))},
  };
}

export const BANK_FREQUENCY_MIN_HZ = 20;
export const RESONATOR_FREQUENCY_MIN_HZ = 60;
export const RESONATOR_FREQUENCY_MAX_HZ = 6000;
export const RESONATOR_DECAY_MIN_SECONDS = 0.03;
export const RESONATOR_DECAY_MAX_SECONDS = 2;
export const RESONATOR_TAIL_MARGIN_SECONDS = 0.05;
export const RESONATOR_DC_BLOCK_HZ = 10;
// A conservative extra tail for the wet-input DC blocker's -60 dB decay.
export const RESONATOR_DC_TAIL_SECONDS = Math.log(1000) / (2 * Math.PI * RESONATOR_DC_BLOCK_HZ);
const LOG_T60 = Math.log(0.001);
const CONTROL_FRAMES = 1;
const SMOOTH_SECONDS = 0.01;
const clamp = (value, min, max, fallback = min) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : fallback));
const norm = value => clamp(value, 0, 1);
const logMap = (value, min, max) => min * (max / min) ** norm(value);
const logInverse = (value, min, max) => Math.log(clamp(value, min, max) / min) / Math.log(max / min);

export const resonatorFrequencyFromNorm = (value, minHz = RESONATOR_FREQUENCY_MIN_HZ) => logMap(value, minHz, RESONATOR_FREQUENCY_MAX_HZ);
export const resonatorFrequencyToNorm = (value, minHz = RESONATOR_FREQUENCY_MIN_HZ) => logInverse(value, minHz, RESONATOR_FREQUENCY_MAX_HZ);
export const resonatorDecayFromNorm = value => logMap(value, RESONATOR_DECAY_MIN_SECONDS, RESONATOR_DECAY_MAX_SECONDS);
export const resonatorDecayToNorm = value => logInverse(value, RESONATOR_DECAY_MIN_SECONDS, RESONATOR_DECAY_MAX_SECONDS);
export const resonatorMixFromNorm = norm;
export const RESONATOR_DEFAULT_NORMALIZED = Object.freeze({
  frequency: resonatorFrequencyToNorm(RESONATOR_DEFAULTS.frequencyHz),
  decay: resonatorDecayToNorm(RESONATOR_DEFAULTS.decaySeconds),
  mix: RESONATOR_DEFAULTS.mix,
});

// Conservative tail for a source-timed curve. The existing Delay tail is added by
// the renderer so either series order can finish. No enabled/wet mode: no padding.
export function resonatorTailSeconds(curves, settings) {
  if (!settings.resonatorEnabled || !settings.chainOrder?.includes('resonator')) return 0;
  const mix = curves.resonatorMix?.length
    ? Math.max(...curves.resonatorMix.map(point => resonatorMixFromNorm(point.y)))
    : RESONATOR_DEFAULTS.mix;
  if (mix === 0) return 0;
  const decay = curves.resonatorDecay?.length
    ? Math.max(...curves.resonatorDecay.map(point => resonatorDecayFromNorm(point.y)))
    : RESONATOR_DEFAULTS.decaySeconds;
  return Math.min(RESONATOR_DECAY_MAX_SECONDS, decay) + RESONATOR_DC_TAIL_SECONDS + RESONATOR_TAIL_MARGIN_SECONDS;
}

export function createResonatorState(sampleRate, count = RESONATOR_DEFAULTS.count) {
  if (!Number.isFinite(sampleRate) || sampleRate < 1000) throw new RangeError('Invalid Resonator sample rate.');
  if (count !== 3 && !RESONATOR_COUNTS.includes(count)) throw new RangeError('Invalid Resonator count.');
  // Taper upper modes and normalize their combined power. This avoids both
  // summing all bands at full gain and dividing a lone excited band by count.
  const weights = Array.from({length: count}, (_, i) => count === 3 ? 1 : 1 / Math.sqrt(i + 1));
  const wetScale = 2 / (count === 3 ? 3 : Math.hypot(...weights));
  return {
    layouts: bankRatios(count), legacy: count === 3, wetScale,
    sampleRate, initialized: false, controlCountdown: 0,
    dcPole: Math.exp(-2 * Math.PI * RESONATOR_DC_BLOCK_HZ / sampleRate),
    dcPreviousInput: 0, dcPreviousOutput: 0,
    controlSmoothing: 1 - Math.exp(-CONTROL_FRAMES / (sampleRate * SMOOTH_SECONDS)),
    mixSmoothing: 1 - Math.exp(-1 / (sampleRate * SMOOTH_SECONDS)),
    logFrequency: 0, logDecay: 0, mix: 0,
    controlSettled: false, targetFrequency: null, targetDecay: null, targetPreset: null,
    modes: weights.map(weight => ({weight, audibleWeight: weight, real: 0, imaginary: 0, ratio: 1, rotationReal: 0, rotationImaginary: 0, drive: 0})),
  };
}

function updateControl(state, frequencyHz, decaySeconds, preset) {
  if (state.controlSettled && frequencyHz === state.targetFrequency && decaySeconds === state.targetDecay && preset === state.targetPreset) return;
  state.targetFrequency = frequencyHz;
  state.targetDecay = decaySeconds;
  state.targetPreset = preset;
  const ratios = (Object.hasOwn(state.layouts, preset)
    ? state.layouts[preset] : state.layouts.harmonic).ratios;
  const frequency = Math.log(clamp(frequencyHz, RESONATOR_FREQUENCY_MIN_HZ, RESONATOR_FREQUENCY_MAX_HZ, RESONATOR_DEFAULTS.frequencyHz));
  const decay = Math.log(clamp(decaySeconds, RESONATOR_DECAY_MIN_SECONDS, RESONATOR_DECAY_MAX_SECONDS, RESONATOR_DEFAULTS.decaySeconds));
  const smoothing = state.initialized ? state.controlSmoothing : 1;
  state.logFrequency += (frequency - state.logFrequency) * smoothing;
  state.logDecay += (decay - state.logDecay) * smoothing;
  if (Math.abs(frequency - state.logFrequency) < 1e-12) state.logFrequency = frequency;
  if (Math.abs(decay - state.logDecay) < 1e-12) state.logDecay = decay;
  let settled = state.logFrequency === frequency && state.logDecay === decay;
  const baseFrequency = Math.exp(state.logFrequency);
  const t60 = Math.exp(state.logDecay);
  // Pole envelope is exactly -60 dB after T60 seconds at constant settings.
  // Every rotation contracts by radius < 1, including while tuning changes.
  const radius = Math.exp(LOG_T60 / (t60 * state.sampleRate));
  for (let index = 0; index < state.modes.length; index++) {
    const mode = state.modes[index];
    mode.ratio += (ratios[index] - mode.ratio) * smoothing;
    if (Math.abs(ratios[index] - mode.ratio) < 1e-12) mode.ratio = ratios[index];
    settled = settled && mode.ratio === ratios[index];
    const targetHz = baseFrequency * mode.ratio;
    const hz = Math.min(state.sampleRate * 0.45, Math.max(10, targetHz));
    if (!state.legacy) {
      // Smoothly silence bands between 40% and 45% of the sample rate.
      const t = Math.min(1, Math.max(0, (targetHz / state.sampleRate - 0.4) / 0.05));
      mode.audibleWeight = mode.weight * (1 - t * t * (3 - 2 * t));
    }
    const angle = 2 * Math.PI * hz / state.sampleRate;
    mode.rotationReal = radius * Math.cos(angle);
    mode.rotationImaginary = radius * Math.sin(angle);
    mode.drive = 1 - radius;
  }
  state.controlSettled = settled;
}

export function processResonator(input, state, frequencyHz, decaySeconds, mix, preset = RESONATOR_DEFAULTS.preset) {
  const requestedMix = resonatorMixFromNorm(mix);
  if (state.controlCountdown-- <= 0) {
    updateControl(state, frequencyHz, decaySeconds, preset);
    state.controlCountdown = CONTROL_FRAMES - 1;
  }
  if (!state.initialized) state.mix = requestedMix;
  else state.mix += (requestedMix - state.mix) * state.mixSmoothing;
  state.initialized = true;
  return processResonatorChannel(input, state, state);
}

// Both stereo channels follow identical control curves. Reuse the current
// rotations and mix, but keep each channel's excitation and ringing independent.
export function processResonatorChannel(input, state, control) {
  if (!Number.isFinite(input)) throw new RangeError('Invalid Resonator audio sample.');
  const dryInput = input;
  // Remove DC before it excites the modes. The dry branch remains untouched.
  // Nyquist-normalized one-pole high pass: approximately -0.12 dB at 60 Hz.
  const filtered = (1 + state.dcPole) / 2 * (input - state.dcPreviousInput) + state.dcPole * state.dcPreviousOutput;
  state.dcPreviousInput = input;
  state.dcPreviousOutput = filtered;
  input = filtered;
  let wet = 0;
  for (let i = 0; i < state.modes.length; i++) {
    const mode = state.modes[i];
    const coeff = control.modes[i];
    const real = mode.real * coeff.rotationReal - mode.imaginary * coeff.rotationImaginary + coeff.drive * input;
    mode.imaginary = mode.real * coeff.rotationImaginary + mode.imaginary * coeff.rotationReal;
    mode.real = real;
    wet += real * coeff.audibleWeight;
  }
  wet *= control.wetScale;
  return dryInput + control.mix * (wet - dryInput);
}
