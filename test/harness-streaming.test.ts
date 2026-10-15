import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { pythonRunner } from '../src/lessons/run-python.ts';

function inHarness(body: string) {
  const script = `import json, sys
sys.path.insert(0, "src/lessons")
import harness
${body}`;
  const result = spawnSync('python3', ['-I', '-c', script], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('output is passed on as it is written, before the program finishes', () => {
  const seen = inHarness(`
chunks = []
result = harness.run_exercise('print("a")\\nprint("b", end="")\\nprint("c")', 'pass', chunks.append)
print(json.dumps({"chunks": chunks, "stdout": result["stdout"]}))
`);
  assert.deepEqual(seen.chunks, ['a', '\n', 'b', 'c', '\n']);
  assert.equal(seen.stdout, 'a\nbc\n');
});

test('the prompt text of input() is part of the streamed output', () => {
  const seen = inHarness(`
import builtins
chunks = []
builtins.input = lambda prompt="": (print(prompt, end=""), "5")[1]
result = harness.run_exercise('n = input("How many? ")\\nprint(n)', 'pass', chunks.append)
print(json.dumps({"chunks": chunks, "stdout": result["stdout"]}))
`);
  assert.equal(seen.chunks.join(''), 'How many? 5\n');
  assert.equal(seen.stdout, 'How many? 5\n');
});

test('output written before an error is streamed, and the error is still reported', () => {
  const seen = inHarness(`
chunks = []
result = harness.run_exercise('print("before")\\n1 / 0', 'pass', chunks.append)
print(json.dumps({"chunks": chunks, "result": result}))
`);
  assert.equal(seen.chunks.join(''), 'before\n');
  assert.equal(seen.result.ok, false);
  assert.match(seen.result.message, /ZeroDivisionError/);
});

test('the streamed output does not include what the tests print', () => {
  const seen = inHarness(`
chunks = []
result = harness.run_exercise('print("x")', 'print("from tests")', chunks.append)
print(json.dumps({"chunks": chunks, "ok": result["ok"]}))
`);
  assert.equal(seen.ok, true);
  assert.equal(seen.chunks.join(''), 'x\n');
});

test('the output object behaves like a file for programs that poke at it', () => {
  const seen = inHarness(`
result = harness.run_exercise('import sys\\nsys.stdout.flush()\\nprint(sys.stdout.isatty())', 'pass')
print(json.dumps(result))
`);
  assert.equal(seen.stdout, 'False\n');
});

test('without a callback the harness behaves exactly as before', () => {
  assert.deepEqual(pythonRunner.exercise('print("hi")', 'assert stdout == "hi\\n"'), {
    ok: true,
    stdout: 'hi\n',
  });
});
