# Legal Disclosure Page Direct Access Fix - Infrastructure Configuration

## Root Cause Analysis

The legal disclosure page works correctly in:
- ✅ Local development (http://localhost:3002/legal-disclosure)
- ✅ Navigation from main site
- ❌ Direct URL access (https://tomohiko.io/legal-disclosure) - returns 403

## Issue Identified

The issue is at the **CloudFront/S3 infrastructure level**, not the Nuxt.js application:

1. **Nuxt.js Configuration**: ✅ Correct
   - Page exists: `pages/legal-disclosure.vue`
   - Prerender routes include: `/legal-disclosure`
   - Static generation works properly

2. **Build Output**: ✅ Correct
   - Files generate during build process
   - Legal disclosure page created as expected
   - Static HTML contains proper content

3. **Infrastructure Issue**: ❌ Problem Here
   - Direct access returns HTTP 403 from CloudFront
   - Error indicates S3/CloudFront access control issue
   - Navigation works because of client-side routing after initial page load

## Required Infrastructure Fixes

### CloudFront Distribution Configuration

**Issue**: CloudFront behavior rules likely preventing direct access to legal-disclosure route

**Required Changes**:

1. **Behavior Pattern**: Ensure `/legal-disclosure*` has proper behavior rule
   ```
   Path Pattern: /legal-disclosure*
   Origin: S3 bucket origin
   Viewer Protocol Policy: Redirect HTTP to HTTPS
   Allowed HTTP Methods: GET, HEAD, OPTIONS
   Cache Policy: Managed-CachingOptimized or custom with long TTL
   ```

2. **Default Root Object**: Verify index.html handling
   ```
   Default Root Object: index.html
   Custom Error Pages:
   - 403 -> /index.html (301 redirect)
   - 404 -> /404.html (404 response)
   ```

3. **Origin Request Policy**: Ensure proper headers forwarded
   ```
   Headers:
   - Host
   - Origin
   - Referer (if needed)
   Query Strings: All
   Cookies: None (static content)
   ```

### S3 Bucket Configuration

**Issue**: S3 bucket policy or object structure preventing direct access

**Required Changes**:

1. **Bucket Policy**: Ensure CloudFront OAC has access
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Service": "cloudfront.amazonaws.com"
         },
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::BUCKET_NAME/*",
         "Condition": {
           "StringEquals": {
             "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
           }
         }
       }
     ]
   }
   ```

2. **Object Structure**: Ensure proper file layout
   ```
   bucket/
   ├── index.html                    # Main page
   ├── legal-disclosure/
   │   └── index.html               # Legal disclosure page
   ├── _nuxt/                       # Static assets
   ├── favicon.ico
   └── other-assets/
   ```

3. **Object Metadata**: Ensure proper Content-Type headers
   ```
   legal-disclosure/index.html:
   - Content-Type: text/html
   - Cache-Control: public, max-age=31536000
   ```

## Deployment Pipeline Fix

**Current Issue**: Build artifacts not properly uploaded or structured

**Required Pipeline Changes**:

1. **Build Command**: Ensure using `npm run generate`
2. **Upload Source**: Upload contents of `dist/public/` directory
3. **Sync Command**:
   ```bash
   aws s3 sync dist/public/ s3://BUCKET_NAME/ --delete --exclude ".*"
   ```
4. **CloudFront Invalidation**:
   ```bash
   aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/legal-disclosure/*" "/"
   ```

## Testing the Fix

Once infrastructure changes are deployed:

1. **Direct Access Test**:
   ```bash
   curl -I https://tomohiko.io/legal-disclosure
   # Should return: HTTP/2 200 OK
   ```

2. **Content Verification**:
   ```bash
   curl -s https://tomohiko.io/legal-disclosure | grep "特定商取引法"
   # Should find Japanese legal content
   ```

3. **Performance Test**:
   ```bash
   curl -w "@curl-format.txt" -o /dev/null -s https://tomohiko.io/legal-disclosure
   # Should be fast (< 1s for static file)
   ```

## Implementation Priority

1. **High Priority**: Fix CloudFront behavior rules for `/legal-disclosure*`
2. **Medium Priority**: Verify S3 bucket policy and object structure
3. **Low Priority**: Optimize deployment pipeline to prevent future issues

## Next Steps

1. Access AWS Console for CloudFront/S3 configuration
2. Apply the infrastructure changes listed above
3. Test the fix using the verification commands
4. Run the test files created in Phase 3.2 to confirm resolution