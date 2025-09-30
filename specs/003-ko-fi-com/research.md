# Research: Ko-fi Support Button Integration

**Feature**: 003-ko-fi-com
**Date**: 2025-09-30
**Status**: Complete

## Research Questions

### 1. Ko-fi Widget Integration Best Practices

**Decision**: Use Ko-fi's official overlay widget with client-side initialization

**Rationale**:
- Ko-fi provides an official overlay-widget.js that handles all UI, interactions, and payment flows
- The widget is designed for floating button implementations with configurable positioning
- Client-side initialization ensures the widget loads after the page content
- The 'floating-chat' widget type is specifically designed for persistent site-wide donation buttons

**Alternatives Considered**:
- **Custom Ko-fi button linking to profile**: Rejected because it doesn't provide the inline donation experience; requires full page navigation
- **Ko-fi embedded panel**: Rejected because it takes up page real estate; not suitable for a floating button
- **Third-party donation services (Buy Me a Coffee, Patreon)**: Out of scope; user specifically requested Ko-fi

**Implementation Approach**:
- Load Ko-fi script from CDN: `https://storage.ko-fi.com/cdn/scripts/overlay-widget.js`
- Initialize widget with `kofiWidgetOverlay.draw()` after script loads
- Configure with username 'kterr' and specified styling

### 2. Script Loading Strategy in Nuxt 3

**Decision**: Use Nuxt's `useHead()` composable with script tag in app.vue or create a dedicated plugin

**Rationale**:
- Nuxt 3 provides built-in script management through `useHead()` composable
- Scripts can be configured to load asynchronously or defer to avoid blocking render
- `useHead()` in app.vue ensures script loads on all pages
- Alternative: Nuxt plugin with `useHead()` in plugin context for better separation of concerns

**Alternatives Considered**:
- **Direct script tag in nuxt.config.ts**: Possible but less flexible; harder to control initialization timing
- **Manual script injection in mounted hook**: Rejected because it's not the Nuxt way; useHead is the recommended approach
- **External script in public/index.html**: Not applicable; Nuxt generates HTML automatically

**Implementation Approach**:
```typescript
// In app.vue or plugin
useHead({
  script: [
    {
      src: 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js',
      defer: true,
      onload: () => {
        if (typeof kofiWidgetOverlay !== 'undefined') {
          kofiWidgetOverlay.draw('kterr', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support me',
            'floating-chat.donateButton.background-color': '#00b9fe',
            'floating-chat.donateButton.text-color': '#fff'
          });
        }
      }
    }
  ]
});
```

### 3. Component Architecture for Site-Wide Widget

**Decision**: Initialize Ko-fi widget directly in app.vue using `onMounted()` and `useHead()`

**Rationale**:
- app.vue is the root component that wraps all pages in Nuxt 3
- Initializing here ensures the button appears on all pages without duplication
- Ko-fi widget automatically creates its own DOM elements and manages positioning
- No need for a separate Vue component since Ko-fi handles all UI

**Alternatives Considered**:
- **Separate KofiButton.vue component in default layout**: Possible but unnecessary; Ko-fi widget doesn't need Vue component wrapper
- **Component in each page**: Rejected due to duplication and maintenance burden
- **Global plugin**: Considered but app.vue initialization is simpler and equally effective

**Implementation Approach**:
- Use `useHead()` to load Ko-fi script in app.vue
- Use `onMounted()` to initialize widget after DOM is ready
- No separate component file needed; Ko-fi widget is self-contained

### 4. Error Handling for External Script Failures

**Decision**: Implement graceful degradation with silent failure and console warning

**Rationale**:
- Ko-fi CDN is generally reliable (99.9%+ uptime expected)
- Script load failures should not break the site
- Silent degradation maintains professional appearance
- Console warning helps with debugging if issues occur

**Alternatives Considered**:
- **Fallback UI with error message**: Rejected because it adds visual clutter for rare occurrence
- **Retry logic**: Rejected as overly complex for a non-critical feature
- **Hard error/notification to user**: Rejected because donation button failure is not critical to site function

**Implementation Approach**:
```typescript
script.onerror = () => {
  console.warn('Ko-fi widget failed to load. Donation button will not be available.');
};
```

### 5. Positioning and Z-Index Management

**Decision**: Trust Ko-fi widget's built-in positioning; add CSS override if conflicts occur

**Rationale**:
- Ko-fi's floating-chat widget type is designed to position at bottom-left with appropriate z-index
- Widget includes responsive behavior for mobile devices
- Only intervene if conflicts with existing site elements are observed

**Alternatives Considered**:
- **Custom positioning via CSS**: Not recommended; could break widget's internal layout
- **Fixed positioning wrapper**: Unnecessary; widget handles positioning internally

**Implementation Approach**:
- Use Ko-fi's default positioning initially
- If conflicts occur, add scoped CSS targeting Ko-fi's widget container
- Test on mobile, tablet, and desktop viewports during implementation

### 6. Testing Strategy

**Decision**: Playwright end-to-end tests for visual verification and interaction

**Rationale**:
- Ko-fi widget creates external UI elements that need visual/interaction testing
- Unit tests cannot verify external script integration
- Playwright can check for button presence, positioning, and clickability
- Existing project appears to use Playwright based on test files

**Alternatives Considered**:
- **Manual testing only**: Not sufficient for CI/CD; automated tests ensure regression prevention
- **Jest unit tests**: Cannot test external script integration or DOM manipulation
- **Cypress**: Possible but project already seems to use Playwright

**Implementation Approach**:
- Test 1: Verify button appears after page load
- Test 2: Verify button position (bottom-left corner)
- Test 3: Verify button is clickable
- Test 4: Verify responsive behavior on mobile viewport
- Mock network responses in test environment if Ko-fi CDN is unreliable in CI

### 7. Static Site Generation Compatibility

**Decision**: Client-side only initialization; no SSR concerns

**Rationale**:
- Ko-fi widget requires browser environment (window object)
- Nuxt SSR will skip client-only code during prerendering
- Static generation produces HTML without Ko-fi script; widget loads on client
- This is the expected behavior for third-party widgets

**Alternatives Considered**:
- **SSR rendering of button**: Not possible; Ko-fi widget is client-side only
- **Placeholder during SSR**: Unnecessary complexity; widget loads quickly on client

**Implementation Approach**:
- Wrap initialization in `onMounted()` to ensure it only runs on client
- Use `process.client` check if needed for additional safety
- No changes needed to Nuxt's SSG configuration

## Resolved Clarifications

### Clarification 1: Error Handling for Script Load Failure
**Original Question**: What should happen if the Ko-fi script fails to load?
**Resolution**: Silent degradation with console warning. The button will not appear, but the site remains fully functional. This is acceptable for a non-critical feature.

### Clarification 2: Page Visibility
**Original Question**: Should the button appear on every page or exclude certain pages?
**Resolution**: Display on all pages. The portfolio site only has 2 pages (index, legal-disclosure), and both can benefit from the support button. If specific page exclusions are needed later, they can be implemented with route-based conditionals.

### Clarification 3: Overlap Management
**Original Question**: How to handle conflicts with other fixed UI elements?
**Resolution**: Ko-fi's floating-chat widget is designed to avoid common UI conflicts. If issues arise during testing, add CSS adjustments with higher specificity or adjust z-index. Current site appears to have no conflicting bottom-left elements based on structure review.

## Technical Specifications Summary

| Aspect | Specification |
|--------|--------------|
| **External Script** | https://storage.ko-fi.com/cdn/scripts/overlay-widget.js |
| **Widget Type** | floating-chat |
| **Username** | kterr |
| **Button Text** | Support me |
| **Button Background** | #00b9fe (cyan blue) |
| **Button Text Color** | #fff (white) |
| **Position** | Bottom left (Ko-fi default for floating-chat) |
| **Loading Strategy** | Async/defer with onMounted initialization |
| **Error Handling** | Silent degradation with console warning |
| **Testing** | Playwright E2E tests |
| **Browser Support** | All modern browsers (inherited from Ko-fi widget) |

## Dependencies

### External Dependencies
- **Ko-fi CDN**: https://storage.ko-fi.com
  - Service: overlay-widget.js
  - Reliability: Expected 99.9%+ uptime
  - Fallback: Silent degradation if unavailable

### Project Dependencies
- **Nuxt.js 3.17.4**: For `useHead()` and `onMounted()` composables
- **Vue 3.5.15**: For component lifecycle hooks
- **Playwright**: For end-to-end testing (assumed based on project structure)

### Account Dependencies
- **Ko-fi Account**: Username 'kterr' must be active
  - Verification: Should be done manually before deployment
  - Impact if inactive: Button will appear but may show error when clicked

## Performance Considerations

1. **Script Size**: Ko-fi overlay-widget.js is ~30-50KB (estimated, minified)
2. **Loading Impact**: Async loading ensures no blocking of page render
3. **Runtime Impact**: Minimal; widget is dormant until clicked
4. **Network Requests**: 1 request for script + potential requests when widget is opened
5. **CDN Caching**: Ko-fi CDN likely uses aggressive caching for performance

## Security Considerations

1. **External Script**: Loaded from Ko-fi's CDN over HTTPS
2. **XSS Risk**: Low; Ko-fi is a reputable service with security practices
3. **CSP Compatibility**: May need Content-Security-Policy adjustments if strict CSP is in place
   - Allow script-src: storage.ko-fi.com
   - Allow connect-src: Ko-fi API domains
4. **Privacy**: Ko-fi widget may load tracking pixels or analytics; document in privacy policy if applicable

## Open Questions for Implementation

None remaining. All critical decisions have been made based on research and best practices.

## References

- [Ko-fi Developer Documentation](https://ko-fi.com/manage/widgets)
- [Nuxt 3 useHead Documentation](https://nuxt.com/docs/api/composables/use-head)
- [Nuxt 3 Client-Only Scripts](https://nuxt.com/docs/getting-started/seo-meta)
- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)