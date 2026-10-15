import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lessonDone, parseExercises, sectionCount } from '../src/client/sidebar-progress.js';

test('a lesson is done when it has exercises and all of them are completed', () => {
  assert.equal(lessonDone(['a', 'b'], new Set(['a', 'b', 'z'])), true);
});

test('a lesson with an exercise still to do is not done', () => {
  assert.equal(lessonDone(['a', 'b'], new Set(['a'])), false);
  assert.equal(lessonDone(['a'], new Set()), false);
});

test('a lesson with no exercises is never marked done', () => {
  assert.equal(lessonDone([], new Set(['a'])), false);
  assert.equal(lessonDone([], new Set()), false);
});

test('a section counts done lessons out of the lessons that have exercises', () => {
  const lessons = [['a'], ['b', 'c'], [], ['d']];
  const completed = new Set(['a', 'b', 'c']);
  assert.deepEqual(sectionCount(lessons, completed), { done: 2, total: 3 });
});

test('a section with no exercises has nothing to count', () => {
  assert.deepEqual(sectionCount([[], []], new Set(['a'])), { done: 0, total: 0 });
  assert.deepEqual(sectionCount([], new Set()), { done: 0, total: 0 });
});

test('a partly done lesson does not count toward its section', () => {
  assert.deepEqual(sectionCount([['a', 'b']], new Set(['a'])), { done: 0, total: 1 });
});

test('exercise ids are read from the comma separated attribute', () => {
  assert.deepEqual(parseExercises('a,b'), ['a', 'b']);
  assert.deepEqual(parseExercises('only'), ['only']);
});

test('a missing or empty attribute means no exercises', () => {
  assert.deepEqual(parseExercises(''), []);
  assert.deepEqual(parseExercises(undefined), []);
});
