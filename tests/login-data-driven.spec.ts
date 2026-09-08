import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';

const cases: { name: string; username: string; password: string; expectedError?: string }[] = [
  { name: 'valid standard user', username: 'standard_user', password: 'secret_sauce' },
  {
    name: 'locked out user',
    username: 'locked_out_user',
    password: 'secret_sauce',
    expectedError: 'Sorry, this user has been locked out.',
  },
  {
    name: 'wrong password',
    username: 'standard_user',
    password: 'not_the_right_password',
    expectedError: 'Username and password do not match any user in this service',
  },
  {
    name: 'empty credentials',
    username: '',
    password: '',
    expectedError: 'Username is required',
  },
];

for (const { name, username, password, expectedError } of cases) {
  test(`login as ${name}`, async ({ page }) => {
    await page.goto(SAUCEDEMO_URL);

    await page.locator('#user-name').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#login-button').click();

    if (expectedError) {
      await expect(page.locator('[data-test="error"]')).toContainText(expectedError);
      await expect(page).toHaveURL(SAUCEDEMO_URL + '/');
    } else {
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.locator('.title')).toHaveText('Products');
    }
  });
}
