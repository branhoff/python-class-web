import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkLesson } from '../src/lessons/check.ts';
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

const exercise: Partial<Cell> = {
  id: 'ex',
  kind: 'exercise',
  tests: 'TESTS',
  solution: 'SOLUTION',
};

test('a healthy lesson has no problems', () => {
  const { python, calls } = runner({});
  assert.deepEqual(checkLesson(lessonWith({}, exercise), python), []);
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
  assert.deepEqual(checkLesson(lessonWith(exercise), python), [
    'demo/ex: the solution fails its own tests: boom',
  ]);
});

test('reports a starter that already passes', () => {
  const { python } = runner({ starter: pass });
  assert.deepEqual(checkLesson(lessonWith(exercise), python), [
    'demo/ex: the starter already passes the tests, so the exercise is trivial',
  ]);
});
