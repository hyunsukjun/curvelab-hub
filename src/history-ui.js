import {tooltipLanguage} from './tooltip-language.js?v=20261108-tooltip-language1';

export function refreshSavedHistoryTitles(root, view) {
 const stages = new Map(view.history.map(stage => [stage.id, stage]));
 for (const button of root.querySelectorAll('button[data-node]')) {
  const stage = stages.get(button.dataset.node);
  const selected = stage.id === view.current?.id;
  const template = selected
    ? tooltipLanguage.text('hub.selectedStage', 'Selected saved stage: {stage} · Delete removes this stage')
    : tooltipLanguage.text('hub.savedStage', 'Saved stage: {stage} · From {parent}');
  button.title = template.replace(/\{(stage|parent)\}/g, (_, key) => key === 'stage'
    ? stage.label : stages.get(stage.parentId)?.label || tooltipLanguage.text('hub.source', 'source'));
 }
}

// Show saved processing stages in chronological order across sources.
export function renderSavedHistory(root,view,{names,colors,disabled,select,remove,undoRemove,redoRemove}){
 root.tabIndex=-1;
 root.onkeydown=event=>{
  if(!event.metaKey||event.ctrlKey||event.altKey||event.key.toLowerCase()!=='z')return;
  event.preventDefault();
  if(!event.repeat&&!disabled)(event.shiftKey?redoRemove:undoRemove)();
 };
 const stages=view.history.filter(n=>n.parentId);
 const focused=root.contains(document.activeElement)?document.activeElement:null;
 function button(n){
  const b=document.createElement('button');const label=document.createElement('span');label.className='stage-label';label.textContent=n.label;b.append(label);b.dataset.node=n.id;b.dataset.lab=n.lab||'source';b.setAttribute('aria-label',n.label);
  if(n.lab&&names.includes(n.lab))b.style.setProperty('--stage-color',colors[names.indexOf(n.lab)]);
  if(n.id===view.current?.id){
   b.setAttribute('aria-current','step');
   b.addEventListener('keydown',event=>{
    if(!['Delete','Backspace'].includes(event.key)||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
    event.preventDefault();
    if(!event.repeat&&!b.disabled)remove(n.id);
   });
  }
  b.disabled=disabled;
  b.onclick=()=>{
   // WebKit can activate a button without moving keyboard focus to it.
   b.focus({preventScroll:true});
   select(n.id);
  };
  return b;
 }
 const children=stages.map(button);
 root.replaceChildren(...children);
 refreshSavedHistoryTitles(root,view);
 if(focused&&focused!==root){
  const target=children.find(b=>b.dataset.node===focused.dataset.node)||children.find(b=>b.dataset.node===view.current?.id);
  // Retain the history shortcuts when deleting the last visible stage.
  (target&&!target.disabled?target:root).focus({preventScroll:true});
 }
}
