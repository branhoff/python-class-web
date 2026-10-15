import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildNav } from '../src/lessons/nav.ts';
import type { Lesson } from '../src/lessons/types.ts';

function lesson(id: string, section: number): Lesson {
  return { id, title: id.toUpperCase(), section, blocks: [] };
}

const lessons = [lesson('a', 1), lesson('b', 1), lesson('c', 2), lesson('d', 3)];

test('sections come back ascending even when lessons arrive out of section order', () => {
  const shuffled = [
    lesson('d', 3),
    lesson('b1', 2),
    lesson('a', 1),
    lesson('b2', 2),
    lesson('c', 1),
  ];
  const nav = buildNav(shuffled, 'a');
  assert.deepEqual(
    nav.sections.map((s) => [s.section, s.lessons.map((l) => l.id)]),
    [
      [1, ['a', 'c']],
      [2, ['b1', 'b2']],
      [3, ['d']],
    ],
  );
});

test('prev and next follow the order lessons are given, not the section order', () => {
  const shuffled = [lesson('d', 3), lesson('b1', 2), lesson('a', 1), lesson('b2', 2)];
  const nav = buildNav(shuffled, 'a');
  assert.deepEqual(nav.prev, { id: 'b1', title: 'B1' });
  assert.deepEqual(nav.next, { id: 'b2', title: 'B2' });
});

test('the first lesson still has a next lesson', () => {
  assert.deepEqual(buildNav(lessons, 'a').next, { id: 'b', title: 'B' });
});
