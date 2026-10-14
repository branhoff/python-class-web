import { mkdirSync, writeFileSync } from 'node:fs';
import { loadLessons } from '../src/lessons/load.ts';
import { renderLesson } from '../src/lessons/render.ts';

const output = 'build/lessons';
mkdirSync(output, { recursive: true });
for (const { lesson } of loadLessons('content')) {
  writeFileSync(`${output}/${lesson.id}.html`, renderLesson(lesson));
  console.log(`${output}/${lesson.id}.html`);
}
