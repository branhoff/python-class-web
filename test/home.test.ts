import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COURSES } from '../src/lessons/courses.ts';
import { courseProgressMeta, renderCourse, renderHome } from '../src/lessons/home.ts';
import type { Cell, Lesson } from '../src/lessons/types.ts';

test('the home page has a title and lists every course card on its own line', () => {
  const html = renderHome(COURSES, {});
  assert.match(html, /<title>Courses<\/title>/);
  assert.equal(html.match(/<a class="course available"/g)?.length, 1);
  assert.equal(html.match(/<div class="course soon">/g)?.length, 3);
  assert.match(html, /<\/a>\n<div class="course soon">/);
  assert.match(html, /<\/div>\n<div class="course soon">/);
});

test('a course page with no lessons still renders, with a title and a way back', () => {
  const python = COURSES[0]!;
  const html = renderCourse(python, []);
  assert.match(html, /<title>Programming 101 with Python<\/title>/);
  assert.match(html, /<a href="\/">← All courses<\/a>/);
  assert.doesNotMatch(html, /<h2>Section/);
});

function cell(id: string, kind: Cell['kind']): Cell {
  return { type: 'cell', id, kind, prompt: '', starter: '', hints: [] };
}

test('course progress counts only exercise cells, not markdown or sandbox cells', () => {
  const lessons: Lesson[] = [
    {
      id: 'one',
      title: 'One',
      section: 1,
      blocks: [
        { type: 'markdown', text: 'intro' },
        cell('try-it', 'sandbox'),
        cell('drill-a', 'exercise'),
      ],
    },
    {
      id: 'two',
      title: 'Two',
      section: 1,
      blocks: [cell('drill-b', 'exercise'), { type: 'markdown', text: 'outro' }],
    },
  ];
  assert.deepEqual(courseProgressMeta(new Map([['python', lessons]])), {
    python: {
      total: 2,
      itemIds: ['drill-a', 'drill-b'],
      pages: [
        { id: 'one', title: 'One', project: false, itemIds: ['drill-a'] },
        { id: 'two', title: 'Two', project: false, itemIds: ['drill-b'] },
      ],
    },
  });
});

test('a course with no exercises has a total of zero', () => {
  const lessons: Lesson[] = [
    { id: 'one', title: 'One', section: 1, blocks: [cell('try-it', 'sandbox')] },
  ];
  assert.deepEqual(courseProgressMeta(new Map([['python', lessons]])), {
    python: {
      total: 0,
      itemIds: [],
      pages: [{ id: 'one', title: 'One', project: false, itemIds: [] }],
    },
  });
});

test('every unavailable course appears as a card with the tag for its status', () => {
  const html = renderHome(COURSES, {});
  for (const title of ['Programming 102 with Python', 'C and C++', 'Game Dev with PICO-8']) {
    assert.match(html, new RegExp(`<span class="title">${title.replace('+', '\\+')}</span>`));
  }
  assert.equal(html.match(/Coming soon/g)?.length, 2);
  assert.equal(html.match(/In planning/g)?.length, 1);
});

test('the 102 card follows the 101 card', () => {
  const html = renderHome(COURSES, {});
  assert.ok(
    html.indexOf('Programming 101 with Python') < html.indexOf('Programming 102 with Python'),
  );
  assert.ok(html.indexOf('Programming 102 with Python') < html.indexOf('C and C++'));
});

test('the home page top bar has nothing on its left', () => {
  assert.match(renderHome(COURSES, {}), /<span class="topbar-left"><\/span>/);
});

function plain(id: string, section: number, after?: string): Lesson {
  return { id, title: id, section, blocks: [], ...(after === undefined ? {} : { after }) };
}

test('a section with no projects shows no project heading and nothing in its place', () => {
  const html = renderCourse(COURSES[0]!, [plain('a', 1), plain('b', 2)]);
  assert.doesNotMatch(html, /Projects/);
  assert.match(
    html,
    /<h2>Section 1<\/h2>\n<ul class="lessons">\n<li>[^\n]*<\/li>\n<\/ul>\n<h2>Section 2<\/h2>/,
  );
});

test('a section with a project lists it under its own heading, after the lessons', () => {
  const html = renderCourse(COURSES[0]!, [plain('a', 1), plain('p', 1, 'a')]);
  assert.match(
    html,
    /<h2>Section 1<\/h2>\n<ul class="lessons">\n<li><a href="\/lessons\/a">a<\/a><\/li>\n<\/ul>\n<h3 class="group-label">Projects<\/h3>\n<ul class="lessons">\n<li><a href="\/lessons\/p">p<\/a><\/li>\n<\/ul>/,
  );
});

test('lessons in a section are listed one to a line', () => {
  const html = renderCourse(COURSES[0]!, [plain('a', 1), plain('b', 1)]);
  assert.match(
    html,
    /<li><a href="\/lessons\/a">a<\/a><\/li>\n<li><a href="\/lessons\/b">b<\/a><\/li>/,
  );
});
