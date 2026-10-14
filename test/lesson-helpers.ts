import assert from 'node:assert/strict';
import { parseLesson } from '../src/lessons/parse.ts';
import { LessonError, type Cell } from '../src/lessons/types.ts';

export const HEADER = '---\nid: demo\ntitle: Demo\nsection: 2\n---\n';

export function cellsOf(source: string): Cell[] {
  return parseLesson(source).blocks.filter((block): block is Cell => block.type === 'cell');
}

export function rejects(source: string, line: number, pattern: RegExp) {
  assert.throws(
    () => parseLesson(source),
    (error: unknown) =>
      error instanceof LessonError && error.line === line && pattern.test(error.message),
  );
}
