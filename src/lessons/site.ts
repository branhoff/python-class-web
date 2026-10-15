import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { accountCourses, renderAccount } from './account.ts';
import { COURSES, type Course } from './courses.ts';
import { courseProgressMeta, renderCourse, renderHome } from './home.ts';
import { loadLessons } from './load.ts';
import { buildNav } from './nav.ts';
import { renderLesson } from './render.ts';
import type { Lesson } from './types.ts';

export type AuthConfig =
  | { apiKey: string; projectId: string; identityUrl?: string; tokenUrl?: string }
  | { devUser: string };

function asset(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');
}

const HARNESS = asset('./harness.py');

function loadCourses(contentDir: string): Map<string, Lesson[]> {
  const byCourse = new Map<string, Lesson[]>();
  for (const course of COURSES) {
    if (course.status !== 'available') continue;
    byCourse.set(
      course.id,
      loadLessons(join(contentDir, course.id)).map((loaded) => loaded.lesson),
    );
  }
  return byCourse;
}

export function createLessonSite(
  contentDir = 'content',
  authConfig: AuthConfig | null = null,
): Hono {
  const courseLessons = loadCourses(contentDir);
  const courseById = new Map<string, Course>(COURSES.map((course) => [course.id, course]));
  const pages = new Map<string, string>();
  for (const lessons of courseLessons.values()) {
    for (const lesson of lessons) {
      pages.set(lesson.id, renderLesson(lesson, buildNav(lessons, lesson.id)));
    }
  }
  const progressMeta = courseProgressMeta(courseLessons);
  const home = renderHome(COURSES, progressMeta);
  const account = renderAccount(accountCourses(COURSES, progressMeta));
  const app = new Hono();

  app.get('/', (c) => c.html(home));
  app.get('/account', (c) => c.html(account));
  app.get('/courses/:courseId', (c) => {
    const courseId = c.req.param('courseId');
    const course = courseById.get(courseId);
    const lessons = courseLessons.get(courseId);
    return course && lessons ? c.html(renderCourse(course, lessons)) : c.notFound();
  });
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
