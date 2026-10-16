import assert from 'node:assert/strict';
import { test } from 'node:test';
import { errorOf, setup } from './dev-identity-helpers.ts';

test('an email is trimmed and lower-cased before it is used', async () => {
  const { post, resets } = await setup();
  const res = await post('/v1/accounts:signUp', {
    email: '  Ada@Example.com ',
    password: 'secret1',
  });
  assert.equal(((await res.json()) as Record<string, string>)['email'], 'ada@example.com');
  await post('/v1/accounts:sendOobCode', {
    email: ' ADA@example.com  ',
    requestType: 'PASSWORD_RESET',
  });
  assert.deepEqual(resets, ['ada@example.com']);
});

test('an email must be a single address, with nothing before or after it', async () => {
  const { post } = await setup();
  for (const email of ['foo bar@baz.co', 'a@b.co x', 'a@@b.co', 'plain']) {
    const res = await post('/v1/accounts:signUp', { email, password: 'secret1' });
    assert.equal(await errorOf(res), 'INVALID_EMAIL', email);
  }
});

test('a request with no email or a non-text email is rejected as an invalid email', async () => {
  const { post } = await setup();
  for (const body of [
    { requestType: 'PASSWORD_RESET' },
    { requestType: 'PASSWORD_RESET', email: 42 },
  ]) {
    assert.equal(await errorOf(await post('/v1/accounts:sendOobCode', body)), 'INVALID_EMAIL');
  }
  assert.equal(
    await errorOf(await post('/v1/accounts:signUp', { email: 42, password: 'secret1' })),
    'INVALID_EMAIL',
  );
});
