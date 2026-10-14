import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAuth } from '../src/client/auth.js';
import type { FetchLike } from '../src/client/auth.js';

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
}

type Route = { ok?: boolean; data: unknown };

function fakeFetch(routes: Record<string, Route>) {
  const calls: { url: string }[] = [];
  const fetch: FetchLike = async (url) => {
    calls.push({ url });
    const key = url.includes('signInWithPassword') ? 'signIn' : 'refresh';
    const { ok = true, data } = routes[key] ?? { data: {} };
    return { ok, json: async () => data };
  };
  return { fetch, calls };
}

const SIGN_IN = {
  signIn: { data: { email: 'a@b.com', idToken: 'tok1', refreshToken: 'r1', expiresIn: '3600' } },
};

test('a successful sign-in stores the session and token', async () => {
  const storage = memoryStorage();
  const { fetch } = fakeFetch(SIGN_IN);
  const auth = createAuth({ apiKey: 'K', fetch, storage, now: () => 1000 });

  assert.equal(await auth.signIn('a@b.com', 'pw'), 'a@b.com');
  assert.equal(auth.currentUser(), 'a@b.com');
  assert.equal(await auth.getToken(), 'tok1');
});

test('a rejected sign-in throws the API error message and stays signed out', async () => {
  const storage = memoryStorage();
  const { fetch } = fakeFetch({
    signIn: { ok: false, data: { error: { message: 'INVALID_PASSWORD' } } },
  });
  const auth = createAuth({ apiKey: 'K', fetch, storage, now: () => 1000 });

  await assert.rejects(() => auth.signIn('a@b.com', 'bad'), /INVALID_PASSWORD/);
  assert.equal(auth.currentUser(), null);
  assert.equal(await auth.getToken(), null);
});

// A signed-in session whose token has just expired, so the next getToken refreshes.
async function expiredSession(refresh: Route) {
  const storage = memoryStorage();
  let clock = 1000;
  const { fetch, calls } = fakeFetch({ ...SIGN_IN, refresh });
  const auth = createAuth({ apiKey: 'K', fetch, storage, now: () => clock });
  await auth.signIn('a@b.com', 'pw');
  clock = 1000 + 3600_000;
  return { auth, calls };
}

test('getToken refreshes an expired token', async () => {
  const { auth, calls } = await expiredSession({
    data: { id_token: 'tok2', refresh_token: 'r2', expires_in: '3600' },
  });
  assert.equal(await auth.getToken(), 'tok2');
  assert.ok(calls.some((c) => c.url.includes('/token')));
});

test('a failed refresh signs the user out', async () => {
  const { auth } = await expiredSession({ ok: false, data: {} });
  assert.equal(await auth.getToken(), null);
  assert.equal(auth.currentUser(), null);
});

test('a session persists across instances and is cleared by sign-out', async () => {
  const storage = memoryStorage();
  const { fetch } = fakeFetch(SIGN_IN);
  await createAuth({ apiKey: 'K', fetch, storage, now: () => 1000 }).signIn('a@b.com', 'pw');

  const restored = createAuth({ apiKey: 'K', fetch, storage, now: () => 1000 });
  assert.equal(restored.currentUser(), 'a@b.com');

  restored.signOut();
  assert.equal(restored.currentUser(), null);
  assert.equal(storage.getItem('pcw.auth'), null);
});
