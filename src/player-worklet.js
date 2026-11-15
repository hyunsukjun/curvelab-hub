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
  this.gain=1;
  this.gainTarget=1;
  this.gainFrames=0;
  this.previous=null;
  this.tick=0;
  this.token=0;
  this.port.onmessage=({data})=>{
   if(data.type==='play'){
    if(data.channels)this.channels=data.channels;
    this.playing=!!this.channels;
    this.at=data.frame;
    this.token=data.token;
    this.gain=this.gainTarget=data.gain;
    this.gainFrames=0;
    this.previous=null;
    this.endingAt=null;
    this.replacementAccepted=false;
    this.boundary.start();
    // Rendering already applied the file boundaries. Fade only after a seek or resume.
    if(data.frame===0)this.boundary.age=this.boundary.span;
   }else if(data.type==='pause'&&this.playing)this.boundary.release();
   else if(data.token===this.token){
    if(data.type==='clear'){this.channels=null;this.previous=null;this.playing=false;}
    if(data.type==='replace'){
     const remaining=data.channels[0].length-this.at;
     const accepted=this.playing&&this.boundary.releaseAge===null&&(remaining>0||data.latest);
     this.replacementAccepted=accepted;
     if(accepted&&remaining<=0){
      // The updated output has already ended at this playhead.
      this.endingAt=data.channels[0].length;
      this.boundary.release();
     }else if(accepted){
      this.previous={channels:this.channels,gain:this.gain,age:0,span:Math.max(1,Math.min(this.boundary.span,remaining-1))};
      this.channels=data.channels;
      this.gain=this.gainTarget=data.gain;
      this.gainFrames=0;
     }
     this.port.postMessage({type:'replacement',accepted,token:this.token});
    }
    if(data.type==='gain'&&this.endingAt===null){
     this.gainTarget=this.replacementAccepted?data.replacementGain:data.gain;
     this.gainFrames=this.boundary.span;
    }
   }
  };
 }
 report(finished=false){this.port.postMessage({frame:this.at,playing:this.playing,token:this.token,finished});}
 process(_,outputs){
  if(!this.playing)return true;
  const output=outputs[0],length=this.channels[0].length;
  for(let i=0;i<output[0].length;i++){
   const boundary=this.boundary.next();
   if(this.gainFrames>0)this.gain+=(this.gainTarget-this.gain)/this.gainFrames--;
   const previous=this.previous;
   const blend=previous?previous.age/previous.span:1;
   for(let channel=0;channel<output.length;channel++){
    const sample=pcm24(Math.fround(this.channels[channel][this.at]*this.gain));
    const old=previous?pcm24(Math.fround((previous.channels[channel][this.at]||0)*previous.gain)):0;
    output[channel][i]=(old*(1-blend)+sample*blend)*boundary;
   }
   if(previous&&++previous.age>=previous.span)this.previous=null;
   this.at++;
   if(this.boundary.done||this.at>=length){
    this.playing=false;
    const finished=this.at>=length||this.endingAt!==null;
    if(this.endingAt!==null)this.at=this.endingAt;
    if(finished)this.channels=null;
    this.previous=null;
    this.report(finished);
    return true;
   }
  }
  if(++this.tick%12===0)this.report();
  return true;
 }
}
registerProcessor('hub-pcm-player',HubPCMPlayer);
