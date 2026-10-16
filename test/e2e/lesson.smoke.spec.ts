import { expect, test } from '@playwright/test';

async function waitForPythonReady(page: import('@playwright/test').Page): Promise<void> {
  await expect(page.locator('button.run').first()).toBeEnabled({ timeout: 45_000 });
  await expect(page.locator('button.run').first()).toHaveText('Run');
}

test('a sandbox cell shows output but never claims a pass', async ({ page }) => {
  await page.goto('/lessons/functions');
  await waitForPythonReady(page);

  const cell = page.locator('[data-cell-id="sum-three-try"]');
  const output = cell.locator('.output');

  await cell.locator('button.run').click();
  await expect(output).toBeVisible();
  await expect(output).toContainText('ran with no output');
  await expect(output).not.toContainText('Passed');
  await expect(output).not.toHaveClass(/pass/);

  const textarea = cell.locator('textarea');
  await textarea.fill((await textarea.inputValue()) + '\nprint(sum_three(-5, 189, 12))');
  await cell.locator('button.run').click();
  await expect(output).toContainText('num1 =');
  await expect(output).not.toContainText('Passed');
});

test('a quiz passes a correct solution and fails a wrong one', async ({ page }) => {
  await page.goto('/lessons/functions');
  await waitForPythonReady(page);

  const cell = page.locator('[data-cell-id="double-number"]');
  const textarea = cell.locator('textarea');
  const output = cell.locator('.output');

  await textarea.fill('def double_num(x):\n    return x * 2\n\nprint(double_num(5))');
  await cell.locator('button.run').click();
  await expect(output).toContainText('✓ Passed');
  await expect(output).toHaveClass(/pass/);

  await textarea.fill('print(5)');
  await cell.locator('button.run').click();
  await expect(output).toContainText('✗');
  await expect(output).toHaveClass(/fail/);
});

test('passing a quiz records progress and restores it on reload', async ({ page }) => {
  await page.goto('/lessons/functions');
  await waitForPythonReady(page);

  const cell = page.locator('[data-cell-id="double-number"]');
  await cell
    .locator('textarea')
    .fill('def double_num(x):\n    return x * 2\n\nprint(double_num(5))');
  await cell.locator('button.run').click();
  await expect(cell.locator('.output')).toContainText('✓ Passed');
  await expect(cell).toHaveClass(/completed/);
  await expect(cell.locator('.badge')).toHaveText('✓ completed');

  const summary = await page.request.get('/progress/summary');
  expect(summary.ok()).toBeTruthy();
  expect((await summary.json()).completedCells).toContain('double-number');

  await page.reload();
  await waitForPythonReady(page);
  await expect(page.locator('[data-cell-id="double-number"]')).toHaveClass(/completed/);
});

test('shows a Sign in button, not a form, at the top of a lesson page', async ({ page }) => {
  await page.goto('/lessons/functions');
  await waitForPythonReady(page);
  await expect(page.locator('input[type="email"]')).toHaveCount(0);
  await expect(page.locator('#account-link')).toBeVisible();
});

test('the sidebar and pager navigate between lessons', async ({ page }) => {
  await page.goto('/lessons/functions');
  await expect(page.locator('nav.sidebar')).toBeVisible();
  const prev = page.locator('.pager a.prev');
  await expect(prev).toContainText('Previous');
  const href = (await prev.getAttribute('href')) ?? '';
  await prev.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
});

test('the page is cross-origin isolated, which the Python worker needs', async ({ page }) => {
  await page.goto('/lessons/functions');
  expect(await page.evaluate(() => crossOriginIsolated)).toBe(true);
});

test('input() asks inline: the prompt shows first, then the typed line is used', async ({
  page,
}) => {
  await page.goto('/lessons/input-and-casting');
  await waitForPythonReady(page);
  const cell = page.locator('[data-cell-id="input-and-casting-demo1"]');
  await cell.locator('button.run').click();
  await expect(cell.locator('form.stdin')).toBeVisible();
  await expect(cell.locator('.output')).toContainText('Please enter your name.');
  await cell.locator('form.stdin input').fill('Ada');
  await cell.locator('form.stdin input').press('Enter');
  await expect(cell.locator('.output')).toContainText('Hi Ada');
  await expect(cell.locator('form.stdin')).toBeHidden();
});

test('a loop that never ends can be stopped, and the page stays usable', async ({ page }) => {
  await page.goto('/lessons/input-and-casting');
  await waitForPythonReady(page);
  const cell = page.locator('[data-cell-id="input-and-casting-demo2"]');
  await cell.locator('textarea').fill('print("starting")\nwhile True:\n    pass');
  await cell.locator('button.run').click();
  await expect(cell.locator('button.stop')).toBeVisible();
  expect(await page.evaluate(() => 1 + 1)).toBe(2);
  await cell.locator('button.stop').click();
  await expect(cell.locator('.output')).toContainText('Stopped.');
  await expect(cell.locator('.output')).toContainText('starting');
  await expect(cell.locator('button.run')).toBeEnabled();
});

test('a program waiting for input is not timed out and can be stopped', async ({ page }) => {
  await page.goto('/lessons/input-and-casting');
  await waitForPythonReady(page);
  const cell = page.locator('[data-cell-id="input-and-casting-demo3"]');
  await cell.locator('button.run').click();
  await expect(cell.locator('form.stdin')).toBeVisible();
  await cell.locator('button.stop').click();
  await expect(cell.locator('.output')).toContainText('Stopped.');
});

test('a project script solution takes typed input and prints its result', async ({ page }) => {
  await page.goto('/lessons/average-of-five');
  await waitForPythonReady(page);
  await page.locator('summary', { hasText: 'Show a solution' }).click();
  const cell = page.locator('[data-cell-id="solution-average-of-five"]');
  await cell.locator('button.run').click();
  for (const number of ['-5.4', '2.1', '7.0', '134.8', '-20.0']) {
    await expect(cell.locator('form.stdin')).toBeVisible();
    await cell.locator('form.stdin input').fill(number);
    await cell.locator('form.stdin input').press('Enter');
  }
  await expect(cell.locator('.output')).toContainText('23.7');
});
