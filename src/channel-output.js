import {getSpeakerLayout} from '../labs/space/src/speaker-layout.js';

const FRAMES_PER_CHUNK = 1 << 16;
const REAR_WEIGHT = Math.SQRT1_2;
const CHANNEL_COUNTS = new Map([['stereo', 2], ['quad', 4], ['octo', 8]]);

export function configuredOutputChannels(lab, spec) {
  if (lab !== 'space' && lab !== 'granular') return 2;
  return CHANNEL_COUNTS.get(lab === 'space' ? spec.format : spec.settings.format);
}

function spaceWeights(format) {
  const left = [];
  const right = [];
  // Project each speaker onto the stereo axis, with −3 dB weight for rear speakers.
  for (const {channel, angle} of getSpeakerLayout(format)) {
    const radians = angle * Math.PI / 180;
    const pan = Math.sin(radians);
    const weight = Math.cos(radians) < 0 ? REAR_WEIGHT : 1;
    left[channel - 1] = (1 - pan) * weight / 2;
    right[channel - 1] = (1 + pan) * weight / 2;
  }
  // Normalize each side so folding a peak cannot increase its level.
  const leftTotal = left.reduce((sum, weight) => sum + weight, 0);
  const rightTotal = right.reduce((sum, weight) => sum + weight, 0);
  return [left.map(weight => weight / leftTotal), right.map(weight => weight / rightTotal)];
}

export async function stereoOutput(packet, lab, format, signal) {
  signal?.throwIfAborted();
  const sources = packet.channels;
  if (sources.length === 2) return packet;
  const expectedChannels = format === 'quad' ? 4 : format === 'octo' ? 8 : 0;
  if (!expectedChannels || sources.length !== expectedChannels || !['space', 'granular'].includes(lab)) {
    throw new Error('Invalid multichannel output layout.');
  }
  const channelWeight = 2 / expectedChannels;
  // Granular distributes grains across numbered channels. Average each parity group.
  const [leftWeights, rightWeights] = lab === 'space' ? spaceWeights(format) : [
    sources.map((_, index) => index % 2 === 0 ? channelWeight : 0),
    sources.map((_, index) => index % 2 === 1 ? channelWeight : 0)
  ];
  const frames = sources[0].length;
  const left = new Float32Array(frames);
  const right = new Float32Array(frames);
  let lastYield = performance.now();
  for (let start = 0; start < frames; start += FRAMES_PER_CHUNK) {
    const end = Math.min(start + FRAMES_PER_CHUNK, frames);
    for (let frame = start; frame < end; frame++) {
      let leftSample = 0;
      let rightSample = 0;
      for (let channel = 0; channel < sources.length; channel++) {
        const sample = sources[channel][frame];
        leftSample += sample * leftWeights[channel];
        rightSample += sample * rightWeights[channel];
      }
      left[frame] = leftSample;
      right[frame] = rightSample;
    }
    if (end < frames && performance.now() - lastYield >= 12) {
      await new Promise(resolve => setTimeout(resolve, 0));
      signal?.throwIfAborted();
      lastYield = performance.now();
    }
  }
  return {...packet, channels: [left, right], referenceBlob: undefined};
}
