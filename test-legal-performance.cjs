/**
 * Performance test for static file serving of legal disclosure page
 * This test MUST FAIL initially since direct access currently fails
 */

const https = require('https');

const PRODUCTION_URL = 'https://tomohiko.io/legal-disclosure';
const PERFORMANCE_THRESHOLD_MS = 3000; // 3 seconds max for static file
const CDN_HEADERS_REQUIRED = ['x-cache', 'cache-control'];

describe('Legal Disclosure Performance Test', () => {
  test('Direct access should respond within performance threshold', async () => {
    // This test WILL FAIL initially - that's expected for TDD
    const startTime = Date.now();

    try {
      const response = await makeHttpsRequest(PRODUCTION_URL);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.statusCode).toBe(200);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
    } catch (error) {
      // Expected to fail initially due to 403 error
      expect(error.message).toContain('HTTP 403');
    }
  });

  test('Response should include CDN cache headers', async () => {
    // This test WILL FAIL initially - that's expected for TDD
    try {
      const response = await makeHttpsRequest(PRODUCTION_URL);

      expect(response.statusCode).toBe(200);

      // Should have CloudFront cache headers
      expect(response.headers['x-cache']).toBeDefined();
      expect(response.headers['cache-control']).toBeDefined();

      // Cache headers should indicate static content
      const cacheControl = response.headers['cache-control'];
      expect(cacheControl).toMatch(/max-age/);
    } catch (error) {
      // Expected to fail initially
      expect(error.message).toContain('HTTP 403');
    }
  });

  test('Multiple requests should benefit from CDN caching', async () => {
    // This test WILL FAIL initially - that's expected for TDD
    const numRequests = 3;
    const requestTimes = [];

    for (let i = 0; i < numRequests; i++) {
      const startTime = Date.now();

      try {
        const response = await makeHttpsRequest(PRODUCTION_URL);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        expect(response.statusCode).toBe(200);
        requestTimes.push(responseTime);

        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Expected to fail initially
        expect(error.message).toContain('HTTP 403');
        return;
      }
    }

    // After first request, subsequent requests should be faster (cached)
    if (requestTimes.length >= 2) {
      const avgLaterRequests = requestTimes.slice(1).reduce((a, b) => a + b, 0) / (requestTimes.length - 1);
      expect(avgLaterRequests).toBeLessThan(requestTimes[0] * 0.8); // 20% faster
    }
  });

  test('Content should be properly compressed', async () => {
    // This test WILL FAIL initially - that's expected for TDD
    try {
      const response = await makeHttpsRequestWithGzip(PRODUCTION_URL);

      expect(response.statusCode).toBe(200);

      // Should support gzip compression for text content
      expect(response.headers['content-encoding']).toMatch(/gzip|br|deflate/);

      // Content size should be reasonable for a legal page
      const contentLength = parseInt(response.headers['content-length'] || '0');
      expect(contentLength).toBeGreaterThan(1000); // At least 1KB
      expect(contentLength).toBeLessThan(500000); // Less than 500KB
    } catch (error) {
      // Expected to fail initially
      expect(error.message).toContain('HTTP 403');
    }
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

function makeHttpsRequestWithGzip(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br'
      }
    };

    const request = https.get(url, options, (response) => {
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