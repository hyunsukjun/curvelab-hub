// Show saved processing stages in chronological order across sources.
export function renderSavedHistory(root,view,{names,colors,disabled,select,remove,undoRemove,redoRemove}){
 root.tabIndex=-1;
 root.onkeydown=event=>{
  if(!event.metaKey||event.ctrlKey||event.altKey||event.key.toLowerCase()!=='z')return;
  event.preventDefault();
  if(!event.repeat&&!disabled)(event.shiftKey?redoRemove:undoRemove)();
 };
 const byId=new Map(view.history.map(n=>[n.id,n]));
 const stages=view.history.filter(n=>n.parentId);
 const focused=root.contains(document.activeElement)?document.activeElement:null;
 function button(n){
  const b=document.createElement('button');const label=document.createElement('span');label.className='stage-label';label.textContent=n.label;b.append(label);b.dataset.node=n.id;b.dataset.lab=n.lab||'source';b.setAttribute('aria-label',n.label);b.title='Saved stage: '+n.label+' · From '+(byId.get(n.parentId)?.label||'source');
  if(n.lab&&names.includes(n.lab))b.style.setProperty('--stage-color',colors[names.indexOf(n.lab)]);
  if(n.id===view.current?.id){
   b.setAttribute('aria-current','step');
   b.title='Selected saved stage: '+n.label+' · Delete removes this stage';
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
 if(focused&&focused!==root){
  const target=children.find(b=>b.dataset.node===focused.dataset.node)||children.find(b=>b.dataset.node===view.current?.id);
  // Retain the history shortcuts when deleting the last visible stage.
  (target&&!target.disabled?target:root).focus({preventScroll:true});
 }
}
