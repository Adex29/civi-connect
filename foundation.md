# Project Foundation

> This document preserves context, raw intent, and domain research for CiviConnect.
> It is not the final authority when an accepted decision in [`decisions.md`](file:///d:/Admin/Music/Janella/civi-connect/decisions.md) supersedes it.

---

## Index

- [F-CIV-001: Product Vision & Core Mission](#f-civ-001-product-vision--core-mission)
- [F-CIV-002: Users and Stakeholders](#f-civ-002-users-and-stakeholders)
- [F-CIV-003: Domain Model and Terminology](#f-civ-003-domain-model-and-terminology)
- [F-CIV-004: User Workflows](#f-civ-004-user-workflows)
- [F-CIV-005: Functional Requirements](#f-civ-005-functional-requirements)
- [F-CIV-006: Non-Functional Requirements](#f-civ-006-non-functional-requirements)
- [F-CIV-007: Technical & Regulatory Constraints](#f-civ-007-technical--regulatory-constraints)
- [F-CIV-008: Security and Authorization Context](#f-civ-008-security-and-authorization-context)
- [F-CIV-009: Comparable Systems and Precedents](#f-civ-009-comparable-systems-and-precedents)
- [F-CIV-010: Alternatives Explored](#f-civ-010-alternatives-explored)
- [F-CIV-011: Open Questions & Unknowns](#f-civ-011-open-questions--unknowns)
- [F-CIV-012: Source Register](#f-civ-012-source-register)

---

## F-CIV-001: Product Vision & Core Mission

### Vision
CiviConnect (Civi-Tech Simulation Engine) is an educational simulation and assessment platform designed to cultivate civic problem-solving, structured public-policy analysis, and collaborative civic literacy in students. 

Through realistic municipal scenarios (such as stray animal rabies threats, public health crises, traffic interventions, or waste management challenges), students step through a guided 7-stage civic inquiry cycle. The platform leverages AI-assisted evaluation (Google Gemini) to provide formative feedback against structured criteria without replacing teacher judgment.

### Core Problem
- Traditional civics education is often theoretical, lacking interactive, scenario-based engagement.
- Teachers lack structured platforms to simulate complex civic dilemmas with realistic stakeholder dynamics, evidence libraries, and rubric-driven formative assessment.
- Students struggle to break down complex public issues into root causes, stakeholder interests, evidence synthesis, and viable policy interventions.

---

## F-CIV-002: Users and Stakeholders

### Primary Actors
1. **Students (Individual / Teams)**:
   - Primary learners in junior/senior high school or collegiate civic courses.
   - Identified via Philippine Department of Education 12-digit Learner Reference Numbers (LRN) and join codes.
   - Work through assigned civic mission scenarios individually or collaboratively in groups.
2. **Teachers / Administrators**:
   - Instructors managing classroom sections, authoring civic mission scenarios, configuring evaluation criteria and evidence banks, monitoring real-time submission progress, and reviewing student proposals.
   - Access the platform via administrative credentials.

### Secondary Stakeholders
- **DepEd / Institutional Evaluators**: Educational administrators assessing alignment with curriculum standards.
- **Simulated Community Stakeholders**: Fictional local actors embedded in scenarios (e.g. Barangay Captains, Veterinarians, Animal Shelter Directors, Local Residents) providing diverse viewpoints.

---

## F-CIV-003: Domain Model and Terminology

### Key Entities
- **Classroom**: An academic section (e.g. `CVC-3A`) managed by an administrator with a unique 6-character Join Code.
- **Student**: An enrolled learner identified by a 12-digit numeric LRN.
- **Group / Team**: A collaborative team of students within a classroom working together on a mission.
- **Scenario (Civic Mission)**: A structured civic problem simulation containing context, problem category, criteria, evidence library, stakeholder profiles, unexpected crisis events, and instructor tips.
- **Constraint / Criterion**: Explicit rule or rubric item attached to a simulation step (e.g. "Identify at least two systemic causes").
- **Assignment**: Association linking a scenario to a classroom or student team.
- **Submission**: The student’s interactive responses, step progression (Steps 1–7), AI evaluation feedback, score, and final policy proposal.

### Simulation Steps (7-Step Civic Inquiry)
1. `identify` — Define the core problem and distinguish symptoms from issues.
2. `analyze` — Map root causes and systemic drivers.
3. `evidence` — Evaluate and synthesize verifiable evidence from the mission library.
4. `stakeholders` — Map stakeholder perspectives, tensions, and community priorities.
5. `intervention` — Formulate actionable public policy or community interventions.
6. `challenge` — Respond to an unexpected civic crisis or complication event.
7. `reflection / tips` — Synthesize lessons learned and reflect on trade-offs.

---

## F-CIV-004: User Workflows

### 1. Classroom Onboarding Workflow
- Admin creates a Classroom section with a title and description.
- System generates a 6-character Join Code (e.g. `S43ZQ8`).
- Admin shares the Join Code with students.
- Students sign up using Join Code + Full Name + 12-digit LRN + Password + optional Group Name.

### 2. Mission Authoring & Assignment Workflow
- Admin authors a Scenario using the Mission Editor (Issues, Causes, Evidence, Stakeholders, Unexpected Events, Step Tips).
- Admin assigns the Scenario to one or more Classroom sections via the Mission Drawer or Scenario view.

### 3. Student Simulation Workflow
- Student logs into student dashboard, views assigned scenarios.
- Student launches the interactive simulation:
  - Answers step prompts with text responses and selections.
  - Submits response for evaluation against configured constraints.
  - Receives AI feedback and scoring.
  - Advances sequentially from Step 1 through Step 7.
- Final submission reviewed and archived.

### 4. Admin Monitoring Workflow
- Admin accesses `/admin/dashboard` to monitor classroom enrollments, mission status, and student submissions.
- Admin views individual and team submissions via the Submission Drawer / Audit view.

---

## F-CIV-005: Functional Requirements

- **FR-001**: Role-based access control distinguishing `admin` and `student` roles.
- **FR-002**: LRN-based authentication with DepEd 12-digit validation format for students.
- **FR-003**: Scenario authoring suite with multi-tab mission configuration (Issues, Causes, Evidence, Stakeholders, Tips).
- **FR-004**: Interactive step-by-step student simulation workspace with automated constraint evaluation.
- **FR-005**: AI-assisted formative evaluation using Google Gemini API (`@google/genai`).
- **FR-006**: Class management dashboard with join codes, student roster tracking, and team group assignment.
- **FR-007**: Responsive admin inspection drawers for scenarios and classroom rosters with dynamic badges and line tab navigation.

---

## F-CIV-006: Non-Functional Requirements

- **NFR-001: Performance**: Sub-second UI transitions for admin drawers and dashboard views.
- **NFR-002: Accessibility & Contrast**: Compliant visual hierarchy ensuring all badges, counters, and tabs have distinct foreground/background contrast (no green-on-green or illegible text).
- **NFR-003: Design System Consistency**: Unified editorial/retro design tokens with curated HSL/OKLCH color palettes, DM Sans typography, and deliberate elevation.
- **NFR-004: Portability & Modularity**: Component-driven architecture using Base UI primitives and Tailwind CSS v4 without coupling to unverified third-party libraries.

---

## F-CIV-007: Technical & Regulatory Constraints

- **Next.js 16 (Turbopack / App Router)**: Breaking changes relative to legacy Next.js conventions; strictly follow docs in `node_modules/next/dist/docs/`.
- **Base UI Primitive Layer**: Component primitives from `@base-ui/react` (using attributes such as `data-active`, `data-variant`, etc., rather than Radix UI defaults).
- **DepEd Educational Context**: Student identifier strictly conforms to Philippine DepEd 12-digit numeric Learner Reference Number standard.
- **Isolated Lab Environment**: Experimental or non-production code must reside exclusively in `lab/` and never be imported into production code.

---

## F-CIV-008: Security and Authorization Context

- Authentication tokens managed via JWT (`jose`) and secure cookies.
- Passwords hashed using `bcryptjs`.
- Strict route protection distinguishing student routes (`/dashboard/...`) and admin routes (`/admin/dashboard/...`).
- API routes enforce session validation prior to evaluating steps or reading submission data.
- Database access managed via Supabase SSR client with row-level security (RLS) policies.

---

## F-CIV-009: Comparable Systems and Precedents

- **iCivics**: Scenario-based civic games; CiviConnect differentiates by focusing on collaborative classroom teams, rubric constraints, and generative AI feedback.
- **Harvard Case Method Simulations**: High-level policy simulations; CiviConnect adapts this to secondary education with structured 7-step scaffolding.
- **Google Classroom / Canvas LMS**: General assignment distribution; CiviConnect acts as a specialized civic simulation engine integrated into classroom cohorts.

---

## F-CIV-010: Alternatives Explored

- *Alternative A*: Radix UI primitives — Explored but replaced by Base UI (`@base-ui/react`) for enhanced headless control and reduced bundle overhead.
- *Alternative B*: Standard numeric email login for students — Rejected in favor of official 12-digit DepEd LRNs to align directly with Philippine educational standards.
- *Alternative C*: Solid dark block tabs with drop shadows — Implemented previously on drawer navigation, but rejected following user review as visually clunky; replaced by sleek underline line tabs with dynamic pill counters.

---

## F-CIV-011: Open Questions & Unknowns

- `[Unknown]`: Long-term offline support requirements for classrooms in areas with intermittent internet connectivity.
- `[Unknown]`: Integration requirements with DepEd Learner Information System (LIS) exports/APIs.
- `[Proposed]`: Peer-review evaluation step allowing students in different groups to audit each other's policy interventions.

---

## F-CIV-012: Source Register

1. [`lib/definitions.ts`](file:///d:/Admin/Music/Janella/civi-connect/lib/definitions.ts) — Verified domain types, Zod schemas, and simulation step definitions.
2. [`app/globals.css`](file:///d:/Admin/Music/Janella/civi-connect/app/globals.css) — Verified design system tokens, OKLCH palette, and component utility classes.
3. [`components/admin/mission-editor/index.tsx`](file:///d:/Admin/Music/Janella/civi-connect/components/admin/mission-editor/index.tsx) — Verified mission structure authoring implementation.
4. [`app/admin/dashboard/scenarios/scenario-drawer.tsx`](file:///d:/Admin/Music/Janella/civi-connect/app/admin/dashboard/scenarios/scenario-drawer.tsx) — Verified drawer navigation and assignment inspection.
