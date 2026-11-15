export const OUTPUT_GAIN_MIN_DB = -12;
export const OUTPUT_GAIN_MAX_DB = 12;
export const OUTPUT_CEILING_DB = -1;
export const outputGainLinear = db => 10 ** (db / 20);

const NEAR_SILENT_PEAK = outputGainLinear(-80);
// Allow for half a 24-bit quantization step when the same samples are saved as WAV.
const OUTPUT_CEILING_PEAK = Math.fround(outputGainLinear(OUTPUT_CEILING_DB) - .5 / (2 ** 23 - 1));
const CHUNK_SAMPLES = 1 << 20;
const peakDb = peak => peak > 0 ? 20 * Math.log10(peak) : null;

async function forSampleChunks(channels, signal, visit) {
  for (const channel of channels) {
    for (let start = 0; start < channel.length; start += CHUNK_SAMPLES) {
      signal?.throwIfAborted();
      const end = Math.min(start + CHUNK_SAMPLES, channel.length);
      visit(channel, start, end);
      if (end < channel.length) await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  signal?.throwIfAborted();
}

// The handoff owns these rendered buffers. Apply one factor across all channels.
export async function measureOutputPeak(channels, signal) {
  let peak = 0;
  await forSampleChunks(channels, signal, (channel, start, end) => {
    for (let i = start; i < end; i++) {
      const magnitude = Math.abs(channel[i]);
      if (!Number.isFinite(magnitude)) throw new Error('Invalid audio sample; previous input retained');
      if (magnitude > peak) peak = magnitude;
    }
  });
  return peak;
}

export function outputGainForPeak(peak, requestedDb) {
  if (!Number.isFinite(requestedDb)) throw new Error('Invalid output gain');
  const requestedGainDb = Math.max(OUTPUT_GAIN_MIN_DB, Math.min(OUTPUT_GAIN_MAX_DB, requestedDb));
  const inputPeakDb = peakDb(peak);
  const skipped = requestedGainDb > 0 && peak <= NEAR_SILENT_PEAK;
  if (skipped) {
    return {gain: 1, outputGain: {requestedGainDb, inputPeakDb, gainDb: 0, outputPeakDb: inputPeakDb, limited: false, skipped}};
  }
  const requestedGain = outputGainLinear(requestedGainDb);
  const gain = Math.min(requestedGain, OUTPUT_CEILING_PEAK / peak);
  const limited = gain < requestedGain;
  const outputPeakDb = peakDb(Math.fround(peak * gain));
  return {gain, outputGain: {requestedGainDb, inputPeakDb, gainDb: limited ? peakDb(gain) : requestedGainDb, outputPeakDb, limited, skipped}};
}

export async function scaleOutput(channels, gain, signal) {
  if (gain !== 1) {
    await forSampleChunks(channels, signal, (channel, start, end) => {
      for (let i = start; i < end; i++) channel[i] *= gain;
    });
  }
}

export async function applyOutputGain(channels, requestedDb, {signal} = {}) {
  const {gain, outputGain} = outputGainForPeak(await measureOutputPeak(channels, signal), requestedDb);
  await scaleOutput(channels, gain, signal);
  return outputGain;
}
