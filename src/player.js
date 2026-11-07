// PCM transport only; reuses the original 10 ms PlaybackBoundary unchanged.
export class PCMPlayer{
 constructor(change){this.change=change;this.packet=null;this.frame=0;this.playing=false;this.token=0;this.context=null;this.node=null;}
 set(p){this.stop();this.packet=p;this.frame=0;this.change(this);}
 stop(){this.token++;this.node?.port.postMessage({type:'stop'});this.playing=false;this.change(this);}
 async unlock(){
  if(!this.initializing){this.initializing=(async()=>{
   this.context=new AudioContext({sampleRate:48000});
   // Resume immediately while the Play/Space user gesture is active.
   await Promise.all([this.context.resume(),this.context.audioWorklet.addModule(new URL('./player-worklet.js',import.meta.url))]);
   if(this.context.sampleRate!==48000)throw new Error('Playback device could not provide 48 kHz. PCM and WAV remain unchanged.');
   this.node=new AudioWorkletNode(this.context,'hub-pcm-player',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});this.node.connect(this.context.destination);
   this.node.port.onmessage=({data:d})=>{if(d.token!==this.token)return;this.frame=d.frame;this.playing=d.playing;this.change(this);};
  })().catch(async e=>{await this.context?.close().catch(()=>{});this.context=null;this.node=null;this.initializing=null;throw e;});}
  await this.initializing;
  if(this.context.state!=='running')await this.context.resume();
 }
 async play(){
  if(!this.packet?.channels[0].length)return;
  if(this.packet.channels.length!==2)throw new Error('Multichannel output is available for WAV export; stereo listening conversion is not automatic.');
  const token=++this.token,packet=this.packet;
  await this.unlock();if(token!==this.token||packet!==this.packet)return;
  if(this.frame>=packet.channels[0].length)this.frame=0;
  this.node.port.postMessage({type:'play',rendered:!!packet.rendered,channels:packet.channels,frame:this.frame,token});this.playing=true;this.change(this);
 }
 pause(){this.node?.port.postMessage({type:'pause'});}
 async seek(frame){const was=this.playing;if(was){this.pause();await new Promise(r=>setTimeout(r,15));}this.stop();this.frame=Math.max(0,Math.min(this.packet?.channels[0].length||0,Math.round(frame)));this.change(this);if(was)await this.play();}
}
