import { test, expect } from '@playwright/test';

test('should search for "notebook" on MercadoLibre and show matching results', async ({ page }) => {
  await page.goto('https://www.mercadolibre.com.ar');

  const cookiesButton = page.getByRole('button', { name: 'Aceptar cookies' });
  if (await cookiesButton.isVisible().catch(() => false)) {
    await cookiesButton.click();
  }

  const searchBox = page.getByRole('search').getByRole('combobox');
  await searchBox.fill('notebook');
  await searchBox.press('Enter');

  await expect(page).toHaveURL(/notebook/i, { timeout: 15000 });
  await expect(page).toHaveTitle(/notebook/i, { timeout: 15000 });
  await expect(page.getByText(/[\d.,]+\s*resultados/i).first()).toBeVisible({ timeout: 15000 });

  const firstProductTitle = page.locator('.poly-component__title').first();
  await expect(firstProductTitle).toBeVisible({ timeout: 15000 });
  await expect(firstProductTitle).toContainText(/notebook/i);
});
