export type CellKind = 'sandbox' | 'exercise';

interface MarkdownBlock {
  type: 'markdown';
  text: string;
}

export interface Cell {
  type: 'cell';
  id: string;
  kind: CellKind;
  prompt: string;
  starter: string;
  tests?: string;
  solution?: string;
  hints: string[];
}

export type Block = MarkdownBlock | Cell;

export interface Lesson {
  id: string;
  title: string;
  section: number;
  after?: string;
  blocks: Block[];
}

export class LessonError extends Error {
  readonly line: number;

  constructor(message: string, line: number) {
    super(`line ${line}: ${message}`);
    this.line = line;
  }
}
