/**
 * Build output verification test for legal disclosure page
 * This test verifies that static generation creates proper files
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = './dist';
const LEGAL_DISCLOSURE_PATHS = [
  'legal-disclosure/index.html',
  'legal-disclosure.html'
];

describe('Legal Disclosure Build Output Verification', () => {
  test('Static build should generate legal disclosure HTML file', () => {
    // Check if dist directory exists
    expect(fs.existsSync(DIST_DIR)).toBe(true);

    // Check if at least one of the expected legal disclosure paths exists
    const legalFileExists = LEGAL_DISCLOSURE_PATHS.some(relativePath => {
      const fullPath = path.join(DIST_DIR, relativePath);
      return fs.existsSync(fullPath);
    });

    expect(legalFileExists).toBe(true);
  });

  test('Generated legal disclosure file should contain proper HTML structure', () => {
    let htmlContent = '';
    let foundFile = '';

    // Find the actual generated file
    for (const relativePath of LEGAL_DISCLOSURE_PATHS) {
      const fullPath = path.join(DIST_DIR, relativePath);
      if (fs.existsSync(fullPath)) {
        htmlContent = fs.readFileSync(fullPath, 'utf8');
        foundFile = fullPath;
        break;
      }
    }

    expect(foundFile).toBeTruthy();
    expect(htmlContent).toContain('<!DOCTYPE html>');
    expect(htmlContent).toContain('<html');
    expect(htmlContent).toContain('<head>');
    expect(htmlContent).toContain('<body>');
    expect(htmlContent).toContain('特定商取引法');
  });

  test('Generated file should include proper meta tags', () => {
    let htmlContent = '';

    // Find and read the generated file
    for (const relativePath of LEGAL_DISCLOSURE_PATHS) {
      const fullPath = path.join(DIST_DIR, relativePath);
      if (fs.existsSync(fullPath)) {
        htmlContent = fs.readFileSync(fullPath, 'utf8');
        break;
      }
    }

    expect(htmlContent).toContain('<meta name="description"');
    expect(htmlContent).toContain('特定商取引法に基づく表記');
    expect(htmlContent).toContain('<meta property="og:title"');
    expect(htmlContent).toContain('<link rel="canonical"');
  });

  test('Generated file should include CSS and be production-ready', () => {
    let htmlContent = '';

    // Find and read the generated file
    for (const relativePath of LEGAL_DISCLOSURE_PATHS) {
      const fullPath = path.join(DIST_DIR, relativePath);
      if (fs.existsSync(fullPath)) {
        htmlContent = fs.readFileSync(fullPath, 'utf8');
        break;
      }
    }

    // Should include CSS (either inline or linked)
    const hasCSS = htmlContent.includes('<style') ||
                   htmlContent.includes('<link') ||
                   htmlContent.includes('stylesheet');
    expect(hasCSS).toBe(true);
  });
});