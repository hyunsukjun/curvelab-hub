import {applyOscillatorLevel} from './oscillator-level.js?v=20261106-level1';
import {prepareGranularSource} from './granular-source.js';
const audioBuffer=p=>({sampleRate:p.sampleRate,numberOfChannels:p.channels.length,length:p.channels[0].length,duration:p.channels[0].length/p.sampleRate,getChannelData:i=>p.channels[i]});
export function needsOfflineConvolution(spec){
 return Boolean(spec.impulse&&spec.settings.convolutionEnabled&&spec.settings.convolutionWet>0);
}
export function oscillatorImpulse({sampleRate,channels}){
 const buffer=new AudioBuffer({sampleRate,numberOfChannels:channels.length,length:channels[0].length});
 channels.forEach((channel,index)=>buffer.copyToChannel(channel,index));
 return buffer;
}
const oscillatorRender=()=>import('../labs/oscillator/src/offline-render.js?v=hub-ir-phases1');
export async function synthesizeIRSource(settings,impulseLength,onProgress){
 const {synthesizeOscillatorBody}=await oscillatorRender();
 return {channels:await synthesizeOscillatorBody({settings,impulseLength,onProgress,cooperative:false})};
}
export async function finishIRPacket(channels,spec,onProgress){
 const {finishOscillatorOutput}=await oscillatorRender();
 const result=await finishOscillatorOutput({channels,onProgress,pcmOnly:true,cooperative:false});
 return oscillatorPacket(result,spec);
}
function oscillatorPacket(result,spec){
 if(spec.hubLevelPolicy==='input-rms-v1')applyOscillatorLevel(result.hubSamples,spec.hubOutputGain);
 return outputPacket(result);
}
function outputPacket(result){
 if(!result.hubSamples)throw new Error('No completed PCM output received.');
 return {rendered:true,sampleRate:48000,channels:result.hubSamples,boundary:'Existing rendered output; no extra normalization',metrics:result.metrics,referenceBlob:result.blob};
}
export async function processPacket(lab,p,spec,{signal,onProgress,reference=false,cooperative=true}={}){
 const audio=audioBuffer(p);let out;
 if(lab==='audio'||lab==='timbre'){
  const m=await import(`../labs/${lab}/src/offline-render.js?v=hub-bank-first-point1`);
  out=await m.renderOffline({audioBuffer:audio,...spec,pcmOnly:true,signal,onProgress});
  return {rendered:true,sampleRate:out.sampleRate,channels:[out.left,out.right],boundary:'Existing 48k output / 10ms fade'};
 }
 if(lab==='granular'){
  const source=prepareGranularSource(p,spec.sourceChannel);
  const selected={...audio,numberOfChannels:1,getChannelData:()=>source.samples};
  const m=reference?await import('../labs/granular/src/reference-offline-render.js')
   :await import('../labs/granular/src/offline-render.js?v=hub-long-output1');
  out=await m.renderGranular({audioBuffer:selected,...spec,signal,onProgress,pcmOnly:!reference});
 }else if(lab==='space'){
  if(p.sampleRate!==48000)throw new Error('Space handoff requires the current 48 kHz project input.');
  const m=await import(`../labs/space/src/${reference?'reference-':''}offline-render.js`);
  let captured=null;globalThis.__hubCapture=(channels,sampleRate)=>captured={channels,sampleRate};
  try{const wav=m.renderSpatialWav(audio,spec.direction,spec.distance,spec.format,spec.bypassed,spec.roomSettings);out={blob:new Blob([wav],{type:'audio/wav'}),hubSamples:captured?.channels};}finally{delete globalThis.__hubCapture;}
 }else if(lab==='spectral'){
  const m=await import(`../labs/spectral/src/${reference?'reference-':''}offline-render.js`);
  out=await m.renderOffline({audioBuffer:audio,...spec,signal,onProgress});
 }else if(lab==='oscillator'){
  const m=reference?await import('../labs/oscillator/src/reference-offline-render.js')
   :await oscillatorRender();
  const impulse=needsOfflineConvolution(spec)?oscillatorImpulse(spec.impulse):null;
  out=await m.renderOscillator({settings:spec.settings,impulse,signal,onProgress,pcmOnly:!reference,cooperative});
  return reference?out:oscillatorPacket(out,spec);
 }else throw new Error('Unknown Lab');
 return reference?out:outputPacket(out);
}
