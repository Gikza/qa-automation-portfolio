import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('playwright.dev homepage has no critical or serious accessibility violations', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrWorse = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');

  expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
});

test('saucedemo login page has no critical or serious accessibility violations', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrWorse = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');

  expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
});
