import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderCourse } from '../src/lessons/home.ts';
import { buildNav } from '../src/lessons/nav.ts';
import { renderLesson } from '../src/lessons/render.ts';
import type { Lesson } from '../src/lessons/types.ts';

function page(id: string, title: string, section: number, after?: string): Lesson {
  const base: Lesson = { id, title, section, blocks: [] };
  return after === undefined ? base : { ...base, after };
}

const course = [
  page('loops', 'Loops', 1),
  page('conditionals', 'Conditionals', 1),
  page('guessing', 'Number guessing', 1, 'loops'),
  page('factors', 'Find the factors', 1, 'loops'),
  page('functions', 'Functions', 2),
];

function sidebarOf(current: string): string {
  const html = renderLesson(page(current, current, 1), buildNav(course, current));
  const start = html.indexOf('<nav class="sidebar"');
  return html.slice(start, html.indexOf('</nav>', start));
}

test('a section lists its lessons first, then its projects under one Projects label', () => {
  const sidebar = sidebarOf('loops');
  const label = sidebar.indexOf('<p class="group-label" aria-hidden="true">Projects</p>');
  assert.ok(label > 0);
  assert.ok(sidebar.indexOf('/lessons/conditionals') < label);
  assert.ok(label < sidebar.indexOf('/lessons/guessing'));
  assert.ok(sidebar.indexOf('/lessons/guessing') < sidebar.indexOf('/lessons/factors'));
});

test('projects sit in their own labelled list, not the lessons list', () => {
  const sidebar = sidebarOf('loops');
  const lessonList = sidebar.match(/<\/summary>\s*<ul>([\s\S]*?)<\/ul>/)![1]!;
  assert.match(lessonList, /\/lessons\/loops/);
  assert.doesNotMatch(lessonList, /guessing|factors/);
  const projectList = sidebar.match(/<ul aria-label="Projects">([\s\S]*?)<\/ul>/)![1]!;
  assert.match(projectList, /guessing/);
  assert.match(projectList, /factors/);
  assert.doesNotMatch(projectList, /\/lessons\/loops/);
});

test('a section without projects has no Projects label', () => {
  const sidebar = sidebarOf('loops');
  assert.equal(sidebar.match(/class="group-label"/g)?.length, 1);
});

test('every section that has projects gets its own label', () => {
  const two = [...course, page('closures', 'Closures project', 2, 'functions')];
  const html = renderLesson(page('loops', 'Loops', 1), buildNav(two, 'loops'));
  assert.equal(html.match(/class="group-label"/g)?.length, 2);
});

test('a project page heading and tab title both start with Project:', () => {
  const project = page('guessing', 'Number guessing <game>', 1, 'loops');
  const html = renderLesson(project, buildNav(course, 'guessing'));
  assert.match(html, /<h1>Project: Number guessing &lt;game&gt;<\/h1>/);
  assert.match(html, /<title>Project: Number guessing &lt;game&gt;<\/title>/);
});

test('an ordinary lesson heading and title are left as they are', () => {
  const html = renderLesson(page('loops', 'Loops', 1), buildNav(course, 'loops'));
  assert.match(html, /<h1>Loops<\/h1>/);
  assert.match(html, /<title>Loops<\/title>/);
});

test('project entries are not drawn with an arrow that looks like a dropdown', () => {
  const html = renderLesson(page('loops', 'Loops', 1), buildNav(course, 'loops'));
  assert.doesNotMatch(html, /li\.project/);
  assert.doesNotMatch(html, /25B8/);
});

test('the course page groups each section projects under a Projects heading', () => {
  const html = renderCourse(
    { id: 'python', title: 'Python', description: 'd', status: 'available' },
    course,
  );
  const section1 = html.slice(
    html.indexOf('<h2>Section 1</h2>'),
    html.indexOf('<h2>Section 2</h2>'),
  );
  assert.match(section1, /<h3 class="group-label">Projects<\/h3>/);
  assert.ok(section1.indexOf('/lessons/conditionals') < section1.indexOf('Projects</h3>'));
  assert.ok(section1.indexOf('Projects</h3>') < section1.indexOf('/lessons/guessing'));
  const section2 = html.slice(html.indexOf('<h2>Section 2</h2>'));
  assert.doesNotMatch(section2, /group-label/);
});
