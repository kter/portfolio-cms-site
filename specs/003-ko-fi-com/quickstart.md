# Quickstart Guide: Ko-fi Support Button

**Feature**: 003-ko-fi-com
**Date**: 2025-09-30
**Estimated Time**: 5 minutes

## Purpose

This quickstart validates that the Ko-fi support button is correctly integrated, visible, and functional across all pages and devices. It serves as both a development validation checklist and a user acceptance test.

## Prerequisites

- [ ] Local development environment running (`npm run dev`)
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Internet connection (required for Ko-fi CDN)
- [ ] Mobile device or browser DevTools for responsive testing

## Quick Validation Steps

### Step 1: Verify Local Development Setup
```bash
# Ensure you're on the correct branch
git branch --show-current
# Expected output: 003-ko-fi-com

# Start development server
npm run dev
# Server should start on http://localhost:3000
```

**Expected Result**: Development server running without errors

### Step 2: Visual Verification - Desktop
1. Open http://localhost:3000 in your browser
2. Wait 2-3 seconds for full page load
3. Look at the bottom-left corner of the viewport

**Expected Result**:
- ✅ A cyan blue button with "Support me" text appears at bottom-left
- ✅ Button has white text on cyan blue (#00b9fe) background
- ✅ Button is visible and not cut off

**Failure Indicators**:
- ❌ No button appears → Check browser console for script errors
- ❌ Button has wrong position → Check CSS or Ko-fi config
- ❌ Button has wrong color → Verify Ko-fi config parameters

### Step 3: Interaction Testing
1. Click the "Support me" button at bottom-left

**Expected Result**:
- ✅ Ko-fi overlay opens with donation form
- ✅ Overlay shows "kterr" profile information
- ✅ Donation amounts and payment options are visible

**Failure Indicators**:
- ❌ Button not clickable → Check z-index or pointer-events CSS
- ❌ Wrong Ko-fi profile → Verify username in config
- ❌ Overlay doesn't open → Check Ko-fi widget initialization

2. Close the overlay (X button or click outside)

**Expected Result**:
- ✅ Overlay closes smoothly
- ✅ Button returns to collapsed state
- ✅ Page remains fully functional

### Step 4: Multi-Page Verification
1. Navigate to http://localhost:3000/ (home page)
   - ✅ Button visible at bottom-left
2. Navigate to http://localhost:3000/legal-disclosure
   - ✅ Button visible at bottom-left
3. Navigate back to home
   - ✅ Button still visible and functional

**Expected Result**: Button appears consistently on all pages

### Step 5: Scroll Behavior
1. On any page, scroll down to the bottom
2. Scroll back to the top
3. Observe button position throughout

**Expected Result**:
- ✅ Button remains fixed at bottom-left during scrolling
- ✅ Button never disappears or moves with content
- ✅ Button stays above page content (z-index correct)

### Step 6: Responsive Testing - Mobile

**Option A: Browser DevTools**
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Toggle device emulation (Ctrl+Shift+M or Cmd+Shift+M)
3. Select iPhone or Android device preset
4. Refresh the page

**Option B: Real Device**
1. Find your local network IP: `ifconfig` or `ipconfig`
2. Open `http://[YOUR_IP]:3000` on mobile device
3. Wait for page to load

**Expected Result**:
- ✅ Button appears at bottom-left on mobile viewport
- ✅ Button is sized appropriately (not too large/small)
- ✅ Button doesn't obscure important content
- ✅ Button is easily tappable (good touch target size)
- ✅ Opening overlay works on touch devices

### Step 7: Responsive Testing - Tablet
1. In DevTools, select iPad or tablet preset
2. Test both portrait and landscape orientations

**Expected Result**:
- ✅ Button visible and properly positioned in both orientations
- ✅ Button size appropriate for tablet viewport

### Step 8: Error Handling Test

**Simulate Script Load Failure**:
1. Open browser DevTools → Network tab
2. Set "Offline" mode or block requests to `storage.ko-fi.com`
3. Refresh the page

**Expected Result**:
- ✅ Page loads normally without Ko-fi button
- ✅ No JavaScript errors in console (or graceful warning only)
- ✅ Site functionality remains intact

4. Disable offline mode and refresh

**Expected Result**:
- ✅ Button reappears after normal page load

### Step 9: Performance Check
1. Open DevTools → Network tab
2. Refresh page and observe network requests

**Expected Result**:
- ✅ Ko-fi script loads in < 1 second
- ✅ Script size is reasonable (~30-50KB)
- ✅ No blocking of other resources
- ✅ Page remains interactive during script load

### Step 10: Browser Compatibility (Optional but Recommended)

Test in multiple browsers:
- [ ] Chrome/Chromium - Expected: ✅ Works
- [ ] Firefox - Expected: ✅ Works
- [ ] Safari - Expected: ✅ Works
- [ ] Edge - Expected: ✅ Works

**Expected Result**: Button works identically across all modern browsers

## Production Deployment Verification

After deploying to production:

### Step 1: Production URL Test
```bash
# Replace with your actual production URL
curl -I https://tomohiko.io
# Should return 200 OK

# Visit production site
open https://tomohiko.io
```

### Step 2: Production Visual Check
1. Open production site in browser
2. Verify button appears at bottom-left
3. Click button and verify Ko-fi overlay opens
4. Test on mobile device if possible

### Step 3: Static Site Generation Verification
```bash
# Build static site
npm run generate

# Preview generated site
npm run preview

# Verify button works in preview mode
```

**Expected Result**: Button works identically in SSG mode as in dev mode

## Troubleshooting

### Button Not Appearing

**Check 1: Browser Console**
```javascript
// In browser console, check if Ko-fi is loaded
typeof kofiWidgetOverlay
// Expected: "object" or "function"
// If "undefined": Script didn't load
```

**Check 2: Network Tab**
- Look for request to `storage.ko-fi.com/cdn/scripts/overlay-widget.js`
- Verify it returns 200 OK
- Check for CSP errors

**Check 3: Script Initialization**
```javascript
// Check if draw() was called
// Look for console logs from your initialization code
```

### Button in Wrong Position

**Check**: Inspect Ko-fi's DOM elements
- Ko-fi creates its own positioned elements
- Verify no conflicting CSS from your site
- Check z-index hierarchy

### Button Not Clickable

**Check**:
- Other elements covering the button (z-index issue)
- CSS pointer-events property
- Ko-fi widget initialized correctly

### Overlay Not Opening

**Check**:
- Username 'kterr' is valid and active
- No JavaScript errors when clicking
- Ko-fi's server is operational

## Success Criteria

All checkboxes completed:
- [ ] Button appears on all pages (home, legal-disclosure)
- [ ] Button positioned at bottom-left corner
- [ ] Button has correct styling (cyan blue, white text, "Support me")
- [ ] Button is clickable and opens Ko-fi overlay
- [ ] Overlay shows correct Ko-fi profile (kterr)
- [ ] Button works on desktop, tablet, and mobile viewports
- [ ] Button remains fixed during scrolling
- [ ] Script load failure degrades gracefully
- [ ] No JavaScript errors in console
- [ ] Performance impact is minimal (< 1s script load)
- [ ] Works in all major browsers
- [ ] Works in production build

## Estimated Time

- **Development validation**: 3 minutes
- **Responsive testing**: 1 minute
- **Cross-browser testing**: 2 minutes (if needed)
- **Production verification**: 1 minute

**Total**: ~5-7 minutes

## Next Steps After Validation

1. If all checks pass: ✅ Feature is ready for production
2. If issues found: ❌ Return to implementation and fix
3. Document any browser-specific quirks in release notes
4. Update privacy policy if needed (Ko-fi integration disclosure)

## Automated Test Equivalent

These manual steps are automated in:
- `tests/e2e/kofi-button.spec.ts` - Playwright E2E tests

Run automated tests:
```bash
npm run test:e2e
```

The automated tests cover Steps 2-5 programmatically.