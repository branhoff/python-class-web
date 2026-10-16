import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';

const VIOLATION = /content security policy|refused to/i;

async function watchViolations(page: Page): Promise<string[]> {
  const seen: string[] = [];
  const note = (msg: ConsoleMessage) => {
    if (VIOLATION.test(msg.text())) seen.push(msg.text());
  };
  page.on('console', note);
  page.on('worker', (worker) => worker.on('console', note));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error(`Refused to load ${event.blockedURI} (${event.violatedDirective})`);
    });
  });
  return seen;
}

async function pythonReady(page: Page): Promise<void> {
  await expect(page.locator('button.run').first()).toBeEnabled({ timeout: 45_000 });
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
  await pythonReady(page);
  const cell = page.locator('[data-cell-id="sum-three-try"]');
  await cell.locator('button.run').click();
  await expect(cell.locator('.output')).toBeVisible();
  expect(violations).toEqual([]);
});

test('a violation raised inside the worker is seen, so the checks above mean something', async ({
  page,
}) => {
  const violations = await watchViolations(page);
  await page.route('**/static/py-worker.js', async (route) => {
    const response = await route.fetch();
    const headers = {
      ...response.headers(),
      'content-security-policy-report-only': "default-src 'self'; script-src 'self'",
    };
    await route.fulfill({ response, headers });
  });
  await page.goto('/lessons/functions');
  await pythonReady(page);
  expect(violations.length).toBeGreaterThan(0);
});

test('responses carry the policy and the other hardening headers', async ({ request }) => {
  const headers = (await request.get('/lessons/functions')).headers();
  const policy =
    headers['content-security-policy'] ?? headers['content-security-policy-report-only'];
  expect(policy).toContain("default-src 'self'");
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
});
