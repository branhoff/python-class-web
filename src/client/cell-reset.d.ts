export interface ResetState {
  value: string;
  original: string;
  undoValue: string | null;
}

export function resetControl(state: ResetState): { label: string; disabled: boolean };

export function pressReset(state: ResetState): { value: string; undoValue: string | null };
