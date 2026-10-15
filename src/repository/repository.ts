export type ProgressEventKind = 'attempt' | 'completed' | 'reopened';

export interface ProgressEvent {
  cellId: string;
  kind: ProgressEventKind;
  at: number;
}

export interface ProgressRepository {
  appendEvent(userId: string, event: ProgressEvent): Promise<void>;
  listEvents(userId: string): Promise<ProgressEvent[]>;
}
