import type { ProgressEvent } from './repository/repository.ts';

export interface Progress {
  completedCells: string[];
}

export function deriveProgress(events: ProgressEvent[]): Progress {
  const completed = new Set(
    events.filter((event) => event.kind === 'completed').map((event) => event.cellId),
  );
  return { completedCells: [...completed].sort() };
}
