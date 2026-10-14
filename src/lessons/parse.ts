import { parseFrontMatter } from './front-matter.ts';
import { parseCell } from './parse-cell.ts';
import { LessonError, type Block, type Lesson } from './types.ts';

const CELL_OPEN = /^:::cell(?:\s+(.*))?$/;
const CELL_CLOSE = /^:::\s*$/;
const FENCE = /^```/;

function findCellEnd(lines: string[], start: number): number {
  let inFence = false;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]!;
    if (FENCE.test(line)) inFence = !inFence;
    if (inFence) continue;
    if (CELL_CLOSE.test(line)) return i;
    if (CELL_OPEN.test(line)) {
      throw new LessonError('cells cannot be nested; close the previous cell with :::', i + 1);
    }
  }
  throw new LessonError('cell is never closed with :::', start + 1);
}

function requireField(fields: Map<string, string>, name: string): string {
  const value = fields.get(name);
  if (!value) {
    throw new LessonError(`front matter is missing "${name}"`, 1);
  }
  return value;
}

export function parseLesson(source: string): Lesson {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const { fields, bodyStart } = parseFrontMatter(lines);
  const section = Number(requireField(fields, 'section'));
  if (!Number.isInteger(section) || section < 1) {
    throw new LessonError('front matter "section" must be a positive integer', 1);
  }

  const blocks: Block[] = [];
  const cellIds = new Set<string>();
  let markdown: string[] = [];
  let inFence = false;
  const flush = () => {
    const text = markdown.join('\n').trim();
    if (text) blocks.push({ type: 'markdown', text });
    markdown = [];
  };

  for (let i = bodyStart; i < lines.length; i++) {
    const line = lines[i]!;
    if (FENCE.test(line)) inFence = !inFence;
    const open = inFence ? null : CELL_OPEN.exec(line);
    if (!open) {
      markdown.push(line);
      continue;
    }
    flush();
    const end = findCellEnd(lines, i);
    const cell = parseCell(lines.slice(i + 1, end), i + 1, open[1] ?? '');
    if (cellIds.has(cell.id)) {
      throw new LessonError(`duplicate cell id "${cell.id}"`, i + 1);
    }
    cellIds.add(cell.id);
    blocks.push(cell);
    i = end;
  }
  if (inFence) {
    throw new LessonError('a code block is never closed', lines.length);
  }
  flush();

  return { id: requireField(fields, 'id'), title: requireField(fields, 'title'), section, blocks };
}
