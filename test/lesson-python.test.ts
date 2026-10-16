import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pythonRunner } from '../src/lessons/run-python.ts';

test('syntax check accepts valid code and explains bad code', () => {
  assert.deepEqual(pythonRunner.syntax('print(1)'), { ok: true });
  const bad = pythonRunner.syntax('def f(:\n  pass');
  assert.equal(bad.ok, false);
  assert.match(bad.message!, /^SyntaxError: .* \(line 1\)$/);
});

test('a quiz passes when the tests pass, and exposes stdout', () => {
  const result = pythonRunner.exercise('print("hi")', 'assert stdout == "hi\\n"');
  assert.deepEqual(result, { ok: true, stdout: 'hi\n' });
});

test('tests can read the learner code as source', () => {
  const code = 'total = 1 + 1';
  assert.equal(pythonRunner.exercise(code, 'assert source == "total = 1 + 1"').ok, true);
  const banned = pythonRunner.exercise(
    'x = round(2.5)',
    'import ast\nassert not any(isinstance(n, ast.Name) and n.id == "round" for n in ast.walk(ast.parse(source))), "no round"',
  );
  assert.deepEqual(banned, { ok: false, stage: 'tests', message: 'no round', stdout: '' });
});

test('tests can call functions the learner defined', () => {
  const result = pythonRunner.exercise('def f(x):\n    return x * 2', 'assert f(2) == 4');
  assert.equal(result.ok, true);
});

test('a failed assertion reports its message, or a default', () => {
  const withMessage = pythonRunner.exercise('x = 1', 'assert x == 2, "x should be 2"');
  assert.deepEqual(withMessage, {
    ok: false,
    stage: 'tests',
    message: 'x should be 2',
    stdout: '',
  });
  const bare = pythonRunner.exercise('x = 1', 'assert x == 2');
  assert.equal(bare.message, 'A check failed.');
});

test('an error in the learner code is reported with its line', () => {
  const result = pythonRunner.exercise('print("before")\n1 / 0', 'assert True');
  assert.deepEqual(result, {
    ok: false,
    stage: 'code',
    message: 'ZeroDivisionError: division by zero (line 2)',
    stdout: 'before\n',
  });
});

test('a missing function surfaces as an error from the tests', () => {
  const result = pythonRunner.exercise('# nothing', 'assert is_even(2)');
  assert.equal(result.ok, false);
  assert.equal(result.stage, 'tests');
  assert.match(result.message!, /^NameError: .*is_even/);
});

test('learner code that raises SystemExit is contained', () => {
  const result = pythonRunner.exercise('raise SystemExit(3)', 'assert True');
  assert.equal(result.ok, false);
  assert.equal(result.stage, 'code');
});

test('a print inside the tests block does not corrupt the result protocol', () => {
  const result = pythonRunner.exercise('x = 1', 'print("noise")\nassert x == 1');
  assert.deepEqual(result, { ok: true, stdout: '' });
});

test('output larger than the default spawn buffer is still returned', () => {
  const result = pythonRunner.exercise('print("x" * 1_300_000)', 'assert True');
  assert.equal(result.ok, true);
  assert.equal(result.stdout, 'x'.repeat(1_300_000) + '\n');
});
