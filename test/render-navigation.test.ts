import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildNav } from '../src/lessons/nav.ts';
import { renderLesson } from '../src/lessons/render.ts';
import type { Lesson } from '../src/lessons/types.ts';

const lesson: Lesson = { id: 'demo', title: 'Demo', section: 1, blocks: [] };

const intro: Lesson = { id: 'intro', title: 'Intro', section: 1, blocks: [] };
const later: Lesson = { id: 'later', title: 'Later', section: 2, blocks: [] };

test('only the current lesson link is marked as the current page', () => {
  const html = renderLesson(lesson, buildNav([intro, lesson, later], lesson.id));
  assert.match(html, /<a href="\/lessons\/demo" aria-current="page">/);
  assert.doesNotMatch(html, /<a href="\/lessons\/intro" aria-current/);
  assert.doesNotMatch(html, /<a href="\/lessons\/later" aria-current/);
});

test('only the section holding the current lesson starts open', () => {
  const inFirst = renderLesson(lesson, buildNav([intro, lesson, later], lesson.id));
  assert.match(inFirst, /<details open><summary>Section 1/);
  assert.match(inFirst, /<details><summary>Section 2/);
  const inSecond = renderLesson(later, buildNav([intro, lesson, later], later.id));
  assert.match(inSecond, /<details><summary>Section 1/);
  assert.match(inSecond, /<details open><summary>Section 2/);
});

test('the pager marks its links, and leaves an empty slot where there is no neighbour', () => {
  const html = renderLesson(intro, buildNav([intro, lesson], intro.id));
  assert.match(
    html,
    /<nav class="pager"[^>]*>\s*<span><\/span>\s*<a class="next" href="\/lessons\/demo">/,
  );
  const last = renderLesson(lesson, buildNav([intro, lesson], lesson.id));
  assert.match(
    last,
    /<a class="prev" href="\/lessons\/intro">Previous: Intro<\/a>\s*<span><\/span>/,
  );
});

function codeBlockOf(info: string): string {
  const html = renderLesson({
    ...lesson,
    blocks: [{ type: 'markdown', text: '```' + info + '\nz = "s"\n```' }],
  });
  return html.match(/<pre><code[^>]*>[\s\S]*?<\/code><\/pre>/)![0];
}

test('the py alias is highlighted like python, and other languages are not', () => {
  assert.match(codeBlockOf('py'), /<span class="hljs-string">/);
  assert.doesNotMatch(codeBlockOf('text'), /hljs-/);
  assert.doesNotMatch(codeBlockOf(''), /hljs-/);
});

test('a fence with extra words after the language is still highlighted as that language', () => {
  const html = renderLesson({
    ...lesson,
    blocks: [{ type: 'markdown', text: '```python title=demo\nif x:\n    y = 1\n```' }],
  });
  assert.match(html, /<span class="hljs-keyword">if<\/span>/);
  assert.match(html, /class="language-python"/);
});
