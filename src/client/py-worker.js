/* Browser-only: the web worker that runs learner Python, so a loop that never
   ends cannot freeze the page. Output is streamed back as it is printed. When
   the program calls input(), the worker asks the page for a line and waits on
   shared memory until it arrives. The page can also interrupt a running program
   through a shared interrupt flag. See py-runner.js for the page side. */

import { loadPyodide } from '/pyodide/pyodide.mjs';

const HEADER_BYTES = 8;
const LINE_READY = 1;

const GLUE = `
import json

_harness = {"__name__": "harness"}

def _load(src):
    exec(compile(src, "harness.py", "exec"), _harness)

def _run(code, tests, emit):
    return json.dumps(_harness["run_exercise"](code, tests, emit))
`;

let pyodide = null;
let ctrl = null;
let data = null;
let runId = 0;

function readLine() {
  Atomics.store(ctrl, 0, 0);
  self.postMessage({ type: 'input-request', id: runId });
  Atomics.wait(ctrl, 0, 0);
  if (Atomics.load(ctrl, 0) !== LINE_READY) return null;
  return new TextDecoder().decode(data.slice(0, ctrl[1])) + '\n';
}

async function init(message) {
  try {
    pyodide = await loadPyodide({ indexURL: '/pyodide/' });
    pyodide.setInterruptBuffer(new Int32Array(message.interrupt));
    ctrl = new Int32Array(message.io);
    data = new Uint8Array(message.io, HEADER_BYTES);
    pyodide.setStdin({ stdin: readLine });
    pyodide.globals.set('_emit', (text) => self.postMessage({ type: 'output', id: runId, text }));
    pyodide.globals.set('harness_src', message.harness);
    pyodide.runPython(GLUE);
    pyodide.runPython('_load(harness_src)');
    self.postMessage({ type: 'ready' });
  } catch (error) {
    self.postMessage({ type: 'fatal', message: String(error) });
  }
}

function run(message) {
  runId = message.id;
  pyodide.globals.set('code', message.code);
  pyodide.globals.set('tests', message.tests);
  let result;
  try {
    result = JSON.parse(pyodide.runPython('_run(code, tests, _emit)'));
  } catch (error) {
    result = { ok: false, message: String(error) };
  }
  self.postMessage({ type: 'result', id: runId, result });
}

self.onmessage = (event) => {
  if (event.data.type === 'init') init(event.data);
  else if (event.data.type === 'run') run(event.data);
};
