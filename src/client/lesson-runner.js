/* Browser-only glue: boots Pyodide, then runs each cell's code (and tests, for
   exercises) through the shared harness.py so grading matches the CLI checker.
   Not imported by the TS graph; served to the page by the lesson site.
   formatResult is the one piece of real logic and is unit-tested. */

// A sandbox cell has no tests, so it has nothing to pass — it only shows output.
// Only an exercise (hasTests) earns a pass/fail verdict.
export function formatResult(result, hasTests) {
  const lines = [];
  if (result.stdout) lines.push(result.stdout.replace(/\n$/, ''));
  if (!result.ok) {
    lines.push(`✗ ${result.message ?? 'Something went wrong.'}`);
    return { state: 'fail', text: lines.join('\n') };
  }
  if (hasTests) {
    lines.push('✓ Passed');
    return { state: 'pass', text: lines.join('\n') };
  }
  if (!result.stdout) lines.push('(ran with no output)');
  return { state: 'ran', text: lines.join('\n') };
}

const GLUE = `
import json

_harness = {"__name__": "harness"}

def _load(src):
    exec(compile(src, "harness.py", "exec"), _harness)

def _run(code, tests):
    return json.dumps(_harness["run_exercise"](code, tests))
`;

function show(cell, result, hasTests) {
  const output = cell.querySelector('.output');
  const { state, text } = formatResult(result, hasTests);
  output.hidden = false;
  output.classList.toggle('pass', state === 'pass');
  output.classList.toggle('fail', state === 'fail');
  output.textContent = text;
}

function runCell(pyodide, button) {
  const cell = button.closest('.cell');
  const hasTests = cell.dataset.tests !== undefined;
  pyodide.globals.set('code', cell.querySelector('textarea').value);
  pyodide.globals.set('tests', cell.dataset.tests ?? '');
  let result;
  try {
    result = JSON.parse(pyodide.runPython('_run(code, tests)'));
  } catch (error) {
    result = { ok: false, message: String(error) };
  }
  show(cell, result, hasTests);
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

if (typeof document !== 'undefined') main();
