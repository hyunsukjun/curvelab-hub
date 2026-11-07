import {processPacket} from './render-job.js?v=20261106-level2';
self.onmessage=async({data})=>{try{const packet=await processPacket(data.lab,data.packet,data.spec,{onProgress:progress=>postMessage({progress})});postMessage({packet},packet.channels.map(c=>c.buffer));}catch(e){postMessage({error:e.message})}};
