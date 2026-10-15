export const INPUT_CAPACITY: number;
export const RUN_LIMIT_MS: number;
export const STOP_GRACE_MS: number;

export interface WorkerMessage {
  type: string;
  id?: number;
  text?: string;
  result?: RunResult;
}

export interface WorkerLike {
  postMessage(message: unknown): void;
  terminate(): void;
  onmessage: ((event: { data: WorkerMessage }) => void) | null;
  onerror: ((event: unknown) => void) | null;
}

export interface RunResult {
  ok: boolean;
  message?: string;
  stdout?: string;
}

export type RunnerState = 'loading' | 'ready' | 'running' | 'unavailable';

export interface PythonRunner {
  readonly state: RunnerState;
  run(
    job: { code: string; tests: string },
    handlers: { onOutput(text: string): void; onInputRequest(): void },
  ): Promise<RunResult>;
  provideInput(line: string): void;
  stop(): void;
  onState(listener: (state: RunnerState) => void): () => void;
}

export function pythonSupport(env?: {
  SharedArrayBuffer?: unknown;
  crossOriginIsolated?: boolean;
}): { ok: boolean; reason: string };

export function createPythonRunner(options: {
  spawn: () => WorkerLike;
  harness: string;
  limitMs?: number;
  graceMs?: number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (handle: unknown) => void;
  now?: () => number;
}): PythonRunner;
