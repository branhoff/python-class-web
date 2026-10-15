import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLessonSite } from '../src/lessons/site.ts';

const site = createLessonSite();

test('the harness is served as Python source text', async () => {
  const harness = await site.request('/static/harness.py');
  assert.equal(harness.headers.get('content-type'), 'text/x-python; charset=utf-8');
});
