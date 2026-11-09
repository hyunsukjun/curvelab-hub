import {PlaybackBoundary} from '../labs/audio/src/playback-boundary.js';

const pcm24=value=>{
 const sample=Math.max(-1,Math.min(1,value));
 return Math.round(sample*(sample<0?8388608:8388607))/8388608;
};

class HubPCMPlayer extends AudioWorkletProcessor {
 constructor(){
  super();
  this.channels=null;
  this.playing=false;
  this.at=0;
  this.boundary=new PlaybackBoundary(sampleRate);
  this.tick=0;
  this.token=0;
  this.port.onmessage=({data})=>{
   if(data.type==='play'){
    if(data.channels)this.channels=data.channels;
    this.playing=!!this.channels;
    this.at=data.frame;
    this.token=data.token;
    this.boundary.start();
    // Rendering already applied the file boundaries. Fade only after a seek or resume.
    if(data.frame===0)this.boundary.age=this.boundary.span;
   }else if(data.type==='pause'&&this.playing)this.boundary.release();
   else if(data.type==='clear'&&data.token===this.token){this.channels=null;this.playing=false;}
  };
 }
 report(finished=false){this.port.postMessage({frame:this.at,playing:this.playing,token:this.token,finished});}
 process(_,outputs){
  if(!this.playing)return true;
  const output=outputs[0],length=this.channels[0].length;
  for(let i=0;i<output[0].length;i++){
   const gain=this.boundary.next();
   for(let channel=0;channel<output.length;channel++)output[channel][i]=pcm24(this.channels[channel][this.at])*gain;
   this.at++;
   if(this.boundary.done||this.at>=length){
    this.playing=false;
    const finished=this.at>=length;
    if(finished)this.channels=null;
    this.report(finished);
    return true;
   }
  }
  if(++this.tick%12===0)this.report();
  return true;
 }
}
registerProcessor('hub-pcm-player',HubPCMPlayer);
