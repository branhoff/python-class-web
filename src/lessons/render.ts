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
@font-face { font-family: 'Departure Mono'; src: url('/static/fonts/departure-mono.woff2') format('woff2'); font-display: swap; }
@font-face { font-family: 'Press Start 2P'; src: url('/static/fonts/press-start-2p.woff2') format('woff2'); font-display: swap; }
body { font-family: system-ui, sans-serif; max-width: 64rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a2e; background: #f0f0f4; }
h1, h2, h3 { font-family: 'Press Start 2P', system-ui, sans-serif; color: #1d2b53; line-height: 1.7; }
h1 { font-size: 1.15rem; letter-spacing: 1px; }
h2 { font-size: .85rem; margin-top: 2rem; }
h3 { font-size: .7rem; }
a { color: #1d2b53; }
a:visited { color: #7e2553; }
pre, textarea { font-family: 'Departure Mono', ui-monospace, monospace; background: #1d2b53; color: #fff1e8; padding: .75rem; border: 2px solid #000; border-radius: 0; font-size: 1rem; line-height: 1.4; }
textarea { width: 100%; box-sizing: border-box; }
.cell { border-left: 4px solid #29adff; padding-left: 1rem; margin: 1.5rem 0; }
.cell.exercise { border-left-color: #ffa300; }
.cell.completed { border-left-color: #00e436; }
.output { white-space: pre-wrap; }
.output.pass { border-color: #00e436; color: #00e436; }
.output.fail { border-color: #ff004d; color: #ff004d; }
button.run, .pager a { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .95rem; background: #1d2b53; color: #fff1e8; border: 2px solid #000; border-radius: 0; padding: .4rem .8rem; box-shadow: 3px 3px 0 #000; cursor: pointer; text-decoration: none; display: inline-block; }
button.run:active, .pager a:active { box-shadow: 1px 1px 0 #000; transform: translate(2px, 2px); }
button.run:disabled { background: #c2c3c7; color: #5f574f; box-shadow: 3px 3px 0 #5f574f; cursor: default; }
.badge { font-family: 'Departure Mono', ui-monospace, monospace; color: #008751; margin-left: .5rem; font-size: .9em; }
#auth { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .9em; margin-bottom: 1rem; }
#auth .err { color: #ff004d; margin-left: .5rem; }
.layout { display: flex; gap: 2rem; align-items: flex-start; }
.sidebar { flex: 0 0 14rem; position: sticky; top: 1rem; background: #fff; border: 2px solid #1d2b53; padding: .75rem; }
.sidebar summary { font-family: 'Press Start 2P', system-ui, sans-serif; font-size: .6rem; line-height: 1.6; cursor: pointer; margin: .4rem 0; }
.sidebar ul { list-style: none; padding-left: .75rem; margin: .25rem 0 .75rem; }
.sidebar li { margin: .3rem 0; }
.sidebar a { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .95rem; text-decoration: none; }
.sidebar a[aria-current="page"] { color: #7e2553; font-weight: 700; }
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
