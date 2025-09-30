import { test, expect } from '@playwright/test';

test.describe('Ko-fi Button Multi-Page Visibility', () => {
  test('should appear on home page', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Button should be visible on home page
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });
  });

  test('should appear on legal-disclosure page', async ({ page }) => {
    await page.goto('/legal-disclosure');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Button should be visible on legal-disclosure page
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });
  });

  test('should persist when navigating from home to legal-disclosure', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Verify button exists on home
    const homeButton = page.getByText('Support me', { exact: false });
    await expect(homeButton).toBeVisible({ timeout: 10000 });

    // Navigate to legal-disclosure
    await page.click('a[href="/legal-disclosure"]');
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // Verify button still exists on new page
    const legalButton = page.getByText('Support me', { exact: false });
    await expect(legalButton).toBeVisible({ timeout: 10000 });
  });

  test('should persist when navigating from legal-disclosure to home', async ({ page }) => {
    // Start at legal-disclosure page
    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);

    // Verify button exists on legal-disclosure
    const legalButton = page.getByText('Support me', { exact: false });
    await expect(legalButton).toBeVisible({ timeout: 10000 });

    // Navigate back to home
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // Verify button exists on home
    const homeButton = page.getByText('Support me', { exact: false });
    await expect(homeButton).toBeVisible({ timeout: 10000 });
  });

  test('should remain functional after multiple page navigations', async ({ page }) => {
    // Navigate home -> legal -> home -> legal
    await page.goto('/');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });

    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });

    await page.goto('/');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });

    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);

    // Button should still be visible and functional
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Should still be clickable
    await kofiButton.click();
    await page.waitForTimeout(1000);

    // Overlay should appear
    const hasOverlay = await page.locator('[class*="overlay" i], [class*="modal" i], iframe[src*="ko-fi" i]').count();
    expect(hasOverlay).toBeGreaterThan(0);
  });

  test('should handle browser back button navigation', async ({ page }) => {
    // Navigate to home
    await page.goto('/');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });

    // Navigate to legal-disclosure
    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });

    // Use browser back button
    await page.goBack();
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // Should be back on home page
    await expect(page).toHaveURL('/');

    // Button should still be visible
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });
  });

  test('should handle browser forward button navigation', async ({ page }) => {
    // Navigate through pages
    await page.goto('/');
    await page.waitForTimeout(3000);

    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);

    // Go back
    await page.goBack();
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // Go forward
    await page.goForward();
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // Should be on legal-disclosure page
    await expect(page).toHaveURL(/.*legal-disclosure/);

    // Button should be visible
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });
  });

  test('should maintain state consistency across pages', async ({ page }) => {
    // Open overlay on home page
    await page.goto('/');
    await page.waitForTimeout(3000);

    const homeButton = page.getByText('Support me', { exact: false });
    await homeButton.click();
    await page.waitForTimeout(1000);

    // Close overlay
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Navigate to legal-disclosure
    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);

    // Button should be in closed state (not showing overlay from previous page)
    const legalButton = page.getByText('Support me', { exact: false });
    await expect(legalButton).toBeVisible({ timeout: 10000 });

    // Overlay should not be open
    const hasOpenOverlay = await page.locator('[class*="overlay" i]').isVisible();
    expect(hasOpenOverlay).toBeFalsy();
  });

  test('should not duplicate on page transitions', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Count Ko-fi buttons on home page
    const homeButtonCount = await page.getByText('Support me', { exact: false }).count();

    // Navigate to legal-disclosure
    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);

    // Count Ko-fi buttons on legal page
    const legalButtonCount = await page.getByText('Support me', { exact: false }).count();

    // Should have same count (only one button per page)
    expect(homeButtonCount).toBe(legalButtonCount);

    // Should have exactly 1 button (not duplicated)
    expect(legalButtonCount).toBe(1);
  });

  test('should initialize correctly on direct page access', async ({ page }) => {
    // Access legal-disclosure directly (not via navigation)
    await page.goto('/legal-disclosure');
    await page.waitForTimeout(3000);

    // Button should be visible even when accessing page directly
    const kofiButton = page.getByText('Support me', { exact: false });
    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Should be clickable
    await kofiButton.click();
    await page.waitForTimeout(1000);

    // Should function properly
    const hasOverlay = await page.locator('[class*="overlay" i], iframe[src*="ko-fi" i]').count();
    expect(hasOverlay).toBeGreaterThan(0);
  });

  test('should handle page refresh correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Verify button exists
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });

    // Refresh page
    await page.reload();
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // Button should still be visible after refresh
    await expect(page.getByText('Support me', { exact: false })).toBeVisible({ timeout: 10000 });
  });

  test('should work across all site pages consistently', async ({ page }) => {
    const pages = ['/', '/legal-disclosure'];
    const results: boolean[] = [];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForTimeout(3000);

      const kofiButton = page.getByText('Support me', { exact: false });
      const isVisible = await kofiButton.isVisible({ timeout: 10000 });

      results.push(isVisible);
    }

    // All pages should have the button visible
    expect(results.every(result => result === true)).toBeTruthy();
  });
});