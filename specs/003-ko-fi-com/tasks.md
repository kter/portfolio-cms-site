# Tasks: Ko-fi Support Button

**Input**: Design documents from `/specs/003-ko-fi-com/`
**Prerequisites**: plan.md, research.md, contracts/widget-interface.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Vue 3.5.15, Nuxt.js 3.17.4, Ko-fi overlay widget
   → Structure: Web app (single frontend, no backend)
2. Load design documents:
   → contracts/widget-interface.md: Ko-fi external widget contract
   → research.md: useHead() + onMounted() approach in app.vue
   → quickstart.md: Visual and interaction test scenarios
3. Generate tasks by category:
   → Setup: E2E test infrastructure
   → Tests: Playwright tests for widget (TDD)
   → Core: Ko-fi integration in app.vue
   → Verification: Quickstart validation, SSG build
4. Apply task rules:
   → Test files = [P] (can run in parallel)
   → app.vue modifications = sequential (same file)
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T010)
6. Validate: All quickstart scenarios have tests
7. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Frontend**: Repository root (Nuxt 3 app structure)
- **Tests**: `tests/e2e/` for Playwright tests
- **Implementation**: `app.vue` (root application component)

---

## Phase 3.1: Setup

### T001: Verify Playwright configuration for E2E testing ✅
**Description**: Verify that Playwright is properly configured for the project. Check for `playwright.config.ts` or similar configuration file. If not present, create basic Playwright configuration for testing Nuxt 3 application.

**Files**:
- Check: `playwright.config.ts` or `playwright.config.js`
- Create if missing with basic config for `http://localhost:3000`

**Acceptance**:
- Playwright configuration exists
- Configuration points to local dev server
- Can run `npx playwright test` without errors

**Dependencies**: None

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation in app.vue**

### T002 [P]: Create E2E test for Ko-fi button appearance ✅
**Description**: Create Playwright test to verify Ko-fi button appears on page load at the bottom-left corner. Test should check for button presence, position, and basic visibility. This test MUST FAIL initially (button doesn't exist yet).

**Files**:
- Create: `tests/e2e/kofi-button-appearance.spec.ts`

**Test Scenarios** (from quickstart.md):
1. Navigate to home page (`/`)
2. Wait for page load (2-3 seconds for Ko-fi script)
3. Assert button exists in DOM
4. Assert button is visible (not hidden)
5. Assert button is at bottom-left corner (check position/CSS)

**Acceptance**:
- Test file created with proper Playwright syntax
- Test visits both `/` and `/legal-disclosure` pages
- Test currently FAILS (button doesn't exist yet)
- Test uses appropriate selectors (Ko-fi widget creates its own elements)

**Dependencies**: T001 (Playwright config)

---

### T003 [P]: Create E2E test for Ko-fi button styling ✅
**Description**: Create Playwright test to verify Ko-fi button has correct styling (cyan blue background #00b9fe, white text, "Support me" text). Test should verify the visual appearance matches specification. This test MUST FAIL initially.

**Files**:
- Create: `tests/e2e/kofi-button-styling.spec.ts`

**Test Scenarios** (from contracts/widget-interface.md):
1. Navigate to home page
2. Wait for Ko-fi button to load
3. Assert button has text "Support me"
4. Assert button has background color #00b9fe (or similar - Ko-fi may apply CSS)
5. Assert button has white text color

**Acceptance**:
- Test file created with style verification
- Test checks for correct button text
- Test currently FAILS (button doesn't exist yet)
- Uses appropriate color checking method (computed styles)

**Dependencies**: T001 (Playwright config)

---

### T004 [P]: Create E2E test for Ko-fi button interaction ✅
**Description**: Create Playwright test to verify Ko-fi button is clickable and opens Ko-fi overlay. Test should verify the interaction behavior without completing an actual donation. This test MUST FAIL initially.

**Files**:
- Create: `tests/e2e/kofi-button-interaction.spec.ts`

**Test Scenarios** (from quickstart.md):
1. Navigate to home page
2. Wait for Ko-fi button to load
3. Click the Ko-fi button
4. Assert Ko-fi overlay appears (new elements in DOM)
5. Verify overlay contains Ko-fi content (username 'kterr' visible)
6. Close overlay (click X or outside)
7. Assert overlay closes and button remains

**Acceptance**:
- Test file created with interaction checks
- Test verifies button is clickable
- Test verifies overlay opens (doesn't complete donation)
- Test currently FAILS (button doesn't exist yet)

**Dependencies**: T001 (Playwright config)

---

### T005 [P]: Create E2E test for responsive behavior ✅
**Description**: Create Playwright test to verify Ko-fi button works correctly on mobile, tablet, and desktop viewports. Test should verify responsive positioning and sizing. This test MUST FAIL initially.

**Files**:
- Create: `tests/e2e/kofi-button-responsive.spec.ts`

**Test Scenarios** (from quickstart.md):
1. Test on desktop viewport (1920x1080)
   - Assert button visible at bottom-left
2. Test on tablet viewport (768x1024)
   - Assert button visible and appropriately sized
3. Test on mobile viewport (375x667)
   - Assert button visible and not obscuring content
   - Assert button has good touch target size

**Acceptance**:
- Test file created with viewport testing
- Test covers desktop, tablet, mobile viewports
- Test verifies button position on each viewport
- Test currently FAILS (button doesn't exist yet)

**Dependencies**: T001 (Playwright config)

---

### T006 [P]: Create E2E test for scroll behavior ✅
**Description**: Create Playwright test to verify Ko-fi button remains fixed at bottom-left during page scrolling. Test should verify the button stays in position when content is scrolled. This test MUST FAIL initially.

**Files**:
- Create: `tests/e2e/kofi-button-scroll.spec.ts`

**Test Scenarios** (from quickstart.md):
1. Navigate to home page
2. Wait for Ko-fi button to load
3. Get initial button position
4. Scroll to bottom of page
5. Assert button is still at same viewport position (fixed)
6. Scroll back to top
7. Assert button hasn't moved

**Acceptance**:
- Test file created with scroll testing
- Test verifies fixed positioning during scroll
- Test currently FAILS (button doesn't exist yet)

**Dependencies**: T001 (Playwright config)

---

### T007 [P]: Create E2E test for multi-page visibility ✅
**Description**: Create Playwright test to verify Ko-fi button appears on all pages of the site (home and legal-disclosure). Test should verify consistent button presence across navigation. This test MUST FAIL initially.

**Files**:
- Create: `tests/e2e/kofi-button-multipage.spec.ts`

**Test Scenarios** (from quickstart.md):
1. Navigate to home page (`/`)
2. Assert button visible
3. Navigate to legal-disclosure page (`/legal-disclosure`)
4. Assert button still visible
5. Navigate back to home
6. Assert button still functional

**Acceptance**:
- Test file created with multi-page navigation
- Test verifies button on all site pages
- Test currently FAILS (button doesn't exist yet)

**Dependencies**: T001 (Playwright config)

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

**Prerequisites**: ALL tests T002-T007 must be written and failing

### T008: Implement Ko-fi script loading in app.vue ✅
**Description**: Modify `app.vue` to load Ko-fi overlay-widget.js script from CDN using Nuxt's `useHead()` composable. Configure script to load with defer attribute for non-blocking load. Add error handling for script load failure.

**Files**:
- Modify: `app.vue`

**Implementation Details** (from research.md):
1. Import `useHead` from `#app` or `nuxt/app`
2. Add `useHead()` call in script setup with:
   - Script src: `https://storage.ko-fi.com/cdn/scripts/overlay-widget.js`
   - Defer: true (non-blocking load)
3. Add error handling for script load failure (console warning)

**Code Reference** (research.md lines 44-65):
```typescript
useHead({
  script: [
    {
      src: 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js',
      defer: true
    }
  ]
});
```

**Acceptance**:
- `useHead()` properly configured in app.vue
- Script loads from Ko-fi CDN with defer attribute
- Browser DevTools Network tab shows script loading
- No errors in console (except Ko-fi not initialized yet)

**Dependencies**: T002-T007 (tests must be failing first)

---

### T009: Implement Ko-fi widget initialization in app.vue ✅
**Description**: Add Ko-fi widget initialization in `app.vue` using `onMounted()` lifecycle hook. Initialize widget with specified configuration (username: kterr, floating-chat type, cyan blue background, white text). Add type safety and error checking.

**Files**:
- Modify: `app.vue` (same file as T008, done sequentially)

**Implementation Details** (from research.md):
1. Import `onMounted` from Vue
2. Add `onMounted()` hook to wait for Ko-fi script load
3. Call `kofiWidgetOverlay.draw()` with configuration:
   - Username: 'kterr'
   - Type: 'floating-chat'
   - Button text: 'Support me'
   - Background color: '#00b9fe'
   - Text color: '#fff'
4. Add type checking for `kofiWidgetOverlay` existence
5. Add error logging if widget fails to initialize

**Code Reference** (research.md lines 44-65):
```typescript
onMounted(() => {
  // Wait for script to load
  if (typeof kofiWidgetOverlay !== 'undefined') {
    kofiWidgetOverlay.draw('kterr', {
      'type': 'floating-chat',
      'floating-chat.donateButton.text': 'Support me',
      'floating-chat.donateButton.background-color': '#00b9fe',
      'floating-chat.donateButton.text-color': '#fff'
    });
  } else {
    console.warn('Ko-fi widget failed to load. Donation button will not be available.');
  }
});
```

**Acceptance**:
- Ko-fi widget initializes on page load
- Button appears at bottom-left corner
- Button has correct styling (cyan blue, white text)
- Tests T002-T007 now PASS
- No errors in console (or graceful warning only)

**Dependencies**: T008 (script loading must be implemented first)

---

### T010: Add TypeScript type declarations for Ko-fi widget ✅
**Description**: Create or update TypeScript declaration file to add type information for Ko-fi's `kofiWidgetOverlay` global object. This prevents TypeScript errors when calling `kofiWidgetOverlay.draw()`.

**Files**:
- Create: `types/kofi.d.ts` (or add to existing types file)

**Implementation Details**:
1. Declare global `kofiWidgetOverlay` interface
2. Add `draw()` method signature with parameters
3. Add configuration interface for widget options

**Code Reference**:
```typescript
declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, config: {
        'type': string;
        'floating-chat.donateButton.text': string;
        'floating-chat.donateButton.background-color': string;
        'floating-chat.donateButton.text-color': string;
      }) => void;
    };
  }
}

declare const kofiWidgetOverlay: Window['kofiWidgetOverlay'];

export {};
```

**Acceptance**:
- TypeScript file created with Ko-fi types
- No TypeScript errors in app.vue when using `kofiWidgetOverlay`
- Type checking works for configuration parameters
- Build succeeds without type errors

**Dependencies**: T009 (after implementation is done)

---

## Phase 3.4: Verification

### T011: Run E2E tests to verify all scenarios pass ✅
**Description**: Execute all Playwright E2E tests created in Phase 3.2 (T002-T007) to verify the Ko-fi button implementation is complete and correct. All tests should now PASS.

**Files**:
- Run: All tests in `tests/e2e/kofi-*.spec.ts`

**Command**:
```bash
npx playwright test tests/e2e/kofi-
```

**Acceptance**:
- All E2E tests (T002-T007) PASS
- No test failures or errors
- Button appears, styled correctly, interactive, responsive
- Works across all pages

**Dependencies**: T010 (implementation complete)

---

### T012: Execute quickstart.md manual validation ⏭️
**Description**: Perform manual testing following the quickstart.md guide to verify the Ko-fi button integration. This is a human validation step to catch any issues not covered by automated tests.

**Files**:
- Follow: `specs/003-ko-fi-com/quickstart.md`

**Steps** (from quickstart.md):
1. Start dev server: `npm run dev`
2. Visual verification - Desktop (Step 2)
3. Interaction testing (Step 3)
4. Multi-page verification (Step 4)
5. Scroll behavior (Step 5)
6. Responsive testing - Mobile (Step 6)
7. Responsive testing - Tablet (Step 7)
8. Error handling test (Step 8)
9. Performance check (Step 9)
10. Browser compatibility (Step 10 - optional)

**Acceptance**:
- All quickstart steps completed successfully
- All checkboxes in quickstart.md checked
- Button works as expected in manual testing
- No visual or functional issues found

**Dependencies**: T011 (automated tests pass)

---

### T013: Test static site generation build ✅
**Description**: Build the site using Nuxt's static site generation (`npm run generate`) and verify the Ko-fi button works correctly in the generated static site. Preview the generated site and test button functionality.

**Files**:
- Generate: `.output/public/` (Nuxt SSG output)

**Commands**:
```bash
# Generate static site
npm run generate

# Preview generated site
npm run preview

# Test in browser at preview URL
```

**Acceptance**:
- Static site builds without errors
- Ko-fi button appears in generated static pages
- Button works correctly in preview mode
- Script loads from Ko-fi CDN in static build
- No SSR/hydration issues

**Dependencies**: T012 (manual validation complete)

---

## Dependencies

### Dependency Graph
```
T001 (Setup)
  ↓
T002, T003, T004, T005, T006, T007 (Tests - can run in parallel [P])
  ↓
T008 (Script loading)
  ↓
T009 (Widget initialization)
  ↓
T010 (TypeScript types)
  ↓
T011 (Run E2E tests)
  ↓
T012 (Manual validation)
  ↓
T013 (SSG build test)
```

### Critical Path
1. Setup (T001)
2. Write all tests (T002-T007) - MUST FAIL initially
3. Implement script loading (T008)
4. Implement widget init (T009)
5. Add types (T010)
6. Verify tests pass (T011)
7. Manual validation (T012)
8. Production build test (T013)

---

## Parallel Execution Examples

### Phase 3.2: Run all test creation tasks in parallel
```bash
# All test files are independent and can be created simultaneously
Task: "Create E2E test for Ko-fi button appearance in tests/e2e/kofi-button-appearance.spec.ts"
Task: "Create E2E test for Ko-fi button styling in tests/e2e/kofi-button-styling.spec.ts"
Task: "Create E2E test for Ko-fi button interaction in tests/e2e/kofi-button-interaction.spec.ts"
Task: "Create E2E test for responsive behavior in tests/e2e/kofi-button-responsive.spec.ts"
Task: "Create E2E test for scroll behavior in tests/e2e/kofi-button-scroll.spec.ts"
Task: "Create E2E test for multi-page visibility in tests/e2e/kofi-button-multipage.spec.ts"
```

**Note**: T008-T009 cannot run in parallel as they both modify app.vue

---

## Notes

### Implementation Notes
- **Single file modification**: All implementation happens in `app.vue` (T008-T009)
- **No new components**: Ko-fi widget is self-contained, no Vue component needed
- **Client-side only**: Widget initializes only in browser (onMounted ensures this)
- **No backend changes**: Purely frontend integration
- **External dependency**: Relies on Ko-fi CDN availability

### Testing Notes
- **E2E testing only**: No unit tests needed (external widget)
- **TDD approach**: All tests written before implementation
- **Visual testing**: Tests verify appearance, not just functionality
- **No mock needed**: Tests can use real Ko-fi widget (doesn't complete donations)

### Performance Notes
- **Non-blocking load**: Script loads with defer attribute
- **Lazy initialization**: Widget initializes after page content loads
- **Minimal impact**: Expected ~30-50KB script size from Ko-fi CDN

### Troubleshooting
- If tests fail to find button: Wait longer for Ko-fi script to load (increase timeout)
- If button styling wrong: Ko-fi may override some styles; verify config parameters
- If TypeScript errors: Ensure type declarations are properly loaded

---

## Validation Checklist
*GATE: Checked before marking complete*

- [x] All contract behaviors have corresponding tests (widget interface contract → T002-T007)
- [x] All tests come before implementation (T002-T007 before T008-T010)
- [x] Parallel tasks truly independent (T002-T007 all create different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task (app.vue tasks are sequential)
- [x] All quickstart scenarios covered by tests
- [x] TDD approach enforced (tests must fail first)

---

## Estimated Completion Time

| Phase | Tasks | Time Estimate |
|-------|-------|---------------|
| Setup | T001 | 5 minutes |
| Test Creation | T002-T007 | 30 minutes (parallel) |
| Implementation | T008-T010 | 20 minutes (sequential) |
| Verification | T011-T013 | 15 minutes |
| **Total** | **13 tasks** | **~70 minutes** |

**Complexity**: LOW - Simple third-party widget integration with comprehensive testing