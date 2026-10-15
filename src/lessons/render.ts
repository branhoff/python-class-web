import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { Marked, type Tokens } from 'marked';
import type { LessonNav, NavLesson, NavSection } from './nav.ts';
import { LESSON_STYLE } from './styles.ts';
import type { Cell, Lesson } from './types.ts';

hljs.registerLanguage('python', python);

export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function highlightCode({ text, lang }: Tokens.Code): string {
  const language = (lang ?? '').trim().split(/\s+/)[0];
  const body =
    language === 'python' || language === 'py'
      ? hljs.highlight(text, { language: 'python' }).value
      : escapeHtml(text);
  const classAttr = language ? ` class="language-${escapeHtml(language)}"` : '';
  return `<pre><code${classAttr}>${body}</code></pre>\n`;
}

const marked = new Marked({ renderer: { code: highlightCode } });

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
<style>${LESSON_STYLE}</style>
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
