import {
  createPythonRunner,
  type WorkerLike,
  type WorkerMessage,
} from '../src/client/py-runner.js';

export class FakeWorker implements WorkerLike {
  sent: Record<string, unknown>[] = [];
  terminated = false;
  onmessage: ((event: { data: WorkerMessage }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  postMessage(message: unknown) {
    this.sent.push(message as Record<string, unknown>);
  }
  terminate() {
    this.terminated = true;
  }
  reply(data: WorkerMessage) {
    this.onmessage?.({ data });
  }
}

export function setup(options: { limitMs?: number; graceMs?: number } = {}) {
  const workers: FakeWorker[] = [];
  let clock = 0;
  const timers: { id: number; at: number; fn: () => void }[] = [];
  let nextTimer = 0;
  const runner = createPythonRunner({
    spawn: () => {
      const worker = new FakeWorker();
      workers.push(worker);
      return worker;
    },
    harness: 'HARNESS SOURCE',
    limitMs: options.limitMs ?? 10_000,
    graceMs: options.graceMs ?? 1_500,
    now: () => clock,
    setTimer: (fn, ms) => {
      timers.push({ id: ++nextTimer, at: clock + ms, fn });
      return nextTimer;
    },
    clearTimer: (id) => {
      const index = timers.findIndex((timer) => timer.id === id);
      if (index >= 0) timers.splice(index, 1);
    },
  });
  const advance = (ms: number) => {
    const target = clock + ms;
    for (;;) {
      const due = timers.filter((timer) => timer.at <= target).sort((a, b) => a.at - b.at)[0];
      if (!due) break;
      timers.splice(timers.indexOf(due), 1);
      clock = due.at;
      due.fn();
    }
    clock = target;
  };
  const states: string[] = [];
  runner.onState((state) => states.push(state));
  const first = () => workers[workers.length - 1]!;
  const ready = () => first().reply({ type: 'ready' });
  const outputs: string[] = [];
  let inputRequests = 0;
  const handlers = {
    onOutput: (text: string) => outputs.push(text),
    onInputRequest: () => (inputRequests += 1),
  };
  const interruptOf = () => new Int32Array(first().sent[0]!['interrupt'] as SharedArrayBuffer);
  const ioOf = () => new Int32Array(first().sent[0]!['io'] as SharedArrayBuffer);
  return {
    runner,
    workers,
    advance,
    states,
    first,
    ready,
    outputs,
    handlers,
    interruptOf,
    ioOf,
    requests: () => inputRequests,
  };
}
