import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLessonSite } from '../src/lessons/site.ts';

const WORDMARK = '<a class="wordmark" href="/">Understand<span>It</span></a>';

test('every page starts its top bar with the UnderstandIt wordmark linking home', async () => {
  const site = createLessonSite();
  for (const path of [
    '/',
    '/courses/python',
    '/lessons/loops',
    '/lessons/number-guessing',
    '/account',
  ]) {
    const html = await (await site.request(path)).text();
    assert.equal(html.split(WORDMARK).length - 1, 1, path);
    assert.ok(html.indexOf(WORDMARK) < html.indexOf('class="topbar-left"'), path);
  }
});

test('only the home page gets the large wordmark', async () => {
  const site = createLessonSite();
  assert.match(await (await site.request('/')).text(), /<body class="home">/);
  for (const path of ['/courses/python', '/lessons/loops', '/account']) {
    assert.doesNotMatch(await (await site.request(path)).text(), /<body class="home">/, path);
  }
});
