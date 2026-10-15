import assert from 'node:assert/strict';
import { test } from 'node:test';
import { setup } from './py-runner-helpers.ts';

test('a program that runs past the limit is interrupted and reported with an explanation', async () => {
  const t = setup({ limitMs: 10_000 });
  t.ready();
  const done = t.runner.run({ code: 'while True: pass', tests: '' }, t.handlers);
  t.advance(9_999);
  assert.equal(Atomics.load(t.interruptOf(), 0), 0);
  t.advance(1);
  assert.equal(Atomics.load(t.interruptOf(), 0), 2);
  const id = t.first().sent[1]!['id'] as number;
  t.first().reply({
    type: 'result',
    id,
    result: { ok: false, message: 'KeyboardInterrupt: ', stdout: 'a' },
  });
  const result = await done;
  assert.equal(result.ok, false);
  assert.match(result.message!, /more than 10 seconds/);
  assert.match(result.message!, /loop/);
  assert.equal(result.stdout, 'a');
});

test('time spent waiting for the learner to type does not count toward the limit', () => {
  const t = setup({ limitMs: 10_000 });
  t.ready();
  void t.runner.run({ code: 'input()', tests: '' }, t.handlers);
  const id = t.first().sent[1]!['id'] as number;
  t.advance(4_000);
  t.first().reply({ type: 'input-request', id });
  t.advance(600_000);
  assert.equal(Atomics.load(t.interruptOf(), 0), 0);
  t.runner.provideInput('go');
  t.advance(5_999);
  assert.equal(Atomics.load(t.interruptOf(), 0), 0);
  t.advance(1);
  assert.equal(Atomics.load(t.interruptOf(), 0), 2);
});

test('stopping asks Python to interrupt, and the result reads Stopped.', async () => {
  const t = setup();
  t.ready();
  const done = t.runner.run({ code: 'while True: pass', tests: '' }, t.handlers);
  t.runner.stop();
  assert.equal(Atomics.load(t.interruptOf(), 0), 2);
  const id = t.first().sent[1]!['id'] as number;
  t.first().reply({ type: 'result', id, result: { ok: false, message: 'KeyboardInterrupt: ' } });
  assert.equal((await done).message, 'Stopped.');
  assert.equal(t.runner.state, 'ready');
  assert.equal(t.first().terminated, false);
});

test('stopping a program that is waiting for input also cancels the wait', () => {
  const t = setup();
  t.ready();
  void t.runner.run({ code: 'input()', tests: '' }, t.handlers);
  t.first().reply({ type: 'input-request', id: t.first().sent[1]!['id'] as number });
  t.runner.stop();
  assert.equal(Atomics.load(t.ioOf(), 0), 2);
  assert.equal(Atomics.load(t.interruptOf(), 0), 2);
});

test('if Python does not respond to the interrupt, the worker is replaced', async () => {
  const t = setup({ graceMs: 1_500 });
  t.ready();
  const stuck = t.first();
  const done = t.runner.run({ code: 'stuck', tests: '' }, t.handlers);
  stuck.reply({ type: 'output', id: 1, text: 'partial' });
  t.runner.stop();
  t.advance(1_499);
  assert.equal(stuck.terminated, false);
  t.advance(1);
  assert.equal(stuck.terminated, true);
  assert.deepEqual(await done, { ok: false, stdout: 'partial', message: 'Stopped.' });
  assert.equal(t.workers.length, 2);
  assert.equal(t.runner.state, 'loading');
  t.ready();
  assert.equal(t.runner.state, 'ready');
});

test('messages from a worker that was replaced are ignored', () => {
  const t = setup();
  t.ready();
  const old = t.first();
  void t.runner.run({ code: 'x', tests: '' }, t.handlers);
  t.runner.stop();
  t.advance(1_500);
  old.reply({ type: 'ready' });
  assert.equal(t.runner.state, 'loading');
});

test('stopping twice does not start a second countdown', () => {
  const t = setup();
  t.ready();
  void t.runner.run({ code: 'x', tests: '' }, t.handlers);
  t.runner.stop();
  t.advance(1_000);
  t.runner.stop();
  t.advance(500);
  assert.equal(t.workers.length, 2);
});

test('stopping with nothing running does nothing', () => {
  const t = setup();
  t.ready();
  t.runner.stop();
  assert.equal(Atomics.load(t.interruptOf(), 0), 0);
});

test('a program that finishes properly keeps its real result even if stop was pressed', async () => {
  const t = setup();
  t.ready();
  const done = t.runner.run({ code: 'x', tests: '' }, t.handlers);
  t.runner.stop();
  const id = t.first().sent[1]!['id'] as number;
  t.first().reply({ type: 'result', id, result: { ok: true, stdout: 'done\n' } });
  assert.deepEqual(await done, { ok: true, stdout: 'done\n' });
});

test('a worker that crashes mid-run ends the run and leaves Python unavailable', async () => {
  const t = setup();
  t.ready();
  const done = t.runner.run({ code: 'x', tests: '' }, t.handlers);
  t.first().onerror?.({});
  const result = await done;
  assert.equal(result.ok, false);
  assert.match(result.message!, /Reload the page/);
  assert.equal(t.runner.state, 'unavailable');
});

test('a worker that crashes while idle just becomes unavailable', () => {
  const t = setup();
  t.ready();
  t.first().onerror?.({});
  assert.equal(t.runner.state, 'unavailable');
});

test('a worker that fails to start leaves Python unavailable', () => {
  const t = setup();
  t.first().reply({ type: 'fatal' });
  assert.equal(t.runner.state, 'unavailable');
});
