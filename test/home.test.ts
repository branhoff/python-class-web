import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COURSES } from '../src/lessons/courses.ts';
import { renderCourse, renderHome } from '../src/lessons/home.ts';

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
