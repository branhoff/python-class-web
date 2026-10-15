import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLessonSite } from '../src/lessons/site.ts';

const site = createLessonSite();

test('the home page shows a square for each course, available and coming soon', async () => {
  const res = await site.request('/');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') ?? '', /text\/html/);
  const html = await res.text();
  assert.match(html, /<a class="course available" href="\/courses\/python"/);
  assert.match(html, /class="course soon"[\s\S]*Coming soon/);
  assert.match(html, /id="progress-meta"/);
});

test('the home page embeds each available course total and exercise ids', async () => {
  const html = await (await site.request('/')).text();
  const meta = JSON.parse(html.match(/id="progress-meta">(.*?)<\/script>/)![1]!);
  assert.ok(meta.python.total > 0);
  assert.ok(meta.python.exerciseIds.includes('double-number'));
  assert.equal(meta.python.exerciseIds.length, meta.python.total);
});

test('an available course page lists its lessons by section', async () => {
  const res = await site.request('/courses/python');
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<a href="\/lessons\/functions">Functions<\/a>/);
  assert.match(html, /<h2>Section 4<\/h2>/);
  assert.match(html, /All courses/);
});

test('a coming-soon course has no page, and an unknown course is a 404', async () => {
  assert.equal((await site.request('/courses/javascript')).status, 404);
  assert.equal((await site.request('/courses/nope')).status, 404);
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

test('the harness, runner and Python worker are served to the browser with usable content types', async () => {
  for (const [path, marker] of [
    ['/static/lesson-runner.js', /createPythonRunner/],
    ['/static/py-runner.js', /KeyboardInterrupt|SIGINT/],
    ['/static/py-worker.js', /loadPyodide/],
  ] as const) {
    const res = await site.request(path);
    assert.equal(res.status, 200, path);
    assert.match(res.headers.get('content-type') ?? '', /javascript/, path);
    assert.match(await res.text(), marker, path);
  }

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

test('a project page is served like a lesson, and the course page lists it under its section', async () => {
  const page = await site.request('/lessons/number-guessing');
  assert.equal(page.status, 200);
  assert.match(await page.text(), /<h1>Project: Number guessing game<\/h1>/);
  const course = await (await site.request('/courses/python')).text();
  const projects = course.slice(
    course.indexOf('<h2>Section 3</h2>'),
    course.indexOf('<h2>Section 4</h2>'),
  );
  assert.match(
    projects,
    /<h3 class="group-label">Projects<\/h3>\s*<ul class="lessons">[\s\S]*\/lessons\/number-guessing/,
  );
});

test('every lesson links its projects, and each project names a real lesson', async () => {
  const loops = await (await site.request('/lessons/loops')).text();
  assert.match(loops, /href="\/lessons\/min-and-max"/);
  assert.match(loops, /href="\/lessons\/find-factors"/);
  assert.match(loops, /href="\/lessons\/number-guessing"/);
});
