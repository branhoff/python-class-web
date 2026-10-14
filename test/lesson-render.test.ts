import assert from 'node:assert/strict';
import { test } from 'node:test';
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

test('the page loads Pyodide and the lesson runner', () => {
  const html = renderLesson(lesson);
  assert.match(html, /<script src="\/pyodide\/pyodide\.js"><\/script>/);
  assert.match(html, /<script type="module" src="\/static\/lesson-runner\.js"><\/script>/);
});

test('a cell without a prompt renders no prompt block', () => {
  const html = renderLesson({ ...lesson, blocks: [lesson.blocks[2]!] });
  assert.doesNotMatch(html, /class="prompt"/);
});
