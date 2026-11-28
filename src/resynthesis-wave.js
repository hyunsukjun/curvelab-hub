// Apply the same smooth ceiling to tracked source components, transposed voices,
// and the harmonics and sidebands added during synthesis. All frequencies are in Hz.
export const TOP_HZ = 15000;
const TAPER = 750;
export function topGain(hz) {
  if (hz <= TOP_HZ - TAPER) return 1;
  if (hz >= TOP_HZ) return 0;
  const x = (TOP_HZ - hz) / TAPER;
  return x * x * (3 - 2 * x);
}

const TAU = Math.PI * 2;
const TABLE_SIZE = 4096;
const tables = new Map();

function harmonicWeight(waveform, order) {
  if (waveform === 'sine') return 1;
  if (waveform === 'saw') return -2 / (Math.PI * order);
  if (waveform === 'square') return 4 / (Math.PI * order);
  return 8 / (Math.PI ** 2) * (order % 4 === 1 ? 1 : -1) / (order * order);
}

function makeTables(waveform) {
  const sums = [new Float64Array(TABLE_SIZE + 1)];
  const saw = waveform === 'saw';
  const terms = saw ? 63 : 32;
  for (let term = 0; term < terms; term++) {
    const order = saw ? term + 1 : 2 * term + 1;
    const weight = harmonicWeight(waveform, order);
    const table = sums[term].slice();
    for (let i = 0; i < TABLE_SIZE; i++) table[i] += weight * Math.sin(TAU * order * i / TABLE_SIZE);
    table[TABLE_SIZE] = table[0];
    sums.push(table);
  }
  return sums;
}

// hz and guard describe the highest frequency occupied by each term.
function bandWave(waveform, phase, hz, guard = 0) {
  if (hz <= 0 || hz + guard >= TOP_HZ) return 0;
  if (waveform === 'sine') return Math.sin(phase) * topGain(hz + guard);
  if (!tables.has(waveform)) tables.set(waveform, makeTables(waveform));
  const bank = tables.get(waveform), terms = bank.length - 1;
  const step = waveform === 'saw' ? 1 : 2;
  const available = TOP_HZ - guard;
  const full = Math.max(0, Math.min(terms, Math.floor(((available - TAPER) / hz + step - 1) / step)));
  const last = Math.min(terms, Math.floor((available / hz + step - 1) / step));
  const cycles = phase / TAU;
  const pos = (cycles - Math.floor(cycles)) * TABLE_SIZE;
  const i = Math.floor(pos), fraction = pos - i;
  let a = bank[full][i], b = bank[full][i + 1];
  for (let n = full; n < last; n++) {
    const gain = topGain((step*n + 1) * hz + guard);
    a += gain * (bank[n+1][i] - bank[n][i]);
    b += gain * (bank[n+1][i+1] - bank[n][i+1]);
  }
  return a + fraction * (b - a);
}

// For carriers near the ceiling, explicitly retain the audible FM sidebands.
// The existing FM Strength curve spans 0–4 radians. At that maximum the
// omitted orders above 15 have amplitudes below 1e-8.
const FM_ORDERS = 15, FM_STEPS = 256;
let fmTable;
function makeFmTable() {
  const table = new Float64Array((FM_STEPS + 1) * (FM_ORDERS + 1));
  for (let row = 0; row <= FM_STEPS; row++) {
    const halfIndex = row * 2 / FM_STEPS;
    let first = 1;
    for (let order = 0; order <= FM_ORDERS; order++) {
      if (order) first *= halfIndex / order;
      let term = first, sum = first;
      for (let k = 1; k <= 20; k++) {
        term *= -halfIndex * halfIndex / (k * (k + order));
        sum += term;
        if (Math.abs(term) < 1e-15) break;
      }
      table[row * (FM_ORDERS+1) + order] = sum;
    }
  }
  return table;
}

function fmFundamental(phase, hz, modPhase, modHz, index) {
  fmTable ??= makeFmTable();
  const pos = index * FM_STEPS / 4;
  const row = Math.min(FM_STEPS-1, Math.floor(pos)), offset = row * (FM_ORDERS+1);
  const fraction = pos - row;
  const carrier = Math.sin(phase), quadrature = Math.cos(phase);
  const sinM = Math.sin(modPhase), cosM = Math.cos(modPhase);
  let result = 0, sinN = 0, cosN = 1;
  for (let n = 0; n <= FM_ORDERS; n++) {
    if (n * modHz - hz >= TOP_HZ) break;
    const j0 = fmTable[offset+n], j1 = fmTable[offset+FM_ORDERS+1+n];
    const j = j0 + (j1-j0) * fraction;
    const a = carrier*cosN, b = quadrature*sinN;
    result += j * (a+b) * topGain(hz + n*modHz);
    if (n) result += (n%2 ? -j : j) * (a-b) * topGain(Math.abs(hz - n*modHz));
    const nextSin = sinN*cosM + cosN*sinM;
    cosN = cosN*cosM - sinN*sinM;
    sinN = nextSin;
  }
  return result;
}

// A sine modulator produces a sum and a difference for each carrier harmonic.
// Near the ceiling the difference can remain audible even if the sum is removed.
function amplitudeSidebands(waveform, phase, hz, modPhase, modHz) {
  let value = bandWave(waveform, phase, hz, modHz) * Math.sin(modPhase);
  const step = waveform === 'saw' ? 1 : 2;
  let first = Math.max(1, Math.ceil((TOP_HZ - TAPER - modHz) / hz));
  if (step === 2 && first % 2 === 0) first++;
  const last = Math.min(waveform === 'sine' ? 1 : 63, Math.floor(TOP_HZ / hz));
  for (let h = first; h <= last; h += step) {
    const frequency = h * hz;
    const extra = topGain(frequency) * topGain(Math.abs(frequency-modHz)) - topGain(frequency+modHz);
    value += .5 * harmonicWeight(waveform,h) * extra * Math.cos(h*phase-modPhase);
  }
  return value;
}

export function sourceWave(waveform, phase, hz, mode, amount, modPhase, modHz) {
  const dry = bandWave(waveform, phase, hz);
  if (mode === 'off' || amount <= 0 || hz >= TOP_HZ) return dry;
  if (mode === 'fm') {
    const mod = Math.sin(modPhase);
    // Only phase-modulate carrier harmonics with headroom for their sidebands.
    // The rest of the waveform continues at its original pitch and amplitude.
    const spread = hz + 2 * amount * modHz, guard = 8 * modHz;
    let result = dry + (bandWave(waveform, phase + amount * mod, spread, guard)
      - bandWave(waveform, phase, spread, guard));
    const guarded = topGain(spread + guard);
    if (guarded < 1) {
      const original = Math.sin(phase);
      const contribution = guarded * (Math.sin(phase + amount*mod) - original);
      result += harmonicWeight(waveform,1) * (topGain(hz) * fmFundamental(phase,hz,modPhase,modHz,amount)
        - topGain(hz)*original - contribution);
    }
    return result;
  }
  const sidebands = amplitudeSidebands(waveform, phase, hz, modPhase, modHz);
  if (mode === 'am') return (dry + amount * sidebands) / (1 + amount);
  return dry * (1 - amount) + amount * sidebands;
}
