import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderLesson } from '../src/lessons/render.ts';
import type { Lesson } from '../src/lessons/types.ts';

const lesson: Lesson = {
  id: 'demo',
  title: 'Demo',
  section: 1,
  blocks: [{ type: 'cell', id: 'play', kind: 'sandbox', prompt: '', starter: 'x = 1', hints: [] }],
};

test('a lesson with a check cell shows a legend and marks the cell as a check', () => {
  const withCheck: Lesson = {
    ...lesson,
    blocks: [
      ...lesson.blocks,
      {
        type: 'cell',
        id: 'quick',
        kind: 'check',
        prompt: '',
        starter: 'x = None',
        tests: 't',
        solution: 's',
        hints: [],
      },
    ],
  };
  const html = renderLesson(withCheck);
  assert.match(html, /class="cell check" data-cell-id="quick"/);
  assert.match(html, /<p class="legend">.*counts toward finishing the lesson.*just for practice/);
});

test('a lesson without checks has no legend', () => {
  assert.doesNotMatch(renderLesson(lesson), /class="legend"/);
});
