import {applyOscillatorLevel} from './oscillator-level.js?v=20261106-level1';
import {prepareGranularSource} from './granular-source.js';
const audioBuffer=p=>({sampleRate:p.sampleRate,numberOfChannels:p.channels.length,length:p.channels[0].length,duration:p.channels[0].length/p.sampleRate,getChannelData:i=>p.channels[i]});
export async function processPacket(lab,p,spec,{signal,onProgress,reference=false}={}){
 const audio=audioBuffer(p);let out;
 if(lab==='audio'||lab==='timbre'){
  const m=await import(`../labs/${lab}/src/offline-render.js`);
  out=await m.renderOffline({audioBuffer:audio,...spec,pcmOnly:true,signal,onProgress});
  return {rendered:true,sampleRate:out.sampleRate,channels:[out.left,out.right],boundary:'Existing 48k output / 10ms fade'};
 }
 if(lab==='granular'){
  const source=prepareGranularSource(p,spec.sourceChannel);
  const selected={...audio,numberOfChannels:1,getChannelData:()=>source.samples};
  const m=await import(`../labs/granular/src/${reference?'reference-':''}offline-render.js`);
  out=await m.renderGranular({audioBuffer:selected,...spec,signal,onProgress});
 }else if(lab==='space'){
  if(p.sampleRate!==48000)throw new Error('Space handoff requires the current 48 kHz project input.');
  const m=await import(`../labs/space/src/${reference?'reference-':''}offline-render.js`);
  let captured=null;globalThis.__hubCapture=(channels,sampleRate)=>captured={channels,sampleRate};
  try{const wav=m.renderSpatialWav(audio,spec.direction,spec.distance,spec.format,spec.bypassed,spec.roomSettings);out={blob:new Blob([wav],{type:'audio/wav'}),hubSamples:captured?.channels};}finally{delete globalThis.__hubCapture;}
 }else if(lab==='spectral'){
  const m=await import(`../labs/spectral/src/${reference?'reference-':''}offline-render.js`);
  out=await m.renderOffline({audioBuffer:audio,...spec,signal,onProgress});
 }else if(lab==='oscillator'){
  const m=await import(`../labs/oscillator/src/${reference?'reference-':''}offline-render.js`);
  const impulse=spec.impulse?new AudioBuffer({sampleRate:spec.impulse.sampleRate,numberOfChannels:spec.impulse.channels.length,length:spec.impulse.channels[0].length}):null;
  spec.impulse?.channels.forEach((c,i)=>impulse.copyToChannel(c,i));
  out=await m.renderOscillator({settings:spec.settings,impulse,signal,onProgress});
  if(!reference&&spec.hubLevelPolicy==='input-rms-v1'){applyOscillatorLevel(out.hubSamples,spec.hubOutputGain);out.blob=null;}
 }else throw new Error('Unknown Lab');
 if(reference)return out;
 if(!out.hubSamples)throw new Error('No completed PCM output received.');
 return {rendered:true,sampleRate:48000,channels:out.hubSamples,boundary:'Existing rendered output; no extra normalization',metrics:out.metrics,referenceBlob:out.blob};
}
