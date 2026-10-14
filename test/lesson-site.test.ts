import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLessonSite } from '../src/lessons/site.ts';

const site = createLessonSite();

test('the index lists each lesson with a link', async () => {
  const res = await site.request('/');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') ?? '', /text\/html/);
  const html = await res.text();
  assert.match(html, /<a href="\/lessons\/functions">Functions<\/a>/);
});

test('a known lesson renders its runnable page', async () => {
  const res = await site.request('/lessons/functions');
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<button type="button" class="run"/);
  assert.match(html, /\/pyodide\/pyodide\.js/);
});

test('an unknown lesson is a 404', async () => {
  const res = await site.request('/lessons/nope');
  assert.equal(res.status, 404);
});

test('the harness and runner are served to the browser with usable content types', async () => {
  const runner = await site.request('/static/lesson-runner.js');
  assert.equal(runner.status, 200);
  assert.match(runner.headers.get('content-type') ?? '', /javascript/);
  assert.match(await runner.text(), /loadPyodide/);

  const harness = await site.request('/static/harness.py');
  assert.equal(harness.status, 200);
  assert.match(await harness.text(), /def run_exercise/);
});

test('auth config is served when provided and empty otherwise', async () => {
  const configured = createLessonSite('content', { apiKey: 'K', projectId: 'P' });
  assert.deepEqual(await (await configured.request('/auth/config')).json(), {
    apiKey: 'K',
    projectId: 'P',
  });
  assert.deepEqual(await (await site.request('/auth/config')).json(), {});
});
