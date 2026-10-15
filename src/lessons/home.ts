import type { Course } from './courses.ts';
import { buildNav, exerciseCellIds } from './nav.ts';
import { escapeHtml } from './render.ts';
import { HOME_STYLE } from './styles.ts';
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
    const exerciseIds = lessons.flatMap(exerciseCellIds);
    meta[courseId] = { total: exerciseIds.length, exerciseIds };
  }
  return meta;
}

function head(title: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>${HOME_STYLE}</style>
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
            `<li${lesson.project ? ' class="project"' : ''}><a href="/lessons/${encodeURIComponent(lesson.id)}">${escapeHtml(lesson.title)}</a></li>`,
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
