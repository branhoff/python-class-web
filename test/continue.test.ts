import assert from 'node:assert/strict';
import { test } from 'node:test';
import { continueLabel, continueTarget, storageKey } from '../src/client/continue.js';
import type { ContinuePage } from '../src/client/continue.js';

const pages: ContinuePage[] = [
  { id: 'intro', title: 'Intro', project: false, itemIds: [] },
  { id: 'loops', title: 'Loops', project: false, itemIds: ['l1', 'l2'] },
  { id: 'funcs', title: 'Functions', project: false, itemIds: ['f1'] },
  { id: 'guess', title: 'Guessing', project: true, itemIds: ['project:guess'] },
  { id: 'recur', title: 'Recursion', project: false, itemIds: ['r1'] },
];

function target(
  lastId: string | null,
  done: string[] = [],
  lastCompletedCell: string | null = null,
) {
  return continueTarget({ pages, lastId, completed: new Set(done), lastCompletedCell });
}

test('a brand new learner has nothing to continue', () => {
  assert.equal(target(null), null);
});

test('a lesson you left unfinished is where you resume', () => {
  assert.deepEqual(target('loops', ['l1']), { page: pages[1], reason: 'resume' });
});

test('a lesson you opened but did nothing in is also where you resume', () => {
  assert.deepEqual(target('loops'), { page: pages[1], reason: 'resume' });
});

test('once a lesson is finished, the next page is offered', () => {
  assert.deepEqual(target('loops', ['l1', 'l2']), { page: pages[2], reason: 'next' });
});

test('a lesson with nothing to complete moves you on to the next page', () => {
  assert.deepEqual(target('intro'), { page: pages[1], reason: 'next' });
});

test('pages you already finished are skipped when moving on', () => {
  const next = target('loops', ['l1', 'l2', 'f1']);
  assert.deepEqual(next, { page: pages[3], reason: 'next' });
});

test('an unticked project is offered, and a ticked one is skipped', () => {
  assert.equal(target('funcs', ['l1', 'l2', 'f1'])?.page.id, 'guess');
  assert.equal(target('funcs', ['l1', 'l2', 'f1', 'project:guess'])?.page.id, 'recur');
});

test('reviewing an old lesson sends you to the next thing you have not done, not back to the start', () => {
  const next = target('intro', ['l1', 'l2', 'f1', 'project:guess']);
  assert.equal(next?.page.id, 'recur');
});

test('when everything after the last page is done there is nothing to continue', () => {
  assert.equal(target('recur', ['l1', 'l2', 'f1', 'project:guess', 'r1']), null);
});

test('with no remembered page, the last completed item on the server says where you were', () => {
  assert.deepEqual(target(null, ['l1'], 'l1'), { page: pages[1], reason: 'resume' });
  assert.deepEqual(target(null, ['l1', 'l2'], 'l2'), { page: pages[2], reason: 'next' });
});

test('a remembered page wins over the server hint', () => {
  assert.equal(target('funcs', ['l1'], 'l1')?.page.id, 'funcs');
});

test('a remembered page that is not in this course is ignored', () => {
  assert.equal(target('elsewhere', ['l1'], 'l1')?.page.id, 'loops');
});

test('with history but nothing to anchor on, it offers the first unfinished page', () => {
  assert.equal(target(null, ['l1'])?.page.id, 'loops');
  assert.equal(target(null, ['l1', 'l2'])?.page.id, 'funcs');
});

test('with history but everything done and nothing to anchor on, there is nothing to continue', () => {
  const all = ['l1', 'l2', 'f1', 'project:guess', 'r1'];
  assert.equal(target(null, all), null);
});

test('completed items from another course do not count as history here', () => {
  assert.equal(target(null, ['x-from-another-course']), null);
});

test('the label is just the page title, whether resuming or moving on', () => {
  assert.equal(continueLabel({ page: pages[1]!, reason: 'resume' }), 'Loops');
  assert.equal(continueLabel({ page: pages[2]!, reason: 'next' }), 'Functions');
});

test('a project is labelled as one', () => {
  assert.equal(continueLabel({ page: pages[3]!, reason: 'next' }), 'Guessing (project)');
});

test('each account has its own remembered page, and signed out has one too', () => {
  assert.equal(storageKey('ada@example.com'), 'pcw.last:ada@example.com');
  assert.equal(storageKey(null), 'pcw.last:anonymous');
  assert.equal(storageKey(undefined), 'pcw.last:anonymous');
  assert.notEqual(storageKey('a@b.co'), storageKey('c@d.co'));
});
