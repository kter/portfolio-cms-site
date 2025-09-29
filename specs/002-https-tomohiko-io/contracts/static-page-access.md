# Static Page Access Contract

## Direct URL Access Contract

### Endpoint
```
GET https://tomohiko.io/legal-disclosure
```

### Expected Response
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=31536000, immutable
```

### Response Body Requirements
- Must contain complete legal disclosure page HTML
- Must include proper `<head>` section with meta tags:
  - Title: "特定商取引法に基づく表記 | 高橋智彦ポートフォリオ"
  - Meta description with legal disclosure information
  - Open Graph and Twitter Card meta tags
  - Canonical link to https://www.tomohiko.io/legal-disclosure
- Must include all CSS and JavaScript required for page functionality
- Content must be identical to navigation-based access

### Error Cases
Currently failing:
```http
HTTP/1.1 403 Forbidden
Content-Type: application/xml
Body: <Error><Code>AccessDenied</Code>...</Error>
```

Must be resolved to return 200 OK response.

## Build Output Contract

### Generated Files
The build process must generate:
```
dist/
└── legal-disclosure/
    └── index.html    # Or legal-disclosure.html
```

### File Content Requirements
- Complete HTML document with DOCTYPE
- All assets inlined or properly referenced
- Meta tags from Vue component preserved
- CSS from TailwindCSS and component styles included

## Configuration Contracts

### Nuxt.js Configuration
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/', '/legal-disclosure']  // Must include this route
    }
  }
})
```

### Infrastructure Configuration
- CloudFront distribution must serve all files in S3 bucket
- No referrer-based restrictions on legal-disclosure route
- Origin Access Control properly configured
- Error documents must not interfere with valid routes