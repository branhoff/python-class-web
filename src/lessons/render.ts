import { marked } from 'marked';
import type { LessonNav, NavLesson, NavSection } from './nav.ts';
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

function renderSection(section: NavSection, current: string): string {
  const items = section.lessons
    .map((lesson) => {
      const marker = lesson.id === current ? ' aria-current="page"' : '';
      return `<li><a href="/lessons/${encodeURIComponent(lesson.id)}"${marker}>${escapeHtml(lesson.title)}</a></li>`;
    })
    .join('\n');
  const open = section.lessons.some((lesson) => lesson.id === current) ? ' open' : '';
  return `<details${open}><summary>Section ${section.section}</summary>\n<ul>\n${items}\n</ul>\n</details>`;
}

function renderSidebar(nav: LessonNav): string {
  const sections = nav.sections.map((section) => renderSection(section, nav.current)).join('\n');
  return `<nav class="sidebar" aria-label="Lessons">\n${sections}\n</nav>`;
}

function pagerLink(lesson: NavLesson | null, label: string, cssClass: string): string {
  if (!lesson) return '<span></span>';
  return `<a class="${cssClass}" href="/lessons/${encodeURIComponent(lesson.id)}">${label}: ${escapeHtml(lesson.title)}</a>`;
}

function renderPager(nav: LessonNav): string {
  return `<nav class="pager" aria-label="Lesson navigation">
${pagerLink(nav.prev, 'Previous', 'prev')}
${pagerLink(nav.next, 'Next', 'next')}
</nav>`;
}

export function renderLesson(lesson: Lesson, nav?: LessonNav): string {
  const body = lesson.blocks
    .map((block) =>
      block.type === 'cell' ? renderCell(block) : (marked.parse(block.text) as string),
    )
    .join('\n');
  const heading = `<h1>${escapeHtml(lesson.title)}</h1>`;
  const content = nav
    ? `<div class="layout">
${renderSidebar(nav)}
<main>
${heading}
${body}
${renderPager(nav)}
</main>
</div>`
    : `${heading}
${body}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(lesson.title)}</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 64rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
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
.layout { display: flex; gap: 2rem; align-items: flex-start; }
.sidebar { flex: 0 0 13rem; position: sticky; top: 1rem; font-size: .9em; }
.sidebar ul { list-style: none; padding-left: .75rem; margin: .25rem 0; }
.sidebar a[aria-current="page"] { font-weight: 600; }
main { flex: 1 1 auto; min-width: 0; }
.pager { display: flex; justify-content: space-between; gap: 1rem; margin-top: 3rem; }
</style>
</head>
<body>
<header id="auth"></header>
${content}
<script src="/pyodide/pyodide.js"></script>
<script type="module" src="/static/lesson-runner.js"></script>
</body>
</html>
`;
}
