export interface ContinuePage {
  id: string;
  title: string;
  project: boolean;
  itemIds: string[];
}

export interface ContinueTarget {
  page: ContinuePage;
  reason: 'resume' | 'next';
}

export function continueTarget(input: {
  pages: ContinuePage[];
  lastId: string | null;
  completed: Set<string>;
  lastCompletedCell: string | null;
}): ContinueTarget | null;

export function continueLabel(target: ContinueTarget): string;

export function storageKey(user: string | null | undefined): string;
