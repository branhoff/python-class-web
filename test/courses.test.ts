import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COURSES } from '../src/lessons/courses.ts';

test('the catalog lists Python as available and the other courses as coming soon', () => {
  assert.deepEqual(
    COURSES.map((course) => [course.id, course.title, course.status]),
    [
      ['python', 'Python', 'available'],
      ['c-cpp', 'C and C++', 'coming-soon'],
      ['pico-8', 'Game Dev with PICO-8', 'coming-soon'],
      ['algorithms', 'Algorithms & Data Structures', 'coming-soon'],
    ],
  );
});

test('every course has a description to show on its card', () => {
  for (const course of COURSES) {
    assert.ok(course.description.length > 10, `${course.id} needs a description`);
  }
});

test('course ids are unique and safe to use in a URL', () => {
  const ids = COURSES.map((course) => course.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[a-z0-9][a-z0-9-]*$/);
});
