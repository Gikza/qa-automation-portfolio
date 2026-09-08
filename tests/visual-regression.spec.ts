import { test, expect } from '@playwright/test';

test('login page visual appearance stays consistent', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await expect(page).toHaveScreenshot('saucedemo-login.png', { maxDiffPixelRatio: 0.02 });
});

test('login form component visual appearance stays consistent', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await expect(page.locator('.login_container')).toHaveScreenshot('saucedemo-login-form.png');
});
