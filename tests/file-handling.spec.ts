import { test, expect } from '@playwright/test';
import path from 'path';

const SAMPLE_FILE = path.join(__dirname, 'fixtures', 'sample-upload.txt');

test('uploading a file shows a confirmation with its name', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');

  await page.locator('#file-upload').setInputFiles(SAMPLE_FILE);
  await page.locator('#file-submit').click();

  await expect(page.locator('h3')).toHaveText('File Uploaded!');
  await expect(page.locator('#uploaded-files')).toHaveText('sample-upload.txt');
});

test('downloading a file saves it with the expected name', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/download');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'some-file.txt' }).click(),
  ]);

  expect(download.suggestedFilename()).toBe('some-file.txt');

  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy();
});
