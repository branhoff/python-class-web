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
  assert.deepEqual(progress, { completedCells: ['a', 'b'] });
});

test('no events means no progress', () => {
  assert.deepEqual(deriveProgress([]), { completedCells: [] });
});
