// Coordinates a user playback request; does not process or transform audio.
export class PreviewTransport {
 constructor({session,player,key,blocked,prepare,changed=()=>{},error=()=>{}}){Object.assign(this,{session,player,key,blocked,prepare,changed,error});this.pending=null;this.cached=null;}
 fresh(){const p=this.session.preview;return !!p&&this.cached?.preview===p&&this.cached.key===this.key();}
 cancel(){const request=this.pending;this.pending=null;if(request){this.player.stop();if(request.job&&this.session.job===request.job)this.session.cancel();this.changed();}}
 async toggle(){
  if(this.pending){this.cancel();return false;}
  if(this.player.playing){this.player.pause();return true;}
  if(this.session.job)return false;
  const reason=this.blocked();if(reason){this.error(new Error(reason));return false;}
  const request={key:this.key(),job:null};this.pending=request;this.changed();
  const valid=()=>this.pending===request&&this.key()===request.key;
  try{
   // Unlock in the original user gesture, before an asynchronous render.
   await this.player.unlock();if(!valid())return false;
   if(!this.fresh()){
    const work=this.prepare();request.job=this.session.job;
    if(!await work||!valid()||!this.session.preview)return false;
    this.cached={key:request.key,preview:this.session.preview};
   }
   if(!valid()||!this.fresh())return false;
   if(this.player.packet!==this.session.preview.packet)this.player.set(this.session.preview.packet);
   await this.player.play();return valid();
  }catch(e){if(valid())this.error(e);return false;}
  finally{if(this.pending===request){this.pending=null;this.changed();}}
 }
}
