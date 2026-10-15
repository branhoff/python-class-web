import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { loadLessons } from '../src/lessons/load.ts';

function lessonSource(id: string) {
  return `---\nid: ${id}\ntitle: ${id}\nsection: 1\n---\nBody\n`;
}

test('loads markdown lessons from nested folders, in path order', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lessons-'));
  mkdirSync(join(dir, 'b'));
  mkdirSync(join(dir, 'a'));
  writeFileSync(join(dir, 'b', 'two.md'), lessonSource('two'));
  writeFileSync(join(dir, 'a', 'one.md'), lessonSource('one'));
  writeFileSync(join(dir, 'notes.txt'), 'ignored');
  const loaded = loadLessons(dir);
  assert.deepEqual(
    loaded.map(({ lesson }) => lesson.id),
    ['one', 'two'],
  );
  assert.equal(loaded[0]!.path, join(dir, 'a', 'one.md'));
});

test('only .md files load, and they come back sorted whatever order they were written in', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lessons-'));
  for (const id of ['m', 'z', 'a', 'k']) writeFileSync(join(dir, `${id}.md`), lessonSource(id));
  writeFileSync(join(dir, 'md'), 'not a lesson');
  writeFileSync(join(dir, 'x.mdx'), 'not a lesson');
  writeFileSync(join(dir, 'notes.md.bak'), 'not a lesson');
  writeFileSync(join(dir, 'README.txt'), 'not a lesson');
  assert.deepEqual(
    loadLessons(dir).map(({ lesson }) => lesson.id),
    ['a', 'k', 'm', 'z'],
  );
});

test('a broken lesson names its file and line', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lessons-'));
  writeFileSync(join(dir, 'bad.md'), 'no front matter');
  assert.throws(() => loadLessons(dir), /bad\.md: line 1: lesson must start with/);
});

test('a non-error throw is still reported', () => {
  assert.throws(() => loadLessons(join(tmpdir(), 'does-not-exist-lessons')), /ENOENT/);
});
