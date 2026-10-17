import { expect, test } from '@playwright/test';

const CELL = '[data-cell-id="input-and-casting-demo1"]';

test('Tab and Enter indent like a code editor, and undo steps back through them', async ({
  page,
}) => {
  await page.goto('/lessons/input-and-casting');
  const editor = page.locator(`${CELL} textarea`);
  await editor.fill('if True:');
  await editor.press('End');
  await editor.press('Enter');
  await expect(editor).toHaveValue('if True:\n    ');
  await editor.pressSequentially('x = 1');
  await editor.press('Enter');
  await expect(editor).toHaveValue('if True:\n    x = 1\n    ');
  await editor.press('Shift+Tab');
  await expect(editor).toHaveValue('if True:\n    x = 1\n');
  await editor.press('Tab');
  await expect(editor).toHaveValue('if True:\n    x = 1\n    ');
  await editor.press('ControlOrMeta+z');
  await expect(editor).toHaveValue('if True:\n    x = 1\n');
});

test('Escape then Tab leaves the code box instead of indenting', async ({ page }) => {
  await page.goto('/lessons/input-and-casting');
  const editor = page.locator(`${CELL} textarea`);
  await editor.fill('x');
  await editor.press('Escape');
  await editor.press('Tab');
  await expect(editor).toHaveValue('x');
  await expect(editor).not.toBeFocused();
});

test('Shift+Enter runs the cell from the keyboard', async ({ page }) => {
  await page.goto('/lessons/input-and-casting');
  await expect(page.locator('button.run').first()).toBeEnabled({ timeout: 45_000 });
  const cell = page.locator(CELL);
  await cell.locator('textarea').fill('print("from the keyboard")');
  await cell.locator('textarea').press('Shift+Enter');
  await expect(cell.locator('.output')).toContainText('from the keyboard');
  await expect(cell.locator('textarea')).toHaveValue('print("from the keyboard")');
});
