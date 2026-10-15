import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from '../src/app.ts';
import { createAuth, describeAuthError } from '../src/client/auth.js';
import type { FetchLike } from '../src/client/auth.js';
import { createDevIdentity } from '../src/dev-identity.ts';
import { createIdentityPlatformAuthenticator } from '../src/identity-platform.ts';
import { MemoryProgressRepository } from '../src/repository/memory.ts';

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}

async function setup() {
  const resets: string[] = [];
  const identity = await createDevIdentity({
    projectId: 'dev-project',
    onPasswordReset: (email) => resets.push(email),
  });
  const fetch: FetchLike = async (url, init) => {
    const res = await identity.app.request(url, init);
    return { ok: res.ok, json: () => res.json() };
  };
  const auth = createAuth({
    apiKey: 'dev-key',
    fetch,
    storage: memoryStorage(),
    identityUrl: 'http://localhost/v1',
    tokenUrl: 'http://localhost/securetoken/v1',
  });
  const app = createApp({
    repository: new MemoryProgressRepository(),
    authenticate: createIdentityPlatformAuthenticator('dev-project', identity.keys),
  });
  return { auth, app, resets };
}

test('a learner can sign up and the token works against the progress API', async () => {
  const { auth, app } = await setup();
  assert.equal(await auth.signUp('ada@example.com', 'secret1'), 'ada@example.com');
  const headers = {
    Authorization: `Bearer ${await auth.getToken()}`,
    'content-type': 'application/json',
  };
  const posted = await app.request('/progress/events', {
    method: 'POST',
    headers,
    body: JSON.stringify({ cellId: 'loops-ex1', kind: 'completed' }),
  });
  assert.equal(posted.status, 201);
  const summary = await app.request('/progress/summary', { headers });
  assert.deepEqual(await summary.json(), { completedCells: ['loops-ex1'] });
});

test('progress belongs to the account: another learner sees none of it', async () => {
  const { auth, app } = await setup();
  await auth.signUp('ada@example.com', 'secret1');
  await app.request('/progress/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await auth.getToken()}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ cellId: 'loops-ex1', kind: 'completed' }),
  });
  auth.signOut();
  await auth.signUp('bob@example.com', 'secret2');
  const summary = await app.request('/progress/summary', {
    headers: { Authorization: `Bearer ${await auth.getToken()}` },
  });
  assert.deepEqual(await summary.json(), { completedCells: [] });
});

test('after signing out, the same learner can sign back in', async () => {
  const { auth } = await setup();
  await auth.signUp('ada@example.com', 'secret1');
  auth.signOut();
  assert.equal(auth.currentUser(), null);
  assert.equal(await auth.signIn('ada@example.com', 'secret1'), 'ada@example.com');
});

test('signing in with the wrong password fails with a readable message', async () => {
  const { auth } = await setup();
  await auth.signUp('ada@example.com', 'secret1');
  auth.signOut();
  await assert.rejects(auth.signIn('ada@example.com', 'wrong-one'), (error: Error) => {
    assert.equal(error.message, 'INVALID_LOGIN_CREDENTIALS');
    assert.equal(describeAuthError(error), 'That email and password do not match an account.');
    return true;
  });
});

test('asking for a password reset reaches the identity server', async () => {
  const { auth, resets } = await setup();
  await auth.signUp('ada@example.com', 'secret1');
  await auth.resetPassword('ada@example.com');
  assert.deepEqual(resets, ['ada@example.com']);
});

test('a password reset for a bad email address is reported', async () => {
  const { auth } = await setup();
  await assert.rejects(auth.resetPassword('not-an-email'), /INVALID_EMAIL/);
});

test('a password reset fails with a generic message when the server gives no reason', async () => {
  const auth = createAuth({
    apiKey: 'K',
    storage: memoryStorage(),
    fetch: async () => ({ ok: false, json: async () => ({}) }),
  });
  await assert.rejects(auth.resetPassword('a@b.co'), /AUTH_FAILED/);
});

test('describeAuthError turns each known code into a sentence a learner can act on', () => {
  const cases: [string, RegExp][] = [
    ['EMAIL_EXISTS', /already exists/],
    ['INVALID_LOGIN_CREDENTIALS', /do not match/],
    ['INVALID_PASSWORD', /do not match/],
    ['EMAIL_NOT_FOUND', /do not match/],
    ['INVALID_EMAIL', /email address/],
    ['MISSING_PASSWORD', /Enter a password/],
    ['WEAK_PASSWORD : Password should be at least 6 characters', /at least 6 characters/],
    ['TOO_MANY_ATTEMPTS_TRY_LATER : Access blocked', /Too many attempts/],
    ['USER_DISABLED', /disabled/],
  ];
  for (const [code, pattern] of cases) {
    assert.match(describeAuthError(new Error(code)), pattern, code);
  }
});

test('describeAuthError never shows a raw code for an unknown error', () => {
  assert.equal(
    describeAuthError(new Error('SOMETHING_NEW')),
    'Something went wrong. Please try again.',
  );
  assert.equal(describeAuthError('plain string'), 'Something went wrong. Please try again.');
  assert.equal(describeAuthError(undefined), 'Something went wrong. Please try again.');
});

test('the client talks to the Google endpoints unless told otherwise', async () => {
  const urls: string[] = [];
  const auth = createAuth({
    apiKey: 'K',
    storage: memoryStorage(),
    fetch: async (url) => {
      urls.push(url);
      return { ok: false, json: async () => ({}) };
    },
  });
  await auth.signIn('a@b.co', 'pw').catch(() => {});
  await auth.resetPassword('a@b.co').catch(() => {});
  assert.deepEqual(urls, [
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=K',
    'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=K',
  ]);
});
