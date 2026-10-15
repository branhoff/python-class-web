import assert from 'node:assert/strict';
import { test } from 'node:test';
import { INPUT_CAPACITY, pythonSupport } from '../src/client/py-runner.js';
import { setup } from './py-runner-helpers.ts';

test('it starts a worker, hands it the harness and shared buffers, and becomes ready', () => {
  const t = setup();
  assert.equal(t.runner.state, 'loading');
  const init = t.first().sent[0]!;
  assert.equal(init['type'], 'init');
  assert.equal(init['harness'], 'HARNESS SOURCE');
  assert.ok(init['interrupt'] instanceof SharedArrayBuffer);
  assert.ok(init['io'] instanceof SharedArrayBuffer);
  t.ready();
  assert.equal(t.runner.state, 'ready');
});

test('it will not run code until Python is ready', async () => {
  const t = setup();
  await assert.rejects(t.runner.run({ code: 'x', tests: '' }, t.handlers), /not ready/);
});

test('a run sends the code, streams output, and resolves with the result', async () => {
  const t = setup();
  t.ready();
  const done = t.runner.run({ code: 'print(1)', tests: 'T' }, t.handlers);
  const job = t.first().sent[1]!;
  assert.deepEqual([job['type'], job['code'], job['tests']], ['run', 'print(1)', 'T']);
  t.first().reply({ type: 'output', id: job['id'] as number, text: 'hi\n' });
  t.first().reply({
    type: 'result',
    id: job['id'] as number,
    result: { ok: true, stdout: 'hi\n' },
  });
  assert.deepEqual(await done, { ok: true, stdout: 'hi\n' });
  assert.deepEqual(t.outputs, ['hi\n']);
  assert.deepEqual(t.states, ['ready', 'running', 'ready']);
});

test('only one program runs at a time', async () => {
  const t = setup();
  t.ready();
  void t.runner.run({ code: 'a', tests: '' }, t.handlers);
  await assert.rejects(t.runner.run({ code: 'b', tests: '' }, t.handlers), /not ready/);
});

test('a typed line reaches the waiting program through shared memory', () => {
  const t = setup();
  t.ready();
  void t.runner.run({ code: 'input()', tests: '' }, t.handlers);
  const id = t.first().sent[1]!['id'] as number;
  t.first().reply({ type: 'input-request', id });
  assert.equal(t.requests(), 1);
  t.runner.provideInput('héllo');
  const io = t.ioOf();
  assert.equal(Atomics.load(io, 0), 1);
  const bytes = new Uint8Array(t.first().sent[0]!['io'] as SharedArrayBuffer, 8, io[1]);
  assert.equal(new TextDecoder().decode(bytes), 'héllo');
});

test('input is ignored when the program is not waiting for it', () => {
  const t = setup();
  t.ready();
  t.runner.provideInput('nobody asked');
  void t.runner.run({ code: 'print(1)', tests: '' }, t.handlers);
  t.runner.provideInput('still nobody');
  assert.equal(Atomics.load(t.ioOf(), 0), 0);
});

test('a line longer than the buffer is cut to fit instead of overflowing', () => {
  const t = setup();
  t.ready();
  void t.runner.run({ code: 'input()', tests: '' }, t.handlers);
  t.first().reply({ type: 'input-request', id: t.first().sent[1]!['id'] as number });
  t.runner.provideInput('x'.repeat(INPUT_CAPACITY * 2));
  assert.equal(t.ioOf()[1], INPUT_CAPACITY - 1);
});

test('output and input requests from an old run are ignored', () => {
  const t = setup();
  t.ready();
  void t.runner.run({ code: 'x', tests: '' }, t.handlers);
  t.first().reply({ type: 'output', id: 99, text: 'stale' });
  t.first().reply({ type: 'input-request', id: 99 });
  assert.deepEqual(t.outputs, []);
  assert.equal(t.requests(), 0);
});

test('a state listener can be removed', () => {
  const t = setup();
  const seen: string[] = [];
  const off = t.runner.onState((state) => seen.push(state));
  off();
  t.ready();
  assert.deepEqual(seen, []);
});

test('Python is only supported when the page is cross-origin isolated', () => {
  assert.deepEqual(pythonSupport({ SharedArrayBuffer, crossOriginIsolated: true }), {
    ok: true,
    reason: '',
  });
  assert.equal(pythonSupport({ SharedArrayBuffer, crossOriginIsolated: false }).ok, false);
  const missing = pythonSupport({ crossOriginIsolated: true });
  assert.equal(missing.ok, false);
  assert.match(missing.reason, /cross-origin isolated/);
});
