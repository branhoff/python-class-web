import assert from 'node:assert/strict';
import { test } from 'node:test';
import { projectEventKind, projectHint } from '../src/client/project-done-logic.js';

test('ticking records a completion and unticking reopens the project', () => {
  assert.equal(projectEventKind(true), 'completed');
  assert.equal(projectEventKind(false), 'reopened');
});

test('each state has its own wording, and an error never reads as success', () => {
  const idle = projectHint('idle');
  const done = projectHint('done');
  const error = projectHint('error');
  assert.match(idle, /own computer/);
  assert.match(done, /marked as done/);
  assert.match(error, /Could not save/);
  assert.equal(new Set([idle, done, error]).size, 3);
});
