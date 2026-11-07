// Explain existing analysis outcomes; never change signal thresholds or audio.
export function inputAnalysisError(detail='') {
  const reason=String(detail).replace(/^Analysis failed:\s*/, '').trim();
  if(reason==='Audio contains no analyzable signal') {
    return new Error('Input is silent or too quiet to analyze. Current input retained. Choose another source region or file.');
  }
  if(reason==='No significant spectral peaks found') {
    return new Error('No clear spectral peaks found. Current input retained. Try another source region or file.');
  }
  if(reason==='Analysis timeout') {
    return new Error('Analysis took too long and was stopped. Current input retained. Retry or choose another file.');
  }
  return new Error('Input analysis failed. Current input retained.'+(reason?' '+reason:''));
}
