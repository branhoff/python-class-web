import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { loadLessons } from '../src/lessons/load.ts';
import { parseLesson } from '../src/lessons/parse.ts';
import { pythonRunner } from '../src/lessons/run-python.ts';
import { renderLesson } from '../src/lessons/render.ts';
import { LessonError, type Lesson } from '../src/lessons/types.ts';
import { cellsOf, HEADER, rejects } from './lesson-helpers.ts';

test('front matter tolerates spacing, blank lines and trailing whitespace', () => {
  const lesson = parseLesson('--- \nid:demo\n   \ntitle:   Demo   \nsection: 3\n---  \nBody');
  assert.equal(lesson.id, 'demo');
  assert.equal(lesson.title, 'Demo');
  assert.equal(lesson.section, 3);
});

test('front matter keys must start the line', () => {
  rejects('---\nthe id: a\n---\n', 2, /bad front matter line/);
  rejects('---\nid:\ntitle: T\nsection: 1\n---\n', 1, /missing "id"/);
});

test('cell directives must start the line', () => {
  const source = `${HEADER}see :::cell id=x here\n\n:::cell id=real\n\`\`\`python starter\nx\n\`\`\`\n:::\n`;
  assert.deepEqual(
    cellsOf(source).map((cell) => cell.id),
    ['real'],
  );
});

test('a bare :::cell reports the missing id', () => {
  rejects(`${HEADER}:::cell\n:::\n`, 6, /needs an id/);
});

test('closing ::: may have trailing spaces, and text containing ::: is just text', () => {
  const [cell] = cellsOf(
    `${HEADER}:::cell id=a\nends with :::\n\`\`\`python starter\nx\n\`\`\`\n:::   \n`,
  );
  assert.equal(cell!.prompt, 'ends with :::');
});

test('backticks in the middle of a line do not open a code fence', () => {
  const lesson = parseLesson(
    `${HEADER}use \`\`\` marks\n:::cell id=a\n\`\`\`python starter\nx\n\`\`\`\n:::\n`,
  );
  assert.equal(lesson.blocks.length, 2);
});

test('cell ids must be fully made of allowed characters', () => {
  rejects(`${HEADER}:::cell id=bad_id\n:::\n`, 6, /needs an id/);
});

test('a cell attribute with a second = is rejected, not silently truncated', () => {
  rejects(`${HEADER}:::cell id=a=b\n:::\n`, 6, /bad cell attribute "id=a=b"/);
});

test('multi-line starter, tests and solution keep their line breaks', () => {
  const [cell] = cellsOf(
    `${HEADER}:::cell id=a kind=exercise\n\`\`\`python starter\na\nb\n\`\`\`\n\`\`\`python tests\nc\nd\n\`\`\`\n\`\`\`python solution\ne\nf\n\`\`\`\n:::\n`,
  );
  assert.equal(cell!.starter, 'a\nb');
  assert.equal(cell!.tests, 'c\nd');
  assert.equal(cell!.solution, 'e\nf');
});

test('hints are trimmed', () => {
  const [cell] = cellsOf(
    `${HEADER}:::cell id=a\n\`\`\`hint\n\n  Use a loop.  \n\n\`\`\`\n\`\`\`python starter\nx\n\`\`\`\n:::\n`,
  );
  assert.deepEqual(cell!.hints, ['Use a loop.']);
});

test('fences with extra words or other languages are prompt text, not cell parts', () => {
  const prompt = (info: string) =>
    cellsOf(
      `${HEADER}:::cell id=a\n\`\`\`${info}\nfoo\n\`\`\`\n\`\`\`python starter\nx\n\`\`\`\n:::\n`,
    )[0]!;
  assert.deepEqual(prompt('hint extra').hints, []);
  assert.match(prompt('hint extra').prompt, /hint extra/);
  assert.match(prompt('js starter').prompt, /js starter/);
  assert.match(prompt('python starter extra').prompt, /python starter extra/);
  assert.equal(prompt('python starter extra').starter, 'x');
});

test('a bare code fence in a prompt stays intact', () => {
  const [cell] = cellsOf(
    `${HEADER}:::cell id=a\n\`\`\`\nplain\n\`\`\`\n\`\`\`python starter\nx\n\`\`\`\n:::\n`,
  );
  assert.equal(cell!.prompt, '```\nplain\n```');
});

test('a line ending in backticks does not close a code block early', () => {
  const [cell] = cellsOf(
    `${HEADER}:::cell id=a\n\`\`\`python starter\nnote\`\`\`\nx\n\`\`\`\n:::\n`,
  );
  assert.equal(cell!.starter, 'note```\nx');
});

test('a missing starter is reported', () => {
  rejects(`${HEADER}:::cell id=a\nJust text\n:::\n`, 6, /needs a "python starter"/);
});

test('rendered blocks and hints are separated by line breaks', () => {
  const lesson: Lesson = {
    id: 'd',
    title: 'T',
    section: 1,
    blocks: [
      { type: 'markdown', text: 'First' },
      { type: 'cell', id: 'c', kind: 'sandbox', prompt: '', starter: 'x', hints: ['a', 'b'] },
    ],
  };
  const html = renderLesson(lesson);
  assert.ok(html.includes('</p>\n\n<section class="cell sandbox" data-cell-id="c">\n\n<textarea'));
  assert.ok(html.includes('</details>\n<details>'));
});

test('a broken lesson keeps the original error as its cause', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lessons-'));
  writeFileSync(join(dir, 'bad.md'), 'nope');
  assert.throws(
    () => loadLessons(dir),
    (error: unknown) => error instanceof Error && error.cause instanceof LessonError,
  );
});

test('lessons are returned in sorted path order', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lessons-'));
  for (const name of ['c.md', 'a.md', 'b.md']) {
    writeFileSync(join(dir, name), `---\nid: ${name}\ntitle: t\nsection: 1\n---\n`);
  }
  assert.deepEqual(
    loadLessons(dir).map(({ lesson }) => lesson.id),
    ['a.md', 'b.md', 'c.md'],
  );
});

function withInterpreter(interpreter: string, run: () => void) {
  const saved = process.env['PYTHON'];
  process.env['PYTHON'] = interpreter;
  try {
    run();
  } finally {
    if (saved === undefined) delete process.env['PYTHON'];
    else process.env['PYTHON'] = saved;
  }
}

test('a missing interpreter is reported with the reason', () => {
  withInterpreter('no-such-interpreter-xyz', () =>
    assert.throws(() => pythonRunner.syntax('x'), /python harness failed: .*ENOENT/),
  );
});

test('an interpreter that fails reports its stderr', () => {
  withInterpreter('node', () =>
    assert.throws(() => pythonRunner.exercise('x', 'y'), /python harness failed: .*bad option/),
  );
});

test('the real runner dispatches syntax and exercise requests differently', () => {
  assert.equal(pythonRunner.syntax('x = 1').stdout, undefined);
  assert.equal(pythonRunner.exercise('print(1)', 'pass').stdout, '1\n');
});
