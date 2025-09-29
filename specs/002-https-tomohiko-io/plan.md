
# Implementation Plan: Fix Legal Disclosure Page Direct Access

**Branch**: `002-https-tomohiko-io` | **Date**: 2025-09-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-https-tomohiko-io/spec.md`

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
Fix direct access to legal disclosure page at https://tomohiko.io/legal-disclosure which currently returns "Access Denied" when accessed directly, but works when accessed through navigation from the main site. This is a Nuxt.js 3 static site generation (SSG) issue that requires investigation and resolution of routing/prerender configuration.

## Technical Context
**Language/Version**: TypeScript with Nuxt.js 3.17.4, Vue.js 3.5.15
**Primary Dependencies**: Nuxt.js 3, Vue Router 4.5.1, TailwindCSS 6.14.0
**Storage**: Static file-based content (data/legal-disclosure), deployed via static site generation
**Testing**: Node.js test files present (test-legal.spec.js, test-legal-disclosure.js)
**Target Platform**: Web browsers via static hosting (likely S3/CloudFront based on constitution)
**Project Type**: web - Nuxt.js 3 SSG application with pages directory structure
**Performance Goals**: Fast loading static pages with CDN distribution
**Constraints**: Must maintain HTTPS, static generation, no server-side processing required
**Scale/Scope**: Portfolio website with legal compliance pages, small scale

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Security-First**: ✅ PASS - Fixing direct access to public legal page maintains HTTPS, no new security risks
**Performance-First**: ✅ PASS - Static site generation maintained, CDN delivery preserved, no performance impact
**Maintainability**: ✅ PASS - Simple configuration fix, follows Nuxt.js conventions, TypeScript maintained
**Professional Presentation**: ✅ PASS - Legal compliance page accessibility improves professional image
**Infrastructure as Code**: ✅ PASS - No infrastructure changes required, existing CDK setup maintained

**Initial Assessment**: All constitutional principles satisfied. This is a minimal configuration fix.

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
# Nuxt.js 3 Web Application Structure
pages/
├── index.vue
└── legal-disclosure.vue         # Target page with access issue

components/
├── LegalDisclosure.vue          # Component used by page
└── [other components]

data/
└── legal-disclosure.ts          # Legal page content

server/
└── tsconfig.json               # Server configuration

tests/
├── test-legal.spec.js          # Existing test file
└── test-legal-disclosure.js    # Existing test file

# Configuration files
nuxt.config.ts                  # Main configuration file
package.json                    # Dependencies
```

**Structure Decision**: Nuxt.js 3 web application with pages-based routing. The legal-disclosure.vue page exists but has access issues when accessed directly. The issue is likely in the static site generation configuration or server/CDN routing rather than the Vue component itself.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Create verification tasks to test current issue [P]
- Create investigation tasks to identify root cause [P]
- Create configuration fix tasks based on findings
- Create validation tasks to confirm resolution

**Specific Task Categories**:
1. **Issue Reproduction**: Test current direct access failure
2. **Build Verification**: Confirm static generation works correctly
3. **Infrastructure Investigation**: Check CloudFront/S3 configuration
4. **Configuration Fix**: Update necessary configuration files
5. **Deployment Validation**: Test fix in production environment

**Ordering Strategy**:
- Investigation before fixes (understand problem fully)
- Build verification before infrastructure changes
- Local testing before production deployment
- Mark [P] for parallel investigation tasks

**Estimated Output**: 12-15 numbered, ordered tasks in tasks.md focusing on:
- Issue diagnosis and root cause analysis
- Configuration fixes (likely infrastructure-level)
- Comprehensive testing and validation

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
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
