import { test, expect } from '@playwright/test';

const BOOKS_API = 'https://demoqa.com/BookStore/v1/Books';

test('renders a mocked book without hitting the real API', async ({ page }) => {
  await page.route(BOOKS_API, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        books: [
          {
            isbn: '0000000000000',
            title: 'Mocked Book Title For Testing',
            subTitle: 'Fully controlled by Playwright route interception',
            author: 'Playwright',
            publish_date: '2024-01-01T00:00:00.000Z',
            publisher: 'Test Suite',
            pages: 42,
            description: 'This response never touched the real DemoQA backend.',
            website: 'https://playwright.dev',
          },
        ],
      }),
    });
  });

  await page.goto('https://demoqa.com/books');

  await expect(page.getByText('Mocked Book Title For Testing')).toBeVisible();
  await expect(page.getByText('Playwright', { exact: true }).first()).toBeVisible();
});

test('shows an empty state when the API returns no books', async ({ page }) => {
  await page.route(BOOKS_API, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ books: [] }),
    });
  });

  await page.goto('https://demoqa.com/books');

  await expect(page.locator('.rt-tr-group')).toHaveCount(0);
  await expect(page.getByText('Page 1 of 0')).toBeVisible();
});

test('surfaces a broken state when the API call fails', async ({ page }) => {
  await page.route(BOOKS_API, (route) => route.abort('failed'));

  await page.goto('https://demoqa.com/books');

  // The book grid never receives data, so no book rows should ever render.
  await expect(page.getByText('Mocked Book Title For Testing')).toHaveCount(0);
});
