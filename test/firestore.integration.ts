import { createFirestoreProgressRepository } from '../src/repository/firestore.ts';
import { runRepositoryContract } from './contract.ts';

if (!process.env['FIRESTORE_EMULATOR_HOST']) {
  throw new Error('Set FIRESTORE_EMULATOR_HOST (see `make firestore-emulator`).');
}

runRepositoryContract('firestore', async () => {
  const repo = createFirestoreProgressRepository('demo-python-class');
  const namespace = crypto.randomUUID();
  return {
    appendEvent: (userId, event) => repo.appendEvent(`${namespace}-${userId}`, event),
    listEvents: (userId) => repo.listEvents(`${namespace}-${userId}`),
  };
});
