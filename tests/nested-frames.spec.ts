import { test, expect } from '@playwright/test';

test('reading content from frames nested inside other frames', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/nested_frames');

  const left = page.frame({ name: 'frame-left' });
  const middle = page.frame({ name: 'frame-middle' });
  const right = page.frame({ name: 'frame-right' });
  const bottom = page.frame({ name: 'frame-bottom' });

  await expect(left!.locator('body')).toHaveText('LEFT');
  await expect(middle!.locator('body')).toHaveText('MIDDLE');
  await expect(right!.locator('body')).toHaveText('RIGHT');
  await expect(bottom!.locator('body')).toHaveText('BOTTOM');
});
