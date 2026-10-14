import { marked } from 'marked';
import type { Cell, Lesson } from './types.ts';

export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderCell(cell: Cell): string {
  const prompt = cell.prompt ? `<div class="prompt">${marked.parse(cell.prompt)}</div>` : '';
  const hints = cell.hints
    .map((hint, i) => `<details><summary>Hint ${i + 1}</summary>${marked.parse(hint)}</details>`)
    .join('\n');
  const tests = cell.tests ? ` data-tests="${escapeHtml(cell.tests)}"` : '';
  return `<section class="cell ${cell.kind}" data-cell-id="${escapeHtml(cell.id)}"${tests}>
${prompt}
<textarea spellcheck="false" rows="${cell.starter.split('\n').length + 1}">${escapeHtml(cell.starter)}</textarea>
<button type="button" class="run" disabled>Loading Python…</button>
<pre class="output" aria-live="polite" hidden></pre>
${hints}
</section>`;
}

export function renderLesson(lesson: Lesson): string {
  const body = lesson.blocks
    .map((block) =>
      block.type === 'cell' ? renderCell(block) : (marked.parse(block.text) as string),
    )
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(lesson.title)}</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 48rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
pre, textarea { font-family: ui-monospace, monospace; background: #f5f5f5; padding: .75rem; border-radius: 6px; }
textarea { width: 100%; box-sizing: border-box; }
.cell { border-left: 4px solid #4b8bbe; padding-left: 1rem; margin: 1.5rem 0; }
.cell.exercise { border-left-color: #e0a800; }
.output { white-space: pre-wrap; }
.output.pass { border-left: 4px solid #2e7d32; }
.output.fail { border-left: 4px solid #c62828; }
button.run { cursor: pointer; }
button.run:disabled { cursor: default; }
.badge { color: #2e7d32; margin-left: .5rem; font-size: .9em; }
.cell.completed { border-left-color: #2e7d32; }
#auth { font-size: .9em; margin-bottom: 1rem; }
#auth .err { color: #c62828; margin-left: .5rem; }
</style>
</head>
<body>
<header id="auth"></header>
<h1>${escapeHtml(lesson.title)}</h1>
${body}
<script src="/pyodide/pyodide.js"></script>
<script type="module" src="/static/lesson-runner.js"></script>
</body>
</html>
`;
}
