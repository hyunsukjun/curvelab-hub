import {applyOutputGain} from './output-gain.js?v=20261108-relative-gain1';
import {VOLUME_MAX_GAIN,VOLUME_MAX_POINTS} from '../labs/audio/src/source-volume.js?v=20261028-volume-line1';
import {initialEdit,lengthOf,deleteRange,setFade,materialize} from '../labs/audio/src/output-edit-core.js';
const clone=x=>structuredClone(x),copy=p=>({...p,referenceBlob:undefined,channels:p.channels.map(c=>c.slice())});
const MAX_EDIT_UNDO=30;
export class HubSession{
 constructor(renderer,change=()=>{}){this.renderer=renderer;this.change=change;this.nodes=[];this.deletedStages=[];this.stageDeletionRedo=[];this.undoEdits=[];this.redoEdits=[];this.current=null;this.working=null;this.reopened=null;this.preview=null;this.job=null;this.serial=0;this.revision=0;this.restoreCount=0;this.status='Loading Bach Prelude…';this.error='';this.progress=0;}
 view(){
  const n=this.current,w=this.working;
  return {current:n?{id:n.id,inputId:w.id,label:n.label,kind:n.kind,parentId:n.parentId,frames:w.packet.channels[0].length,sampleRate:w.packet.sampleRate,channels:w.packet.channels.length}:null,
   edit:w?.editState?{selection:clone(w.selection),fadeIn:w.editState.fadeIn,fadeOut:w.editState.fadeOut,volume:clone(w.editState.volume),rate:w.editState.rate,canUndo:!!this.undoEdits.length,canRedo:!!this.redoEdits.length,modified:w.editState!==this.editBase.editState}:null,
   history:this.nodes.map(n=>({id:n.id,label:n.label,parentId:n.parentId,lab:this.stageLab(n)})),activeJob:!!this.job,status:this.status,error:this.error,progress:this.progress,revision:this.revision,restoreCount:this.restoreCount,preview:!!this.preview};
 }
 stageLab(n){while(n){if(n.renderSpec?.lab)return n.renderSpec.lab;if(n.labProvenance)return n.labProvenance;n=this.nodes.find(parent=>parent.id===n.parentId);}return null;}
 original(){let n=this.current;while(n?.parentId)n=this.nodes.find(parent=>parent.id===n.parentId);return n;}
 packet(){return this.working?copy(this.working.packet):null;}
 emit(){this.change(this.view());}
 cancel(){if(!this.job)return;this.job.cancel?.();this.job=null;this.serial++;this.status='Cancelled · Current input retained';this.emit();}
 invalidate(){this.cancel();this.preview=null;this.revision++;}
 touch(){this.invalidate();this.status='Settings changed · Preview needs refresh';this.emit();}
 async validate(p,input=false,{checkSamples=true}={}){if(!p||!p.channels?.length||p.channels.length>8||p.sampleRate!==48000)throw new Error('Hub requires 48 kHz audio, 1–8 channels.');const n=p.channels[0].length;if(p.channels.some(c=>!(c instanceof Float32Array)||c.length!==n))throw new Error('Invalid channel data');if(n/48000>(input?180:660))throw new Error('Duration exceeds this Hub review build limit.');if(checkSamples)for(const c of p.channels)for(let i=0;i<n;i++)if(!Number.isFinite(c[i]))throw new Error('Invalid audio sample; previous input retained');}
 capacity(node,deleted=[],edits=[]){
  const stages=[...this.nodes,...deleted.map(record=>record.stage)];if(node)stages.push(node);
  const buffers=new Set();
  for(const n of [...stages,...edits]){
   for(const source of [n,n.recipe]){
    source?.packet?.channels.forEach(c=>buffers.add(c.buffer));
    source?.editState?.pieces.forEach(p=>p.channels.forEach(c=>buffers.add(c.buffer)));
   }
  }
  if(stages.length>30||[...buffers].reduce((a,b)=>a+b.byteLength,0)>256*1024*1024)throw new Error('Session history limit reached. Export before starting a new session.');
 }
 make(packet,label,parentId,workspace={}){const p=copy(packet);return {id:'stage-'+(++this.serial),label,parentId,packet:p,workspace:clone(workspace),selection:null,kind:'input',editState:p.channels.length===2&&p.channels[0].length?initialEdit(...p.channels,p.sampleRate):null};}
 publish(n){
  this.capacity(n);
  // Undo entries share the existing history budget. Evict oldest entries when necessary.
  while(this.deletedStages.length){
   try{this.capacity(n,this.deletedStages);break;}
   catch{this.deletedStages.shift();}
  }
  this.nodes.push(n);this.resetWorking(n);this.preview=null;this.revision++;}
 get editBase(){return this.reopened?.recipe||this.current;}
 get baseInputId(){return this.reopened?`${this.current.id}:input`:this.current?.id;}
 get editorWorkspace(){return (this.reopened||this.current)?.workspace;}
 rememberWorkspace(workspace){if(this.current)(this.reopened||this.current).workspace=clone(workspace);}
 resetWorking(n,reopen=false){
  this.current=n;
  const recipe=reopen?n.recipe:null;
  this.reopened=recipe?{recipe,workspace:clone(recipe.workspace)}:null;
  const {packet,editState}=this.editBase;
  this.working={id:this.baseInputId,packet,editState,selection:null};
  this.undoEdits=[];this.redoEdits=[];
 }
 async load(producer){this.invalidate();const token=++this.serial;this.job={token};this.status='Loading…';this.error='';this.emit();try{const p=await producer();await this.validate(p,true);if(this.job?.token!==token)return false;const n=this.make(p,p.name||'Source',null);this.publish(n);this.job=null;this.status='Input ready';this.emit();return true;}catch(e){if(this.job?.token!==token)return false;this.job=null;this.error=e.message;this.status=e.message;this.emit();return false;}}
 restore(id){const n=this.nodes.find(n=>n.id===id);if(!n)return false;this.invalidate();this.resetWorking(n,true);this.restoreCount++;this.status='Restored · Audio and settings';this.emit();return true;}
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
 editSnapshot(){return {editState:this.working.editState,selection:clone(this.working.selection)};}
 undoEdit(){
  if(this.job||!this.undoEdits.length)return false;
  return this.applyEditState(this.undoEdits.at(-1),this.undoEdits.slice(0,-1),[...this.redoEdits,this.editSnapshot()]);
 }
 redoEdit(){
  if(this.job||!this.redoEdits.length)return false;
  return this.applyEditState(this.redoEdits.at(-1),[...this.undoEdits,this.editSnapshot()],this.redoEdits.slice(0,-1));
 }
 select(a,b){const n=this.working;if(!n?.editState||this.job)return false;if(a===null)n.selection=null;else{if(!Number.isFinite(a)||!Number.isFinite(b))return false;const len=lengthOf(n.editState),lo=Math.max(0,Math.min(len,Math.round(a))),hi=Math.max(0,Math.min(len,Math.round(b)));n.selection=lo===hi?null:[Math.min(lo,hi),Math.max(lo,hi)];}this.emit();return true;}
 async edit(action,value){
  const n=this.working;if(this.job||!n?.editState)return false;
  let next;
  if(action==='delete'){
   if(!n.selection)return false;
   next=deleteRange(n.editState,...n.selection);
  }else if(['fadeIn','fadeOut'].includes(action)&&Number.isFinite(value)){
   next=setFade(n.editState,action,value);
  }else if(action==='volume'){
   const length=lengthOf(n.editState);
   if(!Array.isArray(value)||value.length>VOLUME_MAX_POINTS||value.some((p,i)=>!Number.isInteger(p.frame)||p.frame<0||p.frame>=length||!Number.isFinite(p.gain)||p.gain<0||p.gain>VOLUME_MAX_GAIN||(i>0&&p.frame<=value[i-1].frame)))return false;
   if(JSON.stringify(value)===JSON.stringify(n.editState.volume))return false;
   next={...n.editState,volume:clone(value)};
  }else return false;
  if(next===n.editState)return false;
  const undo=[...this.undoEdits,this.editSnapshot()].slice(-MAX_EDIT_UNDO);
  return this.applyEditState({editState:next,selection:action==='volume'?clone(n.selection):null},undo,[]);
 }
 // Undo entries keep edit instructions and shared source pieces, not rendered PCM copies.
 async applyEditState(next,undo,redo){
  this.invalidate();
  const controller=new AbortController(),token=++this.serial,base=this.editBase;
  this.job={token,cancel:()=>controller.abort()};this.status='Applying source edit…';this.error='';this.emit();
  try{
   const saved=next.editState===base.editState,length=lengthOf(next.editState);
   const packet=saved?base.packet:{...base.packet,channels:[new Float32Array(length),new Float32Array(length)]};
   const working={...next,id:saved?this.baseInputId:'edit-'+token,packet};
   this.capacity(null,this.deletedStages,[working,...undo,...redo]);
   if(!saved){await materialize(next.editState,packet.channels,controller.signal);await this.validate(packet);}
   if(this.job?.token!==token)return false;
   this.working=working;this.undoEdits=undo;this.redoEdits=redo;this.job=null;this.status='Source edit applied';this.emit();return true;
  }catch(e){if(this.job?.token!==token)return false;this.job=null;this.status=e.message;this.error=e.message;this.emit();return false;}
 }
 async prepareOutput(lab,input,spec,outputGainDb,signal,onProgress=()=>{}){
  signal.throwIfAborted();
  const job=this.renderer(lab,copy(input),clone(spec),progress=>onProgress(progress*.85));
  const cancel=()=>job.cancel?.();
  signal.addEventListener('abort',cancel,{once:true});
  try{
   const result=await job.promise;
   signal.throwIfAborted();
   await this.validate(result,false,{checkSamples:false});
   if(result.channels.length!==2)throw new Error('Hub output requires stereo; current stage retained.');
   onProgress(.85,'Checking output level…');
   const outputGain=await applyOutputGain(result.channels,outputGainDb,{signal});
   return {packet:{...result,referenceBlob:undefined,name:input.name},outputGain};
  }finally{signal.removeEventListener('abort',cancel);}
 }
 // Prepare the target while the current work remains authoritative. A null spec passes the working audio through.
 async handoff(lab,spec,workspace,target,prepareTarget,{outputGainDb=0,restoreId=null,prepared=null}={}){
  const restoreStage=restoreId===null?null:this.nodes.find(node=>node.id===restoreId);
  if(this.job||!this.current||!this.working.packet.channels[0].length)return false;
  if(restoreId!==null&&(!restoreStage||!spec))return false;
  this.rememberWorkspace(workspace);
  const input=this.current,working=this.working,reopened=this.reopened,recipeWorkspace=this.editorWorkspace;
  const revision=this.revision,token=++this.serial;
  const controller=new AbortController();this.job={token,cancel:()=>controller.abort()};this.progress=0;this.error='';this.status=restoreStage?'Saving '+lab+'…':spec?'Processing '+lab+' → '+target+'…':'Preparing '+target+'…';this.emit();
  const valid=()=>this.job?.token===token&&this.current===input&&this.working===working&&this.revision===revision;
  try{
   const nextWorkspace={active:target,byLab:{},grainChannel:workspace.grainChannel||'mix'};
   if(!spec){
    // Leaving a clean reopened editor continues from its saved output.
    const nextInput=reopened?input:working;
    await prepareTarget({id:nextInput.id,packet:nextInput.packet,workspace:nextWorkspace},valid,controller.signal);
    if(!valid())return false;
    input.workspace=nextWorkspace;
    if(reopened)this.resetWorking(input);
    this.preview=null;this.revision++;
    this.job=null;this.progress=1;this.status=target[0].toUpperCase()+target.slice(1)+' ready · Working audio retained';
    this.emit();return true;
   }
   const {packet:result,outputGain}=prepared??await this.prepareOutput(lab,working.packet,spec,outputGainDb,controller.signal,(progress,status)=>{
    if(!valid())return;
    this.progress=progress;
    if(status)this.status=status;
    this.emit();
   });
   if(!valid())return false;
   const parentId=reopened?input.parentId:input.id;
   const candidate=this.make({...result,name:working.packet.name},lab[0].toUpperCase()+lab.slice(1)+' · '+(result.channels[0].length/48000).toFixed(2)+' s',parentId,nextWorkspace);
   candidate.renderSpec={lab,spec:clone(spec)};
   // The working input is immutable here. Keep it even if its parent is deleted.
   candidate.recipe={packet:working.packet,editState:working.editState,workspace:recipeWorkspace,outputGainDb};
   if(outputGain.requestedGainDb!==0||outputGain.limited)candidate.outputGain=outputGain;
   this.capacity(candidate);
   if(!restoreStage){
    this.status='Preparing '+target+'…';this.progress=.9;this.emit();
    await prepareTarget(candidate,valid,controller.signal);if(!valid())return false;
   }
   this.publish(candidate);this.job=null;this.progress=1;
   if(restoreStage){
    this.resetWorking(restoreStage,true);this.restoreCount++;
    this.status='Saved '+candidate.label+' · Restored '+restoreStage.label;
   }else this.status=target[0].toUpperCase()+target.slice(1)+' ready · Previous stage retained';
   if(outputGain.skipped)this.status+=' · Output Gain skipped for near silence';
   else if(candidate.outputGain){
    const gain=outputGain.gainDb;
    const peak=outputGain.outputPeakDb===null?'−∞':outputGain.outputPeakDb.toFixed(1);
    this.status+=` · Output Gain ${gain>0?'+':''}${gain.toFixed(1)} dB${outputGain.limited?' (limited)':''} · Peak ${peak} dBFS`;
   }
   this.emit();return true;
  }catch(e){if(!valid())return false;this.job=null;this.error=e.message;this.status=e.message;this.emit();return false;}
 }
 async run(lab,spec,workspace,apply){if(this.job||!this.current||!this.working.packet.channels[0].length)return false;this.rememberWorkspace(workspace);const input=this.current,revision=this.revision,token=++this.serial;this.job={token};this.progress=0;this.error='';this.status=apply?'Applying…':'Preparing preview…';this.emit();const valid=()=>this.job?.token===token&&this.current===input&&this.revision===revision;try{const job=this.renderer(lab,this.packet(),clone(spec),p=>{if(valid()){this.progress=p;this.emit();}});this.job.cancel=job.cancel;const result=await job.promise;if(!valid())return false;await this.validate(result);if(!valid())return false;if(apply){const candidate=this.make(result,`${lab[0].toUpperCase()+lab.slice(1)} · ${result.channels[0].length/48000>=60?'':(result.channels[0].length/48000).toFixed(2)+' s'}`,input.id);candidate.renderSpec={lab,spec:clone(spec)};this.publish(candidate);this.status='Applied · Result is the next input';}else{this.preview={packet:copy(result),inputId:input.id,revision,lab,spec:clone(spec)};this.status='Preview ready · Input unchanged';}this.job=null;this.emit();return true;}catch(e){if(!valid())return false;this.job=null;this.error=e.message;this.status=e.message;this.emit();return false;}}
}
