import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Hono } from 'hono';
import { cspEnforced, securityHeaders } from '../src/security-headers.ts';
import { createLessonSite } from '../src/lessons/site.ts';

const REPORT_ONLY = 'content-security-policy-report-only';
const ENFORCING = 'content-security-policy';

function appWithHeaders(enforce = false) {
  const app = new Hono();
  app.use('*', securityHeaders(enforce));
  app.get('/page', (c) => c.html('<p>hi</p>'));
  app.get('/boom', () => {
    throw new Error('boom');
  });
  app.route('/', createLessonSite());
  return app;
}

async function policy(enforce = false, path = '/page'): Promise<string> {
  const header = enforce ? ENFORCING : REPORT_ONLY;
  const value = (await appWithHeaders(enforce).request(path)).headers.get(header);
  assert.ok(value, `${path} sends ${header}`);
  return value;
}

async function directive(name: string): Promise<string[]> {
  const found = (await policy()).split('; ').find((part) => part.startsWith(`${name} `));
  assert.ok(found, `the policy has a ${name} directive`);
  return found.split(' ').slice(1);
}

test('every response carries the hardening headers, including errors and not-found', async () => {
  const app = appWithHeaders();
  const expected = await policy();
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
    assert.equal(res.headers.get(REPORT_ONLY), expected, path);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff', path);
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin', path);
    assert.equal(res.headers.get('x-frame-options'), 'DENY', path);
  }
});

test('by default the policy is only reported, so it cannot break a page', async () => {
  const res = await appWithHeaders().request('/page');
  assert.equal(res.headers.get(ENFORCING), null);
});

test('when enforcing, the same policy is sent as the enforcing header and not the report-only one', async () => {
  const res = await appWithHeaders(true).request('/page');
  assert.equal(res.headers.get(ENFORCING), await policy());
  assert.equal(res.headers.get(REPORT_ONLY), null);
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
  const outside = ((await policy()).match(/https:\/\/[a-z.]+/g) ?? []).sort();
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

test('the policy is enforced only when CSP_ENFORCE is exactly 1', () => {
  assert.equal(cspEnforced({ CSP_ENFORCE: '1' }), true);
  for (const value of [undefined, '', '0', 'true', 'yes', ' 1']) {
    assert.equal(cspEnforced({ CSP_ENFORCE: value }), false, `CSP_ENFORCE=${value}`);
  }
  assert.equal(cspEnforced({}), false);
});
