import type { Course } from './courses.ts';
import { buildNav } from './nav.ts';
import { escapeHtml } from './render.ts';
import type { Lesson } from './types.ts';

export interface CourseProgress {
  total: number;
  exerciseIds: string[];
}

export function courseProgressMeta(
  courseLessons: Map<string, Lesson[]>,
): Record<string, CourseProgress> {
  const meta: Record<string, CourseProgress> = {};
  for (const [courseId, lessons] of courseLessons) {
    const exerciseIds = lessons.flatMap((lesson) =>
      lesson.blocks
        .filter((block) => block.type === 'cell' && block.kind === 'exercise')
        .map((block) => (block as { id: string }).id),
    );
    meta[courseId] = { total: exerciseIds.length, exerciseIds };
  }
  return meta;
}

const STYLE = `
body { font-family: system-ui, sans-serif; max-width: 64rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a2e; background: #f0f0f4; }
h1, h2 { font-family: 'Press Start 2P', system-ui, sans-serif; color: #1d2b53; line-height: 1.7; }
h1 { font-size: 1.15rem; letter-spacing: 1px; }
h2 { font-size: .8rem; margin-top: 2rem; }
a { color: #1d2b53; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: 1.25rem; margin-top: 1.5rem; }
.course { aspect-ratio: 1 / 1; border: 3px solid #000; box-shadow: 5px 5px 0 #000; padding: 1rem; display: flex; flex-direction: column; text-decoration: none; background: #fff1e8; color: #1a1a2e; }
.course .title { font-family: 'Press Start 2P', system-ui, sans-serif; font-size: .75rem; color: #1d2b53; line-height: 1.6; }
.course .desc { font-size: .95rem; margin-top: .5rem; flex: 1 1 auto; }
.course.available:active { box-shadow: 2px 2px 0 #000; transform: translate(3px, 3px); }
.course.soon { background: #c2c3c7; color: #5f574f; box-shadow: 5px 5px 0 #5f574f; cursor: default; }
.course.soon .title { color: #5f574f; }
.tag { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .8rem; text-transform: uppercase; letter-spacing: 1px; }
.bar { height: .9rem; border: 2px solid #000; background: #fff; margin-top: .5rem; }
.bar > span { display: block; height: 100%; width: 0; background: #00e436; }
.count { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .85rem; margin-top: .35rem; }
#auth { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .9em; margin-bottom: 1rem; }
#auth .err { color: #ff004d; margin-left: .5rem; }
.lessons { list-style: none; padding-left: 0; }
.lessons li { margin: .4rem 0; }
.lessons a { font-family: 'Departure Mono', ui-monospace, monospace; font-size: 1rem; }
.back { font-family: 'Departure Mono', ui-monospace, monospace; }
`;

function head(title: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
@font-face { font-family: 'Press Start 2P'; src: url('/static/fonts/press-start-2p.woff2') format('woff2'); font-display: swap; }
@font-face { font-family: 'Departure Mono'; src: url('/static/fonts/departure-mono.woff2') format('woff2'); font-display: swap; }
${STYLE}</style>
</head>`;
}

function courseCard(course: Course): string {
  const title = escapeHtml(course.title);
  const desc = escapeHtml(course.description);
  if (course.status !== 'available') {
    return `<div class="course soon">
<span class="title">${title}</span>
<span class="desc">${desc}</span>
<span class="tag">Coming soon</span>
</div>`;
  }
  return `<a class="course available" href="/courses/${encodeURIComponent(course.id)}" data-course="${escapeHtml(course.id)}">
<span class="title">${title}</span>
<span class="desc">${desc}</span>
<div class="bar"><span></span></div>
<span class="count">Loading progress…</span>
</a>`;
}

export function renderHome(
  courses: readonly Course[],
  meta: Record<string, CourseProgress>,
): string {
  const cards = courses.map(courseCard).join('\n');
  return `${head('Courses')}
<body>
<header id="auth"></header>
<h1>Choose a course</h1>
<div class="grid">
${cards}
</div>
<script type="application/json" id="progress-meta">${JSON.stringify(meta)}</script>
<script type="module" src="/static/app-shell.js"></script>
<script type="module" src="/static/home.js"></script>
</body>
</html>
`;
}

export function renderCourse(course: Course, lessons: Lesson[]): string {
  const { sections } = buildNav(lessons, lessons[0]?.id ?? '');
  const body = sections
    .map((section) => {
      const items = section.lessons
        .map(
          (lesson) =>
            `<li><a href="/lessons/${encodeURIComponent(lesson.id)}">${escapeHtml(lesson.title)}</a></li>`,
        )
        .join('\n');
      return `<h2>Section ${section.section}</h2>\n<ul class="lessons">\n${items}\n</ul>`;
    })
    .join('\n');
  return `${head(course.title)}
<body>
<header id="auth"></header>
<p class="back"><a href="/">← All courses</a></p>
<h1>${escapeHtml(course.title)}</h1>
<p>${escapeHtml(course.description)}</p>
${body}
<script type="module" src="/static/app-shell.js"></script>
</body>
</html>
`;
}
