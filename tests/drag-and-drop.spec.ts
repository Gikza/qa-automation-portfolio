import { test, expect } from '@playwright/test';

// WebKit has a known limitation simulating the HTML5 DataTransfer payload
// this page relies on (dataTransfer.setData/getData in dragstart/drop), so
// the drop target ends up empty instead of receiving the dragged content.
// This is a Playwright/WebKit engine limitation, not an app or test bug.
test.skip(({ browserName }) => browserName === 'webkit', 'WebKit cannot simulate native HTML5 DataTransfer for this page');

test('dragging column A onto column B swaps their labels', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  const columnA = page.locator('#column-a');
  const columnB = page.locator('#column-b');

  await expect(columnA.locator('header')).toHaveText('A');
  await expect(columnB.locator('header')).toHaveText('B');

  await columnA.dragTo(columnB);

  await expect(columnA.locator('header')).toHaveText('B');
  await expect(columnB.locator('header')).toHaveText('A');
});
