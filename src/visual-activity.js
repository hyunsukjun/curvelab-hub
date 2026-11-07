// Hub display-only loops. Never gate engine clocks, worklet messages or Space tick().
const parked=new Map();
const visibilityProbes=new Set();
const visible=()=>!document.hidden&&!window.frameElement?.hidden;
function resumeDisplays(){
  // Geometry is cached on visibility/layout changes, never polled in the audio path.
  for(const probe of visibilityProbes)probe();
  if(!visible())return;
  for(const [callback,canDisplay] of parked){
    if(!canDisplay())continue;
    parked.delete(callback);
    requestAnimationFrame(callback);
  }
}
// A hidden iframe can still receive animation frames. Observe the Hub's actual selection.
if(window.frameElement){
  const observer=new MutationObserver(resumeDisplays);
  observer.observe(window.frameElement,{attributes:true,attributeFilter:['hidden']});
  window.addEventListener('pagehide',event=>{if(!event.persisted)observer.disconnect();});
}
document.addEventListener('visibilitychange',resumeDisplays);
window.addEventListener('pageshow',resumeDisplays);
window.addEventListener('resize',resumeDisplays);
window.addEventListener('pagehide',event=>{if(!event.persisted){parked.clear();visibilityProbes.clear();}});
const componentStates=new WeakMap();
function componentVisibility(element){
  if(!element)return visible;
  if(componentStates.has(element))return componentStates.get(element);
  let elementVisible=true;
  if(element){
    const probe=()=>{
      const rect=element.getBoundingClientRect();
      elementVisible=element.isConnected&&element.getClientRects().length>0&&rect.width>0&&rect.height>0;
      // Also cover visibility:hidden, which retains layout geometry.
      if(elementVisible)elementVisible=getComputedStyle(element).visibility==='visible';
    };
    visibilityProbes.add(probe);probe();
    const resize=new ResizeObserver(resumeDisplays);resize.observe(element);
    const observer=new MutationObserver(resumeDisplays);
    // Watch only this component's ancestors; meter-fill/style updates are not observed.
    for(let node=element;node;node=node.parentElement){
      observer.observe(node,{attributes:true,attributeFilter:['hidden','class','style']});
    }
    window.addEventListener('pagehide',event=>{
      if(!event.persisted){resize.disconnect();observer.disconnect();visibilityProbes.delete(probe);}
    });
  }
  const canDisplay=()=>visible()&&elementVisible;
  componentStates.set(element,canDisplay);
  return canDisplay;
}
export function gateSelfScheduledDisplay(refresh,element=null){
  const canDisplay=componentVisibility(element);
  // refresh schedules its next frame through its existing, now-wrapped binding.
  // Hidden components retain one refresh request. Showing them resumes one loop.
  function displayFrame(...args){
    if(!canDisplay()){parked.set(displayFrame,canDisplay);return;}
    parked.delete(displayFrame);
    return refresh.apply(this,args);
  }
  return displayFrame;
}

// Event-driven paint: coalesce hidden redraws, then paint CURRENT state once shown.
// Call only after required clock/viewport/state updates have already run.
const paints=new WeakMap();
export function shouldPaint(element,refresh){
  let state=paints.get(element);
  if(!state){
    state={canDisplay:componentVisibility(element),pending:null};
    state.flush=()=>{
      if(!state.pending)return; // A newer visible paint already consumed this request.
      if(!state.canDisplay()){parked.set(state.flush,state.canDisplay);return;}
      const current=state.pending;state.pending=null;current();
    };
    paints.set(element,state);
  }
  if(state.canDisplay()){state.pending=null;parked.delete(state.flush);return true;}
  state.pending=refresh;
  parked.set(state.flush,state.canDisplay);
  return false;
}
