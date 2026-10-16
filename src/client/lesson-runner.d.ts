export interface RunResult {
  ok: boolean;
  message?: string;
  stdout?: string;
}

export function formatResult(
  result: RunResult,
  hasTests: boolean,
): { state: 'pass' | 'fail' | 'ran'; text: string };

export function verdictOf(
  result: RunResult,
  hasTests: boolean,
): { state: 'pass' | 'fail' | 'ran'; lines: string[] };

export function countsTowardProgress(cell: {
  classList: { contains(name: string): boolean };
}): boolean;
