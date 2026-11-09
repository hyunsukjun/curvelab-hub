import {OutputMeterAnalyzer} from '../labs/audio/src/output-meter.js';

// Plays the same 48 kHz PCM that the Hub encodes into its 24-bit WAV.
export class PCMPlayer {
 constructor(change){
  this.change=change;
  this.packet=null;
  this.loadedPacket=null;
  this.frame=0;
  this.playing=false;
  this.token=0;
  this.clipped=false;
  this.meter={
   read:()=>{
    const channels=this.playing&&this.analyser?this.analyser.read():[];
    if(channels.some(channel=>channel.clipped))this.clipped=true;
    return {channels,clipped:this.clipped,live:this.playing};
   },
   reset:()=>{this.clipped=false;}
  };
 }
 async unlock(){
  if(!this.initializing){
   const context=this.context=new AudioContext({sampleRate:48000});
   this.initializing=(async()=>{
    await Promise.all([context.resume(),context.audioWorklet.addModule(new URL('./player-worklet.js?v=hub-chain-branch1',import.meta.url))]);
    if(context.sampleRate!==48000)throw new Error('48 kHz playback is unavailable on this device.');
    this.node=new AudioWorkletNode(context,'hub-pcm-player',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});
    this.analyser=new OutputMeterAnalyzer(context);
    this.node.connect(this.analyser.input);
    this.analyser.connect(context.destination);
    this.node.port.onmessage=({data})=>{
     if(data.token!==this.token)return;
     this.frame=data.frame;
     this.playing=data.playing;
     if(data.finished)this.loadedPacket=null;
     if(!data.playing)this.release?.finish();
     this.change();
    };
   })().catch(async error=>{
    await context.close().catch(()=>{});
    this.initializing=null;
    this.context=null;
    this.node=null;
    throw error;
   });
  }else if(this.context.state!=='running')await this.context.resume();
  await this.initializing;
 }
 set(packet,frame=0){
  this.packet=packet;
  this.frame=frame;
  this.change();
 }
 play(){
  if(!this.packet?.channels[0].length)return;
  if(this.frame>=this.packet.channels[0].length)this.frame=0;
  const token=++this.token;
  const channels=this.loadedPacket===this.packet?null:this.packet.channels;
  this.node.port.postMessage({type:'play',channels,frame:this.frame,token});
  this.loadedPacket=this.packet;
  this.playing=true;
  this.change();
 }
 pause(){
  if(!this.playing)return Promise.resolve();
  if(this.release)return this.release.promise;
  let resolve;
  const promise=new Promise(done=>{resolve=done;});
  const finish=()=>{clearTimeout(timeout);this.release=null;resolve();};
  // A suspended device cannot acknowledge on the audio thread.
  const timeout=setTimeout(()=>{
   this.node.port.postMessage({type:'clear',token:this.token});
   this.loadedPacket=null;
   this.playing=false;
   finish();
   this.change();
  },500);
  this.release={promise,finish};
  this.node.port.postMessage({type:'pause'});
  return promise;
 }
 async stop(){
  await this.pause();
  this.node?.port.postMessage({type:'clear',token:this.token});
  this.token++;
  this.loadedPacket=null;
  this.set(null);
 }
}
