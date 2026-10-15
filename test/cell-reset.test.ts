import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pressReset, resetControl } from '../src/client/cell-reset.js';

const original = 'print("hi")\n';

test('code that matches the original has nothing to reset, so the button is off', () => {
  assert.deepEqual(resetControl({ value: original, original, undoValue: null }), {
    label: 'Reset',
    disabled: true,
  });
});

test('any change, even a single space, turns Reset on', () => {
  for (const value of ['print("bye")\n', original + ' ', '', '\n' + original]) {
    assert.deepEqual(resetControl({ value, original, undoValue: null }), {
      label: 'Reset',
      disabled: false,
    });
  }
});

test('pressing Reset restores the original and remembers what the learner had', () => {
  const edited = 'x = 1\nprint(x)\n';
  assert.deepEqual(pressReset({ value: edited, original, undoValue: null }), {
    value: original,
    undoValue: edited,
  });
});

test('right after a Reset the button offers Undo, even though the code equals the original', () => {
  assert.deepEqual(resetControl({ value: original, original, undoValue: 'x = 1\n' }), {
    label: 'Undo reset',
    disabled: false,
  });
});

test('pressing Undo brings back the learner code and forgets the undo', () => {
  assert.deepEqual(pressReset({ value: original, original, undoValue: 'x = 1\n' }), {
    value: 'x = 1\n',
    undoValue: null,
  });
});

test('reset then undo then reset gives the same result each time', () => {
  const edited = 'my own code';
  const reset = pressReset({ value: edited, original, undoValue: null });
  const undone = pressReset({ value: reset.value, original, undoValue: reset.undoValue });
  assert.equal(undone.value, edited);
  const again = pressReset({ value: undone.value, original, undoValue: undone.undoValue });
  assert.deepEqual(again, { value: original, undoValue: edited });
});

test('a cell that starts empty can still be reset after typing', () => {
  assert.equal(resetControl({ value: '', original: '', undoValue: null }).disabled, true);
  assert.deepEqual(pressReset({ value: 'abc', original: '', undoValue: null }), {
    value: '',
    undoValue: 'abc',
  });
});

test('undoing an edit that was empty brings back the empty code', () => {
  assert.deepEqual(pressReset({ value: original, original, undoValue: '' }), {
    value: '',
    undoValue: null,
  });
  assert.equal(resetControl({ value: original, original, undoValue: '' }).label, 'Undo reset');
});
