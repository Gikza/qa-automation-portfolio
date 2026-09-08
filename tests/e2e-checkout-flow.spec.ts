import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';

test('complete purchase flow from login to order confirmation', async ({ page }) => {
  await page.goto(SAUCEDEMO_URL);
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(2);
  await expect(cartItems.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(cartItems.getByText('Sauce Labs Bike Light')).toBeVisible();

  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await page.locator('[data-test="firstName"]').fill('Gika');
  await page.locator('[data-test="lastName"]').fill('QA');
  await page.locator('[data-test="postalCode"]').fill('1000');
  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/checkout-step-two\.html/);
  const summaryItems = page.locator('.cart_item');
  await expect(summaryItems).toHaveCount(2);

  const itemTotal = await page.locator('.summary_subtotal_label').textContent();
  const tax = await page.locator('.summary_tax_label').textContent();
  const total = await page.locator('.summary_total_label').textContent();
  const itemTotalValue = Number(itemTotal?.replace(/[^0-9.]/g, ''));
  const taxValue = Number(tax?.replace(/[^0-9.]/g, ''));
  const totalValue = Number(total?.replace(/[^0-9.]/g, ''));
  expect(totalValue).toBeCloseTo(itemTotalValue + taxValue, 2);

  await page.locator('[data-test="finish"]').click();
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});
