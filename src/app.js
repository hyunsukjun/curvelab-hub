import {connectHubHelp} from './help-ui.js?v=20261108-tooltip-language1';
import {createControlHelp} from './control-help.js?v=20261108-tooltip-language1';
import {tooltipLanguage} from './tooltip-language.js?v=20261108-tooltip-language1';
import {labTooltipCopy} from './lab-tooltip-copy.js?v=20261108-english-help1';
import {renderSavedHistory, refreshSavedHistoryTitles} from './history-ui.js?v=20261108-tooltip-language1';
import {connectOutputMeter} from './output-meter-ui.js?v=20261107-shared-tools2';
import {granularSourceMode} from './granular-source.js';
import {NativeTransport} from './native-transport.js';
import {HubSession} from './session.js?v=20261108-relative-gain1';
import {OUTPUT_GAIN_MIN_DB,OUTPUT_GAIN_MAX_DB} from './output-gain.js?v=20261108-relative-gain1';
import {renderJob} from './renderer.js?v=20261106-level2';
import {connectSourceEditor} from './source-ui.js?v=20261108-tooltip-language1';
import {readAudioFile,validateAudioBuffer} from '../labs/audio/src/audio-import.js';
import {summarizeChannels,peakOf,paintWaveform} from '../labs/audio/src/waveform-view.js';
import {analyzeSourceColors} from '../labs/audio/src/source-colors.js';
import {createSourceOverview} from '../labs/audio/src/source-overview.js';
import {encodeWav} from '../labs/granular/src/granular-core.js';
const $=id=>document.getElementById(id),names=['audio','timbre','space','granular','spectral','oscillator'],colors=['#91bde9','#e2cd83','#b99be9','#da9dbf','#e0a58a','#81cdbd'];
const controlHelp=createControlHelp();
const outputGain=$('output-gain');
outputGain.min=String(OUTPUT_GAIN_MIN_DB);
outputGain.max=String(OUTPUT_GAIN_MAX_DB);
let outputGainStage=null;
function updateOutputGain(){
 const db=outputGain.valueAsNumber;
 const value=db===0?'0 dB':`${db>0?'+':'−'}${Math.abs(db).toFixed(1)} dB`;
 const position=(db-OUTPUT_GAIN_MIN_DB)/(OUTPUT_GAIN_MAX_DB-OUTPUT_GAIN_MIN_DB)*100;
 $('output-gain-value').value=value;
 outputGain.setAttribute('aria-valuetext',db===0?'0 dB, no adjustment':value);
 outputGain.style.setProperty('--gain-start',`${Math.min(50,position)}%`);
 outputGain.style.setProperty('--gain-end',`${Math.max(50,position)}%`);
}
outputGain.oninput=()=>{updateOutputGain();currentBridge()?.meter?.setGainDb(outputGain.valueAsNumber);};
let active='audio',lastId=null,packet=null,peaks=[],colorsData=null,zoom=1,viewStart=0,waveHeight=180,frameHeight=430,ready=false,syncSerial=0,workspace={byLab:{},active:'audio',grainChannel:'mix'},dirty=false,assetLoading=false,editorFailure=null,sourceCursor=0,lastBusy=false,controlBlocked=true;
let editorLoadController=null;
const records=new Map();const session=new HubSession(renderJob,render);
const currentBridge=()=>ready?records.get(active)?.frame.contentWindow.hubBridge:null;
const transport=new NativeTransport({bridge:currentBridge,blocked:()=>session.job?'Processing…':eligibility(),changed:()=>{renderControls();updateTransport();},error:showError});
const sourceUI=connectSourceEditor(session,draw,viewRange,frame=>{sourceCursor=frame;if(!session.job)void transport.seekSource(frame/48000);draw();},async()=>{saveWorkspace();await stopPlayback();},()=>renderControls(),()=>sourceCursor,tool=>applySharedTool(tool));
const overviewPaint=createSourceOverview($('overview-canvas'));

const signature=s=>JSON.stringify(s,(key,value)=>ArrayBuffer.isView(value)?{type:value.constructor.name,length:value.length}:value instanceof ArrayBuffer?{bytes:value.byteLength}:value);
const title=s=>s[0].toUpperCase()+s.slice(1),fmt=n=>{const min=Math.floor(n/60),sec=(n%60).toFixed(2).padStart(5,'0');return String(min).padStart(2,'0')+':'+sec};
function showError(e){session.status=e.message||String(e);session.error=session.status;session.emit();}
function saveWorkspace(){if(ready&&records.get(active)?.frame.contentWindow.hubBridge){workspace.byLab[active]=records.get(active).frame.contentWindow.hubBridge.snapshot();workspace.active=active;workspace.dirtyByLab??={};workspace.dirtyByLab[active]=dirty;workspace.grainChannel=$('grain-channel').value;}if(session.current)session.current.workspace=structuredClone(workspace);}
async function getFrame(lab){
 if(records.has(lab))return records.get(lab).promise;
 const frame=document.createElement('iframe');frame.title=title(lab)+' curve editor';frame.hidden=lab!==active;
 for(const [key,r]of records)r.frame.hidden=key!==active;
 const rec={frame,task:Promise.resolve(),loadedId:null};
 rec.promise=new Promise((resolve,reject)=>{
  let settled=false;
  const fail=error=>{if(settled)return;settled=true;clearInterval(timer);clearTimeout(timeout);if(records.get(lab)===rec)records.delete(lab);frame.remove();reject(error);};
  const finish=()=>{if(settled)return;try{const bridge=frame.contentWindow?.hubBridge;if(!bridge)return;const defaults=bridge.defaults();frame.contentDocument.body.dataset.hubLab=lab;controlHelp.connectLab(frame,lab,labTooltipCopy[lab]);rec.defaults=defaults;settled=true;clearInterval(timer);clearTimeout(timeout);resolve(rec);}catch(error){fail(new Error(title(lab)+' editor could not initialize: '+(error.message||String(error))));}};
  const timer=setInterval(finish,80),timeout=setTimeout(()=>fail(new Error(title(lab)+' editor did not load. Retry or select another Lab.')),45000);frame.onload=finish;
 });records.set(lab,rec);$('frames').append(frame);
 const shellVersion=lab==='granular'?'20261108-granular-pointerup1':'20261108-button-tone-b1';
 frame.src=`labs/${lab}/index.html?hub=1&shell=${shellVersion}`;return rec.promise;
}
async function syncEditor(){
 editorLoadController?.abort();
 const controller=new AbortController();editorLoadController=controller;
 const token=++syncSerial,previousFailure=editorFailure;
 ready=false;editorFailure=null;renderControls();
 try{
  const lab=active,rec=await getFrame(lab);if(token!==syncSerial)return;
  for(const [key,r]of records)r.frame.hidden=key!==lab;
  const p=session.packet(),id=session.view().current?.inputId,saved=structuredClone(workspace.byLab[lab]||null);
  rec.task=rec.task.catch(()=>{}).then(async()=>{
   if(token!==syncSerial)return;
   const bridge=rec.frame.contentWindow.hubBridge;
   const reload=rec.loadedId!==id;
   // Oscillator analyzes the new input with the saved partial count and IR.
   const restoreBeforeLoad=reload&&lab==='oscillator'&&saved&&p?.channels[0].length;
   if(reload){
    bridge.restore(restoreBeforeLoad?saved:rec.defaults);
    if(p?.channels[0].length)await bridge.load(p,{signal:controller.signal});
    rec.loadedId=id;
   }
   if(token!==syncSerial)return;
   if(saved&&!restoreBeforeLoad)bridge.restore(saved);
   bridge.setEditingTool(sourceUI.tool||'pen');
   if(lab==='granular')await bridge.routeSource(granularSourceMode(workspace.grainChannel));
   if(token!==syncSerial)return;
   bridge.meter?.setGainDb(outputGain.valueAsNumber);
   bridge.resize();
  });
  await rec.task;if(token!==syncSerial)return;
  rec.frame.contentDocument.body.dataset.hubLab=lab;
  const bridge=rec.frame.contentWindow.hubBridge,snap=bridge.snapshot();
  workspace.byLab[lab]=snap;rec.signature=signature(snap);
  rec.processingSignature=signature({spec:bridge.spec(),asset:snap.extra?.impulseRevision});
  ready=true;dirty=!!workspace.dirtyByLab?.[lab];
  if(previousFailure&&session.error===previousFailure.message){session.error="";session.status="Editor ready · Current input retained";session.emit();}
  fitEditor();renderControls();
 }catch(e){if(token!==syncSerial)return;ready=false;editorFailure=e;showError(e);}
}
let editorRatio=0,editorBudget=610,layoutFrame=0,layoutRunning=false;
function fitEditor(){
 if(layoutFrame)return;
 layoutFrame=requestAnimationFrame(()=>{layoutFrame=0;layoutEditors();});
}
function layoutEditors(){
 if(layoutRunning)return;
 const rec=records.get(active);if(!rec?.frame.contentWindow.hubBridge)return;
 layoutRunning=true;
 try{
 const doc=rec.frame.contentDocument;document.body.dataset.hubDensity=doc.body.dataset.hubDensity=innerHeight<1000?'compact':'comfortable';doc.documentElement.style.setProperty('--hub-spatial-size',Math.max(180,Math.min(300,innerHeight-650))+'px');const canvas=doc.querySelector(['audio','timbre','spectral'].includes(active)?'#waveCanvas':'#curveCanvas');if(!canvas)return;
 // Measure the Lab's minimum content, never its previous expanded height.
 doc.documentElement.style.setProperty('--hub-curve-height','170px');
 const scroll=rec.frame.contentWindow.scrollY,rect=canvas.getBoundingClientRect(),top=rect.top+scroll,chain=doc.querySelector('#chainDiagram');
 let below=(chain?.getBoundingClientRect().height||0)+12;
 const spatial=doc.querySelector('.spatialPanel')?.getBoundingClientRect();
 if(spatial&&spatial.top>=rect.bottom-1)below+=Math.max(0,spatial.bottom-rect.bottom);
 const minimum=Math.ceil(Math.max(300,top+170+below,spatial?spatial.bottom+scroll+12:0));
 const wave=$('wave'),wrap=$('lab-frame-wrap');
 document.querySelector('main').style.setProperty('--hub-scrollbar-inset',Math.max(0,($('workspace-scroll').offsetWidth-$('workspace-scroll').clientWidth)/2)+'px');
 const overhead=$('workspace-content').getBoundingClientRect().height-wave.getBoundingClientRect().height-wrap.getBoundingClientRect().height;
 editorBudget=Math.max(100+minimum,Math.floor($('workspace-scroll').clientHeight-overhead));
 waveHeight=Math.max(100,Math.min(editorBudget-minimum,Math.round(editorBudget*editorRatio)));
 frameHeight=editorBudget-waveHeight;
 if(wave.style.height!==waveHeight+'px')wave.style.height=waveHeight+'px';
 if(wrap.style.height!==frameHeight+'px')wrap.style.height=frameHeight+'px';
 if(wrap.style.minHeight!==minimum+'px')wrap.style.minHeight=minimum+'px';
 const curveHeight=spatial?frameHeight-top-below:frameHeight-minimum+170;
 doc.documentElement.style.setProperty('--hub-curve-height',Math.max(170,curveHeight)+'px');
 rec.frame.contentWindow.hubBridge.resize();
 const split=$('split');split.setAttribute('aria-valuemin','100');split.setAttribute('aria-valuemax',String(editorBudget-minimum));split.setAttribute('aria-valuenow',String(waveHeight));split.setAttribute('aria-valuetext',`Source ${waveHeight} pixels; Lab ${frameHeight} pixels`);
 draw();
 }finally{layoutRunning=false;}
}

function onCurrent(v){void stopPlayback();sourceCursor=0;lastId=v.current?.inputId;packet=session.packet();workspace=structuredClone(session.current?.workspace||{});workspace.byLab??={};active=workspace.active||active;workspace.active=active;workspace.grainChannel=granularSourceMode(workspace.grainChannel);$('grain-channel').value=workspace.grainChannel;zoom=1;viewStart=0;colorsData=null;peaks=packet?.channels[0].length?summarizeChannels(packet.channels):[];if(packet?.channels[0].length){const id=lastId;analyzeSourceColors({sampleRate:packet.sampleRate,length:packet.channels[0].length,numberOfChannels:packet.channels.length,getChannelData:i=>packet.channels[i]},data=>{if(lastId===id){colorsData=data;draw();}});}syncEditor();}
function render(v){if(v.activeJob&&!lastBusy)void stopPlayback();lastBusy=v.activeJob;if(v.current?.inputId!==lastId)onCurrent(v);sourceUI.render(v);$('input-name').textContent=packet?.name||v.current?.label||'Loading audio…';$('input-name').title=$('input-name').textContent;$('metadata').textContent=v.current?`${v.current.channels}ch · 48 kHz`:'';$('length').textContent=v.current?fmt(v.current.frames/48000):'';paintStatus(v.status,v.activeJob);$('import-error').hidden=!v.error;$('import-error').textContent=v.error;$('cancel').hidden=!v.activeJob;$('progress').hidden=!v.activeJob;$('progress').value=v.progress;$('frame-block').hidden=!v.activeJob;$('frame-block').textContent=v.status;renderSavedHistory($('history'),v,{names,colors,disabled:assetLoading||v.activeJob,select:id=>{if(id!==session.current?.id){saveWorkspace();stopPlayback();session.restore(id)}},remove:id=>{if(ready&&!sourceUI.busy&&!assetLoading&&!currentBridge()?.busy?.())session.deleteSelectedStage(id)},undoRemove:undoStageDeletion,redoRemove:redoStageDeletion});renderControls();draw();}
function eligibility(){const v=session.view();if(sourceUI.busy)return 'Applying source volume…';if(assetLoading)return 'Loading separate IR…';if(ready&&records.get(active)?.frame.contentWindow.hubBridge?.busy?.())return 'Preparing analysis or IR…';if(!ready)return editorFailure?.message||'Loading editor…';if(!v.current?.frames)return 'Open audio to begin';if(v.current.frames<4)return 'At least four source frames are required.';if(v.current.channels!==2)return 'Stereo input required; no automatic downmix.';const spec=records.get(active).frame.contentWindow.hubBridge.spec();if((spec.format&&spec.format!=='stereo')||(spec.settings?.format&&spec.settings.format!=='stereo'))return 'This integration currently supports stereo handoff. Choose Stereo 2ch.';if(active==='granular'&&!['mix','0','1'].includes($('grain-channel').value))return 'Choose Mono mix, Left or Right.';if(active==='oscillator'&&spec.settings.soundMode==='resynthesis'&&!spec.settings.analysisResult)return 'Analyzing current input…';return '';}
function renderControls(){
 const v=session.view(),preparing=sourceUI.busy||assetLoading||Boolean(ready&&currentBridge()?.busy?.());
 const stage=v.current?.id;
 if(stage!==outputGainStage){outputGainStage=stage;outputGain.value=0;updateOutputGain();}
 sourceUI.render({...v,activeJob:v.activeJob||preparing});
 for(const rec of records.values()){const body=rec.frame.contentDocument?.body;if(body)body.inert=v.activeJob||preparing||!ready;}
 for(const b of $('history').querySelectorAll('button'))b.disabled=v.activeJob||preparing;
 $('frame-block').hidden=!v.activeJob&&!preparing&&ready;
 $('frame-block').textContent=v.activeJob?v.status:assetLoading?'Loading separate IR…':preparing?'Preparing analysis…':editorFailure?'Editor unavailable · Retry editor':'Loading editor…';
 $('retry-editor').hidden=!editorFailure;$('retry-editor').disabled=v.activeJob||preparing;
 $('restore-original').hidden=!v.current?.parentId&&!v.edit?.modified;$('restore-original').disabled=preparing||v.activeJob;
 $('file').disabled=preparing||v.activeJob;$('open-ir').disabled=preparing||v.activeJob;$('grain-channel').disabled=preparing||v.activeJob;
 for(const b of $('labs').children){b.setAttribute('aria-pressed',b.dataset.lab===active);b.disabled=v.activeJob||preparing;}
 let blocked='';try{blocked=eligibility();}catch(e){blocked=e.message;}
 outputGain.disabled=v.activeJob||!!blocked;
 controlBlocked=!!blocked;const state=transport.state(),pending=!!transport.pending;
 $('play').disabled=!pending&&!state.playing&&(v.activeJob||!!blocked||state.busy||state.disabled);
 $('play').textContent=pending?'…':state.playing?'Ⅱ':'▶';
 $('play').setAttribute('aria-label',transport.pausing?(transport.pending.resume?'Cancel resume':'Resume after pause'):pending?'Cancel playback request':state.playing?'Pause':'Play');$('play').setAttribute('aria-busy',String(pending));
 $('seek').disabled=$('rewind').disabled=(pending&&!transport.pausing)||v.activeJob||!!blocked||state.busy;
 $('export').disabled=v.activeJob||!session.current?.packet.channels[0].length;refreshExportTitle(v.current);$('draft-state').hidden=!dirty||!ready;$('granular-route').hidden=active!=='granular';
 let mode='';if(ready&&active==='oscillator')mode=currentBridge().spec().settings.soundMode;$('open-ir').hidden=mode!=='convolution';
 $('lab-status').textContent=blocked||(active==='granular'?`Grain source: ${$('grain-channel').selectedOptions[0]?.textContent||'Mono mix'}`:active==='oscillator'?(mode==='resynthesis'?'File Resynthesis':'Oscillator + File IR'):active==='space'?'Live HRTF preview':'');
}
async function prepareTarget(lab,candidate,valid,signal){
 const rec=await getFrame(lab);if(!valid())return;
 rec.task=rec.task.catch(()=>{}).then(async()=>{
  if(!valid())return;const bridge=rec.frame.contentWindow.hubBridge;
  rec.loadedId=null;await bridge.stop();bridge.restore(rec.defaults);
  bridge.meter?.setGainDb(0);
  await bridge.load(candidate.packet,{signal});if(!valid())return;
  if(lab==='granular')await bridge.routeSource(granularSourceMode(candidate.workspace.grainChannel));
  if(!valid())return;bridge.resize();candidate.workspace.byLab[lab]=bridge.snapshot();rec.loadedId=candidate.id;
 });await rec.task;
}
async function switchLab(lab){
 if(!names.includes(lab))throw new Error('Unknown Lab');
 if(lab===active){if(!ready)await syncEditor();return false;}
 if(session.job||assetLoading||currentBridge()?.busy?.())return false;
 const blocked=eligibility();if(blocked){showError(new Error(blocked));return false;}
 const from=active,inputId=session.working?.id;
 const sameInput=()=>ready&&active===from&&session.working?.id===inputId&&!session.job&&!sourceUI.busy;
 await stopPlayback();if(!sameInput())return false;
 await currentBridge().prepareOutput?.();if(!sameInput())return false;
 saveWorkspace();const spec=currentSpec();
 return session.handoff(from,spec,workspace,lab,(candidate,valid,signal)=>prepareTarget(lab,candidate,valid,signal),{outputGainDb:outputGain.valueAsNumber});
}
for (const [index, lab] of names.entries()) {
 const button = document.createElement('button');
 button.textContent = title(lab);
 button.dataset.lab = lab;
 button.style.setProperty('--lab-color', colors[index]);
 button.onclick = () => switchLab(lab).catch(showError);
 $('labs').append(button);
 controlHelp.registerLabTab(button, lab);
}
window.addEventListener('message',e=>{if(e.origin!==location.origin)return;const rec=records.get(active);if(e.source!==rec?.frame.contentWindow)return;if(e.data?.hub==='activity'){renderControls();return;}if(e.data?.hub==='play'){togglePlay();return;}if(e.data?.hub==='changed'&&ready&&!session.job){const snap=rec.frame.contentWindow.hubBridge.snapshot(),key=signature(snap);if(key!==rec.signature){rec.signature=key;workspace.byLab[active]=snap;const processing=signature({spec:rec.frame.contentWindow.hubBridge.spec(),asset:snap.extra?.impulseRevision}),changed=processing!==rec.processingSignature;rec.processingSignature=processing;if(changed)dirty=true;saveWorkspace();fitEditor();if(changed){session.touch();session.status='Live settings updated';session.emit();}else renderControls();}}});
function currentSpec(){const spec=currentBridge().spec();if(active==='granular')spec.sourceChannel=granularSourceMode($('grain-channel').value);return spec;}
async function run(){const blocked=eligibility();if(blocked){showError(new Error(blocked));return false;}await stopPlayback();await currentBridge()?.prepareOutput?.();saveWorkspace();return session.run(active,currentSpec(),workspace,false);}
$('retry-editor').onclick=()=>syncEditor();
$('cancel').onclick=()=>{void stopPlayback();session.cancel()};$('grain-channel').onchange=async()=>{dirty=true;saveWorkspace();await stopPlayback();session.touch();await syncEditor()};$('open-ir').onclick=()=>$('ir-file').click();$('ir-file').onchange=async()=>{const file=$('ir-file').files[0];if(!file)return;assetLoading=true;stopPlayback();session.touch();renderControls();try{await records.get('oscillator').frame.contentWindow.hubBridge.loadIR(file);dirty=true;saveWorkspace();session.status='Separate IR ready · Resynthesis source unchanged';}catch(e){showError(e)}finally{assetLoading=false;$('ir-file').value='';session.emit();fitEditor();}};
async function stopPlayback(){await transport.stop();}
function togglePlay(){if(!session.job&&!$('hub-info').open)void transport.toggle();}
$('play').onclick=togglePlay;$('rewind').onclick=()=>void transport.seek(0);$('seek').oninput=()=>void transport.seek(Number($('seek').value)/1000);
function updateTransport(){
 const state=transport.state();
 $('clock-elapsed').textContent=fmt(state.seconds||0);
 $('clock-duration').textContent=fmt(state.duration||0);
 const seek=$('seek');
 seek.value=state.duration?state.seconds/state.duration*1000:0;
 seek.style.setProperty('--range-progress',`${Number(seek.value)/10}%`);
 $('play').classList.toggle('playing',!!state.playing);$('live-state').hidden=!state.playing;$('live-state').textContent='Live · '+title(active);
 const pending=!!transport.pending,busy=!!session.job||assetLoading||!ready;
 $('play').textContent=pending?'…':state.playing?'Ⅱ':'▶';
 $('play').setAttribute('aria-label',transport.pausing?(transport.pending.resume?'Cancel resume':'Resume after pause'):pending?'Cancel playback request':state.playing?'Pause':'Play');
 $('play').disabled=!pending&&!state.playing&&(busy||controlBlocked||state.busy||state.disabled);
 $('seek').disabled=$('rewind').disabled=(pending&&!transport.pausing)||busy||controlBlocked||state.busy;
 if(Number.isFinite(state.sourceSeconds))sourceCursor=Math.round(state.sourceSeconds*48000);
 if(state.notice){paintStatus(state.notice);}
 draw();
}
connectOutputMeter($('output-meter'),()=>ready&&!session.job?currentBridge():null);
setInterval(updateTransport,100);
window.addEventListener('keydown',e=>{if($('hub-info').open||e.target.closest?.('#hub-info-button'))return;if(e.code==='Space'&&!e.target.matches('input,select,textarea,summary')&&!e.target.isContentEditable){e.preventDefault();if(!e.repeat)togglePlay();}});
async function decode(file){const bytes=await readAudioFile(file,48000),ctx=new OfflineAudioContext(2,1,48000),b=await ctx.decodeAudioData(bytes);await validateAudioBuffer(b);if(![1,2].includes(b.numberOfChannels))throw new Error('Multichannel file: open a mono or stereo file. Previous audio retained.');const channels=Array.from({length:b.numberOfChannels},(_,i)=>{const c=new Float32Array(b.length);b.copyFromChannel(c,i);return c;});if(channels.length===1)channels.push(channels[0].slice());return {name:file.name,sampleRate:b.sampleRate,channels};}
$('file').onchange=()=>{const f=$('file').files[0];if(f){saveWorkspace();stopPlayback();session.load(()=>decode(f));}$('file').value=''};function loadDefaultSample(){return session.load(async()=>{const r=await fetch('labs/audio/assets/audio/bach-prelude-72bpm.mp3');if(!r.ok)throw new Error('Sample unavailable');return decode(new File([await r.blob()],'Bach Prelude.mp3'));});}
$('restore-original').onclick=()=>{
 const original=session.original();if(!original||session.job)return;
 saveWorkspace();void stopPlayback();
 if(session.restore(original.id))$('wave').focus({preventScroll:true});
};
$('export').onclick=async()=>{try{
 if(session.job)return;const stage=session.current;if(!stage?.packet?.channels[0]?.length)return;const p=stage.packet;
 let clipped=0;for(const c of p.channels)for(const x of c)if(Math.abs(x)>1)clipped++;
 if(clipped&&!confirm(`The selected stage contains ${clipped} samples above full scale. Exporting 24-bit WAV clips these samples. Continue?`))return;
 const blob=encodeWav(p.channels,p.sampleRate,{bitDepth:24,dither:false});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='CurveLab-Hub-stage-'+stage.id+'.wav';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);session.status='Selected stage exported · '+stage.label+' · '+(p.sampleRate/1000)+' kHz / 24-bit';session.emit();
 }catch(e){showError(e)}};
function viewRange(){const n=packet?.channels[0].length||0,span=Math.max(1,Math.round(n/zoom));viewStart=Math.max(0,Math.min(viewStart,Math.max(0,n-span)));return {start:viewStart,end:Math.min(n,viewStart+span)};}
function setZoom(z){const v=viewRange(),center=(v.start+v.end)/2;zoom=Math.max(1,Math.min(64,z));viewStart=Math.round(center-(packet?.channels[0].length||0)/zoom/2);draw();}
$('zoom-in').onclick=()=>setZoom(zoom*2);$('zoom-out').onclick=()=>setZoom(zoom/2);$('zoom-fit').onclick=()=>{zoom=1;viewStart=0;draw()};let navigating=false;
function pan(e){const r=$('overview').getBoundingClientRect(),n=packet?.channels[0].length||0;viewStart=Math.round((e.clientX-r.left)/r.width*n-n/zoom/2);draw();}$('overview').onpointerdown=e=>{if(e.button!==0)return;navigating=true;$('overview').setPointerCapture(e.pointerId);pan(e)};$('overview').onpointermove=e=>{if(navigating)pan(e)};$('overview').onpointerup=$('overview').onpointercancel=()=>navigating=false;$('overview').onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=packet?.channels[0].length||0;viewStart=e.key==='Home'?0:e.key==='End'?n:viewStart+(e.key==='ArrowRight'?1:-1)*n/zoom*.1;draw();};
let raster=null,rasterKey='';function draw(){if(!session||!sourceUI)return;const cv=$('wave'),r=cv.getBoundingClientRect(),d=devicePixelRatio||1,v=viewRange(),n=packet?.channels[0].length||0,key=[lastId,v.start,v.end,r.width,r.height,!!colorsData].join(':');if(!raster||key!==rasterKey){raster=document.createElement('canvas');raster.width=Math.max(1,Math.round(r.width*d));raster.height=Math.max(1,Math.round(r.height*d));const ctx=raster.getContext('2d');if(packet&&n&&colorsData){const subset=zoom===1?peaks:summarizeChannels(packet.channels.map(c=>c.subarray(v.start,v.end)));paintWaveform(ctx,{width:r.width,height:r.height,left:64,right:12,peaks:subset,referencePeak:peakOf(peaks),duration:(v.end-v.start)/48000,timeOffset:v.start/48000,title:'Source time',colors:colorsData,colorStart:v.start/n,colorEnd:v.end/n});}else{ctx.fillStyle='#191c20';ctx.fillRect(0,0,raster.width,raster.height);}rasterKey=key;}cv.width=raster.width;cv.height=raster.height;const ctx=cv.getContext('2d');ctx.drawImage(raster,0,0);ctx.scale(d,d);sourceUI.paint(ctx,r.width,r.height,session.view());if(n&&sourceCursor>=v.start&&sourceCursor<=v.end){const x=64+(sourceCursor-v.start)/Math.max(1,v.end-v.start)*(r.width-76);ctx.strokeStyle='#edf5fa';ctx.beginPath();ctx.moveTo(x,22);ctx.lineTo(x,r.height-18);ctx.stroke();}overviewPaint({peaks,colors:colorsData,referencePeak:peakOf(peaks)});$('viewport').style.left=(n?v.start/n*100:0)+'%';$('viewport').style.width=(n?(v.end-v.start)/n*100:100)+'%';$('overview').setAttribute('aria-valuenow',String(n?Math.round(v.start/n*100):0));$('overview').setAttribute('aria-valuetext',`${(v.start/48000).toFixed(2)} to ${(v.end/48000).toFixed(2)} seconds`);$('zoom-fit').textContent=zoom===1?'Fit':`Fit · ${zoom}×`;}
function size(h){const limit=Number($('split').getAttribute('aria-valuemax'))||editorBudget-300;const next=Math.max(100,Math.min(limit,h));if(next===waveHeight)return;editorRatio=next/editorBudget;fitEditor();}
let resizeDrag=null;const split=$('split');
split.onpointerdown=e=>{if(e.button!==0)return;resizeDrag={y:e.clientY,h:waveHeight,ratio:editorRatio};split.setPointerCapture(e.pointerId);e.preventDefault();split.focus({preventScroll:true});};
split.onpointermove=e=>{if(resizeDrag)size(resizeDrag.h+e.clientY-resizeDrag.y);};
split.onpointerup=()=>resizeDrag=null;
function cancelResize(){if(resizeDrag){editorRatio=resizeDrag.ratio;resizeDrag=null;fitEditor();}}
split.onpointercancel=cancelResize;split.onlostpointercapture=()=>{if(resizeDrag)cancelResize();};
split.onkeydown=e=>{if(['ArrowUp','ArrowDown','Home','Escape'].includes(e.key)){e.preventDefault();if(e.key==='Escape'){cancelResize();return;}if(e.key==='Home'){editorRatio=0;fitEditor();}else size(waveHeight+(e.key==='ArrowDown'?16:-16));}};
window.addEventListener('blur',cancelResize);
// Coalesce layout work. Observe only available space and non-canvas chrome;
// never feed the expanded Lab canvas height back into its own minimum.
const layoutObserver=new ResizeObserver(fitEditor);
for(const element of [$('workspace-scroll'),document.querySelector('header'),document.querySelector('.source .bar'),document.querySelector('.edit-controls'),$('edit-help'),$('history'),$('labs'),document.querySelector('.route')])layoutObserver.observe(element);
new ResizeObserver(draw).observe($('wave'));
window.addEventListener('resize',fitEditor);
render(session.view());syncEditor();void loadDefaultSample();window.addEventListener('pagehide',()=>{editorLoadController?.abort();session.cancel();for(const r of records.values())void r.frame.contentWindow.hubBridge?.stop()});
if(['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).has('test'))window.hubTest={session,transport,togglePlay,records,decode,run,switchLab,get active(){return active},get ready(){return ready},get workspace(){return workspace},get packet(){return packet},saveWorkspace};

function applySharedTool(tool){if(ready){currentBridge()?.setEditingTool(tool||'pen');saveWorkspace();const rec=records.get(active);if(rec)rec.signature=signature(currentBridge().snapshot());}}
for(const [id,tool]of [['source-pen','pen'],['source-eraser','eraser']])$(id).onclick=()=>sourceUI.setTool(sourceUI.tool===tool?null:tool);
function refreshExportTitle(stage) {
 const template = tooltipLanguage.text('hub.exportStage', 'Download saved stage: {stage}. Uncommitted changes excluded.');
 $('export').title = stage ? template.replace('{stage}', () => stage.label)
   : tooltipLanguage.text('hub.export', 'Download the selected saved stage as WAV. Unsaved edits are excluded.');
}
tooltipLanguage.subscribe(() => {
 const view = session.view();
 refreshExportTitle(view.current);
 refreshSavedHistoryTitles($('history'), view);
 draw();
});
connectHubHelp($('hub-info'),$('hub-info-button'), code => void tooltipLanguage.select(code));

function paintStatus(message,busy=false){const text=message==='Input ready'?'':message;$('status').textContent=text;$('status').closest('.status-line').hidden=!text&&!busy;}

function undoStageDeletion(){
 if(!ready||sourceUI.busy||assetLoading||currentBridge()?.busy?.()||session.job||!session.deletedStages.length)return;
 saveWorkspace();
 if(session.undoStageDeletion())$('history').querySelector('[aria-current="step"]')?.focus({preventScroll:true});
}

function redoStageDeletion(){
 if(!ready||sourceUI.busy||assetLoading||currentBridge()?.busy?.()||session.job)return;
 session.redoStageDeletion();
}
