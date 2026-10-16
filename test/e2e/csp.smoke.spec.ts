import { expect, test, type Page } from '@playwright/test';

const VIOLATION = /content security policy|refused to/i;

async function watchViolations(page: Page): Promise<string[]> {
  const seen: string[] = [];
  page.on('console', (msg) => {
    if (VIOLATION.test(msg.text())) seen.push(msg.text());
  });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error(`Refused to load ${event.blockedURI} (${event.violatedDirective})`);
    });
  });
  return seen;
}

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

test('booting Python and running a cell in the worker raises no policy violation', async ({
  page,
}) => {
  const violations = await watchViolations(page);
  await page.goto('/lessons/functions');
  const cell = page.locator('[data-cell-id="sum-three-try"]');
  await expect(cell.locator('button.run')).toBeEnabled({ timeout: 45_000 });
  await cell.locator('button.run').click();
  await expect(cell.locator('.output')).toBeVisible();
  expect(violations).toEqual([]);
});

test('responses carry the policy and the other hardening headers', async ({ request }) => {
  const headers = (await request.get('/lessons/functions')).headers();
  const policy =
    headers['content-security-policy'] ?? headers['content-security-policy-report-only'];
  expect(policy).toContain("default-src 'self'");
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
});
