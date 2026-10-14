import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildNav } from '../src/lessons/nav.ts';
import type { Lesson } from '../src/lessons/types.ts';

function lesson(id: string, section: number): Lesson {
  return { id, title: id.toUpperCase(), section, blocks: [] };
}

const lessons = [lesson('a', 1), lesson('b', 1), lesson('c', 2), lesson('d', 3)];

test('groups lessons by section in ascending order, keeping course order within', () => {
  const nav = buildNav(lessons, 'a');
  assert.deepEqual(
    nav.sections.map((s) => [s.section, s.lessons.map((l) => l.id)]),
    [
      [1, ['a', 'b']],
      [2, ['c']],
      [3, ['d']],
    ],
  );
});

test('prev and next follow course order across sections', () => {
  assert.deepEqual(buildNav(lessons, 'b').prev, { id: 'a', title: 'A' });
  assert.deepEqual(buildNav(lessons, 'b').next, { id: 'c', title: 'C' });
});

test('the first lesson has no prev and the last no next', () => {
  assert.equal(buildNav(lessons, 'a').prev, null);
  assert.equal(buildNav(lessons, 'd').next, null);
});

test('an unknown current id yields no prev or next', () => {
  const nav = buildNav(lessons, 'missing');
  assert.equal(nav.prev, null);
  assert.equal(nav.next, null);
});
