// Reverse the current edited PCM without changing channel order or sample values.
export async function reverseSource(source, output, signal) {
 const frames=source?.[0]?.length;
 if(source?.length!==2||output?.length!==2||!Number.isInteger(frames)||frames<2
  ||[...source,...output].some(channel=>!(channel instanceof Float32Array)||channel.length!==frames)
  ||output.some(channel=>source.some(input=>input.buffer===channel.buffer)))throw new Error('Invalid Reverse audio');
 for(let start=0;start<frames;start+=32768){
  signal?.throwIfAborted();
  const end=Math.min(frames,start+32768);
  for(let channel=0;channel<2;channel++){
   for(let frame=start;frame<end;frame++)output[channel][frame]=source[channel][frames-1-frame];
  }
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 signal?.throwIfAborted();
}
