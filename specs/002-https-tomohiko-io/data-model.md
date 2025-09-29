# Data Model: Legal Disclosure Page Access

## Overview
This feature primarily involves configuration and routing rather than data entities. The core concern is ensuring proper static file generation and access control configuration.

## Key Entities

### Static Page Route
- **Purpose**: Represents the legal-disclosure page route configuration
- **Key Attributes**:
  - Path: `/legal-disclosure`
  - Static Generation: Must be pre-rendered during build
  - Direct Access: Must be accessible without referrer restrictions
  - Content Source: Vue component with legal disclosure data
- **Validation Rules**:
  - Route must be included in Nuxt.js prerender configuration
  - Generated static files must be accessible via direct URL
  - Content must be identical regardless of access method

### Build Configuration
- **Purpose**: Controls static site generation behavior
- **Key Attributes**:
  - Prerender Routes: Array of routes to pre-generate
  - SSR Status: Server-side rendering during build
  - Output Directory: Location of generated static files
- **State Transitions**:
  - Development → Build → Static Files → Deployment
- **Validation Rules**:
  - All routes in prerender array must generate corresponding static files
  - Generated files must be valid HTML with proper meta tags

### Access Control Configuration
- **Purpose**: Infrastructure-level configuration controlling direct access
- **Key Attributes**:
  - CloudFront Distribution Behaviors
  - S3 Bucket Access Policies
  - Origin Request Policies
- **Relationships**:
  - CloudFront → S3 Bucket (via Origin Access Control)
  - Route Patterns → Behavior Rules
- **Validation Rules**:
  - All generated static files must be accessible via CloudFront
  - No referrer-based restrictions on public pages
  - Direct URL access must return 200 status code

## Data Flow

1. **Build Process**:
   - Nuxt.js reads `legal-disclosure.vue` page
   - Pre-renders page with legal disclosure data
   - Generates static HTML file in output directory

2. **Deployment Process**:
   - Static files uploaded to S3 bucket
   - CloudFront distribution serves files with proper headers
   - Direct access requests route to correct static files

3. **Access Flow**:
   - Direct URL request → CloudFront → S3 → Static HTML file
   - Navigation request → Same static file (client-side routing handles presentation)

## Constraints
- No server-side processing required (static files only)
- Must maintain existing navigation functionality
- Performance must remain optimal (static file serving)
- All changes must be deployment-pipeline compatible