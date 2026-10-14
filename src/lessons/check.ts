import type { PythonRunner } from './run-python.ts';
import type { Lesson } from './types.ts';

export function checkLesson(lesson: Lesson, python: PythonRunner): string[] {
  const problems: string[] = [];
  for (const block of lesson.blocks) {
    if (block.type !== 'cell') continue;
    const where = `${lesson.id}/${block.id}`;
    const syntax = python.syntax(block.starter);
    if (!syntax.ok) {
      problems.push(`${where}: starter has a syntax error: ${syntax.message}`);
    }
    if (block.kind !== 'exercise') continue;

    const solved = python.exercise(block.solution!, block.tests!);
    if (!solved.ok) {
      const reason =
        solved.stage === 'code' ? 'the solution has an error' : 'the solution fails its own tests';
      problems.push(`${where}: ${reason}: ${solved.message}`);
    }
    if (python.exercise(block.starter, block.tests!).ok) {
      problems.push(`${where}: the starter already passes the tests, so the exercise is trivial`);
    }
  }
  return problems;
}
