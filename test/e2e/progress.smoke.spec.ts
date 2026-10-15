import { expect, test } from '@playwright/test';

test('ticking a project marks it done in the sidebar, survives a reload, and can be undone', async ({
  page,
}) => {
  await page.goto('/lessons/number-guessing');
  const box = page.locator('#project-done');
  await expect(box).toBeEnabled();
  const entry = page.locator('.sidebar li', {
    has: page.locator('a[href="/lessons/number-guessing"]'),
  });
  await box.check();
  await expect(entry).toHaveClass(/complete/);
  await expect(page.locator('#project-done-hint')).toContainText('marked as done');

  await page.reload();
  await expect(page.locator('#project-done')).toBeChecked();

  await page.locator('#project-done').uncheck();
  await expect(entry).not.toHaveClass(/complete/);
  await page.reload();
  await expect(page.locator('#project-done')).not.toBeChecked();
});

test('the home page offers to continue the lesson you were last on', async ({ page }) => {
  await page.goto('/lessons/loops');
  await expect(page.locator('main[data-lesson-id="loops"]')).toBeVisible();
  await page.goto('/');
  const banner = page.locator('#continue');
  await expect(banner).toBeVisible();
  await expect(banner.locator('a')).toContainText('Iteration and Looping');
  await banner.locator('a').click();
  await expect(page).toHaveURL(/\/lessons\/loops$/);
});

test('the course page counts projects in its progress total', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.course.available .count')).toContainText(/of \d+ done/);
});
