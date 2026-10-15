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

test('each sidebar lesson lists its exercise cell ids, not its sandbox cells', () => {
  const withCells: Lesson = {
    id: 'e',
    title: 'E',
    section: 1,
    blocks: [
      { type: 'markdown', text: 'intro' },
      { type: 'cell', id: 'try-it', kind: 'sandbox', prompt: '', starter: '', hints: [] },
      { type: 'cell', id: 'do-it', kind: 'exercise', prompt: '', starter: '', hints: [] },
      { type: 'cell', id: 'do-it-too', kind: 'exercise', prompt: '', starter: '', hints: [] },
    ],
  };
  const nav = buildNav([withCells, lesson('plain', 1)], 'e');
  assert.deepEqual(
    nav.sections[0]!.lessons.map((l) => l.itemIds),
    [['do-it', 'do-it-too'], []],
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

function project(id: string, section: number, after: string): Lesson {
  return { ...lesson(id, section), after };
}

test('a lesson lists the projects that follow it, in course order', () => {
  const course = [lesson('a', 1), lesson('b', 1), project('p1', 1, 'a'), project('p2', 1, 'a')];
  assert.deepEqual(
    buildNav(course, 'a').projects.map((p) => p.id),
    ['p1', 'p2'],
  );
  assert.deepEqual(buildNav(course, 'b').projects, []);
  assert.deepEqual(buildNav(course, 'p1').projects, []);
});

test('projects appear in their section after the lessons and are flagged as projects', () => {
  const course = [lesson('a', 1), lesson('b', 2), project('p', 1, 'a')];
  const nav = buildNav(course, 'a');
  assert.deepEqual(
    nav.sections[0]!.lessons.map((l) => [l.id, l.project]),
    [
      ['a', false],
      ['p', true],
    ],
  );
});

test('a project belongs to the pager like any page, and the project itself is its item', () => {
  const course = [lesson('a', 1), project('p', 1, 'a'), lesson('b', 2)];
  const nav = buildNav(course, 'p');
  assert.deepEqual(nav.prev, { id: 'a', title: 'A' });
  assert.deepEqual(nav.next, { id: 'b', title: 'B' });
  assert.deepEqual(nav.sections[0]!.lessons[1]!.itemIds, ['project:p']);
});
