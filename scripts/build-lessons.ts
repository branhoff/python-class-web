import { mkdirSync, writeFileSync } from 'node:fs';
import { loadLessons } from '../src/lessons/load.ts';
import { buildNav } from '../src/lessons/nav.ts';
import { renderLesson } from '../src/lessons/render.ts';

const output = 'build/lessons';
mkdirSync(output, { recursive: true });
const lessons = loadLessons('content').map((entry) => entry.lesson);
for (const lesson of lessons) {
  writeFileSync(`${output}/${lesson.id}.html`, renderLesson(lesson, buildNav(lessons, lesson.id)));
  console.log(`${output}/${lesson.id}.html`);
}
