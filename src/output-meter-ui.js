// Same -60..0 dB scale, smoothing and palette as the individual Lab meters.
export function connectOutputMeter(root,getBridge){
 const rows=[...root.querySelectorAll('.hub-meter-row')],clip=root.querySelector('button');
 let owner=null,last=performance.now(),states=[];
 const reset=()=>{states=rows.map(()=>({peak:0,rms:0,hold:0,until:0}));};reset();
 const position=v=>v>1e-6?Math.max(0,Math.min(1,(20*Math.log10(v)+60)/60)):0;
 const smooth=(a,b,dt,attack,release)=>a+(b-a)*(1-Math.exp(-dt/(b>a?attack:release)));
 clip.onclick=()=>getBridge()?.meter?.reset();
 function paint(now){
  const bridge=getBridge();if(bridge!==owner){owner=bridge;reset();}
  const dt=Math.min(100,Math.max(0,now-last));last=now;
  const reading=bridge?.meter?.read()||{channels:[],clipped:false,live:false};
  rows.forEach((row,i)=>{
   const m=reading.channels[i]||{peak:0,rms:0},s=states[i];
   if(!reading.live){s.peak=s.rms=s.hold=0;s.until=0;}
   else{
    s.peak=smooth(s.peak,m.peak,dt,18,320);s.rms=smooth(s.rms,m.rms,dt,45,420);
    if(m.peak>=s.hold){s.hold=m.peak;s.until=now+1000;}
    else if(now>s.until)s.hold=smooth(s.hold,m.peak,dt,1,700);
   }
   row.querySelector('.hub-meter-peak').style.clipPath=`inset(0 ${(1-position(s.peak))*100}% 0 0)`;
   row.querySelector('.hub-meter-rms').style.clipPath=`inset(0 ${(1-position(s.rms))*100}% 0 0)`;
   const hold=row.querySelector('.hub-meter-hold');hold.style.left=position(s.hold)*100+'%';hold.style.opacity=s.hold>.001?'1':'0';
   row.setAttribute('aria-label',`${i?'Right':'Left'} output: ${reading.live?(s.peak>1e-6?(20*Math.log10(s.peak)).toFixed(1)+' dBFS':'silent'):'no live reading'}`);
  });
  clip.classList.toggle('clipped',!!reading.clipped);clip.setAttribute('aria-pressed',String(!!reading.clipped));
 }
 let frame,previous=0;
 function tick(now){if(!document.hidden&&now-previous>=33){paint(now);previous=now;}frame=requestAnimationFrame(tick);}
 frame=requestAnimationFrame(tick);window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
 return {paint};
}
