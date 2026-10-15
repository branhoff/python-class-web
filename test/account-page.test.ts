import assert from 'node:assert/strict';
import { test } from 'node:test';
import { accountCourses, renderAccount } from '../src/lessons/account.ts';
import { COURSES } from '../src/lessons/courses.ts';
import { createLessonSite } from '../src/lessons/site.ts';

const site = createLessonSite();

test('every page has the same top-right account button, and none has an inline sign-in form', async () => {
  for (const path of [
    '/',
    '/courses/python',
    '/lessons/loops',
    '/lessons/number-guessing',
    '/account',
  ]) {
    const html = await (await site.request(path)).text();
    assert.match(
      html,
      /<a id="account-link" class="account-link" href="\/account">Sign in<\/a>/,
      path,
    );
    assert.doesNotMatch(html, /id="auth"/, path);
    assert.doesNotMatch(html, /<input[^>]*type="(email|password)"/, path);
  }
});

test('lesson pages keep the Home button on the left of the same top bar', async () => {
  const html = await (await site.request('/lessons/loops')).text();
  assert.match(
    html,
    /<nav class="topbar" aria-label="Site"><span class="topbar-left"><a class="home" href="\/">Home<\/a><\/span><a id="account-link"/,
  );
});

test('the account page is served with its script and the course data it needs', async () => {
  const res = await site.request('/account');
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<h1>Your account<\/h1>/);
  assert.match(html, /<main id="account">/);
  assert.match(html, /src="\/static\/account.js"/);
  const data = JSON.parse(html.match(/id="account-data">(.*?)<\/script>/)![1]!);
  assert.equal(data.courses[0].id, 'python');
  assert.equal(data.courses[0].title, 'Python');
  assert.ok(data.courses[0].total > 0);
  assert.ok(data.courses[0].exerciseIds.length === data.courses[0].total);
});

test('only courses that have lessons appear in the account progress', () => {
  const meta = { python: { total: 2, exerciseIds: ['a', 'b'] } };
  assert.deepEqual(accountCourses(COURSES, meta), [
    { id: 'python', title: 'Python', total: 2, exerciseIds: ['a', 'b'] },
  ]);
});

test('course data cannot close the script tag it is embedded in', () => {
  const html = renderAccount([{ id: 'x', title: '</script><b>', total: 0, exerciseIds: [] }]);
  assert.doesNotMatch(html, /<\/script><b>/);
  assert.match(html, /\\u003c\/script>\\u003cb>/);
});

test('the auth config tells the browser about a local development user', async () => {
  const dev = createLessonSite('content', { devUser: 'me' });
  assert.deepEqual(await (await dev.request('/auth/config')).json(), { devUser: 'me' });
});

test('the auth config carries the emulator endpoints when they are set', async () => {
  const config = {
    apiKey: 'dev-key',
    projectId: 'dev-project',
    identityUrl: '/dev-identity/v1',
    tokenUrl: '/dev-identity/securetoken/v1',
  };
  const emulated = createLessonSite('content', config);
  assert.deepEqual(await (await emulated.request('/auth/config')).json(), config);
});
