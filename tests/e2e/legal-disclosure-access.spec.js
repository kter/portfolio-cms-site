/**
 * E2E tests for legal disclosure page access and navigation
 * 特定商取引法に基づく表記ページのアクセスとナビゲーションのE2Eテスト
 */

import { test, expect } from '@playwright/test'

test.describe('Legal Disclosure Page Access', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/')
  })

  test('should find legal disclosure link in footer', async ({ page }) => {
    // Look for the legal disclosure link in the footer
    const legalLink = page.locator('footer a[href="/legal-disclosure"]')
    await expect(legalLink).toBeVisible()

    // Check that the link text is correct
    await expect(legalLink).toHaveText(/特定商取引法に基づく表記|通信販売に関する表示事項/)
  })

  test('should navigate to legal disclosure page from footer', async ({ page }) => {
    // Click on the legal disclosure link
    await page.click('footer a[href="/legal-disclosure"]')

    // Verify we're on the correct page
    await expect(page).toHaveURL('/legal-disclosure')

    // Check that the page title is correct
    await expect(page).toHaveTitle(/特定商取引法に基づく表記/)
  })

  test('should display legal disclosure page with proper heading', async ({ page }) => {
    // Navigate directly to the legal disclosure page
    await page.goto('/legal-disclosure')

    // Check for the main heading
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText(/特定商取引法に基づく表記|通信販売に関する表示事項/)
  })

  test('should be accessible via direct URL', async ({ page }) => {
    // Navigate directly to the legal disclosure page
    await page.goto('/legal-disclosure')

    // Verify the page loads without errors
    await expect(page.locator('body')).toBeVisible()

    // Check that we don't get a 404 or error page
    const pageText = await page.textContent('body')
    expect(pageText).not.toContain('404')
    expect(pageText).not.toContain('Page not found')
  })

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/legal-disclosure')

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)

    // Check meta viewport for responsive design
    const metaViewport = page.locator('meta[name="viewport"]')
    await expect(metaViewport).toHaveAttribute('content', /width=device-width/)
  })

  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/legal-disclosure')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Should load within 2 seconds (2000ms) as per performance goals
    expect(loadTime).toBeLessThan(2000)
  })

  test('should have proper breadcrumb navigation', async ({ page }) => {
    await page.goto('/legal-disclosure')

    // Check for breadcrumb or navigation back to home
    const homeLink = page.locator('a[href="/"]')
    await expect(homeLink).toBeVisible()
  })

  test('should maintain header and footer layout', async ({ page }) => {
    await page.goto('/legal-disclosure')

    // Check that header exists (if applicable)
    const header = page.locator('header')
    if (await header.count() > 0) {
      await expect(header).toBeVisible()
    }

    // Check that footer exists
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('should handle browser back button correctly', async ({ page }) => {
    // Start from homepage
    await page.goto('/')

    // Navigate to legal disclosure page
    await page.click('footer a[href="/legal-disclosure"]')
    await expect(page).toHaveURL('/legal-disclosure')

    // Use browser back button
    await page.goBack()
    await expect(page).toHaveURL('/')

    // Use browser forward button
    await page.goForward()
    await expect(page).toHaveURL('/legal-disclosure')
  })

  test('should be crawlable by search engines', async ({ page }) => {
    await page.goto('/legal-disclosure')

    // Check that the page doesn't have noindex meta tag
    const noindexMeta = page.locator('meta[name="robots"][content*="noindex"]')
    await expect(noindexMeta).toHaveCount(0)

    // Check for structured data or JSON-LD
    const structuredData = page.locator('script[type="application/ld+json"]')
    if (await structuredData.count() > 0) {
      await expect(structuredData).toBeVisible()
    }
  })
})

test.describe('Legal Disclosure Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE size

  test('should be accessible on mobile devices', async ({ page }) => {
    await page.goto('/')

    // Footer link should be visible and clickable on mobile
    const legalLink = page.locator('footer a[href="/legal-disclosure"]')
    await expect(legalLink).toBeVisible()

    // Click should work on mobile
    await legalLink.click()
    await expect(page).toHaveURL('/legal-disclosure')
  })

  test('should have mobile-friendly touch targets', async ({ page }) => {
    await page.goto('/')

    const legalLink = page.locator('footer a[href="/legal-disclosure"]')

    // Check that the link has adequate touch target size (at least 44px)
    const boundingBox = await legalLink.boundingBox()
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
  })
})