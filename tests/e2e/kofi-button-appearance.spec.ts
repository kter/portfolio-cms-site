import { test, expect } from '@playwright/test';

test.describe('Ko-fi Button Appearance', () => {
  test('should display Ko-fi button on home page', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load and Ko-fi script to initialize (2-3 seconds)
    await page.waitForTimeout(3000);

    // Ko-fi widget creates an iframe with specific attributes
    // The button container typically has class or id from Ko-fi
    const kofiButton = page.frameLocator('iframe[title*="kofi" i]').first()
      .or(page.locator('[id*="kofi" i]'))
      .or(page.locator('[class*="kofi" i]'));

    // Assert button exists in DOM
    await expect(kofiButton).toBeVisible({ timeout: 10000 });
  });

  test('should display Ko-fi button on legal-disclosure page', async ({ page }) => {
    await page.goto('/legal-disclosure');

    // Wait for page to fully load and Ko-fi script to initialize
    await page.waitForTimeout(3000);

    // Check for Ko-fi button presence
    const kofiButton = page.frameLocator('iframe[title*="kofi" i]').first()
      .or(page.locator('[id*="kofi" i]'))
      .or(page.locator('[class*="kofi" i]'));

    // Assert button exists and is visible
    await expect(kofiButton).toBeVisible({ timeout: 10000 });
  });

  test('should position Ko-fi button at bottom-left corner', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi script to load and initialize
    await page.waitForTimeout(3000);

    // Find the Ko-fi widget container
    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Get bounding box of the button
    const boundingBox = await kofiContainer.boundingBox();

    if (boundingBox) {
      const viewportSize = page.viewportSize();
      if (viewportSize) {
        // Assert button is in the bottom half of viewport
        expect(boundingBox.y).toBeGreaterThan(viewportSize.height / 2);

        // Assert button is in the left half of viewport
        expect(boundingBox.x).toBeLessThan(viewportSize.width / 2);

        // Ideally, bottom-left means x is close to 0 and y is close to viewport height
        // Allow some margin (within 20% from edges)
        expect(boundingBox.x).toBeLessThan(viewportSize.width * 0.2);
        expect(boundingBox.y).toBeGreaterThan(viewportSize.height * 0.6);
      }
    }
  });

  test('should remain visible after page load completes', async ({ page }) => {
    await page.goto('/');

    // Wait for initial page load
    await page.waitForLoadState('networkidle');

    // Wait for Ko-fi script
    await page.waitForTimeout(3000);

    // Check button is still visible after all loading completes
    const kofiButton = page.frameLocator('iframe[title*="kofi" i]').first()
      .or(page.locator('[id*="kofi" i]'))
      .or(page.locator('[class*="kofi" i]'));

    await expect(kofiButton).toBeVisible({ timeout: 10000 });

    // Verify it doesn't disappear after additional wait
    await page.waitForTimeout(2000);
    await expect(kofiButton).toBeVisible();
  });

  test('should load without blocking page render', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Page should load quickly even if Ko-fi script is still loading
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    // Page should be interactive within 2 seconds
    expect(loadTime).toBeLessThan(2000);

    // Main content should be visible before Ko-fi loads
    await expect(page.locator('h1, h2, main')).toBeVisible();
  });
});