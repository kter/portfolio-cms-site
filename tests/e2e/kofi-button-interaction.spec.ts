import { test, expect } from '@playwright/test';

test.describe('Ko-fi Button Interaction', () => {
  test('should be clickable', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Find Ko-fi button
    const kofiButton = page.getByText('Support me', { exact: false });

    // Button should be visible
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Check that pointer-events are enabled
    const pointerEvents = await kofiButton.evaluate((el) => {
      return window.getComputedStyle(el).pointerEvents;
    });

    expect(pointerEvents).not.toBe('none');
  });

  test('should open Ko-fi overlay when clicked', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Find and click Ko-fi button
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Click the button
    await kofiButton.click();

    // Wait for overlay to appear
    await page.waitForTimeout(1000);

    // Check for Ko-fi overlay elements
    // Ko-fi overlay might be in an iframe or modal
    const hasOverlay = await page.locator('[class*="overlay" i], [class*="modal" i], iframe[src*="ko-fi" i]').count();

    expect(hasOverlay).toBeGreaterThan(0);
  });

  test('should display Ko-fi content with username "kterr"', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Click Ko-fi button
    const kofiButton = page.getByText('Support me', { exact: false });
    await kofiButton.click();

    // Wait for overlay content to load
    await page.waitForTimeout(2000);

    // Check for username 'kterr' in the page or iframe
    const hasUsername = await page.getByText('kterr', { exact: false }).count() > 0 ||
      await page.locator('iframe[src*="kterr" i]').count() > 0 ||
      await page.locator('[href*="kterr" i]').count() > 0;

    expect(hasUsername).toBeTruthy();
  });

  test('should allow closing the overlay', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Click Ko-fi button to open overlay
    const kofiButton = page.getByText('Support me', { exact: false });
    await kofiButton.click();

    // Wait for overlay to appear
    await page.waitForTimeout(1000);

    // Try to find close button (X, close, or overlay background)
    const closeButton = page.locator('[class*="close" i], [aria-label*="close" i]').first();

    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Try clicking outside overlay (if click-outside-to-close is enabled)
      await page.keyboard.press('Escape');
    }

    // Wait for overlay to close
    await page.waitForTimeout(1000);

    // Ko-fi button should still be visible after closing overlay
    await expect(kofiButton).toBeVisible();
  });

  test('should remain functional after overlay interaction', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    const kofiButton = page.getByText('Support me', { exact: false });

    // First click - open overlay
    await kofiButton.click();
    await page.waitForTimeout(1000);

    // Close overlay
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Button should still be visible and clickable
    await expect(kofiButton).toBeVisible();

    // Second click - should open overlay again
    await kofiButton.click();
    await page.waitForTimeout(1000);

    // Check overlay appears again
    const hasOverlay = await page.locator('[class*="overlay" i], [class*="modal" i], iframe[src*="ko-fi" i]').count();
    expect(hasOverlay).toBeGreaterThan(0);
  });

  test('should not complete donation without explicit confirmation', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Click Ko-fi button
    const kofiButton = page.getByText('Support me', { exact: false });
    await kofiButton.click();

    // Wait for overlay
    await page.waitForTimeout(2000);

    // Close overlay without completing donation
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Page should return to normal state
    // No payment confirmation or processing should occur
    await expect(kofiButton).toBeVisible();

    // No payment success messages should appear
    const hasSuccessMessage = await page.getByText('payment', { exact: false }).count() > 0 ||
      await page.getByText('thank you', { exact: false }).count() > 0;

    expect(hasSuccessMessage).toBeFalsy();
  });

  test('should not interfere with page navigation', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Open Ko-fi overlay
    const kofiButton = page.getByText('Support me', { exact: false });
    await kofiButton.click();
    await page.waitForTimeout(1000);

    // Close overlay
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Navigate to another page
    await page.click('a[href="/legal-disclosure"]');

    // Page navigation should work normally
    await expect(page).toHaveURL(/.*legal-disclosure/);

    // Ko-fi button should appear on new page
    await page.waitForTimeout(3000);
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });
  });
});