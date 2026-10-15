import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatResult, verdictOf } from '../src/client/lesson-runner.js';

test('an exercise that passes its tests shows a pass verdict', () => {
  assert.deepEqual(formatResult({ ok: true, stdout: '' }, true), {
    state: 'pass',
    text: '✓ Passed',
  });
});

test('a failure shows the message and reports fail, tests or not', () => {
  assert.deepEqual(formatResult({ ok: false, message: 'x should be 2', stdout: '12\n' }, true), {
    state: 'fail',
    text: '12\n✗ x should be 2',
  });
  assert.equal(formatResult({ ok: false }, false).state, 'fail');
});

test('a sandbox cell shows its output but never claims a pass', () => {
  const withOutput = formatResult({ ok: true, stdout: '196\n' }, false);
  assert.equal(withOutput.state, 'ran');
  assert.equal(withOutput.text, '196');
});

test('a sandbox cell that printed nothing still confirms it ran', () => {
  assert.deepEqual(formatResult({ ok: true, stdout: '' }, false), {
    state: 'ran',
    text: '(ran with no output)',
  });
});

test('the verdict alone leaves out the output, which is streamed into the cell', () => {
  assert.deepEqual(verdictOf({ ok: true, stdout: '196\n' }, true), {
    state: 'pass',
    lines: ['✓ Passed'],
  });
  assert.deepEqual(verdictOf({ ok: true, stdout: '196\n' }, false), { state: 'ran', lines: [] });
  assert.deepEqual(verdictOf({ ok: true, stdout: '' }, false), {
    state: 'ran',
    lines: ['(ran with no output)'],
  });
  assert.deepEqual(verdictOf({ ok: false, message: 'Stopped.', stdout: 'a' }, false), {
    state: 'fail',
    lines: ['✗ Stopped.'],
  });
});

test('a failure without a message still says something went wrong', () => {
  assert.deepEqual(verdictOf({ ok: false }, true).lines, ['✗ Something went wrong.']);
});
