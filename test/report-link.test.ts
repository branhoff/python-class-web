import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderAccount } from '../src/lessons/account.ts';
import { renderReportFooter } from '../src/lessons/chrome.ts';
import { COURSES } from '../src/lessons/courses.ts';
import { renderCourse, renderHome } from '../src/lessons/home.ts';
import { buildNav } from '../src/lessons/nav.ts';
import { renderLesson } from '../src/lessons/render.ts';
import { reportProblemUrl } from '../src/lessons/report.ts';
import { createLessonSite } from '../src/lessons/site.ts';
import type { Lesson } from '../src/lessons/types.ts';

const lesson: Lesson = { id: 'loops', title: 'Loops', section: 3, blocks: [] };

test('the report URL opens a new issue prefilled with the page title and address', () => {
  const url = new URL(reportProblemUrl({ title: 'Loops', path: '/lessons/loops' }));
  assert.equal(
    `${url.origin}${url.pathname}`,
    'https://github.com/branhoff/python-class-web/issues/new',
  );
  assert.equal(url.searchParams.get('title'), 'Problem on: Loops');
  assert.equal(
    url.searchParams.get('body'),
    'Page: Loops\nAddress: /lessons/loops\n\nWhat is wrong or confusing?\n',
  );
});

test('the report URL survives titles with quotes, ampersands and angle brackets', () => {
  const title = `Tom & "Jerry" <b>`;
  const url = new URL(reportProblemUrl({ title, path: '/lessons/x' }));
  assert.equal(url.searchParams.get('title'), `Problem on: ${title}`);
});

test('the footer link opens GitHub in a new tab without leaking the opener, and says an account is needed', () => {
  const html = renderReportFooter({ title: 'Loops', path: '/lessons/loops' });
  assert.match(html, /^<footer class="report"><a href="https:\/\/github\.com\//);
  assert.match(
    html,
    /target="_blank" rel="noopener noreferrer">Report a problem with this page<\/a>/,
  );
  assert.match(html, /you need an account/);
});

test('the footer href escapes ampersands so the markup stays valid', () => {
  const html = renderReportFooter({ title: 'Loops', path: '/lessons/loops' });
  const href = /href="([^"]*)"/.exec(html)?.[1] ?? '';
  assert.match(href, /\?title=[^&]*&amp;body=/);
  assert.doesNotMatch(href, /&(?!amp;)/);
});

test('a title with quotes cannot break out of the href attribute', () => {
  const html = renderReportFooter({ title: `"><script>x</script>`, path: '/' });
  assert.doesNotMatch(html, /<script>/);
  assert.equal(html.match(/href="/g)?.length, 1);
});

test('a lesson page carries a report link for its own title and address', () => {
  const html = renderLesson(lesson, buildNav([lesson], lesson.id));
  assert.match(html, /<footer class="report">/);
  assert.match(html, /title=Problem\+on%3A\+Loops/);
  assert.match(html, /Address%3A\+%2Flessons%2Floops/);
});

test('a project page names the project title as the page', () => {
  const project: Lesson = { ...lesson, id: 'p1', title: 'Guess', after: 'loops' };
  const html = renderLesson(project, buildNav([lesson, project], project.id));
  assert.match(html, /title=Problem\+on%3A\+Project%3A\+Guess/);
});

test('a lesson rendered without navigation has no footer', () => {
  assert.doesNotMatch(renderLesson(lesson), /class="report"/);
});

test('the home, course and account pages each carry the report link once', () => {
  const python = COURSES[0]!;
  for (const html of [renderHome(COURSES, {}), renderCourse(python, []), renderAccount([])]) {
    assert.equal(html.match(/<footer class="report">/g)?.length, 1);
  }
  assert.match(renderHome(COURSES, {}), /Address%3A\+%2F%0A/);
  assert.match(renderCourse(python, []), /Address%3A\+%2Fcourses%2Fpython%0A/);
  assert.match(renderAccount([]), /Address%3A\+%2Faccount%0A/);
});

test('the real site serves the link on a lesson page', async () => {
  const html = await (await createLessonSite().request('/lessons/loops')).text();
  assert.match(
    html,
    /<footer class="report"><a href="https:\/\/github\.com\/branhoff\/python-class-web\/issues\/new\?/,
  );
});
