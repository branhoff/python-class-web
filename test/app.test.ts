import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from '../src/app.ts';
import { MemoryProgressRepository } from '../src/repository/memory.ts';

function build() {
  const repository = new MemoryProgressRepository();
  const app = createApp({
    repository,
    authenticate: async (header) => (header === 'Bearer good' ? 'user-1' : null),
    now: () => 1000,
  });
  return { app, repository };
}

const auth = { Authorization: 'Bearer good' };

function postEvent(app: ReturnType<typeof build>['app'], body: string, headers = auth) {
  return app.request('/progress/events', { method: 'POST', body, headers });
}

test('health is public', async () => {
  const res = await build().app.request('/health');
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('progress routes reject unauthenticated callers', async () => {
  const { app } = build();
  const summary = await app.request('/progress/summary');
  assert.equal(summary.status, 401);
  assert.deepEqual(await summary.json(), { error: 'unauthorized' });
  assert.equal((await postEvent(app, '{}', {} as typeof auth)).status, 401);
});

test('recording a completed cell shows up in the summary', async () => {
  const { app, repository } = build();
  const res = await postEvent(app, JSON.stringify({ cellId: 'c1', kind: 'completed' }));
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { recorded: true });
  assert.deepEqual(await repository.listEvents('user-1'), [
    { cellId: 'c1', kind: 'completed', at: 1000 },
  ]);
  const summary = await app.request('/progress/summary', { headers: auth });
  assert.deepEqual(await summary.json(), { completedCells: ['c1'] });
});

test('attempt events are accepted', async () => {
  const { app, repository } = build();
  const res = await postEvent(app, JSON.stringify({ cellId: 'c1', kind: 'attempt' }));
  assert.equal(res.status, 201);
  assert.equal((await repository.listEvents('user-1'))[0]?.kind, 'attempt');
});

test('invalid event bodies are rejected with an explanation', async () => {
  const { app } = build();
  const invalid = [
    'not json',
    'null',
    '{}',
    '{"cellId":"","kind":"completed"}',
    '{"cellId":7,"kind":"completed"}',
    '{"cellId":"a","kind":"x"}',
  ];
  for (const body of invalid) {
    const res = await postEvent(app, body);
    assert.equal(res.status, 400, body);
    assert.deepEqual(await res.json(), {
      error: 'cellId and kind (attempt|completed) are required',
    });
  }
});
