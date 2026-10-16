import { expect, test } from '@playwright/test';

test('Reset puts a cell back to its original code, and Undo reset brings the edit back', async ({
  page,
}) => {
  await page.goto('/lessons/input-and-casting');
  const cell = page.locator('[data-cell-id="input-and-casting-demo1"]');
  const editor = cell.locator('textarea');
  const reset = cell.locator('button.reset');
  const original = await editor.inputValue();

  await expect(reset).toBeDisabled();
  await editor.fill('print("I broke it")');
  await expect(reset).toBeEnabled();

  await reset.click();
  await expect(editor).toHaveValue(original);
  await expect(reset).toHaveText('Undo reset');

  await reset.click();
  await expect(editor).toHaveValue('print("I broke it")');
  await expect(reset).toHaveText('Reset');
});

test('a quiz can be reset after a failed attempt', async ({ page }) => {
  await page.goto('/lessons/functions');
  await expect(page.locator('button.run').first()).toBeEnabled({ timeout: 45_000 });
  const cell = page.locator('[data-cell-id="double-number"]');
  const original = await cell.locator('textarea').inputValue();
  await cell.locator('textarea').fill('def double_num(x):\n    return x + 1\nprint(double_num(5))');
  await cell.locator('button.run').click();
  await expect(cell.locator('.output')).toContainText('✗');
  await cell.locator('button.reset').click();
  await expect(cell.locator('textarea')).toHaveValue(original);
});

test('Reset is off while a cell runs and on again when it stops', async ({ page }) => {
  await page.goto('/lessons/input-and-casting');
  await expect(page.locator('button.run').first()).toBeEnabled({ timeout: 45_000 });
  const cell = page.locator('[data-cell-id="input-and-casting-demo2"]');
  await cell.locator('textarea').fill('while True:\n    pass');
  await cell.locator('button.run').click();
  await expect(cell.locator('button.stop')).toBeVisible();
  await expect(cell.locator('button.reset')).toBeDisabled();
  await cell.locator('button.stop').click();
  await expect(cell.locator('.output')).toContainText('Stopped.');
  await expect(cell.locator('button.reset')).toBeEnabled();
});
