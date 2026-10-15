import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildNav } from '../src/lessons/nav.ts';
import { renderLesson } from '../src/lessons/render.ts';
import type { Lesson } from '../src/lessons/types.ts';

const lesson: Lesson = {
  id: 'demo',
  title: 'A <b> title',
  section: 1,
  blocks: [
    { type: 'markdown', text: '## Heading\n\nSome *text*.' },
    {
      type: 'cell',
      id: 'ex',
      kind: 'exercise',
      prompt: 'Write `f`.',
      starter: 'if a < b:\n    pass',
      tests: 'assert SECRET_TESTS',
      solution: 'SECRET_SOLUTION',
      hints: ['Try *this*.', 'Or that.'],
    },
    { type: 'cell', id: 'play', kind: 'sandbox', prompt: '', starter: 'x = 1', hints: [] },
  ],
};

test('renders markdown, cells, hints and an escaped title', () => {
  const html = renderLesson({ ...lesson, title: 'A <b> "title" & more' });
  assert.match(html, /<title>A &lt;b&gt; &quot;title&quot; &amp; more<\/title>/);
  assert.match(html, /<h1>A &lt;b&gt; &quot;title&quot; &amp; more<\/h1>/);
  assert.match(html, /<h2>Heading<\/h2>/);
  assert.match(html, /<em>text<\/em>/);
  assert.match(html, /class="cell exercise" data-cell-id="ex"/);
  assert.match(html, /class="cell sandbox" data-cell-id="play"/);
  assert.match(html, /<code>f<\/code>/);
  assert.match(html, /<summary>Hint 1<\/summary><p>Try <em>this<\/em>\.<\/p>/);
  assert.match(html, /<summary>Hint 2<\/summary>/);
});

test('cell code is escaped inside a textarea sized to its lines', () => {
  const html = renderLesson(lesson);
  assert.ok(html.includes('rows="3">if a &lt; b:\n    pass</textarea>'));
  assert.match(html, /<textarea spellcheck="false" rows="2">x = 1<\/textarea>/);
});

test('the solution is never shipped, and tests ride only in the data-tests attribute', () => {
  const html = renderLesson(lesson);
  assert.doesNotMatch(html, /SECRET_SOLUTION/);
  assert.match(html, /data-tests="assert SECRET_TESTS"/);
  assert.equal(html.match(/SECRET_TESTS/g)?.length, 1);
});

test('exercise and sandbox cells both get an enabled-later Run button and output area', () => {
  const html = renderLesson(lesson);
  assert.match(html, /<button type="button" class="run" disabled>Loading Python…<\/button>/);
  assert.match(html, /<pre class="output" aria-live="polite" hidden><\/pre>/);
  assert.match(html, /data-cell-id="play">/);
});

test('python fences are highlighted; py alias works; other and bare fences are escaped', () => {
  const html = renderLesson({
    ...lesson,
    blocks: [
      { type: 'markdown', text: '```python\nif x:\n    y = 1  # c\n```' },
      { type: 'markdown', text: '```py\nz = "s"\n```' },
      { type: 'markdown', text: '```text\n2 < 3\n```' },
      { type: 'markdown', text: '```\nplain < text\n```' },
    ],
  });
  assert.match(html, /<span class="hljs-keyword">if<\/span>/);
  assert.match(html, /class="language-python"/);
  assert.match(html, /class="language-py"/);
  assert.match(html, /<pre><code class="language-text">2 &lt; 3<\/code><\/pre>/);
  assert.match(html, /<pre><code>plain &lt; text<\/code><\/pre>/);
});

test('the page loads Pyodide and the lesson runner', () => {
  const html = renderLesson(lesson);
  assert.match(html, /<script src="\/pyodide\/pyodide\.js"><\/script>/);
  assert.match(html, /<script type="module" src="\/static\/lesson-runner\.js"><\/script>/);
});

test('a cell without a prompt renders no prompt block', () => {
  const html = renderLesson({ ...lesson, blocks: [lesson.blocks[2]!] });
  assert.doesNotMatch(html, /class="prompt"/);
});

test('with nav, renders the section sidebar and the prev/next pager', () => {
  const nav = buildNav(
    [
      { id: 'intro', title: 'Intro', section: 1, blocks: [] },
      lesson,
      { id: 'next-one', title: 'Next One', section: 2, blocks: [] },
    ],
    lesson.id,
  );
  const html = renderLesson(lesson, nav);
  assert.match(html, /<nav class="sidebar"/);
  assert.match(html, /<summary>Section 1<\/summary>/);
  assert.match(html, /<summary>Section 2<\/summary>/);
  assert.match(html, /<a href="\/lessons\/intro">Intro<\/a>/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /class="pager"/);
  assert.match(html, /Previous: Intro/);
  assert.match(html, /Next: Next One/);
});

test('without nav, no sidebar or pager is rendered', () => {
  const html = renderLesson(lesson);
  assert.doesNotMatch(html, /class="sidebar"/);
  assert.doesNotMatch(html, /class="pager"/);
});

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
