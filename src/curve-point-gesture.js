// Shared by the embedded curve editors. PC Ctrl deletes interior points but
// edits the protected first point vertically; Shift always selects the suffix.
const appleKeyboard = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgentData?.platform || "");

export const eraseModifier = appleKeyboard ? "altKey" : "ctrlKey";
export const firstPointModifier = appleKeyboard ? "metaKey" : "ctrlKey";

export function eraseAtPoint(tool, eraseHeld, index) {
  return tool === "eraser" || (eraseHeld && (appleKeyboard || index !== 0));
}

export function verticalTargets(curve, index, firstOnly) {
  return index === 0 && firstOnly ? curve.slice(0, 1) : curve.slice(index);
}
