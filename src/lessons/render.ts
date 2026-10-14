import { marked } from 'marked';
import type { Cell, Lesson } from './types.ts';

function escapeHtml(text: string): string {
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
  return `<section class="cell ${cell.kind}" data-cell-id="${escapeHtml(cell.id)}">
${prompt}
<textarea spellcheck="false" rows="${cell.starter.split('\n').length + 1}">${escapeHtml(cell.starter)}</textarea>
<button type="button" disabled>Run (coming soon)</button>
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
</style>
</head>
<body>
<h1>${escapeHtml(lesson.title)}</h1>
${body}
</body>
</html>
`;
}
