import assert from 'node:assert/strict';
import { test } from 'node:test';
import { courseProgressMeta } from '../src/lessons/home.ts';
import { buildNav, progressItemIds } from '../src/lessons/nav.ts';
import { renderLesson } from '../src/lessons/render.ts';
import { createLessonSite } from '../src/lessons/site.ts';
import type { Cell, Lesson } from '../src/lessons/types.ts';

function exercise(id: string): Cell {
  return { type: 'cell', id, kind: 'exercise', prompt: '', starter: '', hints: [] };
}

const lesson: Lesson = { id: 'loops', title: 'Loops', section: 1, blocks: [exercise('loops-ex1')] };
const project: Lesson = { id: 'guess', title: 'Guessing', section: 1, after: 'loops', blocks: [] };

test('a lesson is finished by its exercises; a project page is finished by the project itself', () => {
  assert.deepEqual(progressItemIds(lesson), ['loops-ex1']);
  assert.deepEqual(progressItemIds(project), ['project:guess']);
});

test('a project page with exercise cells of its own needs those and the project', () => {
  const both: Lesson = { ...project, blocks: [exercise('drill')] };
  assert.deepEqual(progressItemIds(both), ['drill', 'project:guess']);
});

test('a project item cannot collide with a cell id, which never contains a colon', () => {
  assert.match(progressItemIds(project)[0]!, /^project:/);
  assert.doesNotMatch('loops-ex1', /:/);
});

test('course totals count projects as well as exercises, and pages keep course order', () => {
  const meta = courseProgressMeta(new Map([['python', [lesson, project]]]));
  assert.equal(meta['python']!.total, 2);
  assert.deepEqual(meta['python']!.itemIds, ['loops-ex1', 'project:guess']);
  assert.deepEqual(
    meta['python']!.pages.map((page) => [page.id, page.project]),
    [
      ['loops', false],
      ['guess', true],
    ],
  );
});

test('the home page embeds the real course: projects included in the total', async () => {
  const html = await (await createLessonSite().request('/')).text();
  const meta = JSON.parse(html.match(/id="progress-meta">(.*?)<\/script>/)![1]!);
  const python = meta.python;
  assert.equal(python.total, python.itemIds.length);
  assert.ok(python.itemIds.includes('project:number-guessing'));
  assert.ok(python.itemIds.includes('double-number'));
  const pageIds = python.pages.map((page: { id: string }) => page.id);
  assert.ok(pageIds.indexOf('loops') < pageIds.indexOf('number-guessing'));
});

test('a project page offers a checkbox for that project, off until the page enables it', () => {
  const html = renderLesson(project, buildNav([lesson, project], 'guess'));
  assert.match(
    html,
    /<input type="checkbox" id="project-done" data-item="project:guess" disabled>/,
  );
  assert.match(html, /I finished this project/);
  assert.match(html, /src="\/static\/project-done.js"/);
});

test('a lesson page has no project checkbox and does not load its script', () => {
  const html = renderLesson(lesson, buildNav([lesson, project], 'loops'));
  assert.doesNotMatch(html, /id="project-done"/);
  assert.doesNotMatch(html, /\/static\/project-done.js/);
});

test('the checkbox sits before the pager and the project list', () => {
  const html = renderLesson(project, buildNav([lesson, project], 'guess'));
  assert.ok(html.indexOf('id="project-done"') < html.indexOf('class="pager"'));
});

test('every page says which lesson it is, so a visit can be remembered', () => {
  assert.match(renderLesson(lesson, buildNav([lesson], 'loops')), /<main data-lesson-id="loops">/);
  const odd: Lesson = { ...lesson, id: 'a"b' };
  assert.match(renderLesson(odd, buildNav([odd], odd.id)), /data-lesson-id="a&quot;b"/);
});

test('the home and course pages have a continue banner and load the script for it', async () => {
  const site = createLessonSite();
  for (const path of ['/', '/courses/python']) {
    const html = await (await site.request(path)).text();
    assert.match(html, /<section id="continue" class="continue"[^>]* hidden><\/section>/, path);
    assert.match(html, /src="\/static\/continue.js"/, path);
  }
});

test('the course page embeds its own pages for the banner', async () => {
  const html = await (await createLessonSite().request('/courses/python')).text();
  const meta = JSON.parse(html.match(/id="progress-meta">(.*?)<\/script>/)![1]!);
  assert.deepEqual(Object.keys(meta), ['python']);
  assert.ok(meta.python.pages.length > 20);
});

test('lesson pages load the continue script so visits are remembered', async () => {
  const html = await (await createLessonSite().request('/lessons/loops')).text();
  assert.match(html, /src="\/static\/continue.js"/);
});
