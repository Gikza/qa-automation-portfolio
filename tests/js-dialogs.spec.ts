import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
});

test('accepting a JS alert', async ({ page }) => {
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();

  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});

test('accepting a JS confirm', async ({ page }) => {
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

  await expect(page.locator('#result')).toHaveText('You clicked: Ok');
});

test('dismissing a JS confirm', async ({ page }) => {
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

  await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
});

test('answering a JS prompt', async ({ page }) => {
  page.once('dialog', (dialog) => dialog.accept('Playwright'));
  await page.getByRole('button', { name: 'Click for JS Prompt' }).click();

  await expect(page.locator('#result')).toHaveText('You entered: Playwright');
});
