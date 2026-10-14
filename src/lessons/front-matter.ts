import { LessonError } from './types.ts';

export interface FrontMatter {
  fields: Map<string, string>;
  bodyStart: number;
}

export function parseFrontMatter(lines: string[]): FrontMatter {
  if (lines[0]!.trim() !== '---') {
    throw new LessonError('lesson must start with a --- front matter block', 1);
  }
  const fields = new Map<string, string>();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    if (line.trim() === '---') {
      return { fields, bodyStart: i + 1 };
    }
    if (line.trim() === '') continue;
    const match = /^([a-z]+):(.*)$/.exec(line);
    if (!match) {
      throw new LessonError(`bad front matter line: "${line}"`, i + 1);
    }
    fields.set(match[1]!, match[2]!.trim());
  }
  throw new LessonError('front matter is never closed with ---', lines.length);
}
