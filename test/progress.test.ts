import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deriveProgress } from '../src/progress.ts';

test('completed cells are unique and sorted; attempts do not count', () => {
  const progress = deriveProgress([
    { cellId: 'b', kind: 'completed', at: 1 },
    { cellId: 'a', kind: 'completed', at: 2 },
    { cellId: 'b', kind: 'completed', at: 3 },
    { cellId: 'c', kind: 'attempt', at: 4 },
  ]);
  assert.deepEqual(progress.completedCells, ['a', 'b']);
});

test('no events means no progress and nothing completed last', () => {
  assert.deepEqual(deriveProgress([]), { completedCells: [], lastCompletedCell: null });
});

test('reopening a cell takes it out of the completed list', () => {
  const progress = deriveProgress([
    { cellId: 'project:avg', kind: 'completed', at: 1 },
    { cellId: 'a', kind: 'completed', at: 2 },
    { cellId: 'project:avg', kind: 'reopened', at: 3 },
  ]);
  assert.deepEqual(progress.completedCells, ['a']);
});

test('completing a cell again after reopening it brings it back', () => {
  const progress = deriveProgress([
    { cellId: 'p', kind: 'completed', at: 1 },
    { cellId: 'p', kind: 'reopened', at: 2 },
    { cellId: 'p', kind: 'completed', at: 3 },
  ]);
  assert.deepEqual(progress.completedCells, ['p']);
});

test('reopening something that was never completed changes nothing', () => {
  assert.deepEqual(deriveProgress([{ cellId: 'p', kind: 'reopened', at: 1 }]).completedCells, []);
});

test('the last completed cell is the most recent completion, even if it was reopened later', () => {
  const progress = deriveProgress([
    { cellId: 'a', kind: 'completed', at: 1 },
    { cellId: 'b', kind: 'completed', at: 2 },
    { cellId: 'b', kind: 'reopened', at: 3 },
    { cellId: 'c', kind: 'attempt', at: 4 },
  ]);
  assert.equal(progress.lastCompletedCell, 'b');
});

test('the order of events decides, not their ids', () => {
  const progress = deriveProgress([
    { cellId: 'z', kind: 'completed', at: 1 },
    { cellId: 'a', kind: 'completed', at: 2 },
  ]);
  assert.equal(progress.lastCompletedCell, 'a');
});
