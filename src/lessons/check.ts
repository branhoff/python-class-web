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
    if (block.kind === 'sandbox') continue;

    const solved = python.exercise(block.solution!, block.tests!);
    if (!solved.ok) {
      const reason =
        solved.stage === 'code' ? 'the solution has an error' : 'the solution fails its own tests';
      problems.push(`${where}: ${reason}: ${solved.message}`);
    }
    if (python.exercise(block.starter, block.tests!).ok) {
      problems.push(`${where}: the starter already passes the tests, so it is trivial`);
    }
  }
  return problems;
}

export function checkProjects(lessons: Lesson[]): string[] {
  const problems: string[] = [];
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  for (const project of lessons) {
    if (project.after === undefined) continue;
    const parent = byId.get(project.after);
    if (!parent) {
      problems.push(`${project.id}: "after: ${project.after}" is not a lesson in this course`);
    } else if (parent.after !== undefined) {
      problems.push(`${project.id}: "after: ${project.after}" is itself a project`);
    } else if (parent.section !== project.section) {
      problems.push(
        `${project.id}: section ${project.section} differs from its lesson's section ${parent.section}`,
      );
    }
  }
  return problems;
}
