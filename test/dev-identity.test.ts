import assert from 'node:assert/strict';
import { test } from 'node:test';
import { jwtVerify } from 'jose';
import { createDevIdentity } from '../src/dev-identity.ts';

const PROJECT = 'dev-project';
const CLOCK = Date.UTC(2026, 0, 1);

async function setup(now = () => CLOCK) {
  const resets: string[] = [];
  const identity = await createDevIdentity({
    projectId: PROJECT,
    now,
    onPasswordReset: (email) => resets.push(email),
  });
  const post = (path: string, body: unknown) =>
    identity.app.request(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  return { identity, post, resets };
}

async function errorOf(res: Response): Promise<string> {
  assert.equal(res.status, 400);
  return ((await res.json()) as { error: { message: string } }).error.message;
}

test('signing up returns a session whose token verifies against the dev keys', async () => {
  const { identity, post } = await setup();
  const res = await post('/v1/accounts:signUp', { email: 'Ada@Example.com', password: 'secret1' });
  assert.equal(res.status, 200);
  const body = (await res.json()) as Record<string, string>;
  assert.equal(body['email'], 'ada@example.com');
  assert.equal(body['expiresIn'], '3600');
  const { payload } = await jwtVerify(body['idToken']!, identity.keys, {
    issuer: `https://securetoken.google.com/${PROJECT}`,
    audience: PROJECT,
    algorithms: ['RS256'],
    currentDate: new Date(CLOCK),
  });
  assert.equal(payload.sub, body['localId']);
  assert.equal(payload['email'], 'ada@example.com');
});

test('a token expires an hour after it is issued', async () => {
  const issued = CLOCK;
  const { identity, post } = await setup(() => issued);
  const body = (await (
    await post('/v1/accounts:signUp', { email: 'a@b.co', password: 'secret1' })
  ).json()) as { idToken: string };
  const { payload } = await jwtVerify(body.idToken, identity.keys, {
    currentDate: new Date(issued),
  });
  assert.equal(payload.iat, issued / 1000);
  assert.equal(payload.exp, issued / 1000 + 3600);
});

test('sign-up rejects a bad email, a missing password and a short password', async () => {
  const { post } = await setup();
  assert.equal(
    await errorOf(await post('/v1/accounts:signUp', { email: 'nope', password: 'secret1' })),
    'INVALID_EMAIL',
  );
  assert.equal(
    await errorOf(await post('/v1/accounts:signUp', { email: 'a@b.co' })),
    'MISSING_PASSWORD',
  );
  assert.equal(
    await errorOf(await post('/v1/accounts:signUp', { email: 'a@b.co', password: '12345' })),
    'WEAK_PASSWORD : Password should be at least 6 characters',
  );
  assert.equal(
    (await post('/v1/accounts:signUp', { email: 'a@b.co', password: '123456' })).status,
    200,
  );
});

test('an unreadable body is treated as empty and rejected', async () => {
  const { identity } = await setup();
  const res = await identity.app.request('/v1/accounts:signUp', {
    method: 'POST',
    body: 'not json',
  });
  assert.equal(await errorOf(res), 'INVALID_EMAIL');
});

test('signing up twice with the same email, in any case, is rejected', async () => {
  const { post } = await setup();
  await post('/v1/accounts:signUp', { email: 'a@b.co', password: 'secret1' });
  const again = await post('/v1/accounts:signUp', { email: 'A@B.CO', password: 'other12' });
  assert.equal(await errorOf(again), 'EMAIL_EXISTS');
});

test('signing in works with the right password and fails with the wrong one or an unknown email', async () => {
  const { post } = await setup();
  const created = (await (
    await post('/v1/accounts:signUp', { email: 'a@b.co', password: 'secret1' })
  ).json()) as { localId: string };
  const ok = await post('/v1/accounts:signInWithPassword', {
    email: 'A@b.co',
    password: 'secret1',
  });
  assert.equal(((await ok.json()) as { localId: string }).localId, created.localId);
  const wrong = await post('/v1/accounts:signInWithPassword', {
    email: 'a@b.co',
    password: 'nope',
  });
  assert.equal(await errorOf(wrong), 'INVALID_LOGIN_CREDENTIALS');
  const unknown = await post('/v1/accounts:signInWithPassword', {
    email: 'x@y.co',
    password: 'secret1',
  });
  assert.equal(await errorOf(unknown), 'INVALID_LOGIN_CREDENTIALS');
});

test('a refresh token is exchanged once for a new token and a new refresh token', async () => {
  const { identity, post } = await setup();
  const session = (await (
    await post('/v1/accounts:signUp', { email: 'a@b.co', password: 'secret1' })
  ).json()) as { refreshToken: string; localId: string };
  const refresh = (token: string) =>
    identity.app.request('/securetoken/v1/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(token)}`,
    });
  const res = await refresh(session.refreshToken);
  assert.equal(res.status, 200);
  const next = (await res.json()) as Record<string, string>;
  assert.equal(next['expires_in'], '3600');
  assert.equal(next['user_id'], session.localId);
  assert.notEqual(next['refresh_token'], session.refreshToken);
  await jwtVerify(next['id_token']!, identity.keys, { currentDate: new Date(CLOCK) });
  assert.equal(await errorOf(await refresh(session.refreshToken)), 'INVALID_REFRESH_TOKEN');
});

test('refreshing needs the refresh_token grant type', async () => {
  const { identity, post } = await setup();
  const session = (await (
    await post('/v1/accounts:signUp', { email: 'a@b.co', password: 'secret1' })
  ).json()) as { refreshToken: string };
  const res = await identity.app.request('/securetoken/v1/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `grant_type=password&refresh_token=${session.refreshToken}`,
  });
  assert.equal(await errorOf(res), 'INVALID_REFRESH_TOKEN');
});

test('a password reset is reported for a known email only, but always answers the same', async () => {
  const { post, resets } = await setup();
  await post('/v1/accounts:signUp', { email: 'a@b.co', password: 'secret1' });
  const known = await post('/v1/accounts:sendOobCode', {
    requestType: 'PASSWORD_RESET',
    email: 'A@b.co',
  });
  assert.deepEqual(await known.json(), { email: 'a@b.co' });
  const unknown = await post('/v1/accounts:sendOobCode', {
    requestType: 'PASSWORD_RESET',
    email: 'x@y.co',
  });
  assert.deepEqual(await unknown.json(), { email: 'x@y.co' });
  assert.deepEqual(resets, ['a@b.co']);
});

test('sendOobCode rejects other request types and bad emails', async () => {
  const { post } = await setup();
  assert.equal(
    await errorOf(
      await post('/v1/accounts:sendOobCode', { requestType: 'VERIFY_EMAIL', email: 'a@b.co' }),
    ),
    'INVALID_REQ_TYPE',
  );
  assert.equal(
    await errorOf(
      await post('/v1/accounts:sendOobCode', { requestType: 'PASSWORD_RESET', email: 'nope' }),
    ),
    'INVALID_EMAIL',
  );
});
