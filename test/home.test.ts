import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COURSES } from '../src/lessons/courses.ts';
import { courseProgressMeta, renderCourse, renderHome } from '../src/lessons/home.ts';
import type { Cell, Lesson } from '../src/lessons/types.ts';

test('the home page has a title and lists every course card on its own line', () => {
  const html = renderHome(COURSES, {});
  assert.match(html, /<title>Courses<\/title>/);
  assert.equal(html.match(/<a class="course available"/g)?.length, 1);
  assert.equal(html.match(/<div class="course soon">/g)?.length, 3);
});

test('a course page with no lessons still renders, with a title and a way back', () => {
  const python = COURSES[0]!;
  const html = renderCourse(python, []);
  assert.match(html, /<title>Python<\/title>/);
  assert.match(html, /<a href="\/">← All courses<\/a>/);
  assert.doesNotMatch(html, /<h2>Section/);
});

function cell(id: string, kind: Cell['kind']): Cell {
  return { type: 'cell', id, kind, prompt: '', starter: '', hints: [] };
}

test('course progress counts only exercise cells, not markdown or sandbox cells', () => {
  const lessons: Lesson[] = [
    {
      id: 'one',
      title: 'One',
      section: 1,
      blocks: [
        { type: 'markdown', text: 'intro' },
        cell('try-it', 'sandbox'),
        cell('drill-a', 'exercise'),
      ],
    },
    {
      id: 'two',
      title: 'Two',
      section: 1,
      blocks: [cell('drill-b', 'exercise'), { type: 'markdown', text: 'outro' }],
    },
  ];
  assert.deepEqual(courseProgressMeta(new Map([['python', lessons]])), {
    python: { total: 2, exerciseIds: ['drill-a', 'drill-b'] },
  });
});

test('a course with no exercises has a total of zero', () => {
  const lessons: Lesson[] = [
    { id: 'one', title: 'One', section: 1, blocks: [cell('try-it', 'sandbox')] },
  ];
  assert.deepEqual(courseProgressMeta(new Map([['python', lessons]])), {
    python: { total: 0, exerciseIds: [] },
  });
});
