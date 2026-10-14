import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseLesson } from './parse.ts';
import type { Lesson } from './types.ts';

export interface LoadedLesson {
  path: string;
  lesson: Lesson;
}

export function loadLessons(directory: string): LoadedLesson[] {
  return readdirSync(directory, { recursive: true, encoding: 'utf8' })
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const path = join(directory, name);
      try {
        return { path, lesson: parseLesson(readFileSync(path, 'utf8')) };
      } catch (error) {
        throw new Error(`${path}: ${error instanceof Error ? error.message : String(error)}`, {
          cause: error,
        });
      }
    });
}
