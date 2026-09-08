import { test, expect } from '@playwright/test';

test('should navigate to playwright.dev and click Get started', async ({ page }) => {
  await page.goto('https://playwright.dev');

  await expect(page).toHaveTitle(/Playwright/);

  await page.getByRole('link', { name: 'Get started' }).click();
});
