import {outputGainLinear} from './output-gain.js?v=20261108-relative-gain1';

const GAIN_RAMP_SECONDS = 0.01;

// In the Hub, the existing meter input feeds both its analysers and the destination.
export function createMeterTap({analyser,eligible=()=>true,clipped,setClipped}){
 let waitingTime=null,lastContext=null;
 let attachedMeter=null,requestedGain=1,ramp=null;

 function attach(meter){
  if(meter===attachedMeter)return;
  attachedMeter=meter;ramp=null;
  if(meter?.input?.gain)meter.input.gain.value=requestedGain;
 }

 function setGainDb(db){
  if(!Number.isFinite(db))return;
  const next=outputGainLinear(db);
  if(!Number.isFinite(next)||next===requestedGain)return;
  const previous=requestedGain;
  requestedGain=next;
  const meter=analyser();
  if(meter!==attachedMeter){attach(meter);return;}
  const param=meter?.input?.gain,context=meter?.context||meter?.input?.context;
  if(!param||!context)return;
  const now=context.currentTime;
  const held=ramp
   ? ramp.from+(ramp.to-ramp.from)*Math.max(0,Math.min(1,(now-ramp.start)/GAIN_RAMP_SECONDS))
   : previous;
  param.cancelScheduledValues(now);
  if(context.state!=='running'){
   param.setValueAtTime(next,now);
   ramp=null;
   return;
  }
  param.setValueAtTime(held,now);
  param.linearRampToValueAtTime(next,now+GAIN_RAMP_SECONDS);
  ramp={from:held,to:next,start:now};
 }

 return {
  attach,
  setGainDb,
  read(){
   const meter=analyser(),context=meter?.context||meter?.input?.context;
   attach(meter);
   if(context!==lastContext){lastContext=context;waitingTime=null;}
   if(!context||context.state!=='running'||!eligible()){
    waitingTime=context?.currentTime??null;
    return {channels:[],clipped:clipped(),live:false};
   }
   if(waitingTime!==null&&context.currentTime<=waitingTime)return {channels:[],clipped:clipped(),live:false};
   waitingTime=null;
   const channels=meter.read().slice(0,2);
   if(channels.some(c=>c.clipped))setClipped(true);
   return {channels,clipped:clipped(),live:true};
  },
  reset(){setClipped(false);}
 };
}
