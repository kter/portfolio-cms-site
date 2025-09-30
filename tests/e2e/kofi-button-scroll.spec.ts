import { test, expect } from '@playwright/test';

test.describe('Ko-fi Button Scroll Behavior', () => {
  test('should remain fixed at bottom-left during scroll down', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Get initial button position
    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();
    const initialBox = await kofiContainer.boundingBox();

    if (initialBox) {
      const initialY = initialBox.y;

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(500);

      // Get button position after scroll
      const scrolledBox = await kofiContainer.boundingBox();

      if (scrolledBox) {
        // Button should maintain same viewport position (fixed positioning)
        // Y position relative to viewport should be the same
        expect(Math.abs(scrolledBox.y - initialY)).toBeLessThan(5); // Allow 5px margin for rendering
      }
    }
  });

  test('should remain fixed during scroll to page bottom', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Get initial position
    const initialBox = await kofiContainer.boundingBox();

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Get position after scrolling to bottom
    const bottomBox = await kofiContainer.boundingBox();

    if (initialBox && bottomBox) {
      // Viewport position should be the same (fixed)
      expect(Math.abs(bottomBox.y - initialBox.y)).toBeLessThan(5);
      expect(Math.abs(bottomBox.x - initialBox.x)).toBeLessThan(5);
    }

    // Button should still be visible
    await expect(kofiContainer).toBeVisible();
  });

  test('should remain fixed during scroll back to top', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    // Scroll to bottom first
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Get position at bottom
    const bottomBox = await kofiContainer.boundingBox();

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Get position at top
    const topBox = await kofiContainer.boundingBox();

    if (bottomBox && topBox) {
      // Position should be consistent
      expect(Math.abs(topBox.y - bottomBox.y)).toBeLessThan(5);
      expect(Math.abs(topBox.x - bottomBox.x)).toBeLessThan(5);
    }

    // Button should still be visible
    await expect(kofiContainer).toBeVisible();
  });

  test('should remain visible during smooth scroll animation', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Button should be visible before scroll
    await expect(kofiContainer).toBeVisible();

    // Perform smooth scroll
    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight / 2,
        behavior: 'smooth'
      });
    });

    // Button should remain visible during animation
    await page.waitForTimeout(100);
    await expect(kofiContainer).toBeVisible();

    await page.waitForTimeout(500);
    await expect(kofiContainer).toBeVisible();

    // After animation completes
    await page.waitForTimeout(1000);
    await expect(kofiContainer).toBeVisible();
  });

  test('should maintain z-index above scrolling content', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Get z-index
    const zIndex = await kofiContainer.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // Z-index should be a high number (typically 1000+) to stay above content
    // Or 'auto' if relying on stacking context
    if (zIndex !== 'auto') {
      expect(parseInt(zIndex)).toBeGreaterThan(100);
    }

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Button should still be visible (not covered by scrolling content)
    await expect(kofiContainer).toBeVisible();
  });

  test('should work correctly with rapid scrolling', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Perform rapid scrolling
    for (let i = 0; i < 10; i++) {
      await page.evaluate((offset) => window.scrollBy(0, offset), i * 100);
      await page.waitForTimeout(50);
    }

    // Button should still be visible and in correct position
    await expect(kofiContainer).toBeVisible();

    const boundingBox = await kofiContainer.boundingBox();
    if (boundingBox) {
      const viewportSize = page.viewportSize();
      if (viewportSize) {
        // Should still be at bottom-left
        expect(boundingBox.x).toBeLessThan(viewportSize.width * 0.2);
        expect(boundingBox.y).toBeGreaterThan(viewportSize.height * 0.6);
      }
    }
  });

  test('should not move when content dynamically changes', async ({ page }) => {
    await page.goto('/');

    // Wait for Ko-fi button to load
    await page.waitForTimeout(3000);

    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Get initial position
    const initialBox = await kofiContainer.boundingBox();

    // Simulate dynamic content change (add content to page)
    await page.evaluate(() => {
      const newContent = document.createElement('div');
      newContent.style.height = '500px';
      newContent.textContent = 'Dynamic content added';
      document.body.appendChild(newContent);
    });

    await page.waitForTimeout(500);

    // Get position after content change
    const afterBox = await kofiContainer.boundingBox();

    if (initialBox && afterBox) {
      // Position relative to viewport should remain the same
      expect(Math.abs(afterBox.y - initialBox.y)).toBeLessThan(5);
      expect(Math.abs(afterBox.x - initialBox.x)).toBeLessThan(5);
    }

    // Button should still be visible
    await expect(kofiContainer).toBeVisible();
  });

  test('should handle horizontal scroll on narrow viewports', async ({ page }) => {
    // Set a narrow viewport that might cause horizontal scroll
    await page.setViewportSize({ width: 320, height: 568 });

    await page.goto('/');
    await page.waitForTimeout(3000);

    const kofiContainer = page.locator('[id*="kofi" i], [class*="kofi" i]').first();

    // Get initial position
    const initialBox = await kofiContainer.boundingBox();

    // Try horizontal scroll (if possible)
    await page.evaluate(() => window.scrollBy(50, 0));
    await page.waitForTimeout(500);

    // Get position after horizontal scroll
    const afterBox = await kofiContainer.boundingBox();

    if (initialBox && afterBox) {
      // Button should stay in same viewport position (fixed)
      expect(Math.abs(afterBox.x - initialBox.x)).toBeLessThan(5);
      expect(Math.abs(afterBox.y - initialBox.y)).toBeLessThan(5);
    }

    // Button should still be visible
    await expect(kofiContainer).toBeVisible();
  });
});