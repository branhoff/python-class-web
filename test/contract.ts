import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ProgressRepository } from '../src/repository/repository.ts';

export function runRepositoryContract(name: string, create: () => Promise<ProgressRepository>) {
  test(`${name}: unknown users have no events`, async () => {
    const repo = await create();
    assert.deepEqual(await repo.listEvents('nobody'), []);
  });

  test(`${name}: lists events oldest first`, async () => {
    const repo = await create();
    await repo.appendEvent('u1', { cellId: 'b', kind: 'attempt', at: 20 });
    await repo.appendEvent('u1', { cellId: 'a', kind: 'completed', at: 10 });
    const events = await repo.listEvents('u1');
    assert.deepEqual(
      events.map((event) => event.at),
      [10, 20],
    );
  });

  test(`${name}: keeps repeated events (append-only)`, async () => {
    const repo = await create();
    await repo.appendEvent('u1', { cellId: 'a', kind: 'attempt', at: 1 });
    await repo.appendEvent('u1', { cellId: 'a', kind: 'attempt', at: 1 });
    assert.equal((await repo.listEvents('u1')).length, 2);
  });

  test(`${name}: isolates users`, async () => {
    const repo = await create();
    await repo.appendEvent('u1', { cellId: 'a', kind: 'completed', at: 1 });
    assert.deepEqual(await repo.listEvents('u2'), []);
  });

  test(`${name}: returned events are copies`, async () => {
    const repo = await create();
    await repo.appendEvent('u1', { cellId: 'a', kind: 'attempt', at: 1 });
    const [first] = await repo.listEvents('u1');
    first!.cellId = 'tampered';
    assert.equal((await repo.listEvents('u1'))[0]!.cellId, 'a');
  });

  test(`${name}: stored events are copies of the input`, async () => {
    const repo = await create();
    const event = { cellId: 'a', kind: 'attempt' as const, at: 1 };
    await repo.appendEvent('u1', event);
    event.cellId = 'tampered';
    assert.equal((await repo.listEvents('u1'))[0]!.cellId, 'a');
  });
}
