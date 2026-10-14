import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HARNESS = fileURLToPath(new URL('./harness.py', import.meta.url));

interface RunResult {
  ok: boolean;
  stage?: 'code' | 'tests';
  message?: string;
  stdout?: string;
}

export interface PythonRunner {
  syntax(code: string): RunResult;
  exercise(code: string, tests: string): RunResult;
}

function callHarness(request: object): RunResult {
  const interpreter = process.env['PYTHON'] ?? 'python3';
  const child = spawnSync(interpreter, ['-I', HARNESS], {
    input: JSON.stringify(request),
    timeout: 10_000,
  });
  if (child.error || child.status !== 0) {
    throw new Error(`python harness failed: ${child.error?.message ?? child.stderr.toString()}`);
  }
  return JSON.parse(child.stdout.toString()) as RunResult;
}

export const pythonRunner: PythonRunner = {
  syntax: (code) => callHarness({ action: 'syntax', code }),
  exercise: (code, tests) => callHarness({ action: 'exercise', code, tests }),
};
