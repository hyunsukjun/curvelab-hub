import {needsOfflineConvolution,oscillatorImpulse} from './render-job.js?v=hub-ir-phases1';
export function renderJob(lab,packet,spec,onProgress=()=>{}){
 if(lab==='oscillator'&&needsOfflineConvolution(spec))return renderOscillatorIR(spec,onProgress);
 return renderInWorker({lab,packet,spec},packet.channels,onProgress);
}
function renderInWorker(message,channels,onProgress){
 const worker=new Worker(new URL('./render-worker.js?v=hub-ir-phases1',import.meta.url),{type:'module'});
 let settled=false,rejectResult;
 const finish=()=>{
  settled=true;
  worker.terminate();
 };
 const promise=new Promise((resolve,reject)=>{
  rejectResult=reject;
  worker.onmessage=({data})=>{
   if(settled)return;
   if(data.progress!=null){onProgress(data.progress);return;}
   finish();
   if(data.error)reject(new Error(data.error));
   else resolve(data.packet);
  };
  worker.onerror=event=>{
   if(settled)return;
   finish();
   reject(new Error(event.message));
  };
  try{worker.postMessage(message,channels.map(channel=>channel.buffer));}
  catch(error){finish();reject(error);}
 });
 return {promise,cancel(){
  if(settled)return;
  finish();
  rejectResult(new DOMException('Cancelled','AbortError'));
 }};
}
function renderOscillatorIR(spec,onProgress){
 const controller=new AbortController(),{signal}=controller;
 const {settings,impulse:ir,hubLevelPolicy,hubOutputGain}=spec;
 const {convolutionWet}=settings;
 let phase;
 const promise=(async()=>{
  // Only the native convolution graph needs the main thread's Web Audio APIs.
  phase=renderInWorker({phase:'ir-source',settings,impulseLength:ir.channels[0].length},[],onProgress);
  const source=await phase.promise;
  signal.throwIfAborted();
  const {renderConvolved}=await import('../labs/oscillator/src/convolution.js?v=20261006-cancel-drain1');
  signal.throwIfAborted();
  onProgress(.75);
  signal.throwIfAborted();
  const impulse=oscillatorImpulse(ir);
  const channels=await renderConvolved(source.channels,48000,impulse,convolutionWet,signal);
  signal.throwIfAborted();
  onProgress(.85);
  signal.throwIfAborted();
  phase=renderInWorker({phase:'ir-output',channels,spec:{hubLevelPolicy,hubOutputGain}},channels,onProgress);
  return phase.promise;
 })();
 return {promise,cancel(){controller.abort();phase?.cancel();}};
}
