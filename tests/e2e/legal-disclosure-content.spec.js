/**
 * E2E tests for legal disclosure content completeness
 * 特定商取引法に基づく表記ページのコンテンツ完全性のE2Eテスト
 */

import { test, expect } from '@playwright/test'

test.describe('Legal Disclosure Content Completeness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/legal-disclosure')
  })

  test('should display all mandatory business information', async ({ page }) => {
    // Business operator name
    await expect(page.locator('text=販売業者の名称')).toBeVisible()
    await expect(page.locator('text=高橋智彦')).toBeVisible()

    // Administrative supervisor
    await expect(page.locator('text=運営統括責任者')).toBeVisible()
    await expect(page.locator('text=高橋智彦')).toBeVisible()
  })

  test('should display contact information section', async ({ page }) => {
    // Email address section
    await expect(page.locator('text=メールアドレス')).toBeVisible()
    await expect(page.locator('text=contact@tomohiko.io')).toBeVisible()

    // Business hours
    await expect(page.locator('text=営業時間')).toBeVisible()
    await expect(page.locator('text=平日 10:00-18:00')).toBeVisible()
  })

  test('should display address information or privacy protection notice', async ({ page }) => {
    // Address section should exist
    await expect(page.locator('text=所在地')).toBeVisible()

    // Should show either full address or privacy protection notice
    const hasAddress = await page.locator('text=〒').count() > 0
    const hasPrivacyNotice = await page.locator('text=請求があったら遅滞なく開示します').count() > 0

    expect(hasAddress || hasPrivacyNotice).toBe(true)
  })

  test('should display phone contact information', async ({ page }) => {
    // Phone section should exist
    await expect(page.locator('text=電話番号')).toBeVisible()

    // Should show either phone number or privacy protection notice
    const hasPhoneNumber = await page.locator('text=03-').count() > 0 || await page.locator('text=090-').count() > 0
    const hasPrivacyNotice = await page.locator('text=請求があったら遅滞なく開示します').count() > 0

    expect(hasPhoneNumber || hasPrivacyNotice).toBe(true)
  })

  test('should display additional fees information', async ({ page }) => {
    await expect(page.locator('text=追加手数料')).toBeVisible()

    // Should have fee information
    const hasFeeInfo = await page.locator('text=配送料').count() > 0 ||
                      await page.locator('text=手数料').count() > 0 ||
                      await page.locator('text=なし').count() > 0

    expect(hasFeeInfo).toBe(true)
  })

  test('should display return and exchange policy', async ({ page }) => {
    // Return policy section
    await expect(page.locator('text=返品・交換')).toBeVisible()

    // Customer initiated returns
    await expect(page.locator('text=お客様都合')).toBeVisible()

    // Defective product returns
    await expect(page.locator('text=不備がある場合')).toBeVisible()

    // Time limits should be specified
    await expect(page.locator('text=日以内')).toBeVisible()
  })

  test('should display delivery information', async ({ page }) => {
    // Delivery/provision timing
    await expect(page.locator('text=引渡時期')).toBeVisible()

    // Should have delivery timeframe information
    const hasDeliveryInfo = await page.locator('text=即座').count() > 0 ||
                          await page.locator('text=営業日').count() > 0 ||
                          await page.locator('text=サービス提供').count() > 0

    expect(hasDeliveryInfo).toBe(true)
  })

  test('should display accepted payment methods', async ({ page }) => {
    await expect(page.locator('text=決済手段')).toBeVisible()

    // Should list payment methods
    const hasPaymentMethods = await page.locator('text=クレジットカード').count() > 0 ||
                            await page.locator('text=銀行振込').count() > 0

    expect(hasPaymentMethods).toBe(true)
  })

  test('should display payment timing requirements', async ({ page }) => {
    await expect(page.locator('text=決済期間')).toBeVisible()

    // Should specify when payment is processed
    const hasPaymentTiming = await page.locator('text=即座').count() > 0 ||
                           await page.locator('text=確認後').count() > 0

    expect(hasPaymentTiming).toBe(true)
  })

  test('should display pricing information including tax', async ({ page }) => {
    await expect(page.locator('text=販売価格')).toBeVisible()

    // Should specify tax treatment
    const hasTaxInfo = await page.locator('text=税込').count() > 0 ||
                      await page.locator('text=消費税').count() > 0

    expect(hasTaxInfo).toBe(true)

    // Should specify currency
    await expect(page.locator('text=JPY')).toBeVisible()
  })

  test('should have all content in Japanese language', async ({ page }) => {
    const pageText = await page.textContent('body')

    // Check for key Japanese terms that must be present
    const requiredJapaneseTerms = [
      '特定商取引法に基づく表記',
      '販売業者',
      '所在地',
      '電話番号',
      'メールアドレス',
      '運営統括責任者',
      '追加手数料',
      '返品',
      '引渡時期',
      '決済手段',
      '販売価格'
    ]

    requiredJapaneseTerms.forEach(term => {
      expect(pageText).toContain(term)
    })
  })

  test('should display content in proper structured format', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toHaveText(/特定商取引法に基づく表記|通信販売に関する表示事項/)

    // Should have section headings (h2 or h3)
    const sectionHeadings = page.locator('h2, h3')
    const headingCount = await sectionHeadings.count()
    expect(headingCount).toBeGreaterThan(3) // Should have multiple sections
  })

  test('should consolidate all information on single page', async ({ page }) => {
    // All required information should be on this single page
    // No links to separate pages for legal information
    const externalLegalLinks = page.locator('a[href*="legal"]:not([href="/legal-disclosure"])')
    const externalLegalLinksCount = await externalLegalLinks.count()

    // Should not have links to external legal pages
    expect(externalLegalLinksCount).toBe(0)
  })

  test('should have readable font sizes and spacing', async ({ page }) => {
    // Check that text is not too small
    const bodyText = page.locator('body')
    const fontSize = await bodyText.evaluate(el =>
      window.getComputedStyle(el).fontSize
    )

    const fontSizeValue = parseInt(fontSize.replace('px', ''))
    expect(fontSizeValue).toBeGreaterThanOrEqual(14) // Minimum readable font size
  })

  test('should display current and accurate information', async ({ page }) => {
    // Check that dates are current (if any are displayed)
    const currentYear = new Date().getFullYear()
    const pageText = await page.textContent('body')

    // If year is mentioned, it should be current or recent
    if (pageText.includes('年') || pageText.includes(currentYear.toString())) {
      expect(pageText).toContain(currentYear.toString())
    }
  })

  test('should have proper contact information format', async ({ page }) => {
    // Email should be clickable
    const emailLink = page.locator('a[href^="mailto:"]')
    if (await emailLink.count() > 0) {
      await expect(emailLink).toBeVisible()
      await expect(emailLink).toHaveAttribute('href', /^mailto:.+@.+\..+/)
    }

    // Email should be properly formatted even if not linked
    const pageText = await page.textContent('body')
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    expect(emailRegex.test(pageText)).toBe(true)
  })
})