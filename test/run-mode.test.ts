import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveRunMode } from '../src/run-mode.ts';

test('GCP_PROJECT selects production', () => {
  assert.deepEqual(resolveRunMode({ GCP_PROJECT: 'my-project' }), {
    kind: 'production',
    projectId: 'my-project',
  });
});

test('AUTH_EMULATOR=1 selects the local sign-in emulator', () => {
  assert.deepEqual(resolveRunMode({ AUTH_EMULATOR: '1' }), { kind: 'emulator' });
});

test('DEV_AUTH_USER selects local development without sign-in', () => {
  assert.deepEqual(resolveRunMode({ DEV_AUTH_USER: 'me' }), { kind: 'dev-user', user: 'me' });
});

test('the emulator wins over a dev user when both are set', () => {
  assert.deepEqual(resolveRunMode({ AUTH_EMULATOR: '1', DEV_AUTH_USER: 'me' }), {
    kind: 'emulator',
  });
});

test('only the exact value 1 turns the emulator on', () => {
  assert.deepEqual(resolveRunMode({ AUTH_EMULATOR: '0', DEV_AUTH_USER: 'me' }), {
    kind: 'dev-user',
    user: 'me',
  });
  assert.throws(() => resolveRunMode({ AUTH_EMULATOR: 'true' }), /Set GCP_PROJECT/);
});

test('the emulator can never run alongside a production project', () => {
  assert.throws(
    () => resolveRunMode({ GCP_PROJECT: 'my-project', AUTH_EMULATOR: '1' }),
    /local development only/,
  );
});

test('production wins over a dev user', () => {
  assert.deepEqual(resolveRunMode({ GCP_PROJECT: 'p', DEV_AUTH_USER: 'me' }), {
    kind: 'production',
    projectId: 'p',
  });
});

test('with nothing set, it explains the three ways to run', () => {
  assert.throws(() => resolveRunMode({}), /GCP_PROJECT.*AUTH_EMULATOR.*DEV_AUTH_USER/);
  assert.throws(() => resolveRunMode({ DEV_AUTH_USER: '' }), /Set GCP_PROJECT/);
});
