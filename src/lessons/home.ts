import { renderReportFooter, renderTopbar } from './chrome.ts';
import type { Course } from './courses.ts';
import { buildSections, progressItemIds } from './nav.ts';
import { escapeHtml } from './render.ts';
import { HOME_STYLE } from './styles.ts';
import type { Lesson } from './types.ts';

interface CoursePage {
  id: string;
  title: string;
  project: boolean;
  itemIds: string[];
}

export interface CourseProgress {
  total: number;
  itemIds: string[];
  pages: CoursePage[];
}

export function courseProgressMeta(
  courseLessons: Map<string, Lesson[]>,
): Record<string, CourseProgress> {
  const meta: Record<string, CourseProgress> = {};
  for (const [courseId, lessons] of courseLessons) {
    const pages = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      project: lesson.after !== undefined,
      itemIds: progressItemIds(lesson),
    }));
    const itemIds = pages.flatMap((page) => page.itemIds);
    meta[courseId] = { total: itemIds.length, itemIds, pages };
  }
  return meta;
}

export function head(title: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>${HOME_STYLE}</style>
</head>`;
}

const UNAVAILABLE_TAG = { 'coming-soon': 'Coming soon', planned: 'In planning' } as const;

function courseCard(course: Course): string {
  const title = escapeHtml(course.title);
  const desc = escapeHtml(course.description);
  if (course.status !== 'available') {
    return `<div class="course soon">
<span class="title">${title}</span>
<span class="desc">${desc}</span>
<span class="tag">${UNAVAILABLE_TAG[course.status]}</span>
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
${renderTopbar()}
<h1>Choose a course</h1>
<section id="continue" class="continue" aria-label="Continue where you left off" hidden></section>
<div class="grid">
${cards}
</div>
${renderReportFooter({ title: 'Courses', path: '/' })}
<script type="application/json" id="progress-meta">${JSON.stringify(meta)}</script>
<script type="module" src="/static/app-shell.js"></script>
<script type="module" src="/static/home.js"></script>
<script type="module" src="/static/continue.js"></script>
</body>
</html>
`;
}

export function renderCourse(course: Course, lessons: Lesson[]): string {
  const body = buildSections(lessons)
    .map((section) => {
      const list = (project: boolean) => {
        const items = section.lessons
          .filter((lesson) => lesson.project === project)
          .map(
            (lesson) =>
              `<li><a href="/lessons/${encodeURIComponent(lesson.id)}">${escapeHtml(lesson.title)}</a></li>`,
          )
          .join('\n');
        return `<ul class="lessons">\n${items}\n</ul>`;
      };
      const projectGroup = section.lessons.some((lesson) => lesson.project)
        ? `\n<h3 class="group-label">Projects</h3>\n${list(true)}`
        : '';
      return `<h2>Section ${section.section}</h2>\n${list(false)}${projectGroup}`;
    })
    .join('\n');
  return `${head(course.title)}
<body>
${renderTopbar()}
<p class="back"><a href="/">← All courses</a></p>
<h1>${escapeHtml(course.title)}</h1>
<p>${escapeHtml(course.description)}</p>
<section id="continue" class="continue" aria-label="Continue where you left off" hidden></section>
${body}
${renderReportFooter({ title: course.title, path: `/courses/${course.id}` })}
<script type="application/json" id="progress-meta">${JSON.stringify(courseProgressMeta(new Map([[course.id, lessons]])))}</script>
<script type="module" src="/static/app-shell.js"></script>
<script type="module" src="/static/continue.js"></script>
</body>
</html>
`;
}
