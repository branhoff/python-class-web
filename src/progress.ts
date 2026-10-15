import type { ProgressEvent } from './repository/repository.ts';

export interface Progress {
  completedCells: string[];
  lastCompletedCell: string | null;
}

export function deriveProgress(events: ProgressEvent[]): Progress {
  const done = new Set<string>();
  let lastCompletedCell: string | null = null;
  for (const event of events) {
    if (event.kind === 'completed') {
      done.add(event.cellId);
      lastCompletedCell = event.cellId;
    } else if (event.kind === 'reopened') {
      done.delete(event.cellId);
    }
  }
  return { completedCells: [...done].sort(), lastCompletedCell };
}
