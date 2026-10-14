import { LessonError, type Cell, type CellKind } from './types.ts';

const ROLES = ['starter', 'tests', 'solution'] as const;
type Role = (typeof ROLES)[number];

const FENCE_OPEN = /^```(.*)$/;
const FENCE_CLOSE = /^```\s*$/;

function isRole(word: string): word is Role {
  return (ROLES as readonly string[]).includes(word);
}

function parseAttributes(text: string, line: number): { id: string; kind: CellKind } {
  const attributes = new Map<string, string>();
  for (const token of text.split(/\s+/).filter(Boolean)) {
    const [key, value] = token.split('=');
    if ((key !== 'id' && key !== 'kind') || !value) {
      throw new LessonError(`bad cell attribute "${token}" (use id=... kind=...)`, line);
    }
    attributes.set(key, value);
  }
  const id = attributes.get('id');
  if (!id || !/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new LessonError('cell needs an id made of lowercase letters, digits and dashes', line);
  }
  const kind = attributes.get('kind') ?? 'sandbox';
  if (kind !== 'sandbox' && kind !== 'exercise') {
    throw new LessonError(`unknown cell kind "${kind}"`, line);
  }
  return { id, kind };
}

function requireParts(cell: Cell, roles: Map<Role, string>, line: number): void {
  const hasExtras = roles.has('tests') || roles.has('solution');
  if (cell.kind === 'sandbox' && hasExtras) {
    throw new LessonError(`sandbox cell "${cell.id}" cannot have tests or a solution`, line);
  }
  if (cell.kind === 'exercise' && !(roles.has('tests') && roles.has('solution'))) {
    throw new LessonError(`exercise "${cell.id}" needs "python tests" and "python solution"`, line);
  }
}

export function parseCell(body: string[], openLine: number, attributeText: string): Cell {
  const { id, kind } = parseAttributes(attributeText, openLine);
  const roles = new Map<Role, string>();
  const hints: string[] = [];
  const prompt: string[] = [];

  for (let i = 0; i < body.length; i++) {
    const fence = FENCE_OPEN.exec(body[i]!);
    if (!fence) {
      prompt.push(body[i]!);
      continue;
    }
    const line = openLine + 1 + i;
    const close = body.findIndex((text, j) => j > i && FENCE_CLOSE.test(text));
    if (close === -1) {
      throw new LessonError('code block is never closed', line);
    }
    const content = body.slice(i + 1, close).join('\n');
    const words = fence[1]!.trim().split(/\s+/);
    const role = words[1] ?? '';
    if (words.length === 1 && words[0] === 'hint') {
      hints.push(content.trim());
    } else if (words.length === 2 && words[0] === 'python' && isRole(role)) {
      if (roles.has(role)) {
        throw new LessonError(`cell "${id}" has two "python ${role}" blocks`, line);
      }
      roles.set(role, content);
    } else {
      prompt.push(...body.slice(i, close + 1));
    }
    i = close;
  }

  const starter = roles.get('starter');
  if (starter === undefined) {
    throw new LessonError(`cell "${id}" needs a "python starter" block`, openLine);
  }
  const cell: Cell = { type: 'cell', id, kind, prompt: prompt.join('\n').trim(), starter, hints };
  requireParts(cell, roles, openLine);
  if (roles.has('tests')) cell.tests = roles.get('tests')!;
  if (roles.has('solution')) cell.solution = roles.get('solution')!;
  return cell;
}
