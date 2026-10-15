import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COURSES } from '../src/lessons/courses.ts';

test('the catalog lists Programming 101 as available, 102 as planned and the rest as coming soon', () => {
  assert.deepEqual(
    COURSES.map((course) => [course.id, course.title, course.status]),
    [
      ['python', 'Programming 101 with Python', 'available'],
      ['python-102', 'Programming 102 with Python', 'planned'],
      ['c-cpp', 'C and C++', 'coming-soon'],
      ['pico-8', 'Game Dev with PICO-8', 'coming-soon'],
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
