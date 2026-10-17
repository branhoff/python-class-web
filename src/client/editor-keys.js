/* What the keys do inside a code cell, free of the DOM so it is unit-tested in
   Node. Each function takes the text and the selection (start, end) and returns
   the new text and selection. editorKey decides which one a key press runs.
   After Escape the next Tab is left alone so a keyboard user can leave the box. */

const INDENT = '    ';
const MODIFIER_KEYS = ['Shift', 'Control', 'Alt', 'Meta'];

function lineStart(value, index) {
  return index === 0 ? 0 : value.lastIndexOf('\n', index - 1) + 1;
}

function lineEnd(value, index) {
  const end = value.indexOf('\n', index);
  return end === -1 ? value.length : end;
}

function touchedLines(value, start, end) {
  const lastIndex = end > start && value[end - 1] === '\n' ? end - 1 : end;
  const from = lineStart(value, start);
  const to = lineEnd(value, lastIndex);
  return { from, to, lines: value.slice(from, to).split('\n') };
}

function isOneLine(value, start, end) {
  return !value.slice(start, end).includes('\n');
}

export function indent({ value, start, end }) {
  if (isOneLine(value, start, end)) {
    const caret = start + INDENT.length;
    return { value: value.slice(0, start) + INDENT + value.slice(end), start: caret, end: caret };
  }
  const { from, to, lines } = touchedLines(value, start, end);
  const block = lines.map((line) => INDENT + line).join('\n');
  return {
    value: value.slice(0, from) + block + value.slice(to),
    start: start + INDENT.length,
    end: end + INDENT.length * lines.length,
  };
}

export function outdent({ value, start, end }) {
  const { from, to, lines } = touchedLines(value, start, end);
  const removed = lines.map((line) => /^(\t| {1,4})/.exec(line)?.[0].length ?? 0);
  const block = lines.map((line, i) => line.slice(removed[i])).join('\n');
  const newStart = Math.max(from, start - removed[0]);
  const total = removed.reduce((sum, count) => sum + count, 0);
  return {
    value: value.slice(0, from) + block + value.slice(to),
    start: newStart,
    end: Math.max(newStart, end - total),
  };
}

export function newline({ value, start, end }) {
  const before = value.slice(0, start);
  const line = before.slice(lineStart(before, start));
  const keep = /^[ \t]*/.exec(line)[0];
  const deeper = line.trimEnd().endsWith(':') ? INDENT : '';
  const inserted = `\n${keep}${deeper}`;
  const caret = start + inserted.length;
  return { value: before + inserted + value.slice(end), start: caret, end: caret };
}

function plainTab(event) {
  return event.key === 'Tab' && !event.ctrlKey && !event.altKey && !event.metaKey;
}

export function editorKey(event, text, escaped) {
  if (event.isComposing) return { action: 'pass', escaped };
  if (MODIFIER_KEYS.includes(event.key)) return { action: 'pass', escaped };
  if (event.key === 'Escape') return { action: 'pass', escaped: true };
  if (event.key === 'Enter' && (event.shiftKey || event.ctrlKey || event.metaKey)) {
    return { action: 'run', escaped: false };
  }
  if (event.key === 'Enter' && !event.altKey) {
    return { action: 'edit', edit: newline(text), escaped: false };
  }
  if (plainTab(event) && !escaped) {
    return { action: 'edit', edit: event.shiftKey ? outdent(text) : indent(text), escaped: false };
  }
  return { action: 'pass', escaped: false };
}
