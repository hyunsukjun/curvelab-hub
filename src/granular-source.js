// Hub input adaptation only. The existing single-source Granular DSP is unchanged.
export function granularSourceMode(value){
 if(value==null||value==='')return 'mix';
 if(value==='mix'||value===0||value==='0'||value===1||value==='1')return String(value);
 throw new Error('Unknown grain source. Choose Mono mix, Left or Right.');
}
export function prepareGranularSource(packet,choice='mix'){
 const mode=granularSourceMode(choice),[left,right]=packet.channels;
 if(!left?.length||!right||left.length!==right.length)throw new Error('Grain source requires matching stereo channels.');
 // Keep legacy explicit Left/Right routing exactly as selected.
 if(mode!=='mix')return {samples:packet.channels[Number(mode)],mode,gain:1};
 const samples=new Float32Array(left.length);let peak=0;
 for(let i=0;i<samples.length;i++){
  if(!Number.isFinite(left[i])||!Number.isFinite(right[i]))throw new Error('Grain source contains invalid samples.');
  samples[i]=left[i]*.5+right[i]*.5;peak=Math.max(peak,Math.abs(samples[i]));
 }
 // Ordinary stereo averaging cannot exceed either channel's largest sample.
 // For already over-range floating-point input, use one constant reduction,
 // never clipping/limiting or boosting quiet material.
 const gain=peak>1?.999/peak:1;
 if(gain<1)for(let i=0;i<samples.length;i++)samples[i]*=gain;
 return {samples,mode,gain,peakBeforeReduction:peak};
}
