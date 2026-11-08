// Show the current source's processing stages in the strip; keep sources restorable in the disclosure.
export function renderSavedHistory(root,view,{names,colors,disabled,select,remove,undoRemove,redoRemove}){
 root.onkeydown=event=>{
  if(!event.metaKey||event.ctrlKey||event.altKey||event.key.toLowerCase()!=='z')return;
  event.preventDefault();
  if(!event.repeat&&!disabled)(event.shiftKey?redoRemove:undoRemove)();
 };
 const byId=new Map(view.history.map(n=>[n.id,n]));
 function sourceId(n){while(n?.parentId&&byId.has(n.parentId))n=byId.get(n.parentId);return n?.id;}
 const selectedSource=sourceId(byId.get(view.current?.id));
 // Restoring an earlier stage changes selection, never hides later work on that source.
 const path=view.history.filter(n=>n.parentId&&sourceId(n)===selectedSource);
 const sources=view.history.filter(n=>!n.parentId||sourceId(n)!==selectedSource);
 const wasOpen=root.querySelector('details')?.open||false;
 const focused=root.contains(document.activeElement)?document.activeElement:null,focusedId=focused?.dataset.node,summaryFocused=focused?.tagName==='SUMMARY';
 function button(n){
  const b=document.createElement('button');const label=document.createElement('span');label.className='stage-label';label.textContent=n.label;b.append(label);b.dataset.node=n.id;b.dataset.lab=n.lab||'source';b.setAttribute('aria-label',n.label);b.title=n.parentId?'Saved stage: '+n.label+' · From '+(byId.get(n.parentId)?.label||'source'):'Source: '+n.label;
  if(n.lab&&names.includes(n.lab))b.style.setProperty('--stage-color',colors[names.indexOf(n.lab)]);
  if(!n.parentId)b.dataset.root='true';
  if(n.id===view.current?.id){b.setAttribute('aria-current','step');b.title='Selected saved stage: '+n.label;}
  if(n.parentId&&n.id===view.current?.id){
   b.title+=' · Delete removes this stage';
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
 const children=path.map(button);
 if(sources.length){
  const details=document.createElement('details');details.className='other-stages';details.open=wasOpen;
  const summary=document.createElement('summary');summary.textContent='Sources';
  const list=document.createElement('div');list.className='other-stage-list';list.setAttribute('aria-label','Sources and their saved stages');
  list.append(...sources.map(button));details.append(summary,list);children.push(details);
 }
 root.replaceChildren(...children);
 const summary=root.querySelector('summary');
 if(focusedId){
  const visibleButtons=[...root.querySelectorAll(':scope > button, details[open] button')];
  const target=visibleButtons.find(b=>b.dataset.node===focusedId)||visibleButtons.find(b=>b.getAttribute('aria-current')==='step');
  if(target&&!target.disabled)target.focus({preventScroll:true});
  else summary?.focus({preventScroll:true});
 }else if(summaryFocused)summary?.focus({preventScroll:true});
}
