import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Hono } from 'hono';
import { crossOriginIsolation } from '../src/isolation.ts';
import { createLessonSite } from '../src/lessons/site.ts';

const ISOLATED = {
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-embedder-policy': 'require-corp',
};

function headersOf(res: Response) {
  return {
    'cross-origin-opener-policy': res.headers.get('cross-origin-opener-policy'),
    'cross-origin-embedder-policy': res.headers.get('cross-origin-embedder-policy'),
  };
}

test('every response carries the headers that allow shared memory for the Python worker', async () => {
  const app = new Hono();
  app.use('*', crossOriginIsolation);
  app.get('/page', (c) => c.html('<p>hi</p>'));
  app.route('/', createLessonSite());
  for (const path of ['/page', '/', '/lessons/loops', '/static/py-worker.js', '/account']) {
    const res = await app.request(path);
    assert.equal(res.status, 200, path);
    assert.deepEqual(headersOf(res), ISOLATED, path);
  }
});

test('error and not-found responses are isolated too, so the page never half-loads', async () => {
  const app = new Hono();
  app.use('*', crossOriginIsolation);
  app.get('/boom', () => {
    throw new Error('boom');
  });
  const missing = await app.request('/nope');
  assert.equal(missing.status, 404);
  assert.deepEqual(headersOf(missing), ISOLATED);
  const broken = await app.request('/boom');
  assert.equal(broken.status, 500);
  assert.deepEqual(headersOf(broken), ISOLATED);
});

test('without the middleware the headers are absent, so the test above is meaningful', async () => {
  const res = await createLessonSite().request('/lessons/loops');
  assert.equal(res.headers.get('cross-origin-opener-policy'), null);
});
