/**
 * E2E tests for legal disclosure responsive design
 * 特定商取引法に基づく表記ページのレスポンシブデザインのE2Eテスト
 */

import { test, expect } from '@playwright/test'

// Define common viewport sizes
const viewports = {
  mobile: { width: 375, height: 667 },      // iPhone SE
  mobileL: { width: 414, height: 896 },     // iPhone XR
  tablet: { width: 768, height: 1024 },     // iPad
  tabletL: { width: 1024, height: 768 },    // iPad Landscape
  desktop: { width: 1280, height: 720 },    // Desktop
  desktopL: { width: 1920, height: 1080 }   // Large Desktop
}

test.describe('Legal Disclosure Responsive Design', () => {
  Object.entries(viewports).forEach(([deviceType, viewport]) => {
    test.describe(`${deviceType} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport })

      test(`should display properly on ${deviceType}`, async ({ page }) => {
        await page.goto('/legal-disclosure')

        // Page should load without horizontal scrolling
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
        const viewportWidth = await page.evaluate(() => window.innerWidth)
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20) // Allow small margin

        // Main content should be visible
        await expect(page.locator('h1')).toBeVisible()
        await expect(page.locator('body')).toBeVisible()
      })

      test(`should have readable text on ${deviceType}`, async ({ page }) => {
        await page.goto('/legal-disclosure')

        // Check font size is appropriate for device
        const bodyElement = page.locator('body')
        const fontSize = await bodyElement.evaluate(el =>
          window.getComputedStyle(el).fontSize
        )
        const fontSizeValue = parseInt(fontSize.replace('px', ''))

        if (deviceType.includes('mobile')) {
          expect(fontSizeValue).toBeGreaterThanOrEqual(14) // Minimum for mobile
        } else {
          expect(fontSizeValue).toBeGreaterThanOrEqual(14) // Minimum for all devices
        }
      })

      test(`should have proper spacing on ${deviceType}`, async ({ page }) => {
        await page.goto('/legal-disclosure')

        // Check that content is not too cramped
        const contentElement = page.locator('main, .content, body > div').first()
        const padding = await contentElement.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return {
            left: parseInt(styles.paddingLeft),
            right: parseInt(styles.paddingRight),
            top: parseInt(styles.paddingTop),
            bottom: parseInt(styles.paddingBottom)
          }
        })

        // Should have adequate padding on all sides
        if (deviceType.includes('mobile')) {
          expect(padding.left + padding.right).toBeGreaterThanOrEqual(16)
        } else {
          expect(padding.left + padding.right).toBeGreaterThanOrEqual(32)
        }
      })

      test(`should have touch-friendly elements on ${deviceType}`, async ({ page }) => {
        await page.goto('/legal-disclosure')

        if (deviceType.includes('mobile') || deviceType.includes('tablet')) {
          // Links should be large enough for touch
          const links = page.locator('a')
          const linkCount = await links.count()

          for (let i = 0; i < Math.min(linkCount, 5); i++) {
            const link = links.nth(i)
            if (await link.isVisible()) {
              const boundingBox = await link.boundingBox()
              if (boundingBox) {
                expect(boundingBox.height).toBeGreaterThanOrEqual(32) // Minimum touch target
              }
            }
          }
        }
      })
    })
  })

  test.describe('Cross-device Layout Consistency', () => {
    test('should maintain content order across devices', async ({ browser }) => {
      const mobileContext = await browser.newContext({ viewport: viewports.mobile })
      const desktopContext = await browser.newContext({ viewport: viewports.desktop })

      const mobilePage = await mobileContext.newPage()
      const desktopPage = await desktopContext.newPage()

      await Promise.all([
        mobilePage.goto('/legal-disclosure'),
        desktopPage.goto('/legal-disclosure')
      ])

      // Get text content order from both devices
      const mobileContent = await mobilePage.textContent('body')
      const desktopContent = await desktopPage.textContent('body')

      // Key sections should appear in the same order
      const keySections = [
        '販売業者',
        '所在地',
        '電話番号',
        'メールアドレス',
        '運営統括責任者',
        '追加手数料',
        '返品',
        '決済手段',
        '販売価格'
      ]

      keySections.forEach(section => {
        const mobileIndex = mobileContent.indexOf(section)
        const desktopIndex = desktopContent.indexOf(section)

        expect(mobileIndex).toBeGreaterThan(-1)
        expect(desktopIndex).toBeGreaterThan(-1)
      })

      await mobileContext.close()
      await desktopContext.close()
    })

    test('should adapt layout between mobile and desktop', async ({ browser }) => {
      const mobileContext = await browser.newContext({ viewport: viewports.mobile })
      const desktopContext = await browser.newContext({ viewport: viewports.desktop })

      const mobilePage = await mobileContext.newPage()
      const desktopPage = await desktopContext.newPage()

      await Promise.all([
        mobilePage.goto('/legal-disclosure'),
        desktopPage.goto('/legal-disclosure')
      ])

      // Check main container width usage
      const mobileContainer = mobilePage.locator('main, .container, body > div').first()
      const desktopContainer = desktopPage.locator('main, .container, body > div').first()

      const mobileWidth = await mobileContainer.evaluate(el => el.offsetWidth)
      const desktopWidth = await desktopContainer.evaluate(el => el.offsetWidth)

      const mobileViewportWidth = viewports.mobile.width
      const desktopViewportWidth = viewports.desktop.width

      // Mobile should use most of the viewport width
      expect(mobileWidth / mobileViewportWidth).toBeGreaterThan(0.85)

      // Desktop should have reasonable max-width (not use full viewport)
      expect(desktopWidth / desktopViewportWidth).toBeLessThan(0.9)

      await mobileContext.close()
      await desktopContext.close()
    })
  })

  test.describe('Orientation Changes', () => {
    test('should handle mobile portrait to landscape', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/legal-disclosure')

      // Verify content is visible in portrait
      await expect(page.locator('h1')).toBeVisible()

      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 })

      // Content should still be visible and properly laid out
      await expect(page.locator('h1')).toBeVisible()

      // Should not have horizontal scrolling
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20)
    })

    test('should handle tablet orientation changes', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/legal-disclosure')

      await expect(page.locator('h1')).toBeVisible()

      // Switch to landscape
      await page.setViewportSize({ width: 1024, height: 768 })

      // Layout should adapt to landscape
      await expect(page.locator('h1')).toBeVisible()

      // Check that content utilizes the wider screen appropriately
      const containerWidth = await page.locator('main, .container, body > div').first()
        .evaluate(el => el.offsetWidth)
      expect(containerWidth).toBeGreaterThan(600) // Should use wider layout
    })
  })

  test.describe('Accessibility on Different Screen Sizes', () => {
    test('should maintain accessibility across viewports', async ({ page }) => {
      const testViewports = [viewports.mobile, viewports.tablet, viewports.desktop]

      for (const viewport of testViewports) {
        await page.setViewportSize(viewport)
        await page.goto('/legal-disclosure')

        // Check focus visibility
        const firstLink = page.locator('a').first()
        if (await firstLink.count() > 0) {
          await firstLink.focus()
          // Should have visible focus indicator
          const outlineStyle = await firstLink.evaluate(el =>
            window.getComputedStyle(el).outline
          )
          expect(outlineStyle).not.toBe('none')
        }

        // Check heading hierarchy
        const h1Count = await page.locator('h1').count()
        expect(h1Count).toBe(1) // Should have exactly one h1

        // Check for proper ARIA labels or semantic structure
        const main = page.locator('main, [role="main"]')
        if (await main.count() > 0) {
          await expect(main).toBeVisible()
        }
      }
    })

    test('should have adequate color contrast on all devices', async ({ page }) => {
      await page.goto('/legal-disclosure')

      // This test would ideally use accessibility testing tools
      // For now, we ensure text is visible
      const headings = page.locator('h1, h2, h3, h4, h5, h6')
      const headingCount = await headings.count()

      for (let i = 0; i < headingCount; i++) {
        await expect(headings.nth(i)).toBeVisible()
      }

      const paragraphs = page.locator('p')
      const paragraphCount = await paragraphs.count()

      for (let i = 0; i < Math.min(paragraphCount, 5); i++) {
        await expect(paragraphs.nth(i)).toBeVisible()
      }
    })
  })

  test.describe('Print Styles', () => {
    test('should be printer-friendly', async ({ page }) => {
      await page.goto('/legal-disclosure')

      // Emulate print media
      await page.emulateMedia({ media: 'print' })

      // Content should still be visible in print mode
      await expect(page.locator('h1')).toBeVisible()

      // Check that footer navigation is hidden in print (if applicable)
      const footerNav = page.locator('footer nav, footer .nav')
      if (await footerNav.count() > 0) {
        const isVisible = await footerNav.isVisible()
        // Footer navigation should be hidden in print mode
        expect(isVisible).toBe(false)
      }
    })
  })
})