import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COURSES } from '../src/lessons/courses.ts';

test('the catalog lists Python as available and the other courses as coming soon', () => {
  assert.deepEqual(
    COURSES.map((course) => [course.id, course.title, course.status]),
    [
      ['python', 'Python', 'available'],
      ['web-basics', 'Web Basics', 'coming-soon'],
      ['javascript', 'JavaScript', 'coming-soon'],
      ['command-line', 'Command Line & Git', 'coming-soon'],
    ],
  );
});

test('every course has a description to show on its card', () => {
  for (const course of COURSES) {
    assert.ok(course.description.length > 10, `${course.id} needs a description`);
  }
});
