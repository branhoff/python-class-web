import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildNav } from '../src/lessons/nav.ts';
import { renderLesson } from '../src/lessons/render.ts';
import type { Lesson } from '../src/lessons/types.ts';

function pageOf(text: string, ...others: Lesson[]): string {
  const solo: Lesson = {
    id: 'solo',
    title: 'Solo',
    section: 1,
    blocks: [{ type: 'markdown', text }],
  };
  return renderLesson(solo, buildNav([solo, ...others], solo.id));
}

function mainText(html: string): string {
  const inner = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)![1]!;
  return inner
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

test('a fence uses its first word as the language, however many words follow', () => {
  const html = pageOf('```python title=demo\nprint(1)\n```');
  assert.match(html, /<pre><code class="language-python">/);
  assert.match(html, /hljs-/);
  assert.match(pageOf('```text   extra\nplain\n```'), /<pre><code class="language-text">plain/);
});

test('a fence with no language has no language class', () => {
  assert.match(pageOf('```\nplain\n```'), /<pre><code>plain<\/code><\/pre>/);
});

test('a lesson with no project, no projects list and no neighbours adds nothing to the page', () => {
  const html = pageOf('Body text');
  assert.equal(mainText(html), 'Solo Body text');
  assert.match(html, /continue\.js"><\/script>\n<\/body>/);
});

test('a section with no projects closes its list straight into the section', () => {
  assert.match(pageOf('Body text'), /<\/ul>\n<\/details>/);
});

function plain(id: string, section: number, after?: string): Lesson {
  return { id, title: id, section, blocks: [], ...(after === undefined ? {} : { after }) };
}

test('sidebar lessons, sidebar sections and project links are each on their own line', () => {
  const lessons = [
    plain('a', 1),
    plain('b', 1),
    plain('c', 2),
    plain('p1', 2, 'a'),
    plain('p2', 2, 'a'),
  ];
  const html = renderLesson(lessons[0]!, buildNav(lessons, 'a'));
  assert.match(html, /<li data-items=""><a href="\/lessons\/a"[^\n]*<\/li>\n<li data-items="">/);
  assert.match(html, /<\/details>\n<details>/);
  assert.match(
    html,
    /<li><a href="\/lessons\/p1">p1<\/a><\/li>\n<li><a href="\/lessons\/p2">p2<\/a><\/li>/,
  );
});

test('a section lists its projects under their own heading, one to a line', () => {
  const lessons = [plain('a', 1), plain('p1', 1, 'a'), plain('p2', 1, 'a')];
  const html = renderLesson(lessons[0]!, buildNav(lessons, 'a'));
  assert.match(
    html,
    /<p class="group-label" aria-hidden="true">Projects<\/p>\n<ul aria-label="Projects">\n<li class="project"[^\n]*<\/li>\n<li class="project"[^\n]*<\/li>\n<\/ul>/,
  );
});
