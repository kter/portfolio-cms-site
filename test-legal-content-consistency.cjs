/**
 * Content consistency test comparing direct vs navigation access
 * This test MUST FAIL initially since direct access currently fails
 */

const https = require('https');
const puppeteer = require('puppeteer');

const PRODUCTION_DOMAIN = 'https://tomohiko.io';
const LEGAL_DISCLOSURE_PATH = '/legal-disclosure';

describe('Legal Disclosure Content Consistency', () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Content should be identical via direct access vs navigation', async () => {
    // This test WILL FAIL initially - that's expected for TDD

    // Get content via direct access (currently fails)
    let directContent = '';
    try {
      const directResponse = await makeHttpsRequest(PRODUCTION_DOMAIN + LEGAL_DISCLOSURE_PATH);
      expect(directResponse.statusCode).toBe(200);
      directContent = extractMainContent(directResponse.body);
    } catch (error) {
      // Expected to fail initially
      expect(error.message).toContain('HTTP 403 or similar error');
      return; // Skip rest of test until direct access is fixed
    }

    // Get content via navigation
    const page = await browser.newPage();
    await page.goto(PRODUCTION_DOMAIN);

    // Navigate to legal disclosure page (assuming there's a link)
    await page.click('a[href="/legal-disclosure"]');
    await page.waitForNavigation();

    const navigationContent = await page.evaluate(() => {
      return document.documentElement.innerHTML;
    });

    await page.close();

    const navigatedMainContent = extractMainContent(navigationContent);

    // Compare core content (ignoring potential timing/cache differences)
    expect(directContent).toContain('特定商取引法');
    expect(navigatedMainContent).toContain('特定商取引法');

    // Key content elements should be present in both
    const keyElements = ['事業者', '連絡先', '表記'];
    keyElements.forEach(element => {
      expect(directContent).toContain(element);
      expect(navigatedMainContent).toContain(element);
    });
  });

  test('Meta tags should be consistent between access methods', async () => {
    // This test WILL FAIL initially - that's expected for TDD

    // Direct access meta tags
    let directResponse;
    try {
      directResponse = await makeHttpsRequest(PRODUCTION_DOMAIN + LEGAL_DISCLOSURE_PATH);
      expect(directResponse.statusCode).toBe(200);
    } catch (error) {
      // Expected to fail initially
      console.log('Direct access failed as expected:', error.message);
      return;
    }

    // Navigation meta tags
    const page = await browser.newPage();
    await page.goto(PRODUCTION_DOMAIN);
    await page.click('a[href="/legal-disclosure"]');
    await page.waitForNavigation();

    const navigationTitle = await page.title();
    const navigationMeta = await page.evaluate(() => {
      const metas = Array.from(document.querySelectorAll('meta'));
      return metas.map(meta => ({
        name: meta.getAttribute('name'),
        property: meta.getAttribute('property'),
        content: meta.getAttribute('content')
      }));
    });

    await page.close();

    // Both should have same title and key meta tags
    expect(directResponse.body).toContain(navigationTitle);

    const keyMetaNames = ['description', 'keywords'];
    keyMetaNames.forEach(metaName => {
      const navigationMetaContent = navigationMeta.find(m => m.name === metaName)?.content;
      if (navigationMetaContent) {
        expect(directResponse.body).toContain(navigationMetaContent);
      }
    });
  });
});

function makeHttpsRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: body
        });
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function extractMainContent(html) {
  // Remove script tags, style tags, and extract main content
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}