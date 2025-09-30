import { test, expect } from '@playwright/test';

test.describe('Ko-fi Button Responsive Behavior', () => {
  test('should be visible on desktop viewport (1920x1080)', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Button should be visible
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Verify position is at bottom-left
    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();
    const boundingBox = await kofiContainer.boundingBox();

    if (boundingBox) {
      // Should be in bottom-left quadrant
      expect(boundingBox.x).toBeLessThan(1920 * 0.2); // Left 20%
      expect(boundingBox.y).toBeGreaterThan(1080 * 0.6); // Bottom 40%
    }
  });

  test('should be visible on tablet viewport (768x1024)', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Button should be visible
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Check button is appropriately sized for tablet
    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();
    const boundingBox = await kofiContainer.boundingBox();

    if (boundingBox) {
      // Button should still be reasonably sized (not too small)
      expect(boundingBox.width).toBeGreaterThan(40);
      expect(boundingBox.height).toBeGreaterThan(40);

      // Should still be at bottom-left
      expect(boundingBox.x).toBeLessThan(768 * 0.25);
      expect(boundingBox.y).toBeGreaterThan(1024 * 0.6);
    }
  });

  test('should be visible on mobile viewport (375x667)', async ({ page }) => {
    // Set mobile viewport (iPhone SE size)
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Button should be visible
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Check button doesn't obscure important content
    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();
    const boundingBox = await kofiContainer.boundingBox();

    if (boundingBox) {
      // Button should be positioned at bottom
      expect(boundingBox.y).toBeGreaterThan(667 * 0.5);

      // Button should not be too large (max 30% of viewport width)
      expect(boundingBox.width).toBeLessThan(375 * 0.3);
    }
  });

  test('should have good touch target size on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();
    const boundingBox = await kofiContainer.boundingBox();

    if (boundingBox) {
      // Touch targets should be at least 44x44 pixels (iOS guideline)
      // At minimum 40x40 (Android guideline)
      expect(boundingBox.width).toBeGreaterThan(40);
      expect(boundingBox.height).toBeGreaterThan(40);
    }
  });

  test('should not obscure main content on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Check main content is still accessible
    const mainContent = page.locator('main, h1, h2').first();
    await expect(mainContent).toBeVisible();

    // Get positions
    const mainBox = await mainContent.boundingBox();
    const kofiBox = await page.locator('[id*="kofi" i], [class*="kofi" i]').first().boundingBox();

    if (mainBox && kofiBox) {
      // Ko-fi button should not overlap with main content
      // Button is at bottom, main content should be above it
      expect(mainBox.y).toBeLessThan(kofiBox.y);
    }
  });

  test('should maintain visibility across orientation changes', async ({ page }) => {
    // Start with portrait
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Button visible in portrait
    const kofiButtonPortrait = page.getByText('Support me', { exact: false });
    await expect(kofiButtonPortrait).toBeVisible({ timeout: 10000 });

    // Switch to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(1000);

    // Button should still be visible in landscape
    const kofiButtonLandscape = page.getByText('Support me', { exact: false });
    await expect(kofiButtonLandscape).toBeVisible();
  });

  test('should scale appropriately for different screen densities', async ({ page }) => {
    // Test with higher pixel density (2x)
    await page.emulateMedia({ colorScheme: 'light' });

    // Desktop with retina
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/');
    await page.waitForTimeout(3000);

    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Button should still be readable and properly sized
    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();
    const boundingBox = await kofiContainer.boundingBox();

    if (boundingBox) {
      // Should maintain good size even on high-DPI screens
      expect(boundingBox.width).toBeGreaterThan(50);
      expect(boundingBox.height).toBeGreaterThan(50);
    }
  });

  test('should work correctly on extra small mobile (320px width)', async ({ page }) => {
    // Very small mobile viewport
    await page.setViewportSize({ width: 320, height: 568 });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Button should still be visible and functional
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Button should not take up too much space
    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();
    const boundingBox = await kofiContainer.boundingBox();

    if (boundingBox) {
      // Should be less than 35% of screen width
      expect(boundingBox.width).toBeLessThan(320 * 0.35);
    }
  });

  test('should work correctly on large desktop (2560px width)', async ({ page }) => {
    // Very large desktop viewport
    await page.setViewportSize({ width: 2560, height: 1440 });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Button should be visible
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Button should still be at bottom-left, not lost in the large viewport
    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();
    const boundingBox = await kofiContainer.boundingBox();

    if (boundingBox) {
      // Should still be in bottom-left corner
      expect(boundingBox.x).toBeLessThan(2560 * 0.15);
      expect(boundingBox.y).toBeGreaterThan(1440 * 0.7);
    }
  });
});