export function lessonDone(itemIds: string[], completed: Set<string>): boolean;

export function sectionCount(
  lessons: string[][],
  completed: Set<string>,
): { done: number; total: number };

export function parseItems(attribute: string | undefined): string[];
