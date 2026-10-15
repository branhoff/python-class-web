/* Browser-only controller for the Python web worker. It starts the worker, runs
   one program at a time, streams its output, hands typed input to a waiting
   input() call, and stops a program that runs too long or that the learner
   stops: first by asking Python to raise KeyboardInterrupt, then, if that does
   not take effect, by ending the worker and starting a fresh one. The worker,
   timers and clock are injected so the logic is unit-tested in Node. */

export const INPUT_CAPACITY = 1 << 16;
export const RUN_LIMIT_MS = 10_000;
export const STOP_GRACE_MS = 1_500;

const SIGINT = 2;
const HEADER_BYTES = 8;
const LINE_READY = 1;
const INPUT_CANCELLED = 2;

export function pythonSupport(env = globalThis) {
  if (typeof env.SharedArrayBuffer === 'undefined' || !env.crossOriginIsolated) {
    return {
      ok: false,
      reason:
        'This page cannot run Python in your browser because it is not cross-origin isolated. Reload the page; if that does not help, try a current version of Chrome, Firefox or Safari.',
    };
  }
  return { ok: true, reason: '' };
}

export function createPythonRunner({
  spawn,
  harness,
  limitMs = RUN_LIMIT_MS,
  graceMs = STOP_GRACE_MS,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  now = Date.now,
}) {
  const listeners = new Set();
  let state = 'loading';
  let worker = null;
  let interrupt = null;
  let ctrl = null;
  let data = null;
  let current = null;
  let nextId = 0;

  const stopMessages = {
    stopped: 'Stopped.',
    timeout: `Your code ran for more than ${limitMs / 1000} seconds, so it was stopped. If it has a loop, check that something inside the loop changes so the loop can end.`,
  };

  function setState(next) {
    state = next;
    for (const listener of listeners) listener(next);
  }

  function start() {
    interrupt = new SharedArrayBuffer(4);
    const io = new SharedArrayBuffer(HEADER_BYTES + INPUT_CAPACITY);
    ctrl = new Int32Array(io);
    data = new Uint8Array(io, HEADER_BYTES);
    const mine = spawn();
    worker = mine;
    mine.onmessage = (event) => handle(mine, event.data);
    mine.onerror = () => crashed(mine);
    mine.postMessage({ type: 'init', interrupt, io, harness });
    setState('loading');
  }

  function startClock() {
    current.startedAt = now();
    current.clock = setTimer(() => {
      current.stopReason ??= 'timeout';
      interruptNow();
    }, current.budget);
  }

  function pauseClock() {
    clearTimer(current.clock);
    current.budget -= now() - current.startedAt;
  }

  function settle(result) {
    const run = current;
    clearTimer(run.clock);
    clearTimer(run.grace);
    current = null;
    const stopped = run.stopReason && !result.ok;
    run.resolve(stopped ? { ...result, message: stopMessages[run.stopReason] } : result);
  }

  function interruptNow() {
    clearTimer(current.clock);
    if (current.waiting) {
      Atomics.store(ctrl, 0, INPUT_CANCELLED);
      Atomics.notify(ctrl, 0);
    }
    Atomics.store(new Int32Array(interrupt), 0, SIGINT);
    current.grace = setTimer(endWorker, graceMs);
  }

  function endWorker() {
    worker.terminate();
    settle({ ok: false, stdout: current.output });
    start();
  }

  function crashed(source) {
    if (source !== worker) return;
    if (current) {
      settle({
        ok: false,
        stdout: current.output,
        message: 'Python stopped unexpectedly. Reload the page to try again.',
      });
    }
    setState('unavailable');
  }

  function handle(source, message) {
    if (source !== worker) return;
    if (message.type === 'ready') setState('ready');
    else if (message.type === 'fatal') setState('unavailable');
    else if (!current || message.id !== current.id) return;
    else if (message.type === 'output') {
      current.output += message.text;
      current.onOutput(message.text);
    } else if (message.type === 'input-request') {
      pauseClock();
      current.waiting = true;
      current.onInputRequest();
    } else if (message.type === 'result') {
      settle(message.result);
      setState('ready');
    }
  }

  function run({ code, tests }, { onOutput, onInputRequest }) {
    if (state !== 'ready') return Promise.reject(new Error('Python is not ready to run code.'));
    return new Promise((resolve) => {
      nextId += 1;
      current = {
        id: nextId,
        resolve,
        onOutput,
        onInputRequest,
        output: '',
        budget: limitMs,
        waiting: false,
        stopReason: null,
      };
      Atomics.store(new Int32Array(interrupt), 0, 0);
      setState('running');
      startClock();
      worker.postMessage({ type: 'run', id: current.id, code, tests });
    });
  }

  function provideInput(line) {
    if (!current || !current.waiting) return;
    const bytes = new TextEncoder().encode(line).subarray(0, INPUT_CAPACITY - 1);
    data.set(bytes);
    ctrl[1] = bytes.length;
    current.waiting = false;
    startClock();
    Atomics.store(ctrl, 0, LINE_READY);
    Atomics.notify(ctrl, 0);
  }

  function stop() {
    if (!current || current.grace) return;
    current.stopReason ??= 'stopped';
    interruptNow();
  }

  function onState(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  start();
  return {
    run,
    provideInput,
    stop,
    onState,
    get state() {
      return state;
    },
  };
}
