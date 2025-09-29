# Quickstart: Legal Disclosure Page Direct Access Fix

## Prerequisites
- Node.js and npm installed
- Access to deployed website at tomohiko.io
- Browser for testing

## Quick Validation Steps

### 1. Reproduce the Issue
```bash
# Test direct access (should currently fail)
curl -I https://tomohiko.io/legal-disclosure
# Expected: HTTP 403 Forbidden (current issue)
# Should be: HTTP 200 OK (after fix)
```

### 2. Test Local Development
```bash
# Start development server
npm run dev

# Test local page access
open http://localhost:3000/legal-disclosure
# Should work in development
```

### 3. Verify Build Configuration
```bash
# Check current nuxt configuration
cat nuxt.config.ts | grep -A 10 "prerender"
# Should show: routes: ['/', '/legal-disclosure']
```

### 4. Test Build Output
```bash
# Generate static build
npm run generate

# Check if legal disclosure page is generated
ls -la dist/legal-disclosure/
# Should show: index.html or similar static file
```

### 5. Verify Page Content
```bash
# Check generated page has proper content
grep -i "特定商取引法" dist/legal-disclosure/index.html
# Should find Japanese legal disclosure content
```

## Success Criteria Validation

### Direct Access Test
```bash
# After fix implementation:
curl -s -o /dev/null -w "%{http_code}" https://tomohiko.io/legal-disclosure
# Must return: 200
```

### Content Consistency Test
```bash
# Compare direct access vs navigation content
curl -s https://tomohiko.io/legal-disclosure > direct_access.html
# Navigate from main page and save content
# Files should have identical core content
```

### Performance Test
```bash
# Measure page load time
curl -w "@curl-format.txt" -o /dev/null -s https://tomohiko.io/legal-disclosure
# Should be fast (static file serving)
```

### SEO Validation
```bash
# Check meta tags are present
curl -s https://tomohiko.io/legal-disclosure | grep -i "<meta.*og:"
# Should show Open Graph meta tags
```

## Troubleshooting

### If direct access still fails:
1. Check CloudFront distribution settings
2. Verify S3 bucket policies
3. Check for custom error pages interfering
4. Verify build generated proper static files

### If content differs:
1. Check if client-side routing affects content
2. Verify all assets load properly via direct access
3. Check for JavaScript-dependent content rendering

### If performance degrades:
1. Verify static file caching headers
2. Check CDN cache hit rates
3. Ensure no unexpected server-side processing

## Integration with Existing Tests
```bash
# Run existing legal page tests
npm test test-legal-disclosure.js
npm test test-legal.spec.js

# Tests should pass both before and after fix
```