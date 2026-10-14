/* Browser-only glue: boots Pyodide, then runs each cell's code (and tests, for
   exercises) through the shared harness.py so grading matches the CLI checker.
   Not imported by the TS graph; served to the page by the lesson site. */

const GLUE = `
import json

_harness = {"__name__": "harness"}

def _load(src):
    exec(compile(src, "harness.py", "exec"), _harness)

def _run(code, tests):
    return json.dumps(_harness["run_exercise"](code, tests))
`;

function show(cell, result) {
  const output = cell.querySelector('.output');
  output.hidden = false;
  output.classList.toggle('pass', result.ok);
  output.classList.toggle('fail', !result.ok);
  const lines = [];
  if (result.stdout) lines.push(result.stdout.replace(/\n$/, ''));
  lines.push(result.ok ? '✓ Passed' : `✗ ${result.message ?? 'Something went wrong.'}`);
  output.textContent = lines.join('\n');
}

function runCell(pyodide, button) {
  const cell = button.closest('.cell');
  pyodide.globals.set('code', cell.querySelector('textarea').value);
  pyodide.globals.set('tests', cell.dataset.tests ?? '');
  let result;
  try {
    result = JSON.parse(pyodide.runPython('_run(code, tests)'));
  } catch (error) {
    result = { ok: false, message: String(error) };
  }
  show(cell, result);
}

async function main() {
  const buttons = [...document.querySelectorAll('button.run')];
  let pyodide;
  try {
    pyodide = await loadPyodide({ indexURL: '/pyodide/' });
    pyodide.runPython(GLUE);
    pyodide.globals.set('harness_src', await (await fetch('/static/harness.py')).text());
    pyodide.runPython('_load(harness_src)');
  } catch {
    for (const button of buttons) button.textContent = 'Python unavailable';
    return;
  }
  for (const button of buttons) {
    button.disabled = false;
    button.textContent = 'Run';
    button.addEventListener('click', () => runCell(pyodide, button));
  }
}

main();
