// Hub output adaptation, outside the original synthesis/IR/limiter engine.
export function channelRms(channels,frames=channels[0]?.length||0){
 let sum=0,n=0;
 for(const channel of channels)for(let i=0;i<Math.min(frames,channel.length);i++){
  const v=channel[i];if(!Number.isFinite(v))throw new Error('Invalid level reference sample');sum+=v*v;n++;
 }
 return n?Math.sqrt(sum/n):0;
}
export function matchingGain(inputRms,referenceRms){
 if(!Number.isFinite(inputRms)||!Number.isFinite(referenceRms)||inputRms<0||referenceRms<0)throw new Error('Invalid level reference');
 return referenceRms>1e-9?Math.min(1,inputRms/referenceRms):0;
}
export function applyOscillatorLevel(channels,gain){
 if(!Number.isFinite(gain)||gain<0||gain>1)throw new Error('Oscillator level is not prepared');
 for(const channel of channels)for(let i=0;i<channel.length;i++)channel[i]*=gain;
 return channels;
}
