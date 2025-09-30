
# Implementation Plan: Ko-fi Support Button

**Branch**: `003-ko-fi-com` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ko-fi-com/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implement a Ko-fi floating donation button positioned at the bottom left corner of the portfolio website. The button will integrate Ko-fi's overlay widget (username: kterr) using their CDN-hosted script, allowing site visitors to support the portfolio owner financially. The button will be fixed-position, visible across all pages, responsive on all devices, and styled with the text "Support me" in white on a cyan blue (#00b9fe) background.

## Technical Context
**Language/Version**: TypeScript/JavaScript with Vue 3.5.15
**Primary Dependencies**: Nuxt.js 3.17.4, TailwindCSS 6.14.0, Ko-fi overlay-widget.js (CDN)
**Storage**: N/A (no data storage required)
**Testing**: Playwright (end-to-end testing for visual verification and interaction)
**Target Platform**: Static site generated with Nuxt (SSG), deployed via CloudFront CDN
**Project Type**: Web (single frontend application with static generation)
**Performance Goals**: Button must not impact page load time significantly; script loading should be non-blocking
**Constraints**: Must maintain sub-second page load time; button must not obscure content; external script dependency on Ko-fi CDN
**Scale/Scope**: Single component integration affecting all pages; no backend changes required

**User-Provided Implementation Details**: Ko-fi provided script using kofiWidgetOverlay.draw() with floating-chat widget type, cyan blue background (#00b9fe), white text, username 'kterr'

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Security-First**: ✅ PASS
- External script loaded via HTTPS from Ko-fi CDN (storage.ko-fi.com)
- No credentials or sensitive data involved
- No IAM access keys or authentication changes required
- Existing HTTPS/CloudFront infrastructure maintained

**II. Performance-First**: ✅ PASS
- External script loaded asynchronously to avoid blocking page load
- Minimal impact on static site generation
- CloudFront CDN continues to serve all static assets
- Button widget is lightweight (external optimization by Ko-fi)

**III. Maintainability**: ✅ PASS
- Simple component integration following Vue 3/Nuxt patterns
- Configuration values clearly defined (username, colors, text)
- TypeScript type safety maintained
- Follows existing project structure and conventions

**IV. Professional Presentation**: ✅ PASS
- Provides professional support/donation mechanism
- Non-intrusive bottom-left positioning
- Responsive design across all devices
- Consistent with modern portfolio sites

**V. Infrastructure as Code**: ✅ PASS
- No infrastructure changes required
- Existing CDK stack unchanged
- Code changes only (Vue components)
- Deployment through existing CI/CD pipeline

**Overall**: ✅ PASS - No constitutional violations. Feature aligns with all principles.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Nuxt 3 Application Structure (Web Application)
components/          # Vue components
├── KofiButton.vue   # NEW: Ko-fi floating button component

layouts/             # Layout components
├── default.vue      # Default layout (will integrate Ko-fi button)

pages/               # Page components
├── index.vue        # Home page
└── legal-disclosure.vue  # Legal disclosure page

app.vue              # Root application component (potential integration point)

nuxt.config.ts       # Nuxt configuration (script integration point)

tests/               # Test files
├── e2e/             # NEW: End-to-end tests
│   └── kofi-button.spec.ts  # Ko-fi button interaction tests

public/              # Static assets (unchanged)
assets/              # CSS and other assets (unchanged)
```

**Structure Decision**: This is a Nuxt 3 single-page application using the standard Nuxt convention-based routing structure. The Ko-fi button will be implemented as:
1. A reusable Vue component (`components/KofiButton.vue`)
2. Integrated into the default layout or app.vue for site-wide visibility
3. External script loaded via Nuxt's `useHead()` or `app.head` configuration
4. Tested with Playwright end-to-end tests to verify visibility and functionality

No backend changes are required. All modifications are frontend-only.

## Phase 0: Outline & Research ✅ COMPLETE

**Research Questions Addressed**:
1. Ko-fi Widget Integration Best Practices → Use official overlay widget with client-side initialization
2. Script Loading Strategy in Nuxt 3 → Use `useHead()` composable with defer
3. Component Architecture → Initialize directly in app.vue using `onMounted()`
4. Error Handling for Script Failures → Graceful degradation with console warning
5. Positioning and Z-Index Management → Trust Ko-fi's built-in positioning
6. Testing Strategy → Playwright end-to-end tests
7. Static Site Generation Compatibility → Client-side only initialization

**Resolved Clarifications**:
- Error handling: Silent degradation acceptable
- Page visibility: Display on all pages
- Overlap management: Ko-fi widget designed to avoid conflicts

**Output**: ✅ research.md created with all decisions documented

## Phase 1: Design & Contracts ✅ COMPLETE

**1. Data Model** → `data-model.md`:
   - ✅ No data entities required (third-party widget integration)
   - ✅ Configuration values documented (username, colors, text)
   - ✅ External data flow documented

**2. Contracts** → `contracts/widget-interface.md`:
   - ✅ External script interface contract defined
   - ✅ Widget initialization contract specified
   - ✅ Expected behavior documented (visual, interaction, responsive)
   - ✅ Error scenarios defined
   - ✅ Performance contract established
   - ✅ Security considerations documented

**3. Test Scenarios** → `quickstart.md`:
   - ✅ Visual verification steps (desktop, mobile, tablet)
   - ✅ Interaction testing (click, open overlay, close)
   - ✅ Multi-page verification
   - ✅ Scroll behavior validation
   - ✅ Error handling test
   - ✅ Performance check
   - ✅ Browser compatibility checklist

**4. Agent Context Update**:
   - ✅ Executed `.specify/scripts/bash/update-agent-context.sh claude`
   - ✅ CLAUDE.md updated with Ko-fi integration details
   - ✅ Technologies added: Vue 3.5.15, Nuxt.js 3.17.4, Ko-fi overlay widget
   - ✅ Recent changes recorded

**Output**: ✅ data-model.md, contracts/widget-interface.md, quickstart.md, CLAUDE.md updated

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

The /tasks command will generate a task list following TDD principles for this frontend integration:

1. **Setup Tasks** (1-2 tasks):
   - Create placeholder/skeleton files
   - Update nuxt.config.ts if needed

2. **Test Tasks** (3-5 tasks) [P]:
   - Create Playwright E2E test file for Ko-fi button
   - Test: Button appearance on page load
   - Test: Button position and styling
   - Test: Button interaction (click to open overlay)
   - Test: Responsive behavior (mobile, tablet, desktop)

3. **Implementation Tasks** (2-4 tasks):
   - Implement Ko-fi script loading in app.vue using useHead()
   - Implement Ko-fi widget initialization with onMounted()
   - Handle error scenarios (script load failure)
   - Verify CSS doesn't conflict with Ko-fi widget

4. **Verification Tasks** (1-2 tasks):
   - Run quickstart.md manual validation
   - Verify all E2E tests pass
   - Test static site generation build

**Ordering Strategy**:
1. **Test-First**: E2E tests written before implementation (will fail initially)
2. **Implementation**: Add Ko-fi integration to make tests pass
3. **Verification**: Validate against quickstart guide

**Parallelization**:
- [P] E2E test files can be created in parallel (independent test specs)
- Implementation tasks must be sequential (single app.vue file)

**File Structure**:
```
Tests:
  tests/e2e/kofi-button.spec.ts
  tests/e2e/kofi-responsive.spec.ts (optional)

Implementation:
  app.vue (modify existing file)

Documentation:
  No new documentation needed (already in specs/)
```

**Estimated Output**: 8-12 numbered tasks in tasks.md

**Complexity**: LOW
- No new components needed (Ko-fi handles UI)
- No state management required
- No routing changes
- No backend integration
- Single file modification (app.vue)

**Dependencies**:
- External: Ko-fi CDN availability
- Internal: Nuxt 3 composables (useHead, onMounted)
- Testing: Playwright setup (assumed already configured)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [x] Phase 3: Tasks generated (/tasks command) ✅
- [ ] Phase 4: Implementation complete - NEXT STEP
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅ (No violations)
- [x] Post-Design Constitution Check: PASS ✅ (No violations)
- [x] All NEEDS CLARIFICATION resolved ✅ (Via research phase)
- [x] Complexity deviations documented: N/A (No deviations)

**Artifacts Generated**:
- [x] research.md - Complete
- [x] data-model.md - Complete (N/A documented)
- [x] contracts/widget-interface.md - Complete
- [x] quickstart.md - Complete
- [x] CLAUDE.md - Updated
- [x] tasks.md - Complete (13 tasks generated)

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
