import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseLesson } from '../src/lessons/parse.ts';
import { HEADER, cellsOf, rejects } from './lesson-helpers.ts';

test('parses front matter, markdown, a sandbox cell and an exercise', () => {
  const lesson = parseLesson(`${HEADER}
# Intro

Some text.

:::cell id=try-it
\`\`\`python starter
print(1)
\`\`\`
:::

:::cell id=double kind=exercise
Write a function.

\`\`\`python starter
# code
\`\`\`

\`\`\`python tests
assert True
\`\`\`

\`\`\`python solution
x = 1
\`\`\`

\`\`\`hint
Think about *
\`\`\`
:::
`);
  assert.equal(lesson.id, 'demo');
  assert.equal(lesson.title, 'Demo');
  assert.equal(lesson.section, 2);
  assert.deepEqual(
    lesson.blocks.map((block) => block.type),
    ['markdown', 'cell', 'cell'],
  );
  assert.deepEqual(lesson.blocks[0], { type: 'markdown', text: '# Intro\n\nSome text.' });
  assert.deepEqual(lesson.blocks[1], {
    type: 'cell',
    id: 'try-it',
    kind: 'sandbox',
    prompt: '',
    starter: 'print(1)',
    hints: [],
  });
  assert.deepEqual(lesson.blocks[2], {
    type: 'cell',
    id: 'double',
    kind: 'exercise',
    prompt: 'Write a function.',
    starter: '# code',
    tests: 'assert True',
    solution: 'x = 1',
    hints: ['Think about *'],
  });
});

test('cell markers inside markdown code fences are plain text', () => {
  const lesson = parseLesson(`${HEADER}\`\`\`text\n:::cell id=x\n:::\n\`\`\`\n`);
  assert.equal(lesson.blocks.length, 1);
  assert.equal(lesson.blocks[0]!.type, 'markdown');
});

test('other code fences inside a cell prompt stay in the prompt', () => {
  const lesson = parseLesson(
    `${HEADER}:::cell id=a\nSee:\n\`\`\`python\nprint(2)\n\`\`\`\n\`\`\`python starter\npass\n\`\`\`\n:::\n`,
  );
  const cell = lesson.blocks[0]!;
  assert.equal(cell.type === 'cell' && cell.prompt, 'See:\n```python\nprint(2)\n```');
});

test('accepts Windows line endings', () => {
  const lesson = parseLesson(HEADER.replaceAll('\n', '\r\n') + 'Hello\r\n');
  assert.equal(lesson.title, 'Demo');
});

test('front matter problems are reported', () => {
  rejects('no front matter', 1, /must start with/);
  rejects('---\nid: a\nnonsense\n---\n', 3, /bad front matter line/);
  rejects('---\nid: a\ntitle: B\n', 4, /never closed/);
  rejects('---\ntitle: B\nsection: 1\n---\n', 1, /missing "id"/);
  rejects('---\nid: a\ntitle: B\nsection: x\n---\n', 1, /positive integer/);
  rejects('---\nid: a\ntitle: B\nsection: 0\n---\n', 1, /positive integer/);
});

test('structural problems are reported with line numbers', () => {
  rejects(`${HEADER}:::cell id=a\n`, 6, /never closed/);
  rejects(`${HEADER}:::cell id=a\n:::cell id=b\n:::\n`, 7, /nested/);
  rejects(`${HEADER}\`\`\`python\nx\n`, 8, /code block is never closed/);
  rejects(
    `${HEADER}:::cell id=a\n\`\`\`python starter\nx\n\`\`\`\n:::\n:::cell id=a\n\`\`\`python starter\nx\n\`\`\`\n:::\n`,
    11,
    /duplicate cell id/,
  );
});

test('cell problems are reported', () => {
  const cell = (attrs: string, body = '') => `${HEADER}:::cell ${attrs}\n${body}:::\n`;
  const starter = '```python starter\nx\n```\n';
  const tests = '```python tests\nassert True\n```\n';
  const solution = '```python solution\nx\n```\n';
  rejects(cell('', starter), 6, /needs an id/);
  rejects(cell('id=Bad_Id', starter), 6, /needs an id/);
  rejects(cell('id=a color=red', starter), 6, /bad cell attribute/);
  rejects(cell('id=a kind', starter), 6, /bad cell attribute/);
  rejects(cell('id=a kind=quiz', starter), 6, /unknown cell kind/);
  rejects(cell('id=a'), 6, /needs a "python starter"/);
  rejects(cell('id=a', starter + tests), 6, /cannot have tests/);
  rejects(cell('id=a', starter + solution), 6, /cannot have tests or a solution/);
  rejects(cell('id=a kind=exercise', starter + tests), 6, /needs "python tests" and/);
  rejects(cell('id=a kind=exercise', starter + solution), 6, /needs "python tests" and/);
  rejects(cell('id=a kind=check', starter + tests), 6, /check "a" needs "python tests" and/);
  rejects(cell('id=a', starter + starter), 10, /two "python starter" blocks/);
  rejects(cell('id=a', '```python starter\nx\n'), 6, /cell is never closed/);
  rejects(cell('id=a', '```python starter\nx\n```python\n'), 7, /code block is never closed/);
});

test('an "after" front matter field marks a project and names the lesson it follows', () => {
  const project = parseLesson(
    '---\nid: p\ntitle: A project\nsection: 2\nafter: input-and-casting\n---\nBody\n',
  );
  assert.equal(project.after, 'input-and-casting');
});

test('a lesson without "after" has no after property at all', () => {
  const lesson = parseLesson(`${HEADER}\nBody\n`);
  assert.equal('after' in lesson, false);
});

test('a check cell is parsed like an exercise, with tests and a solution', () => {
  const source = `${HEADER}:::cell id=c kind=check\n\`\`\`python starter\nx = None\n\`\`\`\n\`\`\`python tests\nassert x == 1\n\`\`\`\n\`\`\`python solution\nx = 1\n\`\`\`\n:::\n`;
  const [cell] = cellsOf(source);
  assert.equal(cell!.kind, 'check');
  assert.equal(cell!.tests, 'assert x == 1');
  assert.equal(cell!.solution, 'x = 1');
});
