/* What the Reset button in a code cell says and does, free of the DOM so it is
   unit-tested in Node. "original" is the code the page shipped with. Resetting
   remembers the learner's own code so a mis-click can be undone; typing again
   clears that memory (the page passes undoValue: null). */

export function resetControl({ value, original, undoValue }) {
  if (undoValue !== null) return { label: 'Undo reset', disabled: false };
  return { label: 'Reset', disabled: value === original };
}

export function pressReset({ value, original, undoValue }) {
  if (undoValue !== null) return { value: undoValue, undoValue: null };
  return { value: original, undoValue: value };
}
