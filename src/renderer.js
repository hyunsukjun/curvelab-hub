import {processPacket} from './render-job.js?v=20261106-level2';
export function renderJob(lab,packet,spec,onProgress){
 if(lab==='oscillator'){
  const controller=new AbortController();return {promise:processPacket(lab,packet,spec,{signal:controller.signal,onProgress}),cancel:()=>controller.abort()};
 }
 const worker=new Worker(new URL('./render-worker.js?v=20261106-level2',import.meta.url),{type:'module'});let done=false,fail;
 const promise=new Promise((resolve,reject)=>{fail=reject;worker.onmessage=({data})=>{if(done)return;if(data.progress!=null){onProgress(data.progress);return;}done=true;worker.terminate();data.error?reject(new Error(data.error)):resolve(data.packet);};worker.onerror=e=>{done=true;worker.terminate();reject(new Error(e.message))};worker.postMessage({lab,packet,spec},packet.channels.map(c=>c.buffer));});
 return {promise,cancel(){if(done)return;done=true;worker.terminate();fail(new DOMException('Cancelled','AbortError'));}};
}
