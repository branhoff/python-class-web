export function lessonDone(exerciseIds: string[], completed: Set<string>): boolean;

export function sectionCount(
  lessons: string[][],
  completed: Set<string>,
): { done: number; total: number };

export function parseExercises(attribute: string | undefined): string[];
