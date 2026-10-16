import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { Marked, type Tokens } from 'marked';
import { renderTopbar } from './chrome.ts';
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
<button type="button" class="reset" disabled aria-label="Reset this cell to its original code">Reset</button>
<button type="button" class="stop" hidden>Stop</button>
<pre class="output" aria-live="polite" hidden></pre>
<form class="stdin" hidden><input name="line" type="text" autocomplete="off" spellcheck="false" aria-label="Type the program's input, then press Enter"><button type="submit" class="send">Enter</button></form>
${hints}
</section>`;
}

type SidebarLesson = NavSection['lessons'][number];

function renderSidebarItem(lesson: SidebarLesson, current: string): string {
  const marker = lesson.id === current ? ' aria-current="page"' : '';
  const exercises = escapeHtml(lesson.itemIds.join(','));
  const kind = lesson.project ? ' class="project"' : '';
  return `<li${kind} data-items="${exercises}"><a href="/lessons/${encodeURIComponent(lesson.id)}"${marker}>${escapeHtml(lesson.title)}</a></li>`;
}

function renderSection(section: NavSection, current: string): string {
  const items = (lessons: SidebarLesson[]) =>
    lessons.map((lesson) => renderSidebarItem(lesson, current)).join('\n');
  const projects = section.lessons.filter((lesson) => lesson.project);
  const projectGroup =
    projects.length === 0
      ? ''
      : `\n<p class="group-label" aria-hidden="true">Projects</p>\n<ul aria-label="Projects">\n${items(projects)}\n</ul>`;
  const open = section.lessons.some((lesson) => lesson.id === current) ? ' open' : '';
  return `<details${open}><summary>Section ${section.section}<span class="count"></span></summary>\n<ul>\n${items(section.lessons.filter((lesson) => !lesson.project))}\n</ul>${projectGroup}\n</details>`;
}

function renderSidebar(nav: LessonNav): string {
  const sections = nav.sections.map((section) => renderSection(section, nav.current)).join('\n');
  return `<nav class="sidebar" aria-label="Lessons">\n${sections}\n</nav>`;
}

function pagerLink(lesson: NavLesson | null, label: string, cssClass: string): string {
  if (!lesson) return '<span></span>';
  return `<a class="${cssClass}" href="/lessons/${encodeURIComponent(lesson.id)}">${label}: ${escapeHtml(lesson.title)}</a>`;
}

function renderProjects(nav: LessonNav): string {
  if (nav.projects.length === 0) return '';
  const items = nav.projects
    .map(
      (project) =>
        `<li><a href="/lessons/${encodeURIComponent(project.id)}">${escapeHtml(project.title)}</a></li>`,
    )
    .join('\n');
  return `<section class="projects">
<h2>Projects</h2>
<p>Practice what you learned in your own editor. Each project has its own page.</p>
<ul>
${items}
</ul>
</section>`;
}

function renderProjectDone(projectId: string): string {
  return `<section class="project-done">
<label class="check"><input type="checkbox" id="project-done" data-item="project:${escapeHtml(projectId)}" disabled> <span>I finished this project</span></label>
<p id="project-done-hint" class="hint">Projects run on your own computer, so you tell us when you are done.</p>
</section>`;
}

function renderPager(nav: LessonNav): string {
  return `<nav class="pager" aria-label="Lesson navigation">
${pagerLink(nav.prev, 'Previous', 'prev')}
${pagerLink(nav.next, 'Next', 'next')}
</nav>`;
}

const LEGEND = `<p class="legend"><span class="swatch exercise"></span> Exercise: counts toward finishing the lesson. <span class="swatch check"></span> Check: just for practice.</p>`;

function hasChecks(lesson: Lesson): boolean {
  return lesson.blocks.some((block) => block.type === 'cell' && block.kind === 'check');
}

export function renderLesson(lesson: Lesson, nav?: LessonNav): string {
  const body = lesson.blocks
    .map((block) =>
      block.type === 'cell' ? renderCell(block) : (marked.parse(block.text) as string),
    )
    .join('\n');
  const title = lesson.after === undefined ? lesson.title : `Project: ${lesson.title}`;
  const heading = `<h1>${escapeHtml(title)}</h1>${hasChecks(lesson) ? `\n${LEGEND}` : ''}`;
  const content = nav
    ? `${renderTopbar('<a class="home" href="/">Home</a>')}
<div class="layout">
${renderSidebar(nav)}
<main data-lesson-id="${escapeHtml(lesson.id)}">
${heading}
${body}
${lesson.after === undefined ? '' : renderProjectDone(lesson.id)}
${renderProjects(nav)}
${renderPager(nav)}
</main>
</div>`
    : `${heading}
${body}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>${LESSON_STYLE}</style>
</head>
<body>
${content}
<script src="/pyodide/pyodide.js"></script>
<script type="module" src="/static/lesson-runner.js"></script>
<script type="module" src="/static/sidebar-progress.js"></script>
<script type="module" src="/static/continue.js"></script>${nav && lesson.after !== undefined ? '\n<script type="module" src="/static/project-done.js"></script>' : ''}
</body>
</html>
`;
}
