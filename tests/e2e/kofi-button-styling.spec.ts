import { test, expect } from '@playwright/test';

test.describe('Ko-fi Button Styling', () => {
  test('should display "Support me" text', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi script to load
    await page.waitForTimeout(3000);

    // Check for "Support me" text in the page
    // Ko-fi button should contain this text
    const supportText = page.getByText('Support me', { exact: false });

    await expect(supportText).toBeVisible({ timeout: 10000 });
  });

  test('should have cyan blue background color', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Find element with Ko-fi branding
    const kofiButton = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Get computed background color
    const backgroundColor = await kofiButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Convert #00b9fe to RGB: rgb(0, 185, 254)
    // Ko-fi might apply the color slightly differently, so we check for similar blue tones
    const isBlueish = backgroundColor.includes('rgb') &&
      (backgroundColor.includes('0, 185, 254') || // Exact match
       backgroundColor.includes('0, 184') ||  // Close match
       backgroundColor.includes('0, 186'));  // Close match

    expect(isBlueish || backgroundColor.includes('#00b9fe')).toBeTruthy();
  });

  test('should have white text color', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Find the "Support me" text element
    const supportText = page.getByText('Support me', { exact: false });

    if (await supportText.isVisible()) {
      // Get text color
      const textColor = await supportText.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // White color is rgb(255, 255, 255)
      const isWhiteish = textColor.includes('rgb(255, 255, 255)') ||
        textColor.includes('rgb(254, 254, 254)') ||
        textColor === 'white';

      expect(isWhiteish).toBeTruthy();
    }
  });

  test('should maintain styling consistency across pages', async ({ page }) => {
    // Check home page
    await page.goto('/');
    await page.waitForTimeout(3000);

    const homeButtonText = page.getByText('Support me', { exact: false });
    await expect(homeButtonText).toBeVisible({ timeout: 10000 });

    const homeColor = await homeButtonText.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Check legal-disclosure page
    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);

    const legalButtonText = page.getByText('Support me', { exact: false });
    await expect(legalButtonText).toBeVisible({ timeout: 10000 });

    const legalColor = await legalButtonText.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Styling should be consistent
    expect(homeColor).toBe(legalColor);
  });

  test('should be visually distinct and noticeable', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    const kofiButton = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Button should be visible
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Button should have reasonable size (not too small)
    const boundingBox = await kofiButton.boundingBox();
    if (boundingBox) {
      // Button should be at least 40x40 pixels (good touch target)
      expect(boundingBox.width).toBeGreaterThan(40);
      expect(boundingBox.height).toBeGreaterThan(40);
    }
  });

  test('should not be transparent or hidden', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    const kofiButton = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Check opacity
    const opacity = await kofiButton.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    // Opacity should be 1 (fully visible) or close to it
    expect(parseFloat(opacity)).toBeGreaterThan(0.8);

    // Check display property
    const display = await kofiButton.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });

    expect(display).not.toBe('none');

    // Check visibility
    const visibility = await kofiButton.evaluate((el) => {
      return window.getComputedStyle(el).visibility;
    });

    expect(visibility).not.toBe('hidden');
  });
});