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
