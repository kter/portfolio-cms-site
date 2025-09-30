# Ko-fi Widget Interface Contract

**Feature**: 003-ko-fi-com
**Date**: 2025-09-30
**Type**: External Service Interface

## Overview

This contract defines the expected interface and behavior of the Ko-fi overlay widget. Since Ko-fi is an external service, this is not an API contract we implement, but rather a specification of what we expect from the third-party widget.

## External Script Contract

### Script Loading
```typescript
// Expected CDN endpoint
URL: https://storage.ko-fi.com/cdn/scripts/overlay-widget.js

// Loading method
Method: Async/defer script tag or dynamic script injection

// Expected global after load
window.kofiWidgetOverlay: {
  draw: (username: string, config: object) => void;
}
```

### Initialization Contract

```typescript
interface KofiWidgetOverlay {
  draw(username: string, config: KofiConfig): void;
}

interface KofiConfig {
  'type': 'floating-chat';
  'floating-chat.donateButton.text': string;
  'floating-chat.donateButton.background-color': string;  // Hex color
  'floating-chat.donateButton.text-color': string;        // Hex color
}

// Example usage
kofiWidgetOverlay.draw('kterr', {
  'type': 'floating-chat',
  'floating-chat.donateButton.text': 'Support me',
  'floating-chat.donateButton.background-color': '#00b9fe',
  'floating-chat.donateButton.text-color': '#fff'
});
```

## Expected Widget Behavior

### Visual Appearance
- **Position**: Bottom-left corner of viewport
- **Display**: Floating button fixed to viewport
- **Visibility**: Persistent across page scrolls
- **Styling**: Cyan blue (#00b9fe) background with white text
- **Text**: "Support me"

### Interaction Behavior
1. **Initial State**: Button visible but collapsed
2. **On Click**: Overlay opens with Ko-fi donation form
3. **On Donation**: User completes donation flow on Ko-fi
4. **On Close**: Overlay closes, button returns to collapsed state

### Responsive Behavior
- **Desktop (>= 1024px)**: Full-size button at bottom-left
- **Tablet (768px - 1023px)**: Adjusted size, maintains position
- **Mobile (< 768px)**: Smaller button, non-intrusive positioning

### Z-Index Management
- Widget should automatically handle z-index to appear above page content
- Expected z-index range: 9000-10000 (typical for overlay widgets)

## Error Scenarios

### Script Load Failure
```typescript
// Expected behavior:
// - No global kofiWidgetOverlay object
// - No button appears
// - No errors thrown to page
// - Site remains fully functional

// Our handling:
if (typeof kofiWidgetOverlay === 'undefined') {
  console.warn('Ko-fi widget failed to load');
  // Graceful degradation - no button, no error
}
```

### Invalid Username
```typescript
// Expected behavior if 'kterr' account is invalid:
// - Button may appear but show error when clicked
// - Or button may not appear at all
// Our handling: Manual verification of account before deployment
```

### Network Timeout
```typescript
// Expected behavior:
// - Script loading timeout after 30-60 seconds
// - onerror callback triggered
// Our handling: Silent failure with console warning
```

## DOM Modifications

Ko-fi widget is expected to:
1. Create its own DOM elements (button, overlay)
2. Append elements to document.body
3. Apply its own inline styles
4. Manage its own event listeners
5. Clean up on page unload (if SPA navigation)

**We do not control or manipulate Ko-fi's DOM structure.**

## Performance Contract

### Expected Performance
- **Script Size**: ~30-50KB (minified, gzipped)
- **Load Time**: < 1 second on standard connection
- **Initialization**: < 100ms after script load
- **Interaction Latency**: < 50ms for button click response

### Performance Monitoring
```typescript
// Measure script load time
const startTime = performance.now();
script.onload = () => {
  const loadTime = performance.now() - startTime;
  console.log(`Ko-fi widget loaded in ${loadTime}ms`);
};
```

## Security Contract

### Expected Security Measures
- **HTTPS**: All Ko-fi resources served over HTTPS
- **CSP Compatibility**: Widget should work with reasonable CSP policies
- **No XSS**: Widget should sanitize any user inputs
- **No Data Leakage**: Widget should not access portfolio site data

### Required CSP Adjustments (if strict CSP enabled)
```
script-src 'self' https://storage.ko-fi.com;
connect-src 'self' https://ko-fi.com https://*.ko-fi.com;
img-src 'self' https://storage.ko-fi.com data:;
```

## Testing Contract

### Unit Testing
Not applicable - external widget cannot be unit tested in isolation.

### Integration Testing
Mock Ko-fi script in test environment:
```typescript
// Mock implementation for tests
window.kofiWidgetOverlay = {
  draw: jest.fn((username, config) => {
    // Create mock button element
    const button = document.createElement('div');
    button.id = 'kofi-test-button';
    button.textContent = config['floating-chat.donateButton.text'];
    document.body.appendChild(button);
  })
};
```

### E2E Testing
Test against real Ko-fi widget:
- Verify button appears after page load
- Verify button position and styling
- Verify button is clickable (do not complete donation)
- Verify responsive behavior on different viewports

## Versioning and Changes

### Widget Versioning
- Ko-fi does not expose version numbers in widget URL
- Script at CDN URL may update without notice
- Expect backward compatibility from Ko-fi

### Breaking Change Handling
If Ko-fi changes widget API:
1. Button may stop appearing
2. E2E tests will fail
3. Manual investigation required
4. Update integration code as needed

### Change Detection
- Monitor Ko-fi's developer documentation for updates
- Periodic manual testing recommended (quarterly)

## Support and Documentation

### Official Resources
- Ko-fi Widget Documentation: https://ko-fi.com/manage/widgets
- Ko-fi Support: https://help.ko-fi.com

### Troubleshooting
1. Verify 'kterr' account is active
2. Check browser console for script load errors
3. Verify CSP policies allow Ko-fi domains
4. Test in incognito mode to rule out browser extensions
5. Check Ko-fi service status

## Acceptance Criteria

This contract is satisfied when:
- [ ] Ko-fi script loads successfully from CDN
- [ ] `kofiWidgetOverlay.draw()` initializes without errors
- [ ] Button appears at bottom-left corner
- [ ] Button displays "Support me" text in white
- [ ] Button has cyan blue (#00b9fe) background
- [ ] Button is clickable and opens Ko-fi overlay
- [ ] Widget works on desktop, tablet, and mobile viewports
- [ ] Widget does not interfere with existing site functionality
- [ ] Script load failure degrades gracefully

## Contract Version

**Version**: 1.0.0
**Based on**: Ko-fi Overlay Widget (current as of 2025-09-30)
**Review Date**: 2025-12-30 (or when Ko-fi announces API changes)