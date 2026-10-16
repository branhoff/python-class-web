import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkLesson, checkProjects } from '../src/lessons/check.ts';
import type { PythonRunner } from '../src/lessons/run-python.ts';
import type { Cell, Lesson } from '../src/lessons/types.ts';

type RunResult = ReturnType<PythonRunner['syntax']>;

const fail: RunResult = { ok: false, message: 'boom' };
const pass: RunResult = { ok: true };

function lessonWith(...cells: Partial<Cell>[]): Lesson {
  return {
    id: 'demo',
    title: 'Demo',
    section: 1,
    blocks: [
      { type: 'markdown', text: 'intro' },
      ...cells.map((cell): Cell => ({
        type: 'cell',
        id: 'c',
        kind: 'sandbox',
        prompt: '',
        starter: 'START',
        hints: [],
        ...cell,
      })),
    ],
  };
}

function runner(options: { syntax?: RunResult; solved?: RunResult; starter?: RunResult }) {
  const calls: string[] = [];
  const python: PythonRunner = {
    syntax: (code) => {
      calls.push(`syntax:${code}`);
      return options.syntax ?? pass;
    },
    exercise: (code, tests) => {
      calls.push(`exercise:${code}:${tests}`);
      return code === 'SOLUTION' ? (options.solved ?? pass) : (options.starter ?? fail);
    },
  };
  return { python, calls };
}

const quizCell: Partial<Cell> = {
  id: 'ex',
  kind: 'quiz',
  tests: 'TESTS',
  solution: 'SOLUTION',
};

test('a healthy lesson has no problems', () => {
  const { python, calls } = runner({});
  assert.deepEqual(checkLesson(lessonWith({}, quizCell), python), []);
  assert.deepEqual(calls, [
    'syntax:START',
    'syntax:START',
    'exercise:SOLUTION:TESTS',
    'exercise:START:TESTS',
  ]);
});

test('sandbox cells are only syntax-checked', () => {
  const { python, calls } = runner({});
  checkLesson(lessonWith({}), python);
  assert.deepEqual(calls, ['syntax:START']);
});

test('reports a starter syntax error', () => {
  const { python } = runner({ syntax: { ok: false, message: 'bad' } });
  assert.deepEqual(checkLesson(lessonWith({ id: 's' }), python), [
    'demo/s: starter has a syntax error: bad',
  ]);
});

test('reports a solution that fails its own tests', () => {
  const { python } = runner({ solved: fail });
  assert.deepEqual(checkLesson(lessonWith(quizCell), python), [
    'demo/ex: the solution fails its own tests: boom',
  ]);
});

test('a solution that errors before its tests is labeled an error, not a test failure', () => {
  const { python } = runner({
    solved: { ok: false, stage: 'code', message: 'SyntaxError: bad (line 1)' },
  });
  assert.deepEqual(checkLesson(lessonWith(quizCell), python), [
    'demo/ex: the solution has an error: SyntaxError: bad (line 1)',
  ]);
});

test('reports a starter that already passes', () => {
  const { python } = runner({ starter: pass });
  assert.deepEqual(checkLesson(lessonWith(quizCell), python), [
    'demo/ex: the starter already passes the tests, so it is trivial',
  ]);
});

function page(id: string, section: number, after?: string): Lesson {
  const base: Lesson = { id, title: id, section, blocks: [] };
  return after === undefined ? base : { ...base, after };
}

test('projects that follow a real lesson in the same section are fine', () => {
  assert.deepEqual(checkProjects([page('a', 1), page('p', 1, 'a')]), []);
});

test('a project that follows a lesson that does not exist is reported', () => {
  assert.deepEqual(checkProjects([page('a', 1), page('p', 1, 'missing')]), [
    'p: "after: missing" is not a lesson in this course',
  ]);
});

test('a project cannot follow another project', () => {
  assert.deepEqual(checkProjects([page('a', 1), page('p', 1, 'a'), page('q', 1, 'p')]), [
    'q: "after: p" is itself a project',
  ]);
});

test('a project must sit in the same section as its lesson', () => {
  assert.deepEqual(checkProjects([page('a', 1), page('p', 2, 'a')]), [
    "p: section 2 differs from its lesson's section 1",
  ]);
});
