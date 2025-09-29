/**
 * Contract test for direct URL access to legal disclosure page
 * This test MUST FAIL initially to follow TDD approach
 */

const https = require('https');

const PRODUCTION_URL = 'https://tomohiko.io/legal-disclosure';

describe('Legal Disclosure Direct Access Contract', () => {
  test('Direct URL access should return HTTP 200', async () => {
    const response = await makeHttpsRequest(PRODUCTION_URL);

    // This test WILL FAIL initially - that's expected for TDD
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('Direct access should include proper meta tags', async () => {
    const response = await makeHttpsRequest(PRODUCTION_URL);
    const body = response.body;

    // This test WILL FAIL initially - that's expected for TDD
    expect(response.statusCode).toBe(200);
    expect(body).toContain('特定商取引法に基づく表記');
    expect(body).toContain('<meta name="description"');
    expect(body).toContain('og:title');
    expect(body).toContain('canonical');
  });

  test('Direct access should have proper cache headers', async () => {
    const response = await makeHttpsRequest(PRODUCTION_URL);

    // This test WILL FAIL initially - that's expected for TDD
    expect(response.statusCode).toBe(200);
    expect(response.headers['cache-control']).toBeDefined();
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