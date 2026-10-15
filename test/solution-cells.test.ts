import assert from 'node:assert/strict';
import { test } from 'node:test';
import { splitScriptTests, splitSolution } from '../src/lessons/solution-cells.ts';

const cell = [
  'def double(n):',
  '    return n * 2',
  '',
  '',
  '# ---- Tests ----',
  'class T:',
  '    def test_double(self):',
  '        pass',
  '',
  '',
  '# ---- Run the tests ----',
  'run()',
  '',
].join('\n');

test('splits a solution cell into the solution and its tests', () => {
  const parts = splitSolution(cell);
  assert.equal(parts.solution, 'def double(n):\n    return n * 2\n');
  assert.equal(parts.tests, 'class T:\n    def test_double(self):\n        pass\n');
});

test('a cell without a tests marker is rejected', () => {
  assert.throws(() => splitSolution('x = 1\n'), /exactly one "# ---- Tests ----"/);
});

test('a cell with two tests markers is rejected', () => {
  assert.throws(() => splitSolution(cell + '# ---- Tests ----\n'), /exactly one "# ---- Tests/);
});

test('a cell without a run marker is rejected', () => {
  const noRun = cell.replace('# ---- Run the tests ----\n', '');
  assert.throws(() => splitSolution(noRun), /exactly one "# ---- Run the tests ----"/);
});

test('a cell with two run markers is rejected', () => {
  assert.throws(
    () => splitSolution(cell + '# ---- Run the tests ----\n'),
    /exactly one "# ---- Run/,
  );
});

test('a cell whose tests section has no test methods is rejected', () => {
  const empty = cell.replace('def test_double', 'def helper');
  assert.throws(() => splitSolution(empty), /no test methods/);
});

const scriptCell = [
  "PROGRAM = r'''",
  'print(input())',
  "'''",
  '',
  cell.split('\n').slice(4).join('\n'),
].join('\n');

test('splits a script tests cell into the program copy and the tests', () => {
  const parts = splitScriptTests(scriptCell);
  assert.equal(parts.program, 'print(input())\n');
  assert.equal(parts.tests, 'class T:\n    def test_double(self):\n        pass\n');
});

test('a script tests cell must start with the PROGRAM string', () => {
  assert.throws(() => splitScriptTests(cell), /must start with PROGRAM/);
});

test('a PROGRAM string that is never closed is rejected', () => {
  assert.throws(() => splitScriptTests("PROGRAM = r'''\nprint(1)\n"), /never closed/);
});

test('code between the PROGRAM string and the tests marker is rejected', () => {
  const stray = scriptCell.replace("'''\n\n", "'''\nx = 1\n\n");
  assert.throws(() => splitScriptTests(stray), /nothing between/);
});

test('a script tests cell without a tests marker is rejected', () => {
  assert.throws(() => splitScriptTests("PROGRAM = r'''\nx\n'''\n"), /exactly one "# ---- Tests/);
});
