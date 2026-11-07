// Owns one native Lab transport. Audio processing and clocks stay in the Lab.
export class NativeTransport {
 constructor({bridge,blocked,changed=()=>{},error=()=>{}}){Object.assign(this,{bridge,blocked,changed,error});this.pending=null;this.owner=null;}
 state(){return this.bridge()?.transport.state()||{playing:false,seconds:0,duration:0,sourceSeconds:null};}
 get pausing(){return this.pending?.kind==='pause';}
 cancel(){const request=this.pending;this.pending=null;if(request)void Promise.resolve(request.bridge.stop()).catch(this.error);this.changed();}
 stop(){const owner=this.owner||this.bridge();this.pending=null;this.owner=null;const result=owner?.stop();this.changed();return Promise.resolve(result).catch(this.error);}
 async toggle(){
  if(this.pausing){this.pending.resume=!this.pending.resume;this.changed();return true;}
  if(this.pending){await this.stop();return false;}
  const bridge=this.bridge();if(!bridge)return false;
  const state=bridge.transport.state();
  if(state.busy||(!state.playing&&state.disabled))return false;
  if(!state.playing){const blocked=this.blocked();if(blocked){this.error(new Error(blocked));return false;}}
  const request={bridge,kind:state.playing&&bridge.transport.pauseCompletes?'pause':'play',resume:false,seek:null};this.pending=request;this.owner=bridge;this.changed();
  try{
   if(state.playing)await bridge.transport.pause();else await bridge.transport.play();
   if(request.kind==='pause'){
    // One latest intent across output-time and source-time seeks. Native clocks,
    // mapping and pause boundary remain owned by the selected Lab.
    while(this.pending===request&&this.bridge()===bridge&&request.seek&&!this.blocked()){
     const intent=request.seek;request.seek=null;await this.applySeek(bridge,intent);
    }
    if(this.pending===request&&this.bridge()===bridge&&request.resume&&!this.blocked()){
     request.kind='play';this.changed();await bridge.transport.play();
    }
   }
   return this.pending===request;
  }catch(e){if(this.pending===request)this.error(e);return false;}
  finally{if(this.pending===request){this.pending=null;this.changed();}}
 }
 applySeek(bridge,{kind,value}){return kind==='source'?bridge.seekSource?.(value):bridge.transport.seek(value);}
 seek(progress){return this.requestSeek({kind:'output',value:Math.max(0,Math.min(1,progress))});}
 seekSource(seconds){return this.requestSeek({kind:'source',value:seconds});}
 async requestSeek(intent){
  const bridge=this.bridge();if(!bridge||!Number.isFinite(intent.value)||this.blocked()||bridge.transport.state().busy)return false;
  if(intent.kind==='source'&&!bridge.seekSource)return false;
  if(this.pausing&&this.pending.bridge===bridge){this.pending.seek=intent;this.changed();return true;}
  if(this.pending)return false;
  try{return await this.applySeek(bridge,intent);}catch(e){this.error(e);return false;}finally{this.changed();}
 }
}
