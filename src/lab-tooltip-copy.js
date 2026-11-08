const clearCurrent = 'Restore the selected curve to its default values.';

export const labTooltipCopy = {
  audio: {
    '#clearCurveButton': clearCurrent,
    '#resetButton': 'Restore the default Speed, Pitch, and Pan curves.',
  },
  timbre: {
    '#clearCurveButton': clearCurrent,
    '#resetButton': 'Restore all curve defaults, turn off every effect, and clear the effect chain.',
  },
  space: {
    '#clearCurveButton': clearCurrent,
    '#resetButton': 'Restore all curves and set Direction on, Distance and Reverb off, and Decay to 1.2 seconds.',
    '#reverbDecay': 'Set the reverb decay time from 0.3 to 4 seconds.',
  },
  granular: {
    '#clearCurveButton': clearCurrent,
    '#resetButton': 'Restore all curve defaults and reset the Source Window to its minimum length at the start.',
  },
  spectral: {
    '#clearCurveButton': clearCurrent,
    '#resetButton': 'Restore the default values for all spectral curves.',
  },
  oscillator: {
    '#clearCurveButton': clearCurrent,
    '#resetButton': 'Restore all curve defaults for the current synthesis mode.',
    '#resynthesisMode': 'Analyze the working audio and rebuild its spectrum using partials.',
    '#convolutionButton': 'Generate an oscillator sound and optionally shape it with a file used as an impulse response.',
    '[data-waveform="sine"]': 'Use a sine wave for the oscillators.',
    '[data-waveform="triangle"]': 'Use a triangle wave for the oscillators.',
    '[data-waveform="saw"]': 'Use a sawtooth wave for the oscillators.',
    '[data-waveform="square"]': 'Use a square wave for the oscillators.',
    '#countSelect': 'Choose how many oscillators are configured.',
    '#stackSelect': 'Choose how oscillator frequencies are arranged relative to the base frequency.',
    '#modulationSelect': 'Choose FM, AM, or ring modulation, or turn modulation off.',
    '#modulationRatioInput': 'Set the modulator frequency as a multiple of each oscillator frequency.',
    '#partialCountSelect': 'Choose up to 32 or 64 partials for resynthesis.',
    '#convolutionWet': 'Blend the dry oscillator sound with the sound processed by the impulse response.',
    '#impulseLength': 'Set how much of the impulse response is used. Files under 3 seconds are used in full.',
  },
};
