// Hub input adapter. Volume, deletion and fade calculations use the pinned Audio core.
import {volumePoints,volumeNorm,volumeDb,volumeLabel,volumeGainAt,putVolumePoint,eraseVolumePoint,hasSourceVolume} from '../labs/audio/src/source-volume.js?v=20261028-volume-line1';
import {volumePointer,volumeHit} from '../labs/audio/src/source-volume-view.js?v=20261028-volume-line1';
import {tooltipLanguage} from './tooltip-language.js?v=20261108-tooltip-language1';
export function connectSourceEditor(session,repaint,getView=()=>({start:0,end:session.view().current?.frames||0}),seek=()=>{},beforeVolume=()=>{},busyChanged=()=>{},getCursor=()=>getView().start,toolChanged=()=>{}){
 const $=id=>document.getElementById(id),wave=$('wave');let gesture=null,view=null,held=false,latched=false,volumeTool='pen',selected=0,pending=false,lastNode=null;
 const seconds=n=>Number(n.toFixed(6)).toString(),editing=()=>held||latched||gesture?.kind==='volume',activeTool=()=>held?'pen':volumeTool;
 const geom=r=>({left:64,width:Math.max(1,r.width-76),top:24,bottom:Math.max(25,r.height-19)});
 // The Hub has a 12px right rail; the original editor has 8px. Reuse mapping with a 4px adjustment.
 const rect=()=>{const r=wave.getBoundingClientRect();return {left:r.left,top:r.top,width:r.width-4,height:r.height}};
 const model=v=>({volume:v.edit?.volume||[],rate:v.current?.sampleRate||48000});
 const frame=e=>{const r=wave.getBoundingClientRect(),v=getView();return Math.round(v.start+Math.max(0,Math.min(1,(e.clientX-r.left-64)/Math.max(1,r.width-76)))*(v.end-v.start));};
 const editable=()=>{const v=session.view();return !!v.edit&&!v.activeJob&&!view?.activeJob&&!pending&&v.current.frames>0;};
 function refresh(){render(session.view());repaint();}
 async function applyVolume(next,id,pause){
  if(pending)return;pending=true;refresh();busyChanged();
  try{await pause;if(session.working?.id===id&&!session.job)await session.edit('volume',next.volume);}
  catch(e){session.error=e.message;session.status='Volume not applied: '+e.message;session.emit();}
  finally{pending=false;refresh();busyChanged();}
 }
 function finish(cancel=false,e){
  if(!gesture)return;if(e&&!cancel)move(e);const g=gesture;gesture=null;
  if(g.target.hasPointerCapture(g.id))g.target.releasePointerCapture(g.id);
  if(!cancel&&editable()){
   if(g.kind==='volume'){if(g.draft!==g.previous)void applyVolume(g.draft,g.node,g.pause);}
   else if(g.kind==='select'){session.select(g.start,g.at);if(Math.abs(g.at-g.start)<2)seek(g.start);}
   else void session.edit(g.kind,g.value);
  }
  refresh();
 }
 function move(e){
  if(!gesture||e.pointerId!==gesture.id)return;const g=gesture,v=session.view(),at=frame(e);g.at=at;
  if(g.kind==='volume'){if(Math.hypot(e.clientX-g.x,e.clientY-g.y)<1)return;const p=volumePointer(e,rect(),getView());g.draft=putVolumePoint(g.draft,v.current.frames,p.frame,p.gain,g.index);}
  else if(g.kind!=='select'){const other=g.kind==='fadeIn'?v.edit.fadeOut:v.edit.fadeIn;g.value=Math.min(v.current.frames-other,Math.max(0,g.kind==='fadeIn'?at:v.current.frames-at));}
  repaint();
 }
 function down(e,kind){
  if(e.button!==0||!editable())return;const r=wave.getBoundingClientRect(),v=session.view();
  if(kind==='select'&&(e.clientX<r.left+64||e.clientX>r.right-12))return;
  if(kind==='select'&&(e.metaKey||editing())){
   const g=geom(r);if(e.clientY<r.top+g.top||e.clientY>r.top+g.bottom)return;
   e.preventDefault();wave.focus();held=!!e.metaKey;const state=model(v),hit=volumeHit(state,v.current.frames,getView(),rect(),e);
   if(e.altKey||activeTool()==='eraser'){if(hit!==null){selected=hit;const next=eraseVolumePoint(state,hit);if(next!==state)void applyVolume(next,v.current.inputId,Promise.resolve().then(beforeVolume));}refresh();return;}
   const p=volumePointer(e,rect(),getView()),draft=hit===null?putVolumePoint(state,v.current.frames,p.frame,p.gain):state;
   selected=hit===null?volumePoints(draft,v.current.frames).findIndex(p=>p.frame===Math.min(v.current.frames-1,Math.round(frame(e)))):hit;
   if(selected<0){session.status='Volume point limit reached (512). Remove a point before adding another.';session.emit();return;}
   const pause=Promise.resolve().then(beforeVolume);pause.catch(()=>{});
   gesture={kind:'volume',previous:state,draft,index:selected,x:e.clientX,y:e.clientY,target:e.currentTarget,id:e.pointerId,node:v.current.inputId,pause};
   e.currentTarget.setPointerCapture(e.pointerId);refresh();return;
  }
  if(kind!=='select'&&editing())return;
  e.preventDefault();e.currentTarget.focus();gesture={kind,start:frame(e),at:frame(e),value:kind==='select'?0:v.edit[kind],target:e.currentTarget,id:e.pointerId,node:v.current.inputId};e.currentTarget.setPointerCapture(e.pointerId);repaint();
 }
 for(const [target,kind]of [[wave,'select'],[$('fade-in-handle'),'fadeIn'],[$('fade-out-handle'),'fadeOut']]){
  target.addEventListener('pointerdown',e=>down(e,kind));target.addEventListener('pointermove',move);target.addEventListener('pointerup',e=>finish(false,e));target.addEventListener('pointercancel',()=>finish(true));target.addEventListener('lostpointercapture',()=>finish(true));
 }
 window.addEventListener('blur',()=>{finish(true);held=false;refresh();});
 window.addEventListener('keyup',e=>{if(e.key==='Meta'||e.key==='OS'){held=false;refresh();}},true);
 window.addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]'))return;
  if(e.key==='Escape'&&(gesture||latched)){e.preventDefault();e.stopImmediatePropagation();finish(true);latched=false;refresh();toolChanged(null);return;}
  if(e.key==='Meta'&&editable()&&!e.target.matches('input,select,textarea')&&!e.target.isContentEditable){held=true;refresh();}
 },true);
 wave.addEventListener('keydown',e=>{
  if(gesture||pending||view?.activeJob)return;
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?session.redoEdit():session.undoEdit();return;}
  if(!editable())return;const v=session.view();
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='a'){e.preventDefault();session.select(0,v.current.frames);return;}
  if(editing()){
   const state=model(v),points=volumePoints(state,v.current.frames),p=points[selected];let next=null,handled=true;
   if(e.key==='ArrowLeft'||e.key==='ArrowRight')selected=Math.max(0,Math.min(points.length-1,selected+(e.key==='ArrowRight'?1:-1)));
   else if(['ArrowUp','ArrowDown'].includes(e.key)&&p){const db=(p.gain?volumeDb(p.gain):-60)+(e.key==='ArrowUp'?1:-1)*(e.shiftKey?.1:.5);next=putVolumePoint(state,v.current.frames,p.frame,db<=-60?0:10**(db/20),selected);}
   else if(e.key==='Home'&&p)next=putVolumePoint(state,v.current.frames,p.frame,1,selected);
   else if(e.key==='Enter'){const at=Math.max(0,Math.min(v.current.frames-1,Math.round(getCursor())));next=putVolumePoint(state,v.current.frames,at,1);selected=volumePoints(next,v.current.frames).findIndex(p=>p.frame===Math.min(v.current.frames-1,at));}
   else if(['Delete','Backspace'].includes(e.key))next=eraseVolumePoint(state,selected);
   else handled=false;
   if(handled){e.preventDefault();e.stopImmediatePropagation();if(next&&next!==state)void applyVolume(next,v.current.inputId,Promise.resolve().then(beforeVolume));else refresh();return;}
  }else{
   if(['Delete','Backspace'].includes(e.key)){e.preventDefault();void session.edit('delete');}
   if(e.key==='Escape'){e.preventDefault();session.select(null);}
   if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='a'){e.preventDefault();session.select(0,v.current.frames);}
  }
 });
 for(const [id,side]of [['fade-in-handle','fadeIn'],['fade-out-handle','fadeOut']])$(id).addEventListener('keydown',async e=>{
  if(!editable()||editing()||!['ArrowLeft','ArrowRight','Home'].includes(e.key))return;e.preventDefault();const v=session.view(),delta=(e.key==='ArrowRight'?1:-1)*(side==='fadeIn'?1:-1)*v.current.sampleRate*.01,target=e.currentTarget;
  const changed=await session.edit(side,e.key==='Home'?0:v.edit[side]+delta);if(changed&&document.activeElement===document.body&&target.isConnected&&!target.disabled)target.focus({preventScroll:true});
 });
 $('delete').onclick=()=>!editing()&&session.edit('delete');$('undo-edit').onclick=()=>session.undoEdit();$('redo-edit').onclick=()=>session.redoEdit();
 $('volume-reset').onclick=()=>{if(editable()&&!gesture)void applyVolume({...model(session.view()),volume:[]},session.working.id,Promise.resolve().then(beforeVolume));};
 function render(v){
  view=v;if(gesture&&(gesture.node!==v.current?.inputId||v.activeJob))finish(true);
  if(lastNode!==v.current?.inputId){lastNode=v.current?.inputId;selected=Math.min(selected,Math.max(0,volumePoints(model(v),v.current?.frames||0).length-1));}
  const active=!!v.edit&&!v.activeJob&&!pending,n=v.current?.frames||0,volume=editing();
  $('delete').disabled=!active||volume||!v.edit.selection;$('undo-edit').disabled=!active||!v.edit.canUndo;$('redo-edit').disabled=!active||!v.edit.canRedo;
  for(const [id,tool]of [['source-pen','pen'],['source-eraser','eraser']]){$(id).disabled=!active||!n;$(id).setAttribute('aria-pressed',String(volume&&activeTool()===tool));}$('volume-reset').hidden=!v.edit?.volume?.length;$('volume-reset').disabled=!active||!v.edit?.volume?.length;
  wave.setAttribute('aria-disabled',String(!active||!n));wave.dataset.volumeEditing=String(!!volume);wave.dataset.volumeTool=activeTool();
  wave.setAttribute('aria-label',volume?(activeTool()==='eraser'?'Source volume eraser. Click an interior point to delete. Audio regions and endpoints stay protected. Escape exits.':'Source volume envelope, mute to +6 dB. Click to add; drag to move. Option-click deletes interior points. Arrow keys adjust. Home resets a point to 0 dB. Escape cancels.'):'Source waveform. Click to seek; drag to select. Command shows volume editing.');
  for(const id of ['fade-in-handle','fade-out-handle']){$(id).disabled=!active||!n||volume;$(id).hidden=!v.edit||!n||volume;}
  const range=v.edit?.selection||[0,n],rate=v.current?.sampleRate||48000;
  $('selection-length').textContent=v.edit?.selection?`Selection · ${seconds((range[1]-range[0])/rate)} s`:'';
  $('edit-help').textContent=volume?(activeTool()==='eraser'?'Volume eraser · Click a point · Endpoints protected · Esc exits':'Volume · Click/drag points · Option-click deletes · Esc cancels'):'Drag to select · Delete joins · Corner handles fade · ⌘ Volume';
 }
 function paint(ctx,w,h,v){
  const n=v.current?.frames||0;if(!n||!v.edit)return;const viewport=getView(),span=Math.max(1,viewport.end-viewport.start),x=f=>64+(f-viewport.start)/span*(w-76),range=gesture?.kind==='select'?[Math.min(gesture.start,gesture.at),Math.max(gesture.start,gesture.at)]:v.edit.selection;
  if(range&&range[1]>range[0]){ctx.save();ctx.beginPath();ctx.rect(64,0,w-76,h);ctx.clip();ctx.fillStyle='#8abdED25';ctx.fillRect(x(range[0]),0,x(range[1])-x(range[0]),h);ctx.strokeStyle='#9dcafa';ctx.strokeRect(x(range[0]),1,x(range[1])-x(range[0]),h-2);ctx.restore();}
  for(const [side,id]of [['fadeIn','fade-in-handle'],['fadeOut','fade-out-handle']]){
   const f=gesture?.kind===side?gesture.value:v.edit[side],at=side==='fadeIn'?f:n-f,fraction=(at-viewport.start)/span;
   $(id).hidden=editing()||fraction<0||fraction>1;$(id).style.left=`calc(${fraction*100}% + ${64-76*fraction}px)`;
   const help = side === 'fadeIn' ? 'Drag to set the fade-in length.' : 'Drag to set the fade-out length.';
   $(id).title = `${tooltipLanguage.text('hub.'+side, help)} · ${seconds(f/v.current.sampleRate)} s`;
   if(f){ctx.strokeStyle='#a6c3d0';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x(side==='fadeIn'?0:n),h-8);ctx.lineTo(x(at),8);ctx.stroke();ctx.setLineDash([]);}
  }
  const state=gesture?.kind==='volume'?gesture.draft:model(v);if(!editing()&&!hasSourceVolume(state))return;
  const g=geom({width:w,height:h}),height=g.bottom-g.top,y=gain=>g.bottom-volumeNorm(gain)*height,points=volumePoints(state,n);
  ctx.save();ctx.beginPath();ctx.rect(g.left,g.top,g.width,height);ctx.clip();
  if(editing()){
   ctx.fillStyle='#191c20a6';ctx.fillRect(g.left,g.top,g.width,height);
   for(const db of [6,0,-12,-24,-48]){ctx.strokeStyle=db===0?'#c3d3e361':'#9faebf29';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(g.left,y(10**(db/20)));ctx.lineTo(g.left+g.width,y(10**(db/20)));ctx.stroke();}
  }
  const anchors=[{frame:viewport.start,gain:volumeGainAt(state.volume,viewport.start)},...points.filter(p=>p.frame>viewport.start&&p.frame<viewport.end),{frame:viewport.end,gain:volumeGainAt(state.volume,viewport.end)}];
  ctx.strokeStyle='#8fc5f5';ctx.lineWidth=editing()?1.7:1.1;ctx.beginPath();anchors.forEach((p,i)=>{if(i)ctx.lineTo(x(p.frame),y(p.gain));else ctx.moveTo(x(p.frame),y(p.gain));});ctx.stroke();
  if(editing())for(const [i,p]of points.entries()){if(p.frame<viewport.start||p.frame>viewport.end)continue;ctx.beginPath();ctx.arc(x(p.frame),y(p.gain),i===selected?4.5:3.2,0,Math.PI*2);ctx.fillStyle=i===selected?'#edf4fb':'#8fc5f5';ctx.fill();}
  ctx.restore();if(!editing())return;
  ctx.save();ctx.font='11px -apple-system, BlinkMacSystemFont, sans-serif';ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillStyle='#191c20';ctx.fillRect(0,g.top,g.left-2,height);ctx.fillStyle='#bec8d2';
  for(const db of (height<100?[0,-24]:[6,0,-12,-24,-48]))ctx.fillText(`${db>0?'+':''}${db} dB`,g.left-7,Math.max(g.top+7,y(10**(db/20))));ctx.fillText('−∞',g.left-7,g.bottom-5);
  const p=points[selected];if(p){ctx.fillStyle='#191c20';ctx.fillRect(0,0,w,21);ctx.fillStyle='#e1e8ef';ctx.textAlign='left';ctx.fillText(`Source volume · ${volumeLabel(p.gain)} · ${(p.frame/(v.current.sampleRate||48000)).toFixed(3)} s`,8,12);}
  ctx.restore();
 }
 return {render,paint,get busy(){return pending;},get dragging(){return !!gesture;},get tool(){return latched?volumeTool:null;},setTool(tool){if(pending||gesture||!editable())return false;latched=tool!==null;volumeTool=tool||'pen';refresh();toolChanged(tool);return true;}};
}
