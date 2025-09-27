
# Implementation Plan: 特定商取引法に基づく表記ページ

**Branch**: `001-1-abc-123` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-1-abc-123/spec.md`

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
Create a legally compliant "特定商取引法に基づく表記" (Specified Commercial Transaction Act disclosure) page for the portfolio website. This static page will display all mandatory business information required by Japanese law for commercial websites, accessible via footer navigation and optimized for performance and professional presentation.

## Technical Context
**Language/Version**: JavaScript/TypeScript (Nuxt.js 3)
**Primary Dependencies**: Nuxt.js 3, TailwindCSS v3, Vue 3
**Storage**: Static content (no database required)
**Testing**: Vitest/Jest for unit tests, Playwright for E2E
**Target Platform**: Web browsers (static site served via AWS CloudFront)
**Project Type**: web - frontend static site
**Performance Goals**: <2s initial load, <100ms page transitions, 95+ Lighthouse score
**Constraints**: Static site generation only, HTTPS required, responsive design mandatory
**Scale/Scope**: Single legal disclosure page, minimal complexity, high compliance requirements

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Security-First ✅ PASS
- HTTPS: All traffic served over HTTPS via CloudFront (existing infrastructure)
- No credentials: Static page with no authentication requirements
- No sensitive data storage: Legal disclosure information is public by law

### II. Performance-First ✅ PASS
- Static site generation: Legal page will be pre-generated at build time
- CloudFront CDN: Existing CDN will serve the page globally
- Optimized delivery: TailwindCSS for minimal CSS, no images required

### III. Maintainability ✅ PASS
- Clean code: Vue.js component with TypeScript for type safety
- Established conventions: Following existing Nuxt.js project structure
- Version controlled: All changes through Git workflow

### IV. Professional Presentation ✅ PASS
- Legal compliance: Accurate representation of business requirements
- Modern UI/UX: Responsive design with TailwindCSS styling
- Accessible: WCAG compliance for inclusive design

### V. Infrastructure as Code ✅ PASS
- No infrastructure changes: Uses existing Nuxt.js static site generation
- Automated deployment: Existing GitHub Actions pipeline handles deployment

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
pages/
└── legal-disclosure.vue     # New legal disclosure page

components/
└── LegalDisclosure.vue      # Reusable disclosure component (if needed)

layouts/
└── default.vue             # Existing layout for consistent footer navigation

assets/
└── css/                    # TailwindCSS styles (existing)

tests/
├── unit/
│   └── legal-disclosure.test.js
└── e2e/
    └── legal-disclosure.spec.js

public/
└── [static assets if needed]
```

**Structure Decision**: Nuxt.js single-page application structure. The legal disclosure will be implemented as a new page at `/legal-disclosure` with responsive design using existing TailwindCSS framework. Footer navigation will be updated in the default layout to include the new legal page link.

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
- Generate tasks from Phase 1 design docs (data model, quickstart)
- Static page implementation tasks based on Nuxt.js structure
- Component creation and styling tasks
- Navigation integration tasks
- Testing tasks for compliance verification

**Ordering Strategy**:
- Static content structure setup first
- Page component creation
- Navigation integration
- Styling and responsive design
- Testing implementation (unit and E2E)
- Performance optimization

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

**Key Task Categories**:
1. Setup: Project structure and component scaffolding
2. Content: Legal disclosure data structure and content
3. UI: Page layout and responsive design with TailwindCSS
4. Navigation: Footer link integration in existing layout
5. Testing: Unit tests for component and E2E for user flows
6. Performance: Optimization and accessibility compliance

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
- [x] All NEEDS CLARIFICATION resolved (privacy protection handled)
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
