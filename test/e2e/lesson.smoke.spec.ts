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

test('an exercise passes a correct solution and fails a wrong one', async ({ page }) => {
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

test('passing an exercise records progress and restores it on reload', async ({ page }) => {
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

test('shows no sign-in form when auth is unconfigured (dev)', async ({ page }) => {
  await page.goto('/lessons/functions');
  await waitForPythonReady(page);
  await expect(page.locator('#auth form')).toHaveCount(0);
});
