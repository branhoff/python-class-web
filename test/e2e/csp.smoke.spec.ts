import { expect, test, type Page } from '@playwright/test';

const VIOLATION = /content security policy|refused to/i;

async function watchViolations(page: Page): Promise<string[]> {
  const seen: string[] = [];
  page.on('console', (msg) => {
    if (VIOLATION.test(msg.text())) seen.push(msg.text());
  });
  return seen;
}

test('the smoke suite runs with the policy enforced, so a blocked source breaks a test', async ({
  request,
}) => {
  const headers = (await request.get('/lessons/functions')).headers();
  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['content-security-policy-report-only']).toBeUndefined();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
});

test('the home, course, account, lesson and project pages raise no policy violation', async ({
  page,
}) => {
  const violations = await watchViolations(page);
  for (const path of [
    '/',
    '/courses/python',
    '/account',
    '/lessons/functions',
    '/lessons/first-python-file',
  ]) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }
  expect(violations).toEqual([]);
});

test('a violation in the page is reported, so the check above can fail', async ({ page }) => {
  const violations = await watchViolations(page);
  await page.goto('/');
  await page.evaluate(() => {
    try {
      new Function('return 1')();
    } catch {
      return;
    }
  });
  expect(violations.length).toBeGreaterThan(0);
});
