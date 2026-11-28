export const MAX_VOICES = 128;

export function partialLimit(value) {
  const count = Number(value);
  return [16, 32, 64, MAX_VOICES].includes(count) ? count : 32;
}
