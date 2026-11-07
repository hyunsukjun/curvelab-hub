// Read-only access to the existing Lab analyser. Never connect audio nodes here.
export function createMeterTap({analyser,eligible=()=>true,clipped,setClipped}){
 let waitingTime=null,lastContext=null;
 return {
  read(){
   const meter=analyser(),context=meter?.context||meter?.input?.context;
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
