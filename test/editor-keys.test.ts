import assert from 'node:assert/strict';
import { test } from 'node:test';
import { editorKey, indent, newline, outdent } from '../src/client/editor-keys.js';

function at(value: string, start: number, end = start) {
  return { value, start, end };
}

test('Tab with nothing selected inserts four spaces at the caret and moves past them', () => {
  assert.deepEqual(indent(at('ab', 1)), at('a    b', 5));
  assert.deepEqual(indent(at('', 0)), at('    ', 4));
});

test('Tab replaces a selection inside one line with four spaces', () => {
  assert.deepEqual(indent(at('a123b', 1, 4)), at('a    b', 5));
});

test('Tab on a selection spanning lines indents every touched line and keeps the selection', () => {
  const result = indent(at('a\nb\nc', 0, 3));
  assert.deepEqual(result, at('    a\n    b\nc', 4, 11));
  assert.equal(result.value.slice(result.start, result.end), 'a\n    b');
});

test('Tab on a multi-line selection that starts mid-line still indents that whole line', () => {
  assert.deepEqual(indent(at('abc\ndef', 2, 5)), at('    abc\n    def', 6, 13));
});

test('a selection ending at the start of a line leaves that last line alone', () => {
  assert.deepEqual(indent(at('a\nb\nc', 0, 4)), at('    a\n    b\nc', 4, 12));
});

test('a selection that starts at the very top of the text indents the first line', () => {
  assert.deepEqual(indent(at('a\n\nb', 0, 4)), at('    a\n    \n    b', 4, 16));
});

test('Shift+Tab removes up to four spaces from the current line', () => {
  assert.deepEqual(outdent(at('        x', 9)), at('    x', 5));
  assert.deepEqual(outdent(at('  x', 3)), at('x', 1));
});

test('Shift+Tab removes a leading tab character', () => {
  assert.deepEqual(outdent(at('\tx', 2)), at('x', 1));
});

test('Shift+Tab leaves a line with no indentation alone', () => {
  assert.deepEqual(outdent(at('x', 1)), at('x', 1));
});

test('Shift+Tab with the caret inside the indentation removes the whole step and keeps the caret in place', () => {
  assert.deepEqual(outdent(at('        x', 2)), at('    x', 0));
});

test('Shift+Tab outdents each selected line and shifts the selection by what was removed', () => {
  const result = outdent(at('    a\n  b\nc', 4, 11));
  assert.equal(result.value, 'a\nb\nc');
  assert.deepEqual([result.start, result.end], [0, 5]);
});

test('Shift+Tab only touches the lines in the selection', () => {
  assert.equal(outdent(at('    a\n    b\n    c', 10, 11)).value, '    a\nb\n    c');
});

test('Shift+Tab never moves the selection start above the first line', () => {
  const result = outdent(at('x\n    y', 0, 7));
  assert.deepEqual(result, at('x\ny', 0, 3));
});

test('Enter keeps the indentation of the current line', () => {
  assert.deepEqual(newline(at('    x = 1', 9)), at('    x = 1\n    ', 14));
});

test('Enter after a line ending in a colon adds one more level', () => {
  assert.deepEqual(newline(at('if x:', 5)), at('if x:\n    ', 10));
  assert.deepEqual(newline(at('    for i in r:', 15)), at('    for i in r:\n        ', 24));
});

test('Enter ignores trailing spaces when looking for the colon', () => {
  assert.equal(newline(at('if x:  ', 7)).value, 'if x:  \n    ');
});

test('Enter on a line that merely contains a colon does not add a level', () => {
  assert.equal(newline(at('d = {1: 2}', 10)).value, 'd = {1: 2}\n');
  assert.equal(newline(at('print(":") ', 11)).value, 'print(":") \n');
});

test('Enter splits a line at the caret and carries the rest down at the same indentation', () => {
  assert.deepEqual(newline(at('  ab', 3)), at('  a\n  b', 6));
});

test('Enter with the caret inside the indentation only carries the indentation before the caret', () => {
  assert.deepEqual(newline(at('    x', 2)), at('  \n    x', 5));
});

test('Enter on the second line uses that line, not the first', () => {
  assert.equal(newline(at('    a\nb', 7)).value, '    a\nb\n');
});

test('Enter replaces a selection', () => {
  assert.deepEqual(newline(at('ab12cd', 2, 4)), at('ab\ncd', 3));
});

test('Enter at the very start of the text adds a blank line', () => {
  assert.deepEqual(newline(at('x', 0)), at('\nx', 1));
});

const plain = at('x', 1);

test('Shift+Enter, Ctrl+Enter and Cmd+Enter run the cell', () => {
  for (const mods of [{ shiftKey: true }, { ctrlKey: true }, { metaKey: true }]) {
    assert.deepEqual(editorKey({ key: 'Enter', ...mods }, plain, false), {
      action: 'run',
      escaped: false,
    });
  }
});

test('plain Enter edits, but Alt+Enter is left to the browser', () => {
  assert.equal(editorKey({ key: 'Enter' }, plain, false).action, 'edit');
  assert.equal(editorKey({ key: 'Enter', altKey: true }, plain, false).action, 'pass');
});

test('Tab indents and Shift+Tab outdents', () => {
  const tab = editorKey({ key: 'Tab' }, at('x', 1), false);
  assert.deepEqual(tab, { action: 'edit', edit: at('x    ', 5), escaped: false });
  const back = editorKey({ key: 'Tab', shiftKey: true }, at('    x', 5), false);
  assert.deepEqual(back, { action: 'edit', edit: at('x', 1), escaped: false });
});

test('Tab with Ctrl, Alt or Cmd is left alone so browser shortcuts still work', () => {
  for (const mods of [{ ctrlKey: true }, { altKey: true }, { metaKey: true }]) {
    assert.equal(editorKey({ key: 'Tab', ...mods }, plain, false).action, 'pass');
  }
});

test('Escape lets the next Tab, forward or back, move focus out of the box', () => {
  assert.deepEqual(editorKey({ key: 'Escape' }, plain, false), { action: 'pass', escaped: true });
  assert.equal(editorKey({ key: 'Tab' }, plain, true).action, 'pass');
  assert.equal(editorKey({ key: 'Tab', shiftKey: true }, plain, true).action, 'pass');
});

test('holding Shift or another modifier after Escape does not cancel the escape', () => {
  for (const key of ['Shift', 'Control', 'Alt', 'Meta']) {
    assert.deepEqual(editorKey({ key }, plain, true), { action: 'pass', escaped: true });
  }
});

test('any other key after Escape cancels it, so Tab indents again', () => {
  assert.deepEqual(editorKey({ key: 'a' }, plain, true), { action: 'pass', escaped: false });
  assert.equal(editorKey({ key: 'Enter' }, plain, true).action, 'edit');
  assert.equal(editorKey({ key: 'Tab' }, plain, false).action, 'edit');
});

test('keys typed while an input method is composing text are not touched', () => {
  assert.equal(editorKey({ key: 'Enter', isComposing: true }, plain, false).action, 'pass');
  assert.equal(editorKey({ key: 'Tab', isComposing: true }, plain, false).action, 'pass');
});

test('ordinary typing passes through', () => {
  assert.deepEqual(editorKey({ key: 'a' }, plain, false), { action: 'pass', escaped: false });
});
