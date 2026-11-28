import {MAX_VOICES} from './voice-counts.js';
import {irSourceReleaseGain} from "./ir-source-boundary.js?v=20261030-ir-end1";
import { fadeOutput } from "./playback-boundary.js";
import { renderFrame, prepareResynthesisRender, prepareStackRender, createSmoothingState, TARGET_SAMPLE_RATE, MAX_SOUND_DURATION_SECONDS, clamp, encodeWav24Steps, outputChannelCount } from "./oscillator-core.js?v=hub-long-output1";
import { renderConvolved } from "./convolution.js?v=20261006-cancel-drain1";
import { limitChannelsSteps, LOOKAHEAD_SECONDS } from "./safety-limiter.js?v=20261006-cooperative1";

function checkAbort(signal) {
  if (signal?.aborted) throw new DOMException("Render cancelled", "AbortError");
}

async function yieldUI(signal) {
  await new Promise(resolve => setTimeout(resolve, 0));
  checkAbort(signal);
}

// The caller owns a settings snapshot. The worker needs only the IR length
// here to apply the same release to the body before native convolution.
export async function synthesizeOscillatorBody({ settings, createFollower = null, impulseLength = 0, signal, onProgress, cooperative = true }) {
  checkAbort(signal);
  const sampleRate = TARGET_SAMPLE_RATE;
  const requestedDuration = Number(settings.durationSeconds ?? 20);
  if (!Number.isFinite(requestedDuration) || requestedDuration <= 0) throw new RangeError("Choose an Output Duration above 0 sec.");
  const duration = clamp(requestedDuration, 1, MAX_SOUND_DURATION_SECONDS);
  const durationFrames = duration * sampleRate;
  const frameCount = Math.ceil(durationFrames);
  const channelCount = outputChannelCount(settings.format);
  const output = Array.from({ length: channelCount }, () => new Float32Array(frameCount));
  const phases = new Float64Array(MAX_VOICES);
  const modPhases = new Float64Array(MAX_VOICES);
  const smoothingState = createSmoothingState();
  const prepared = prepareResynthesisRender(settings) ?? prepareStackRender(settings);
  const convolving = impulseLength > 0 && settings.convolutionEnabled && settings.convolutionWet > 0;
  const progressEnd = convolving ? 0.75 : 0.85;
  let lastProgress = 0;
  let lastYield = performance.now();

  const sourceFollower = createFollower?.(frameCount);
  const activeFrames = sourceFollower?.length ?? frameCount;
  for (let frame = 0; frame < activeFrames; frame += 1) {
    const t = frame / durationFrames;
    const level = sourceFollower ? sourceFollower.update(frame) : 1;
    const sample = renderFrame(settings, t, sampleRate, phases, modPhases, smoothingState, prepared, sourceFollower);
    const fade = convolving ? irSourceReleaseGain(frame, frameCount, impulseLength - 1, sampleRate) : 1;
    const sourceEdge = activeFrames < frameCount ? Math.min(1, (activeFrames - 1 - frame) / (sampleRate * .01)) : 1;
    const gain = level * sourceEdge * fade;
    const left = sample.left * gain;
    const right = sample.right * gain;
    output[0][frame] = left;
    if (channelCount > 1) output[1][frame] = right;

    if ((frame & 511) === 0) {
      checkAbort(signal);
      const progress = (frame / frameCount) * progressEnd;
      const now = cooperative ? performance.now() : 0;
      if (progress - lastProgress > 0.01 || now - lastYield > 12) {
        lastProgress = progress;
        lastYield = now;
        onProgress?.(progress);
        if (cooperative) await yieldUI(signal);
      }
    }
  }

  checkAbort(signal);
  return output;
}

export async function finishOscillatorOutput({ channels, signal, onProgress, samplesOnly = false, pcmOnly = false, cooperative = true }) {
  const consume = async steps => {
    let step;
    let lastYield = performance.now();
    do {
      checkAbort(signal);
      step = steps.next();
      if (cooperative && !step.done && performance.now() - lastYield >= 12) {
        await yieldUI(signal);
        lastYield = performance.now();
      }
    } while (!step.done);
    checkAbort(signal);
    return step.value;
  };
  const sampleRate = TARGET_SAMPLE_RATE;
  // Flush the unchanged limiter, then remove only its leading algorithmic delay.
  // Preserve every source/tail sample; do not trim the end to force duration.
  const latencyFrames = Math.round(sampleRate * LOOKAHEAD_SECONDS);
  let output = await consume(limitChannelsSteps(channels, sampleRate));
  // Internal FFT/reference PCM retains the realtime timeline. Compensate files only.
  if (!samplesOnly) output = output.map(channel => channel.subarray(latencyFrames));
  fadeOutput(samplesOnly ? output.map(channel => channel.subarray(latencyFrames)) : output, sampleRate);
  let peak = 0;
  let lastYield = performance.now();
  for (const channel of output) {
    for (let start = 0; start < channel.length; start += 65536) {
      const end = Math.min(channel.length, start + 65536);
      for (let i = start; i < end; i++) peak = Math.max(peak, Math.abs(channel[i]));
      if (cooperative && performance.now() - lastYield > 12) {
        await yieldUI(signal);
        lastYield = performance.now();
      }
    }
  }
  const blob = samplesOnly || pcmOnly ? null : await consume(encodeWav24Steps(output, sampleRate));
  checkAbort(signal);
  onProgress?.(1);
  return {
    blob,
    samples: samplesOnly ? output : null,
    hubSamples: output,
    duration: output[0].length / sampleRate,
    channelCount: output.length,
    peak
  };
}

export async function renderOscillator({ settings, impulse, signal, onProgress, samplesOnly = false, pcmOnly = false, cooperative = true }) {
  settings = structuredClone(settings);
  const convolving = Boolean(impulse && settings.convolutionEnabled && settings.convolutionWet > 0);
  const body = await synthesizeOscillatorBody({
    settings, impulseLength: convolving ? impulse.length : 0, signal, onProgress, cooperative
  });
  const channels = convolving
    ? await renderConvolved(body, TARGET_SAMPLE_RATE, impulse, settings.convolutionWet, signal)
    : body;
  return finishOscillatorOutput({ channels, signal, onProgress, samplesOnly, pcmOnly, cooperative });
}
