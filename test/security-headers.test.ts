import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Hono } from 'hono';
import { securityHeaders } from '../src/security-headers.ts';
import { createLessonSite } from '../src/lessons/site.ts';

function appWithHeaders() {
  const app = new Hono();
  app.use('*', securityHeaders);
  app.get('/page', (c) => c.html('<p>hi</p>'));
  app.get('/boom', () => {
    throw new Error('boom');
  });
  app.route('/', createLessonSite());
  return app;
}

async function reportedPolicy(path = '/page'): Promise<string> {
  const policy = (await appWithHeaders().request(path)).headers.get(
    'content-security-policy-report-only',
  );
  assert.ok(policy, `${path} reports a policy`);
  return policy;
}

async function directive(name: string): Promise<string[]> {
  const found = (await reportedPolicy()).split('; ').find((part) => part.startsWith(`${name} `));
  assert.ok(found, `the policy has a ${name} directive`);
  return found.split(' ').slice(1);
}

test('every response carries the hardening headers, including errors and not-found', async () => {
  const app = appWithHeaders();
  const expected = await reportedPolicy();
  for (const [path, status] of [
    ['/page', 200],
    ['/', 200],
    ['/lessons/loops', 200],
    ['/static/py-worker.js', 200],
    ['/nope', 404],
    ['/boom', 500],
  ] as const) {
    const res = await app.request(path);
    assert.equal(res.status, status, path);
    assert.equal(res.headers.get('content-security-policy-report-only'), expected, path);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff', path);
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin', path);
    assert.equal(res.headers.get('x-frame-options'), 'DENY', path);
  }
});

test('the policy is only reported for now, so it cannot break a page', async () => {
  const res = await appWithHeaders().request('/page');
  assert.equal(res.headers.get('content-security-policy'), null);
});

test('scripts and workers come only from this origin, and no script may be inline or use eval', async () => {
  const scripts = await directive('script-src');
  assert.deepEqual(scripts, ["'self'", "'wasm-unsafe-eval'"]);
  assert.deepEqual(await directive('worker-src'), ["'self'"]);
  for (const banned of ["'unsafe-inline'", "'unsafe-eval'"]) {
    assert.ok(!scripts.includes(banned), `script-src has no ${banned}`);
  }
});

test('the only outside hosts are the two Identity Platform sign-in endpoints', async () => {
  const outside = ((await reportedPolicy()).match(/https:\/\/[a-z.]+/g) ?? []).sort();
  assert.deepEqual(outside, [
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com',
  ]);
  assert.deepEqual(await directive('connect-src'), ["'self'", ...outside]);
});

test('the page cannot be framed, embed plugins, or change its base or form targets', async () => {
  assert.deepEqual(await directive('frame-ancestors'), ["'none'"]);
  assert.deepEqual(await directive('object-src'), ["'none'"]);
  assert.deepEqual(await directive('base-uri'), ["'self'"]);
  assert.deepEqual(await directive('form-action'), ["'self'"]);
});
