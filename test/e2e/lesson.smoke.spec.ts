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
