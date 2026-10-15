/* Browser-only glue: runs each cell's code (and tests, for exercises) in a web
   worker through the shared harness.py, so grading matches the CLI checker and
   a loop that never ends cannot freeze the page. Output streams into the cell,
   input() shows an inline box, and Stop interrupts the program. The run logic is
   in py-runner.js. formatResult and verdictOf are unit-tested. */

import { authHeader } from './app-shell.js';
import { pressReset, resetControl } from './cell-reset.js';
import { createPythonRunner, pythonSupport } from './py-runner.js';

// A sandbox cell has no tests, so it has nothing to pass; it only shows output.
// Only an exercise (hasTests) earns a pass/fail verdict.
export function verdictOf(result, hasTests) {
  if (!result.ok) {
    return { state: 'fail', lines: [`✗ ${result.message ?? 'Something went wrong.'}`] };
  }
  if (hasTests) return { state: 'pass', lines: ['✓ Passed'] };
  return { state: 'ran', lines: result.stdout ? [] : ['(ran with no output)'] };
}

export function formatResult(result, hasTests) {
  const { state, lines } = verdictOf(result, hasTests);
  const shown = result.stdout ? [result.stdout.replace(/\n$/, ''), ...lines] : lines;
  return { state, text: shown.join('\n') };
}

function showVerdict(cell, state, lines) {
  const output = cell.querySelector('.output');
  output.hidden = false;
  output.classList.toggle('pass', state === 'pass');
  output.classList.toggle('fail', state === 'fail');
  const text = output.textContent;
  const gap = text === '' || text.endsWith('\n') ? '' : '\n';
  const verdict = document.createElement('span');
  verdict.className = `verdict ${state}`;
  verdict.textContent = lines.join('\n');
  output.append(gap, verdict);
}

function markCompleted(cell) {
  cell.classList.add('completed');
  if (cell.querySelector('.badge')) return;
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = '✓ completed';
  cell.querySelector('button.run').after(badge);
}

// Best-effort: a signed-out learner (401) or offline should not break the
// lesson, so progress is fire-and-forget with the auth token when present.
async function recordCompletion(cellId) {
  try {
    await fetch('/progress/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({ cellId, kind: 'completed' }),
    });
  } catch {
    // best-effort
  }
}

async function loadProgress() {
  try {
    const res = await fetch('/progress/summary', { headers: await authHeader() });
    if (!res.ok) return;
    const summary = await res.json();
    for (const id of summary.completedCells ?? []) {
      const cell = document.querySelector(`[data-cell-id="${id}"]`);
      if (cell) markCompleted(cell);
    }
  } catch {
    // best-effort: no restored progress when unauthenticated or offline
  }
}

function setupReset(cell) {
  const editor = cell.querySelector('textarea');
  const button = cell.querySelector('button.reset');
  const original = editor.defaultValue;
  let undoValue = null;
  const paint = () => {
    const control = resetControl({ value: editor.value, original, undoValue });
    button.textContent = control.label;
    button.disabled = control.disabled || cell.classList.contains('running');
  };
  editor.addEventListener('input', () => {
    undoValue = null;
    paint();
  });
  button.addEventListener('click', () => {
    const next = pressReset({ value: editor.value, original, undoValue });
    editor.value = next.value;
    undoValue = next.undoValue;
    paint();
    editor.focus();
  });
  cell.addEventListener('cell-state', paint);
  paint();
}

function setRunning(cell, running) {
  cell.classList.toggle('running', running);
  cell.dispatchEvent(new CustomEvent('cell-state'));
}

async function runCell(runner, button) {
  const cell = button.closest('.cell');
  const output = cell.querySelector('.output');
  const stdin = cell.querySelector('form.stdin');
  const stop = cell.querySelector('button.stop');
  const hasTests = cell.dataset.tests !== undefined;
  const send = (event) => {
    event.preventDefault();
    const line = stdin.elements.line.value;
    stdin.elements.line.value = '';
    stdin.hidden = true;
    output.textContent += `${line}\n`;
    runner.provideInput(line);
  };

  output.hidden = false;
  output.textContent = '';
  output.classList.remove('pass', 'fail');
  stop.hidden = false;
  stop.onclick = () => runner.stop();
  stdin.addEventListener('submit', send);
  button.textContent = 'Running…';
  setRunning(cell, true);

  let result;
  try {
    result = await runner.run(
      { code: cell.querySelector('textarea').value, tests: cell.dataset.tests ?? '' },
      {
        onOutput: (text) => {
          output.textContent += text;
        },
        onInputRequest: () => {
          stdin.hidden = false;
          stdin.elements.line.focus();
        },
      },
    );
  } catch (error) {
    result = { ok: false, message: String(error.message ?? error) };
  }

  stdin.removeEventListener('submit', send);
  stdin.hidden = true;
  stop.hidden = true;
  setRunning(cell, false);
  const { state, lines } = verdictOf(result, hasTests);
  showVerdict(cell, state, lines);
  if (state === 'pass') {
    markCompleted(cell);
    recordCompletion(cell.dataset.cellId);
    document.dispatchEvent(
      new CustomEvent('item-done', { detail: { id: cell.dataset.cellId, done: true } }),
    );
  }
}

const BUTTON_TEXT = { loading: 'Loading Python…', ready: 'Run', unavailable: 'Python unavailable' };

function paintButtons(buttons, state) {
  for (const button of buttons) {
    button.disabled = state !== 'ready';
    if (state !== 'running') button.textContent = BUTTON_TEXT[state];
  }
}

function explainUnavailable(buttons, reason) {
  paintButtons(buttons, 'unavailable');
  const notice = document.createElement('p');
  notice.className = 'notice-error';
  notice.setAttribute('role', 'alert');
  notice.textContent = reason;
  document.querySelector('h1')?.after(notice);
}

async function startRunner(buttons) {
  const support = pythonSupport();
  if (!support.ok) return explainUnavailable(buttons, support.reason);
  let runner;
  try {
    const harness = await (await fetch('/static/harness.py')).text();
    runner = createPythonRunner({
      spawn: () => new Worker('/static/py-worker.js', { type: 'module' }),
      harness,
    });
  } catch {
    return explainUnavailable(buttons, 'Python could not be loaded. Reload the page to try again.');
  }
  runner.onState((state) => paintButtons(buttons, state));
  paintButtons(buttons, runner.state);
  for (const button of buttons) button.addEventListener('click', () => runCell(runner, button));
}

async function main() {
  for (const cell of document.querySelectorAll('.cell')) setupReset(cell);
  const buttons = [...document.querySelectorAll('button.run')];
  await startRunner(buttons);
  await loadProgress();
}

if (typeof document !== 'undefined') main();
