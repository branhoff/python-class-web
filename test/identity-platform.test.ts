import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exportJWK, generateKeyPair, SignJWT, createLocalJWKSet } from 'jose';
import { createIdentityPlatformAuthenticator } from '../src/identity-platform.ts';

const PROJECT = 'demo-project';

async function setup() {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk = { ...(await exportJWK(publicKey)), alg: 'RS256', kid: 'k1' };
  const authenticate = createIdentityPlatformAuthenticator(
    PROJECT,
    createLocalJWKSet({ keys: [jwk] }),
  );
  const sign = (claims: { sub?: string; iss?: string; aud?: string; exp?: string }) => {
    const jwt = new SignJWT({})
      .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
      .setIssuer(claims.iss ?? `https://securetoken.google.com/${PROJECT}`)
      .setAudience(claims.aud ?? PROJECT)
      .setExpirationTime(claims.exp ?? '5m');
    return (claims.sub === undefined ? jwt : jwt.setSubject(claims.sub)).sign(privateKey);
  };
  return { authenticate, sign };
}

test('a valid token maps to our prefixed user ID', async () => {
  const { authenticate, sign } = await setup();
  assert.equal(await authenticate(`Bearer ${await sign({ sub: 'abc' })}`), 'idp:abc');
});

test('missing or malformed headers are rejected', async () => {
  const { authenticate } = await setup();
  assert.equal(await authenticate(undefined), null);
  assert.equal(await authenticate('Basic abc'), null);
  assert.equal(await authenticate('Bearer '), null);
  assert.equal(await authenticate('Bearer not-a-jwt'), null);
  const { authenticate: auth2, sign } = await setup();
  const valid = await sign({ sub: 'abc' });
  assert.equal(await auth2(`x Bearer ${valid}`), null);
  assert.equal(await auth2(`Bearer ${valid}\nextra`), null);
});

test('wrong audience, issuer, expiry, or missing subject are rejected', async () => {
  const { authenticate, sign } = await setup();
  const rejected = [
    { sub: 'abc', aud: 'other-project' },
    { sub: 'abc', iss: 'https://securetoken.google.com/other-project' },
    { sub: 'abc', exp: '-1m' },
    {},
  ];
  for (const claims of rejected) {
    assert.equal(await authenticate(`Bearer ${await sign(claims)}`), null, JSON.stringify(claims));
  }
});

test('a token signed by an unknown key is rejected', async () => {
  const { authenticate } = await setup();
  const other = await generateKeyPair('RS256');
  const forged = await new SignJWT({})
    .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
    .setIssuer(`https://securetoken.google.com/${PROJECT}`)
    .setAudience(PROJECT)
    .setSubject('abc')
    .setExpirationTime('5m')
    .sign(other.privateKey);
  assert.equal(await authenticate(`Bearer ${forged}`), null);
});
