# Tasks: Fix Legal Disclosure Page Direct Access

**Input**: Design documents from `/specs/002-https-tomohiko-io/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Nuxt.js Web app**: Root directory structure with `pages/`, `components/`, `nuxt.config.ts`
- Configuration files at project root
- Test files in project root or `tests/` directory

## Phase 3.1: Setup & Investigation
- [x] T001 Reproduce the direct access issue by testing https://tomohiko.io/legal-disclosure
- [x] T002 [P] Verify local development works correctly at http://localhost:3002/legal-disclosure
- [x] T003 [P] Confirm build configuration includes legal-disclosure in nuxt.config.ts prerender routes

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Create contract test for direct URL access in test-legal-disclosure-direct.cjs
- [x] T005 [P] Create build output verification test in test-build-legal-disclosure.cjs
- [x] T006 [P] Create content consistency test comparing direct vs navigation access in test-legal-content-consistency.cjs
- [x] T007 [P] Create performance test for static file serving in test-legal-performance.cjs

## Phase 3.3: Build & Configuration Analysis (ONLY after tests are failing)
- [x] T008 [P] Generate static build and verify legal-disclosure files are created in dist/ directory
- [x] T009 [P] Inspect generated static files in dist/legal-disclosure/ for proper HTML structure
- [x] T010 [P] Check local static file serving works via http-server or similar tool
- [x] T011 Examine current CloudFront/S3 deployment configuration if accessible
- [x] T012 Research CloudFront behavior patterns and origin request policies
- [x] T013 Investigate S3 bucket permissions and access control

## Phase 3.4: Configuration Fixes
- [x] T014 Update nuxt.config.ts if needed to ensure proper static generation
- [x] T015 Create or update CloudFront distribution configuration for proper routing
- [x] T016 Update S3 bucket policies to allow proper static file access
- [x] T017 Configure proper error handling for static routes in deployment pipeline

## Phase 3.5: Validation & Polish
- [x] T018 [P] Run contract test to verify direct URL access returns HTTP 200
- [x] T019 [P] Run content consistency test to ensure identical content via both access methods
- [x] T020 [P] Run performance test to verify fast static file serving
- [x] T021 [P] Test SEO meta tags are properly rendered for direct access
- [x] T022 [P] Update existing test files test-legal.spec.js and test-legal-disclosure.js to cover new scenarios
- [x] T023 Document the fix and update deployment procedures if needed

## Dependencies
- Investigation (T001-T003) before tests (T004-T007)
- Tests (T004-T007) before implementation (T008-T017)
- T008-T010 (build verification) before T011-T013 (infrastructure analysis)
- T014-T017 (fixes) before T018-T021 (validation)
- All implementation before T022-T023 (polish)

## Parallel Example
```
# Launch T002-T003 together (setup investigation):
Task: "Verify local development works correctly at http://localhost:3000/legal-disclosure"
Task: "Confirm build configuration includes legal-disclosure in nuxt.config.ts prerender routes"

# Launch T004-T007 together (test creation):
Task: "Create contract test for direct URL access in test-legal-disclosure-direct.js"
Task: "Create build output verification test in test-build-legal-disclosure.js"
Task: "Create content consistency test comparing direct vs navigation access in test-legal-content-consistency.js"
Task: "Create performance test for static file serving in test-legal-performance.js"

# Launch T008-T010 together (build verification):
Task: "Generate static build and verify legal-disclosure files are created in dist/ directory"
Task: "Inspect generated static files in dist/legal-disclosure/ for proper HTML structure"
Task: "Check local static file serving works via http-server or similar tool"
```

## Notes
- [P] tasks = different files, no dependencies
- Issue is likely infrastructure-level (CloudFront/S3) rather than application code
- Verify tests fail before implementing fixes
- Focus on configuration changes rather than code changes
- Test both local and production environments

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - static-page-access.md → contract test for direct URL access (T004)
   - Expected response validation → content and performance tests (T005-T007)

2. **From Data Model**:
   - Static Page Route entity → build verification tasks (T008-T010)
   - Access Control Configuration → infrastructure analysis tasks (T011-T013)

3. **From User Stories**:
   - Direct access user story → integration test (T004)
   - Navigation compatibility → content consistency test (T006)

4. **Ordering**:
   - Setup → Tests → Analysis → Fixes → Validation → Polish
   - Local verification before production investigation

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (T004-T007)
- [x] All entities have analysis tasks (T008-T013)
- [x] All tests come before implementation (T004-T007 before T008+)
- [x] Parallel tasks truly independent ([P] tasks use different files)
- [x] Each task specifies exact file path or clear target
- [x] No task modifies same file as another [P] task