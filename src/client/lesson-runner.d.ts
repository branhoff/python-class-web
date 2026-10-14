export interface RunResult {
  ok: boolean;
  message?: string;
  stdout?: string;
}

export function formatResult(
  result: RunResult,
  hasTests: boolean,
): { state: 'pass' | 'fail' | 'ran'; text: string };
