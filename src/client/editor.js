/* Browser-only: wires the keys in editor-keys.js to a code cell's textarea.
   Edits go through execCommand so the browser's own undo still works; the
   plain assignment is the fallback when a browser refuses it. */

import { editorKey } from './editor-keys.js';

function applyEdit(editor, { value, start, end }) {
  if (value !== editor.value) {
    editor.select();
    if (!document.execCommand('insertText', false, value)) {
      editor.value = value;
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  editor.setSelectionRange(start, end);
}

export function setupEditor(cell) {
  const editor = cell.querySelector('textarea');
  const runButton = cell.querySelector('button.run');
  let escaped = false;
  editor.addEventListener('blur', () => {
    escaped = false;
  });
  editor.addEventListener('keydown', (event) => {
    const text = { value: editor.value, start: editor.selectionStart, end: editor.selectionEnd };
    const result = editorKey(event, text, escaped);
    escaped = result.escaped;
    if (result.action === 'pass') return;
    event.preventDefault();
    if (result.action === 'run') runButton.click();
    else applyEdit(editor, result.edit);
  });
}
