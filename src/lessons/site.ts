import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { loadLessons } from './load.ts';
import { escapeHtml, renderLesson } from './render.ts';
import type { Lesson } from './types.ts';

export interface AuthConfig {
  apiKey: string;
  projectId: string;
}

function asset(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');
}

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
<header id="auth"></header>
<h1>Lessons</h1>
<ul>
${items}
</ul>
<script type="module" src="/static/app-shell.js"></script>
</body>
</html>
`;
}

export function createLessonSite(
  contentDir = 'content',
  authConfig: AuthConfig | null = null,
): Hono {
  const lessons = loadLessons(contentDir).map((loaded) => loaded.lesson);
  const pages = new Map(lessons.map((lesson) => [lesson.id, renderLesson(lesson)]));
  const app = new Hono();

  app.get('/', (c) => c.html(indexPage(lessons)));
  app.get('/lessons/:id', (c) => {
    const page = pages.get(c.req.param('id'));
    return page ? c.html(page) : c.notFound();
  });
  app.get('/auth/config', (c) => c.json(authConfig ?? {}));
  app.get('/static/harness.py', (c) =>
    c.body(HARNESS, 200, { 'content-type': 'text/x-python; charset=utf-8' }),
  );
  app.use(
    '/static/*',
    serveStatic({
      root: './src/client',
      rewriteRequestPath: (path) => path.replace(/^\/static/, ''),
    }),
  );

  return app;
}
