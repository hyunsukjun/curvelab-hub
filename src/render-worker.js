import {finishIRPacket,processPacket,synthesizeIRSource} from './render-job.js?v=hub-ir-phases1';
self.onmessage=async({data})=>{
 const onProgress=progress=>postMessage({progress});
 try{
  let packet;
  if(data.phase==='ir-source')packet=await synthesizeIRSource(data.settings,data.impulseLength,onProgress);
  else if(data.phase==='ir-output')packet=await finishIRPacket(data.channels,data.spec,onProgress);
  else packet=await processPacket(data.lab,data.packet,data.spec,{cooperative:false,onProgress});
  postMessage({packet},packet.channels.map(channel=>channel.buffer));
 }catch(error){postMessage({error:error.message});}
};
