import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Hono } from 'hono';
import { loadLessons } from './load.ts';
import { escapeHtml, renderLesson } from './render.ts';
import type { Lesson } from './types.ts';

function asset(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');
}

const RUNNER = asset('../client/lesson-runner.js');
const HARNESS = asset('./harness.py');

function indexPage(lessons: Lesson[]): string {
  const items = lessons
    .map(
      (lesson) =>
        `<li><a href="/lessons/${encodeURIComponent(lesson.id)}">${escapeHtml(lesson.title)}</a></li>`,
    )
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Python lessons</title></head>
<body>
<h1>Lessons</h1>
<ul>
${items}
</ul>
</body>
</html>
`;
}

export function createLessonSite(contentDir = 'content'): Hono {
  const lessons = loadLessons(contentDir).map((loaded) => loaded.lesson);
  const pages = new Map(lessons.map((lesson) => [lesson.id, renderLesson(lesson)]));
  const app = new Hono();

  app.get('/', (c) => c.html(indexPage(lessons)));
  app.get('/lessons/:id', (c) => {
    const page = pages.get(c.req.param('id'));
    return page ? c.html(page) : c.notFound();
  });
  app.get('/static/lesson-runner.js', (c) =>
    c.body(RUNNER, 200, { 'content-type': 'text/javascript; charset=utf-8' }),
  );
  app.get('/static/harness.py', (c) =>
    c.body(HARNESS, 200, { 'content-type': 'text/x-python; charset=utf-8' }),
  );

  return app;
}
