import {tooltipLanguage} from './tooltip-language.js?v=hub-chain-branch1';

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

// Follow each saved stage back to the source it was derived from.
export function renderSavedHistory(root,view,{names,colors,disabled,select,remove,undoRemove,redoRemove}){
 root.tabIndex=-1;
 root.onkeydown=event=>{
  if(!event.metaKey||event.ctrlKey||event.altKey||event.key.toLowerCase()!=='z')return;
  event.preventDefault();
  if(!event.repeat&&!disabled)(event.shiftKey?redoRemove:undoRemove)();
 };
 const focused=root.contains(document.activeElement)?document.activeElement:null;
 const byParent=new Map();
 for(const stage of view.history){
  const siblings=byParent.get(stage.parentId)||[];
  siblings.push(stage);
  byParent.set(stage.parentId,siblings);
 }
 const buttons=[];
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
  buttons.push(b);
  return b;
 }
 function branch(stages,originals=false){
  const list=document.createElement('ul');
  list.className=originals?'history-trees':'history-branches';
  for(const stage of stages){
   const item=document.createElement('li');
   item.className='history-node';
   if(originals){
    const label=document.createElement('span');
    label.className='history-origin';
    label.textContent=label.title=stage.label;
    item.append(label);
   }else item.append(button(stage));
   const children=byParent.get(stage.id);
   if(children) item.append(branch(children));
   list.append(item);
  }
  return list;
 }
 const originals=(byParent.get(null)||[]).filter(stage=>byParent.has(stage.id));
 root.replaceChildren(...(originals.length?[branch(originals,true)]:[]));
 refreshSavedHistoryTitles(root,view);
 if(focused){
  const target=buttons.find(b=>b.dataset.node===focused.dataset.node)||buttons.find(b=>b.dataset.node===view.current?.id);
  // Retain the history shortcuts when deleting the last visible stage.
  (target&&!target.disabled?target:root).focus({preventScroll:true});
 }
}
