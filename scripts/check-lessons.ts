import { checkLesson } from '../src/lessons/check.ts';
import { loadLessons } from '../src/lessons/load.ts';
import { pythonRunner } from '../src/lessons/run-python.ts';

const lessons = loadLessons('content');
const problems = lessons.flatMap(({ lesson }) => checkLesson(lesson, pythonRunner));

for (const problem of problems) {
  console.error(problem);
}
if (problems.length > 0) {
  process.exit(1);
}
console.log(`${lessons.length} lesson(s) checked: every solution passes and every starter fails.`);
