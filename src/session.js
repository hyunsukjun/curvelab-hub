import {VOLUME_MAX_GAIN,VOLUME_MAX_POINTS} from '../labs/audio/src/source-volume.js?v=20261028-volume-line1';
import {initialEdit,lengthOf,deleteRange,setFade,materialize} from '../labs/audio/src/output-edit-core.js';
const clone=x=>structuredClone(x),copy=p=>({...p,referenceBlob:undefined,channels:p.channels.map(c=>c.slice())});
export class HubSession{
 constructor(renderer,change=()=>{}){this.renderer=renderer;this.change=change;this.nodes=[];this.deletedStages=[];this.stageDeletionRedo=[];this.redoPath=[];this.current=null;this.preview=null;this.job=null;this.serial=0;this.revision=0;this.status='Loading Bach Prelude…';this.error='';this.progress=0;}
 view(){const n=this.current;return {current:n?{id:n.id,label:n.label,kind:n.kind,parentId:n.parentId,frames:n.packet.channels[0].length,sampleRate:n.packet.sampleRate,channels:n.packet.channels.length}:null,edit:n?.editState?{selection:clone(n.selection),fadeIn:n.editState.fadeIn,fadeOut:n.editState.fadeOut,volume:clone(n.editState.volume),rate:n.editState.rate,canUndo:!!n.parentId,canRedo:this.redoPath.at(-1)?.parentId===n.id}:null,history:this.nodes.map(n=>({id:n.id,label:n.label,parentId:n.parentId,lab:this.stageLab(n)})),activeJob:!!this.job,status:this.status,error:this.error,progress:this.progress,revision:this.revision,preview:!!this.preview};}
 stageLab(n){while(n){if(n.renderSpec?.lab)return n.renderSpec.lab;if(n.labProvenance)return n.labProvenance;n=this.nodes.find(parent=>parent.id===n.parentId);}return null;}
 packet(){return this.current?copy(this.current.packet):null;}
 emit(){this.change(this.view());}
 cancel(){if(!this.job)return;this.job.cancel?.();this.job=null;this.serial++;this.status='Cancelled · Current input retained';this.emit();}
 invalidate(){this.cancel();this.preview=null;this.revision++;}
 touch(){this.invalidate();this.status='Settings changed · Preview needs refresh';this.emit();}
 async validate(p,input=false){if(!p||!p.channels?.length||p.channels.length>8||p.sampleRate!==48000)throw new Error('Hub requires 48 kHz audio, 1–8 channels.');const n=p.channels[0].length;if(p.channels.some(c=>!(c instanceof Float32Array)||c.length!==n))throw new Error('Invalid channel data');if(n/48000>(input?180:660))throw new Error('Duration exceeds this Hub review build limit.');for(const c of p.channels)for(let i=0;i<n;i++)if(!Number.isFinite(c[i]))throw new Error('Invalid audio sample; previous input retained');}
 capacity(node,deleted=[]){const retained=[...this.nodes,node,...deleted.map(record=>record.stage)];const buffers=new Set();for(const n of retained){n.packet.channels.forEach(c=>buffers.add(c.buffer));n.editState?.pieces.forEach(p=>p.channels.forEach(c=>buffers.add(c.buffer)));}if(retained.length>30||[...buffers].reduce((a,b)=>a+b.byteLength,0)>256*1024*1024)throw new Error('Session history limit reached. Export before starting a new session.');}
 make(packet,label,parentId,workspace={}){const p=copy(packet);return {id:'stage-'+(++this.serial),label,parentId,packet:p,workspace:clone(workspace),selection:null,kind:'input',editState:p.channels.length===2&&p.channels[0].length?initialEdit(...p.channels,p.sampleRate):null};}
 publish(n){
  this.capacity(n);
  // Undo entries share the existing history budget. Evict oldest entries when necessary.
  while(this.deletedStages.length){
   try{this.capacity(n,this.deletedStages);break;}
   catch{this.deletedStages.shift();}
  }
  this.nodes.push(n);this.redoPath=[];this.current=n;this.preview=null;this.revision++;}
 async load(producer){this.invalidate();const token=++this.serial;this.job={token};this.status='Loading…';this.error='';this.emit();try{const p=await producer();await this.validate(p,true);if(this.job?.token!==token)return false;const n=this.make(p,p.name||'Source',null);this.publish(n);this.job=null;this.status='Input ready';this.emit();return true;}catch(e){if(this.job?.token!==token)return false;this.job=null;this.error=e.message;this.status=e.message;this.emit();return false;}}
 restore(id,{keepRedo=false}={}){const n=this.nodes.find(n=>n.id===id);if(!n)return false;this.invalidate();if(!keepRedo)this.redoPath=[];this.current=n;this.status='Restored · Audio and settings';this.emit();return true;}
 deleteSelectedStage(id){
  if(this.current?.id!==id)return false;
  return this.deleteStage(id,false);
 }
 deleteStage(id,redo){
  const stage=this.nodes.find(node=>node.id===id);
  if(this.job||!stage?.parentId)return false;
  const parent=this.nodes.find(node=>node.id===stage.parentId);
  if(!parent)return false;
  const record={stage,index:this.nodes.indexOf(stage),children:[]};
  for(const child of this.nodes){
   if(child.parentId!==id)continue;
   record.children.push({child,labProvenance:child.labProvenance});
   child.labProvenance=this.stageLab(child);
   child.parentId=parent.id;
  }
  if(redo)this.stageDeletionRedo.pop();
  else this.stageDeletionRedo=[];
  this.deletedStages.push(record);
  this.nodes.splice(record.index,1);
  if(this.current===stage)return this.restore(parent.id);
  this.redoPath=this.redoPath.filter(node=>node!==stage);
  this.emit();
  return true;
 }
 redoStageDeletion(){
  const id=this.stageDeletionRedo.at(-1);
  return id ? this.deleteStage(id,true) : false;
 }
 undoStageDeletion(){
  if(this.job||!this.deletedStages.length)return false;
  const {stage,index,children}=this.deletedStages.pop();
  this.nodes.splice(index,0,stage);
  for(const {child,labProvenance} of children){
   child.parentId=stage.id;
   child.labProvenance=labProvenance;
  }
  this.stageDeletionRedo.push(stage.id);
  return this.restore(stage.id);
 }
 undoEdit(){if(this.job||!this.current?.parentId)return false;this.redoPath.push(this.current);return this.restore(this.current.parentId,{keepRedo:true});}
 redoEdit(){const n=this.redoPath.at(-1);if(this.job||!n||n.parentId!==this.current?.id)return false;this.redoPath.pop();return this.restore(n.id,{keepRedo:true});}
 select(a,b){const n=this.current;if(!n?.editState||this.job)return false;if(a===null)n.selection=null;else{if(!Number.isFinite(a)||!Number.isFinite(b))return false;const len=lengthOf(n.editState),lo=Math.max(0,Math.min(len,Math.round(a))),hi=Math.max(0,Math.min(len,Math.round(b)));n.selection=lo===hi?null:[Math.min(lo,hi),Math.max(lo,hi)];}this.emit();return true;}
 async edit(action,value){const n=this.current;if(!n?.editState)return false;let next;if(action==='delete'){if(!n.selection)return false;next=deleteRange(n.editState,...n.selection);}else if(['fadeIn','fadeOut'].includes(action)&&Number.isFinite(value))next=setFade(n.editState,action,value);else if(action==='volume'){const length=lengthOf(n.editState);if(!Array.isArray(value)||value.length>VOLUME_MAX_POINTS||value.some((p,i)=>!Number.isInteger(p.frame)||p.frame<0||p.frame>=length||!Number.isFinite(p.gain)||p.gain<0||p.gain>VOLUME_MAX_GAIN||(i>0&&p.frame<=value[i-1].frame)))return false;if(JSON.stringify(value)===JSON.stringify(n.editState.volume))return false;next={...n.editState,volume:clone(value)};}else return false;if(next===n.editState)return false;this.invalidate();const controller=new AbortController(),token=++this.serial;this.job={token,cancel:()=>controller.abort()};this.status='Applying source edit…';this.emit();try{const p={...n.packet,channels:[new Float32Array(lengthOf(next)),new Float32Array(lengthOf(next))]};const candidate={...this.make(p,action==='delete'?'Delete range':action==='fadeIn'?'Fade in':action==='volume'?'Volume envelope':'Fade out',n.id,n.workspace),editState:next,selection:action==='volume'?clone(n.selection):null};this.capacity(candidate);await materialize(next,p.channels,controller.signal);if(this.job?.token!==token)return false;await this.validate(p);candidate.packet=p;this.publish(candidate);this.job=null;this.status='Source edit applied';this.emit();return true;}catch(e){if(this.job?.token!==token)return false;this.job=null;this.status=e.message;this.error=e.message;this.emit();return false;}}
 // Render and prepare the target while the previous stage remains authoritative.
 async handoff(lab,spec,workspace,target,prepareTarget){
  if(this.job||!this.current||!this.current.packet.channels[0].length)return false;
  this.current.workspace=clone(workspace);
  const input=this.current,revision=this.revision,token=++this.serial;
  const controller=new AbortController();this.job={token,cancel:()=>controller.abort()};this.progress=0;this.error='';this.status='Processing '+lab+' → '+target+'…';this.emit();
  const valid=()=>this.job?.token===token&&this.current===input&&this.revision===revision;
  try{
   const job=this.renderer(lab,copy(input.packet),clone(spec),p=>{if(valid()){this.progress=p*.85;this.emit();}});
   controller.signal.addEventListener('abort',()=>job.cancel?.(),{once:true});
   if(controller.signal.aborted)job.cancel?.();
   const result=await job.promise;if(!valid())return false;
   await this.validate(result);if(!valid())return false;
   if(result.channels.length!==2)throw new Error('Next Lab requires stereo; current stage retained.');
   const nextWorkspace={active:target,byLab:{},grainChannel:workspace.grainChannel||'mix',dirtyByLab:{}};
   const candidate=this.make({...result,name:input.packet.name},lab[0].toUpperCase()+lab.slice(1)+' · '+(result.channels[0].length/48000).toFixed(2)+' s',input.id,nextWorkspace);
   candidate.renderSpec={lab,spec:clone(spec)};this.capacity(candidate);
   this.status='Preparing '+target+'…';this.progress=.9;this.emit();
   await prepareTarget(candidate,valid,controller.signal);if(!valid())return false;
   this.publish(candidate);this.job=null;this.progress=1;
   this.status=target[0].toUpperCase()+target.slice(1)+' ready · Previous stage retained';this.emit();return true;
  }catch(e){if(!valid())return false;this.job=null;this.error=e.message;this.status=e.message;this.emit();return false;}
 }
 async run(lab,spec,workspace,apply){if(this.job||!this.current||!this.current.packet.channels[0].length)return false;this.current.workspace=clone(workspace);const input=this.current,revision=this.revision,token=++this.serial;this.job={token};this.progress=0;this.error='';this.status=apply?'Applying…':'Preparing preview…';this.emit();const valid=()=>this.job?.token===token&&this.current===input&&this.revision===revision;try{const job=this.renderer(lab,copy(input.packet),clone(spec),p=>{if(valid()){this.progress=p;this.emit();}});this.job.cancel=job.cancel;const result=await job.promise;if(!valid())return false;await this.validate(result);if(!valid())return false;if(apply){const candidate=this.make(result,`${lab[0].toUpperCase()+lab.slice(1)} · ${result.channels[0].length/48000>=60?'':(result.channels[0].length/48000).toFixed(2)+' s'}`,input.id);candidate.renderSpec={lab,spec:clone(spec)};this.publish(candidate);this.status='Applied · Result is the next input';}else{this.preview={packet:copy(result),inputId:input.id,revision,lab,spec:clone(spec)};this.status='Preview ready · Input unchanged';}this.job=null;this.emit();return true;}catch(e){if(!valid())return false;this.job=null;this.error=e.message;this.status=e.message;this.emit();return false;}}
}
