# Decision Register

This document is the authoritative record of accepted, provisional, superseded, and rejected decisions for the CiviConnect project.
When guidance in other documentation conflicts with an accepted decision recorded here, the accepted decision in this document governs.

---

## Active Decisions

- [D-20260920-010: Standardizing Mission Steps Delete Buttons with Clean Rest State and Destructive Offset Shadow Hover Effect](#d-20260920-010--standardizing-mission-steps-delete-buttons-with-clean-rest-state-and-destructive-offset-shadow-hover-effect)
- [D-20260920-009: Unified Design Standard for Delete and Remove Actions](#d-20260920-009--unified-design-standard-for-delete-and-remove-actions)
- [D-20260920-008: Elimination of Circular Tailwind v4 Spacing Variable and Dialog/Form Action Button Collision](#d-20260920-008--elimination-of-circular-tailwind-v4-spacing-variable-and-dialogform-action-button-collision)
- [D-20260920-007: Clean Slate Initialization for Admin Mission Authoring](#d-20260920-007--clean-slate-initialization-for-admin-mission-authoring)
- [D-20260920-006: Controlled Modal State Decoupling for Dropdown Menu Action Items](#d-20260920-006--controlled-modal-state-decoupling-for-dropdown-menu-action-items)
- [D-20260920-005: Retirement of Legacy "Standard Mission" vs "Civic Mission" Distinction](#d-20260920-005--retirement-of-legacy-standard-mission-vs-civic-mission-distinction)
- [D-20260920-004: Interactive Limitation & Constraint Suggestions in Admin Scenario Authoring](#d-20260920-004--interactive-limitation--constraint-suggestions-in-admin-scenario-authoring)
- [D-20260920-003: "Not Related / Irrelevant" Evidence Scope Option for Step 3 Evidence Evaluation](#d-20260920-003--not-related--irrelevant-evidence-scope-option-for-step-3-evidence-evaluation)
- [D-20260920-002: Visual Highlighting for Mission Context & Statutory Legal Guidance](#d-20260920-002--visual-highlighting-for-mission-context--statutory-legal-guidance)
- [D-20260920-001: 70% Minimum Passing Threshold for Simulation Step Progression](#d-20260920-001--70-minimum-passing-threshold-for-simulation-step-progression)
- [D-20260919-004: Modal-Only AI Evaluation Display & Form State Decoupling](#d-20260919-004--modal-only-ai-evaluation-display--form-state-decoupling)
- [D-20260919-003: Human-Readable Evaluation Flag Mapping & Variable Name Sanitization](#d-20260919-003--human-readable-evaluation-flag-mapping--variable-name-sanitization)
- [D-20260919-002: AI Evaluation Response Modal and Explicit Submit Response Workflow](#d-20260919-002--ai-evaluation-response-modal-and-explicit-submit-response-workflow)
- [D-20260919-001: Explicit Unselected Initial State for Student Simulation Decisions](#d-20260919-001--explicit-unselected-initial-state-for-student-simulation-decisions)
- [D-20260908-001: Living Interactive Vector Mascot Companion ("Civi") for Student Dashboard](#d-20260908-001--living-interactive-vector-mascot-companion-civi-for-student-dashboard)
- [D-20260906-001: Underline Indicator Line Tabs for Drawer Navigation](#d-20260906-001--underline-indicator-line-tabs-for-drawer-navigation)
- [D-20260906-002: Dynamic Contrast Pill Badges for Tab Navigation](#d-20260906-002--dynamic-contrast-pill-badges-for-tab-navigation)
- [D-20260906-004: Neutral Form Controls & Toolbar Surfaces (Removal of Blue Hue 220)](#d-20260906-004--neutral-form-controls--toolbar-surfaces-removal-of-blue-hue-220)
- [D-20260906-005: Role-Aware Route Guarding & Client-Side Cookie Eviction](#d-20260906-005--role-aware-route-guarding--client-side-cookie-eviction)
- [D-20260906-006: Comprehensive Adoption of Combobox for Filtering, Sorting, and Selection](#d-20260906-006--comprehensive-adoption-of-combobox-for-filtering-sorting-and-selection)
- [D-20260906-007: Obsidian-Pine Dark Mode Palette & Elevation Architecture](#d-20260906-007--obsidian-pine-dark-mode-palette--elevation-architecture)
- [D-20260906-008: Brutalist 4px Offset Shadow Styling for Navigation Systems](#d-20260906-008--brutalist-4px-offset-shadow-styling-for-navigation-systems)
- [D-20260905-002: Pine Green Active State & Subtle Primary Tint Hover for Filter Toolbars](#d-20260905-002--pine-green-active-state--subtle-primary-tint-hover-for-filter-toolbars)
- [D-20260901-001: DepEd 12-Digit LRN and Join Code Student Authentication](#d-20260901-001--deped-12-digit-lrn-and-join-code-student-authentication)
- [D-20260901-002: 7-Step Civi-Tech Civic Inquiry Simulation Model](#d-20260901-002--7-step-civi-tech-civic-inquiry-simulation-model)
- [D-20260901-003: Base UI Primitives and Tailwind CSS v4 Integration](#d-20260901-003--base-ui-primitives-and-tailwind-css-v4-integration)

---

## Provisional Decisions

- [D-20260906-003: Peer-Review Policy Audit Workflow](#d-20260906-003--peer-review-policy-audit-workflow)

---

## Superseded Decisions

- [D-20260905-001: Forced Solid Primary Block Tabs with Drop Shadows](#d-20260905-001--forced-solid-primary-block-tabs-with-drop-shadows)

---

## Rejected Alternatives

- [D-20260901-004: Standard Email/Password Login for Student Accounts](#d-20260901-004--standard-emailpassword-login-for-student-accounts)

### D-20260920-010 — Standardizing Mission Steps Delete Buttons with Clean Rest State and Destructive Offset Shadow Hover Effect

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Mission editor steps (`components/admin/mission-editor/*`) and core destructive button variant (`components/ui/button.tsx`)
- **Supersedes**: Static destructive background/shadow at rest in authoring rows
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-007
- **Related implementation**: `components/ui/button.tsx`, `components/admin/mission-editor/issues-tab.tsx`, `components/admin/mission-editor/causes-tab.tsx`, `components/admin/mission-editor/evidence-tab.tsx`, `components/admin/mission-editor/stakeholders-tab.tsx`, `components/admin/mission-editor/challenge-tab.tsx`

#### Context
In administrative mission step authoring, displaying permanent solid destructive pink background boxes with static drop shadows across dozens of items in a scenario (issues, causes, evidence documents, stakeholders, follow-up questions, and decision options) creates intense visual clutter. Furthermore, all other interactive buttons in the application (`variant="default"`, `outline`, `secondary`) feature clean rest states and trigger the brutalist offset drop shadow (`hover:shadow-md`) strictly on hover.
The user clarified that the destructive styling shown in screenshots (soft red background, red border, red icon/text, and 4px offset shadow) is intended as an interactive **hover effect** rather than a static at-rest display.

#### Decision
1. **Interactive Hover Effect on Mission Steps Delete Controls**:
   - At rest: Buttons maintain a clean, non-intrusive appearance with transparent background and transparent border (`border border-transparent text-destructive/80`).
   - On hover: The destructive styling activates smoothly with soft red container background (`hover:bg-destructive/10`), subtle red border (`hover:border-destructive/20`), bold red icon/text (`hover:text-destructive`), and the 4px brutalist offset shadow (`hover:shadow-md`).
   - On click (active): Applies tactile displacement (`active:translate-x-0.5 active:translate-y-0.5`).
   - Applied across all 5 authoring steps:
     - Priority Issues item remove (`issues-tab.tsx`)
     - Root Causes factor remove (`causes-tab.tsx`)
     - Evidence Library source document remove (`evidence-tab.tsx`)
     - Stakeholders primary card remove (`stakeholders-tab.tsx`)
     - Stakeholders follow-up question remove (`stakeholders-tab.tsx`)
     - Challenge Event decision option remove (`challenge-tab.tsx`)
2. **Core Destructive Button Variant in `button.tsx`**:
   - Removed static `shadow-xs` from `variant="destructive"` at rest.
   - Restored `hover:shadow-md` and `hover:border-destructive/40` on hover, ensuring all destructive dialog buttons pop with the authentic brutalist shadow only when hovered.

#### Evidence
Direct user prompts: *"add the same effects tot the mission steps delete button"* and *"ive said to hover effect just like the other buttons"*. Full TypeScript type-checking verified via `npx tsc --noEmit` (`exit code: 0`).

---

### D-20260920-009 — Unified Design Standard for Delete and Remove Actions

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Mission editor tabs, administrative drawers, dialogs, and table views (`components/admin/mission-editor/*`, `app/admin/dashboard/scenarios/*`, `app/admin/dashboard/classrooms/*`)
- **Supersedes**: Ad-hoc, fragmented button sizes, hover styles, and icon choices for item removal and deletion
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-007
- **Related implementation**: `issues-tab.tsx`, `causes-tab.tsx`, `evidence-tab.tsx`, `stakeholders-tab.tsx`, `challenge-tab.tsx`, `delete-scenario-dialog.tsx`, `delete-classroom-dialog.tsx`, `unassign-scenario-button.tsx`, `scenario-drawer.tsx`, `classroom-roster-drawer.tsx`, `scenarios-view.tsx`

#### Context
Delete and remove buttons across mission authoring tabs and administrative management modals lacked visual and semantic consistency:
- Icon-only item remove buttons had differing dimensions (`h-8 w-8` vs `h-7 w-7`), icon scales (`h-4 w-4` vs `h-3.5 w-3.5`), and unhovered color treatments (`text-destructive/80` vs `text-muted-foreground`).
- Sub-item remove buttons used varying labels ("Remove" vs "Delete Option") and button heights (`h-6` vs `h-7`).
- Final confirmation destructive buttons in dialogs used inconsistent text ("Delete" vs "Delete Mission" vs "Delete Classroom"), missing loading/trash icons, and differing cancel companion sizing.
- Table row triggers varied between solid destructive buttons and ghost icon buttons.

#### Decision
Established a 5-tier unified standard for all delete and remove actions:
1. **Icon-Only Item Remove Buttons (Card & Row Headers)**:
   - `variant="ghost" size="icon-sm" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 transition-colors" title="Remove [Item]"`
   - Icon: `<Trash2 className="h-4 w-4" />`
   - Applied to `issues-tab.tsx`, `causes-tab.tsx`, `evidence-tab.tsx`, `stakeholders-tab.tsx`, `scenario-drawer.tsx`, and `classroom-roster-drawer.tsx`.
2. **Sub-Item Text + Icon Remove Buttons (Nested Items)**:
   - `variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2.5 transition-colors font-medium shrink-0" title="Remove [Item]"`
   - Icon: `<Trash2 className="h-3.5 w-3.5" />`
   - Text: `<span>Remove</span>`
   - Applied to follow-up questions (`stakeholders-tab.tsx`) and decision options (`challenge-tab.tsx`).
3. **Modal & Dialog Final Destructive Action Buttons**:
   - `variant="destructive" size="sm" className="gap-1.5 font-bold"`
   - Icon: `{loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}`
   - Explicit noun labels: `Delete Mission`, `Delete Classroom`, `Unassign Mission`.
   - Companion Cancel: `variant="outline" size="sm"` with standard `gap-3 sm:gap-3`.
4. **Table & Card Standalone Delete Trigger Buttons**:
   - `variant="ghost" size="icon-sm" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Delete [Entity]"` with `<Trash2 className="h-4 w-4" />`.
5. **Dropdown Menu Delete Actions**:
   - `<Trash2 className="h-3.5 w-3.5" />` with explicit noun label (`Delete Mission`, `Delete Classroom`).

---

### D-20260920-008 — Elimination of Circular Tailwind v4 Spacing Variable and Dialog/Form Action Button Collision

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Global styles, mission authoring forms, and administrative dialogs (`app/globals.css`, `app/admin/dashboard/scenarios/scenario-form.tsx`, `components/ui/dialog.tsx`, `components/ui/alert-dialog.tsx`, `app/admin/dashboard/classrooms/edit-classroom-dialog.tsx`, `create-classroom-dialog.tsx`, `delete-scenario-dialog.tsx`)
- **Supersedes**: Circular `--spacing: var(--spacing);` in `@theme inline` and legacy `sm:gap-0` modal footer classes
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-007
- **Related implementation**: `app/globals.css`, `app/admin/dashboard/scenarios/scenario-form.tsx`, `components/ui/dialog.tsx`, `components/ui/alert-dialog.tsx`, `edit-classroom-dialog.tsx`, `create-classroom-dialog.tsx`, `delete-scenario-dialog.tsx`

#### Context
In administrative forms and dialogs (e.g. mission authoring in `scenario-form.tsx` and modal footers in `edit-classroom-dialog.tsx`), the "Cancel" and "Save Changes" / action buttons were rendering directly adjacent with 0px gap between them, causing visual collision.
Investigation identified two contributing causes:
1. In `app/globals.css`, the `@theme inline` block defined `--spacing: var(--spacing);`. In CSS custom properties specifications, self-referential variable declarations are invalid at computed-value time, causing Tailwind v4 utilities that rely on `calc(var(--spacing) * <n>)` (such as `gap-3`) to evaluate to `unset` (0px).
2. Several dialog footers explicitly specified `className="gap-2 sm:gap-0"`, which intentionally stripped the button gap on desktop viewports (`sm:` breakpoint and wider).

#### Decision
1. **Remove Self-Referential Spacing Variable**: Removed `--spacing: var(--spacing);` and `--letter-spacing: var(--letter-spacing);` from `@theme inline` in `app/globals.css`, allowing Tailwind v4's native `0.25rem` spacing baseline to prevail and generate valid `gap` values.
2. **Harmonize Action Button Spacing**:
   - Wrapped `Link` elements in `scenario-form.tsx` with `inline-flex` within the `gap-3` flex container to preserve proper flex item boundaries.
   - Replaced all legacy `sm:gap-0` instances with `gap-3 sm:gap-3` across `edit-classroom-dialog.tsx`, `create-classroom-dialog.tsx`, and `delete-scenario-dialog.tsx`.
   - Updated default `DialogFooter` (`components/ui/dialog.tsx`) and `AlertDialogFooter` (`components/ui/alert-dialog.tsx`) to guarantee `gap-3 sm:gap-3` across all screen sizes.

---

### D-20260920-007 — Clean Slate Initialization for Admin Mission Authoring

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Admin mission creation and editing (`app/admin/dashboard/scenarios/scenario-form.tsx`, `components/admin/mission-editor/index.tsx`, `components/admin/mission-editor/*`)
- **Supersedes**: Hardcoded default waste disposal dummy data in `MissionEditorTabs`
- **Superseded by**: None
- **Related foundation sections**: F-CIV-001, F-CIV-005, F-CIV-006
- **Related implementation**: `components/admin/mission-editor/index.tsx`, `issues-tab.tsx`, `causes-tab.tsx`, `evidence-tab.tsx`, `stakeholders-tab.tsx`, `challenge-tab.tsx`, `tips-tab.tsx`

#### Context
When an administrator navigated to "Create Mission" (`/admin/dashboard/scenarios/new`), the form was supposed to be a blank canvas for authoring custom scenarios. While the basic fields (title, description, constraints) started blank, the 6 simulation configuration tabs (Priority Issues, Root Causes, Evidence Library, Stakeholders, Challenge Event, and Step Guidance) were hardcoded to pre-populate mock data from a solid waste management scenario ("Improper Waste Disposal", "Weak Regulatory Enforcement", "Official Barangay Environmental Report", "Hon. Manuel Cruz", etc.). This forced teachers and admins to manually clear out or overwrite unwanted text when authoring unrelated missions.

#### Decision
1. **Zero Pre-Inputted Data on New Mission Creation**:
   - In `MissionEditorTabs`, when `initialConfig` is undefined (or when fields are empty):
     - `issuesText`: Starts as an empty string `""` (`0 items`).
     - `causes`: Starts as an empty array `[]` (`0 factors`).
     - `evidence`: Starts as an empty array `[]` (`0 sources`).
     - `stakeholders`: Starts as an empty array `[]` (`0 figures`).
     - `unexpectedEvent`: Starts with blank title `""`, blank description `""`, and empty options `[]` (`0 choices`).
     - `stepTips`: Starts as an empty object `{}` (`0 tips`).
2. **Complete Removal of Input Placeholders**:
   - Removed all `placeholder="..."` attributes across all mission authoring inputs and textareas:
     - `scenario-form.tsx`: Title, description, and constraints.
     - `issues-tab.tsx`: Raw textarea and problem statement input cards.
     - `causes-tab.tsx`: Cause title and description context.
     - `evidence-tab.tsx`: Evidence title, snippet preview, full document body, and image URL.
     - `stakeholders-tab.tsx`: Stakeholder name, role, initial statement, student question, and stakeholder answer.
     - `challenge-tab.tsx`: Event title, event description, option action text, and outcome feedback.
     - `tips-tab.tsx`: Step tips textareas across all 8 simulation steps.
   - All fields present a 100% clean, distraction-free blank input surface without grayed-out ghost text.
3. **Empty States with Direct Call-to-Action**:
   - Retained and enhanced clean dashed empty-state containers across all tabs, featuring prominent "Add First Issue/Cause/Evidence/Stakeholder/Option" buttons.
4. **Clean Propagation to Server**:
   - Empty or unedited guidance tabs are sanitized on change, preventing the database from storing empty string arrays or blank objects.

#### Evidence
User prompts: *"when adding a mission, it should be clean and no pre inputted"* and *"remove also the placeholder"*. Verified with `npx tsc --noEmit` (`exit code: 0`).

---

### D-20260920-006 — Controlled Modal State Decoupling for Dropdown Menu Action Items

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Admin mission and classroom views, dialogs, and drawers (`app/admin/dashboard/scenarios/scenarios-view.tsx`, `app/admin/dashboard/scenarios/scenario-drawer.tsx`, `app/admin/dashboard/scenarios/assign-scenario-dialog.tsx`, `app/admin/dashboard/scenarios/delete-scenario-dialog.tsx`, `app/admin/dashboard/classrooms/classrooms-view.tsx`, `app/admin/dashboard/classrooms/classroom-roster-drawer.tsx`, `app/admin/dashboard/classrooms/edit-classroom-dialog.tsx`, `app/admin/dashboard/classrooms/delete-classroom-dialog.tsx`)
- **Supersedes**: Direct nesting of Dialog/Drawer component trees inside `<DropdownMenuContent>`
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-007
- **Related implementation**: `scenarios-view.tsx`, `scenario-drawer.tsx`, `assign-scenario-dialog.tsx`, `delete-scenario-dialog.tsx`, `classrooms-view.tsx`, `classroom-roster-drawer.tsx`, `edit-classroom-dialog.tsx`, `delete-classroom-dialog.tsx`

#### Context
In administrative card and table views (`scenarios-view.tsx` and `classrooms-view.tsx`), action dropdown menus included items for opening modal drawers and dialogs (e.g., "Inspect & Submissions", "Assign to Class", "Delete Mission", "View Roster & Missions", "Edit Classroom", "Delete Classroom").
These components were directly nested inside `<DropdownMenuContent>`. When a user clicked a `<DropdownMenuItem>`, Base UI's `@base-ui/react/menu` item selection closed the dropdown popup, immediately unmounting all nested dialog and drawer components along with their internal React state. Consequently, only route navigation links (such as "Edit Mission") functioned, while all dialog and drawer triggers failed to open.

#### Decision
1. **Support Controlled/Uncontrolled Modal State**:
   - Extended `ScenarioDrawer`, `AssignScenarioDialog`, `DeleteScenarioDialog`, `ClassroomRosterDrawer`, `EditClassroomDialog`, and `DeleteClassroomDialog` to accept optional `open?: boolean` and `onOpenChange?: (open: boolean) => void` props, allowing them to function seamlessly both as standalone trigger buttons and as externally-controlled modals.
   - Suppressed `<DrawerTrigger>` and `<DialogTrigger>` when controlled with `trigger={null}`.
2. **Decouple Modals from Dropdown Menus**:
   - Extracted `ScenarioCard` and `ScenarioTableRow` in `scenarios-view.tsx`, and `ClassroomCard` in `classrooms-view.tsx`.
   - Each card/row maintains local boolean state (`drawerOpen`, `assignOpen`, `deleteOpen`).
   - Dropdown menu items execute clean click callbacks (e.g., `onClick={() => setDrawerOpen(true)}`), allowing the dropdown to close cleanly without interfering with the target dialog or drawer.
   - Rendered the dialog and drawer components at the card/row level **outside** the `<DropdownMenuContent>` container.

#### Evidence
Direct user report and screenshot: *"these buttons are not working except in the edit mission"*. Full TypeScript type-checking verified via `npx tsc --noEmit` (`exit code: 0`).

---

### D-20260920-005 — Retirement of Legacy "Standard Mission" vs "Civic Mission" Distinction

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Scenario card headers, scenario table rows, and scenario drawer details (`app/admin/dashboard/scenarios/scenarios-view.tsx`, `app/admin/dashboard/scenarios/scenario-drawer.tsx`, `app/admin/dashboard/classrooms/classroom-roster-drawer.tsx`)
- **Supersedes**: Conditional badge rendering based on `scenario.missionData` presence
- **Superseded by**: None
- **Related foundation sections**: F-CIV-001, F-CIV-005, F-CIV-006
- **Related implementation**: `app/admin/dashboard/scenarios/scenarios-view.tsx`, `app/admin/dashboard/scenarios/scenario-drawer.tsx`, `app/admin/dashboard/classrooms/classroom-roster-drawer.tsx`

#### Context
In early prototyping phases, `Scenario` was a flat entity (`title`, `description`, `context`, `constraints`). When the 8-step simulation architecture was introduced, `missionData?: MissionDataConfig` was added as an optional field. A UI badge was added that displayed `"Civic Mission"` (with a sparkles icon) if `scenario.missionData` was present, and `"Standard Mission"` if `scenario.missionData` was absent.
However, in CiviConnect all missions are civic inquiry simulations, and the concept of an alternate "Standard Mission" mode does not exist in the curriculum. The badge created user confusion as to why some missions were labeled "Standard" and others "Civic".

#### Decision
1. **Remove "Civic Mission" / "Standard Mission" Badges**:
   - Removed the conditional badge `{scenario.missionData ? <Badge>Civic Mission</Badge> : <Badge>Standard Mission</Badge>}` from scenario card headers in `scenarios-view.tsx`.
   - Removed the redundant "Type" column from the administrative table view in `scenarios-view.tsx`.
   - Removed the redundant badge from the scenario drawer header in `scenario-drawer.tsx` and the classroom roster drawer in `classroom-roster-drawer.tsx`.
2. **Clarify Empty State Messaging**:
   - Replaced the confusing "Standard Mission" label in the Mission Structure tab of `scenario-drawer.tsx` with "Custom Structure Not Configured" and an explanatory subtext explaining that default simulation criteria are used until custom evidence banks, root causes, or stakeholders are authored.

#### Evidence
Direct user instruction: *"remove this badge and why there is a standard mission here"*. Verified with `npx tsc --noEmit` (`exit code: 0`).

---

### D-20260920-004 — Interactive Limitation & Constraint Suggestions in Admin Scenario Authoring

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Admin mission authoring form (`app/admin/dashboard/scenarios/scenario-form.tsx`)
- **Supersedes**: Unassisted manual text entry for mission constraints and limitations
- **Superseded by**: None
- **Related foundation sections**: F-CIV-001, F-CIV-005, F-CIV-006
- **Related implementation**: `app/admin/dashboard/scenarios/scenario-form.tsx`

#### Context
When teachers or administrators author civic inquiry missions, defining authentic, educationally sound limitations (e.g., budget ceiling, timeline windows, SK youth leadership coordination, statutory compliance, and resident consultation) was previously unassisted, requiring admins to formulate all rules manually without reference suggestions.

#### Decision
1. **"Suggest Limitations" Action Control**: Added a dedicated `Suggest Limitations` button with a `Sparkles` icon adjacent to the Constraints & Limitations label in `scenario-form.tsx`.
2. **Categorized Limitation Directory**: Structured curated DepEd Senior High School civic limitations into 5 categories:
   - Budget & Resources (₱)
   - Timeline & Scheduling (⏱)
   - Governance & SK (👥)
   - Legal & Statutory (⚖)
   - Community & Impact (🌱)
3. **Interactive Multi-Insert & Toggle**: Clicking any suggestion adds it to the textarea on a new line (or removes it if already present), with a visual `Added` badge state and notification toast.
4. **"Add Standard 3" Quick Action**: Added a single-click batch insert for the foundational DepEd triad (Budget ≤ ₱15k, SK coordination, resident consultation).

---

### D-20260920-003 — "Not Related / Irrelevant" Evidence Scope Option for Step 3 Evidence Evaluation

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Step 3 evidence evaluation component (`components/simulation/evidence-library.tsx`), type definitions (`lib/definitions.ts`), and AI evaluation engine (`lib/ai.ts`)
- **Supersedes**: Positive-only evidence scope options ("Cause", "Solution", "Community Need")
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-003, F-CIV-004
- **Related implementation**: `components/simulation/evidence-library.tsx`, `lib/definitions.ts`, `lib/ai.ts`

#### Context
In Step 3 (Evaluate Digital Evidence), students inspect and assess sources from the scenario's evidence library. Previously, the "Does it support the following?" checklist only provided positive association options: "Cause", "Solution", and "Community Need". When an evidence source was a distractor, irrelevant, or not directly applicable to the identified community issue, students had no dedicated option to indicate that the evidence was not related.

#### Decision
1. **Schema & Interface Extension (`not_related`)**: Added `"not_related"` to the `selectedSupports` union type in `lib/definitions.ts` and `EvaluatedEvidence` in `components/simulation/evidence-library.tsx`.
2. **Mutually Exclusive Interaction**: Selecting "Not Related / Irrelevant" automatically unselects "Cause", "Solution", and "Community Need", and vice-versa, preventing contradictory evidence classifications.
3. **Visual Distinction**: Tagged evaluated cards with a subtle amber badge when classified as "Not Related", allowing students to easily review which sources were categorized as non-applicable.
4. **Evaluation Engine Compatibility**: Updated `detectEvidenceRatingMismatch` and `evaluateStep3` in `lib/ai.ts` to recognize `userCredibility` and valid justifications noting irrelevance without triggering false contradiction penalties.

---

### D-20260920-002 — Visual Highlighting for Mission Context & Statutory Legal Guidance

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Student simulation form interface (`app/dashboard/activity/[scenarioId]/activity-form.tsx`)
- **Supersedes**: Neutral/unaccented `border-border bg-card` styling for the legal reference card
- **Superseded by**: None
- **Related foundation sections**: F-CIV-001, F-CIV-002, F-CIV-005
- **Related implementation**: `app/dashboard/activity/[scenarioId]/activity-form.tsx`

#### Context
Following the relocation of "Mission Context & Legal Guidance" from the left sidebar to the right panel underneath "Mission Tips", the card used neutral card tokens (`border-border bg-card shadow-xs`). Consequently, it blended into surrounding panels and failed to stand out as the authoritative legal and statutory reference container that students must consult when constructing their civic intervention.

#### Decision
1. **Clean Civic Accent Surface**: Applied a cohesive pine-green card border and background tint (`border border-primary/30 bg-primary/5 shadow-xs`) that uniformly styles the container without disjointed internal header boxes or top margin gaps.
2. **Unified Icon & Title Header**: Styled the title directly via `CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary"` with `<Scale className="h-4 w-4 shrink-0" />`, harmonizing seamlessly with the "Step 0X Mission Tips" card directly above it and eliminating visual clutter/extraneous badge elements.
3. **Integrated Legal Framework Inset**: Formatted `scenario.context` within a clean border-t divider (`border-t border-primary/20 text-muted-foreground italic`) anchored with a `<BookOpen className="h-3.5 w-3.5 shrink-0" /> Legal & Statutory Framework:` label.

---

### D-20260920-001 — 70% Minimum Passing Threshold for Simulation Step Progression

- **Status**: Accepted
- **Date**: 2026-09-20
- **Decision owner**: User prompt
- **Scope**: Evaluation engine (`lib/ai.ts`), server actions (`app/dashboard/activity/[scenarioId]/actions.ts`), definitions (`lib/definitions.ts`), and student activity form (`app/dashboard/activity/[scenarioId]/activity-form.tsx`)
- **Supersedes**: Implicit or qualitative-only step pass conditions without score thresholds
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-003, F-CIV-007
- **Related implementation**: `lib/definitions.ts`, `lib/ai.ts`, `actions.ts`, `activity-form.tsx`

#### Context
Previously, passing a step in the civic inquiry simulation relied on qualitative rubric criteria and deterministic checks. However, there was no enforced minimum numeric score threshold (70%) required to unlock progression to the next mission step. Students who scored below 70% could theoretically still advance if the AI or deterministic check marked `passed: true`.

#### Decision
1. **Single Source of Truth (`SIMULATION_PASSING_THRESHOLD`)**: Defined `SIMULATION_PASSING_THRESHOLD = 70` in `lib/definitions.ts`.
2. **AI Rubric & Prompt Enforcement (`lib/ai.ts`)**:
   - Explicitly instructed the master evaluation system prompt that students must achieve a minimum step score of 70% to pass and advance.
   - In `callGeminiVerification`, `buildDeterministicEvaluation`, and `formatEvaluationResponse`, enforced that `passed` is strictly `false` if `step_score < 70`.
   - Appended clear instructional guidance to feedback if a score is below 70% explaining the requirement.
3. **Server Progression Gate (`actions.ts`)**: In `processSimulationStepAction` and `submitReflectionAction`, `state.currentStep` only increments to the next step when `evalResult.passed && step_score >= 70`.
4. **Modal & Client UI Enforcement (`activity-form.tsx`)**:
   - The Evaluation Modal displays whether the 70% threshold was met (e.g. `Score: XX% | Threshold: ≥70%`).
   - If the score is below 70%, the modal displays a clear "Revision Required" status with the exact score shortfall, and disables the "Continue Mission" button.
   - The student must click "Revise" to refine their response until reaching the 70% standard.

---

### D-20260919-004 — Modal-Only AI Evaluation Display & Form State Decoupling

- **Status**: Accepted
- **Date**: 2026-09-19
- **Decision owner**: User prompt
- **Scope**: Student simulation form components (`app/dashboard/activity/[scenarioId]/activity-form.tsx`)
- **Supersedes**: Inline AI evaluation alert banners embedded within the active form card
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-003, F-CIV-007
- **Related implementation**: `activity-form.tsx`

#### Context
Following the introduction of the dedicated AI Evaluation Response Modal (D-20260919-002), the student form retained a legacy inline feedback alert box displaying scores, strengths, areas for improvement, and AI validation status directly inside `CardContent`. This created visual redundancy on the page and cluttered the form controls when students revised their input.

#### Decision
1. **Modal-Only AI Verification**: AI verification evaluation details (step score, validation status, strengths, areas for improvement, AI voice alerts, and civic flags) are strictly displayed within the Base UI `Dialog` modal.
2. **Decoupled Local Validation State (`formError`)**: Separated client-side input validation errors (e.g. unselected issue, unevaluated evidence items, missing plan fields) and server execution errors from AI evaluation responses. Local checks populate a compact, standard destructive alert (`formError`) to guide students before network calls, while successful AI evaluations route solely to `evaluationModalData`.
3. **Clean Workspace on Revision**: Closing or revising from the evaluation modal leaves the form card uncluttered, free of duplicate alerts and badges, maintaining focus on the civic task.

---

### D-20260919-003 — Human-Readable Evaluation Flag Mapping & Variable Name Sanitization

- **Status**: Accepted
- **Date**: 2026-09-19
- **Decision owner**: User prompt
- **Scope**: AI evaluation engine (`lib/ai.ts`, `lib/flag-utils.ts`), student simulation view (`activity-form.tsx`), admin submission drawer (`submission-drawer.tsx`)
- **Supersedes**: Raw monospace CONSTANT_CASE badge rendering of evaluation flags
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-003, F-CIV-007
- **Related implementation**: `lib/flag-utils.ts`, `lib/ai.ts`, `activity-form.tsx`, `submission-drawer.tsx`

#### Context
Internal rubric checks generated raw CONSTANT_CASE codes (such as `INSUFFICIENT_STAKEHOLDER_BREADTH`, `NOTES_STAKEHOLDER_MISMATCH`, `INCOMPLETE_SCHEMA`, etc.). In previous iterations, the UI directly rendered these internal flag strings in monospace badges (`<Badge variant="outline" className="font-mono">{flag}</Badge>`), causing internal variable and constant names to leak into student and teacher interfaces.

#### Decision
1. **Centralized Flag Mapping (`lib/flag-utils.ts`)**: Created a dedicated mapping module (`FLAG_LABELS` and `formatFlagLabel`) converting all internal rubric flag constants to natural, educational labels (e.g. `INSUFFICIENT_STAKEHOLDER_BREADTH` -> `"Stakeholder Diversity Needed"`).
2. **Text Sanitization (`sanitizeEducationalText`)**: Implemented recursive text sanitization in `lib/ai.ts` across `evaluation_summary`, `actionable_feedback`, `strengths`, and `areas_for_improvement` to replace any raw SCREAMING_SNAKE_CASE tokens with plain English.
3. **UI Polish (`activity-form.tsx` & `submission-drawer.tsx`)**:
   - Replaced raw `{flag}` rendering with `{formatFlagLabel(flag)}`.
   - Changed badge typography from raw `font-mono` to `font-medium`.
   - Filtered out redundant internal AI control flags from the badge list when the dedicated `ShieldAlert` AI content banner is active.
4. **Prompt Guardrail**: Added strict instructions to `MASTER_SYSTEM_PROMPT` forbidding the evaluation engine from outputting raw variable names or enum identifiers in student-facing prose.

---

### D-20260919-002 — AI Evaluation Response Modal and Explicit Submit Response Workflow

- **Status**: Accepted
- **Date**: 2026-09-19
- **Decision owner**: User prompt
- **Scope**: Student simulation form components (`app/dashboard/activity/[scenarioId]/activity-form.tsx`)
- **Supersedes**: Auto-advancing step transitions and Step 1-only inline revision prompts
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-003, F-CIV-007
- **Related implementation**: `activity-form.tsx`, `actions.ts`

#### Context
Prior implementations utilized a generic "Continue Mission" button in the form footer. When clicked, the submission was sent to the server and, upon success, the interface immediately advanced to the next step (or displayed a bespoke inline alert on Step 1 only). Students did not receive an explicit review of the AI's rubric feedback, strengths, and areas for improvement before transitioning, nor did they have a unified opportunity to revise their work across all steps.

#### Decision
1. **Button Label**: Updated the primary action button on the student simulation form footer from `"Continue Mission"` to `"Submit Response"` (retaining `"Next Step"` for read-only / completed navigation).
2. **AI Evaluation Response Modal**: Created a dedicated Base UI `Dialog` modal that pops up upon receiving the AI evaluation result for any step:
   - Displays clear validation status (Validated with green checkmark vs. Revision Required with amber warning).
   - Shows rubric step score percentage, evaluator feedback message, AI-generated content warnings, and any civic flags.
   - Highlights specific Strengths and Areas for Improvement in structured bullet points.
3. **Modal Actions**:
   - `"Revise"`: Closes the modal and leaves the student on the current step with all form inputs preserved, allowing iterative refinement.
   - `"Continue Mission"`: Advances the student to the next step once validation is satisfied (`res.success === true`). Disabled when revision is required.
4. **Unified Progression**: Eliminated the Step 1-only inline revision prompt (`showStep1RevisionPrompt`), unifying Steps 1 through 8 under the standardized modal review flow.

---

### D-20260919-001 — Explicit Unselected Initial State for Student Simulation Decisions

- **Status**: Accepted
- **Date**: 2026-09-19
- **Decision owner**: User prompt
- **Scope**: Student simulation form components (`app/dashboard/activity/[scenarioId]/activity-form.tsx`, `components/simulation/evidence-library.tsx`, `lib/ai.ts`)
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-003
- **Related implementation**: `activity-form.tsx`, `evidence-library.tsx`, `lib/ai.ts`

#### Context
Prior implementations pre-selected the first option or default values across multiple student activity steps:
1. In Step 1 (Priority Community Concerns), `selectedIssue` defaulted to `missionData.issues[0]`.
2. In Step 3 (Digital Evidence Library), credibility inspection defaulted to `item.defaultCredibility || 3` stars.
3. In Step 5 (Intervention Plan), `projectTitle` was pre-filled with `Community Action Plan: ${scenario.title}`.
4. In Step 6 (Adaptive Challenge Simulation), `selectedChallengeOptId` defaulted to `missionData.unexpectedEvent.options[0]?.id`.

This undermined authentic student decision-making, as students could proceed without deliberately evaluating choices.

#### Decision
1. All student decision inputs start in an explicit unselected state (`""` or `0`).
2. Client-side validation blocks step submission with clear instructional feedback if an option has not been chosen.
3. In Step 3, evidence credibility rating stars start at 0 ("Select a rating (1-5 stars)") and saving is disabled until the student explicitly assigns a star rating.
4. Step 5 & Step 7 project title fields start blank with helpful placeholder text (`e.g. Community Action Plan: ...`).
5. Server-side evaluation in `lib/ai.ts` returns an explicit `INCOMPLETE_SELECTION` structural error if `selectedOptionText` or `selectedIssue` is missing.
6. In Step 3, both client-side validation and server AI verification require evaluating all evidence items in the library (`evaluatedCount === totalRequired`), explicitly instructing the student that all evidence sources must be evaluated before proceeding.

---

### D-20260908-001 — Living Interactive Vector Mascot Companion ("Civi") for Student Dashboard

- **Status**: Accepted
- **Date**: 2026-09-08
- **Decision owner**: Joint (User prompt & Agent design)
- **Scope**: Student Welcome Command Center (`app/dashboard/page.tsx`, `components/civic-companion.tsx`, `app/globals.css`)
- **Supersedes**: Static bitmap student mascot photo (`/images/student-hero-mascot.png`)
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-010
- **Related implementation**: `components/civic-companion.tsx`, `app/dashboard/page.tsx`, `app/globals.css`

#### Context
The user requested removing the static student mascot image/photo and replacing it with a high-quality graphic that is:
1. **Not an image file** (100% vector SVG and code-driven).
2. **Moving and alive** (continuous organic levitation, natural blinking, 2.5D parallax gaze tracking, butter-smooth spring damping physics).
3. **Not a person** (an original robotic civic companion named "Civi").
4. **Designed to bring joy and happiness to students** (delightful expressions, interactive cheer particles, inspirational civic affirmations).

#### Decision
1. **Zero Bitmap Imagery**: The mascot is implemented entirely as a high-definition, scalable SVG component (`CivicCompanion`), completely eliminating raster compression artifacts and copyright risks.
2. **Spring Damping & LERP Gaze Physics**: Uses a 60fps `requestAnimationFrame` interpolation loop with 0.085 damping factor to achieve silky, butter-smooth gaze and head tilt tracking when the student moves their cursor.
3. **Multi-Layered 2.5D Parallax**: Visor, digital eyes, and antennae shift with layered depth offsets, giving Civi a palpable 3D sculpted feel.
4. **Zero Focus Bounding Boxes**: Removed all native browser focus outlines on SVG elements (`outline: none`, removal of redundant `tabIndex={0}` on inner SVG tags, and global CSS stripping `-webkit-tap-highlight-color` and focus rings).
5. **Multi-Gesture Recognition Engine**:
   - **Single Tap**: Quick primary animation and affirming quip.
   - **Double Tap (within 280ms)**: High-energy secondary combo:
     - Sprout: Flower of Leadership blooms (`civi-flower-bloom`) with golden petals.
     - Visor: Matrix / Cyber Equalizer Rave mode.
     - Left Hand: Fist bump with electric spark.
     - Right Hand: Peace sign / Victory 'V' with festive stars.
     - Core: Hyper-drive overdrive spin with dual energy rings.
     - Body: Full 360° mid-air aerial backflip (`animate-civi-backflip`).
   - **Multi-Tap (3+ rapid clicks)**: Overgrowth frenzy on sprout, dizzy spiral eyes on visor, rapid applause on left hand, rainbow core on chest, jumping bean hop on body.
   - **Hold / Long-Press (> 450ms)**: Charge-up mode with live progress counter, releasing Supernova blasts, deep potential scans, solar beams, and bubble shields.
   - **Petting / Scrubbing Gesture**: Dragging mouse across cheeks triggers cute blissful blushing and purring hearts.
   - **Costume Accessories & 14-Hat Wardrobe**: Complete interactive headwear collection featuring 14 distinct vector hats:
     - 🎓 Graduation Cap (`grad`), 🕵️ Detective Sleuth Hat (`detective`), 👑 Golden Civic Crown (`crown`), 🥽 Cyber VR Goggles (`goggles`), 👷 Builder Helmet (`hardHat`), 🧙‍♂️ Sorcerer Hat (`wizard`), 🧑‍🍳 Master Chef Toque (`chef`), 🎧 DJ Headphones (`headphones`), 🤠 Sheriff Stetson (`cowboy`), 🚀 Space Helmet (`astronaut`), 🌸 Blossom Floral Wreath (`flowerCrown`), 🧢 Backwards Snapback (`cap`), 🎩 Magician Silk Hat (`topHat`), ✨ Sleek Robot (`none`).
     - Includes `<` / `>` quick navigation buttons plus an expandable 14-hat wardrobe modal grid for instant selection.
6. **Individual SVG Part Kinematics (Zero Static Zooming)**:
   - Parts now physically translate, rotate, and deform independently rather than merely scaling the outer card container:
     - **Sprout**: Whips dynamically left/right 38° (`animate-part-sprout-whip`), stretches vertically 150% (`animate-part-sprout-stretch`), or sways in a hula wave (`animate-part-sprout-hula`).
     - **Left Hand**: Leaps out and raises 36px towards the user for a real high-five (`animate-part-left-highfive`), thrusts forward in a fist bump (`animate-part-left-fistbump`), waves, or meets the right hand in center applause (`animate-part-left-clap`).
     - **Right Hand**: Reaches up into a thumbs-up cheer (`animate-part-right-thumbsup`), gestures victory peace sign (`animate-part-right-peace`), points directly at speech affirmations (`animate-part-right-point`), or waves.
     - **Visor / Head**: Physically tilts quizzically 20° (`animate-part-visor-tilt`), nods affirmatively (`animate-part-visor-nod`), or performs a 360° spin (`animate-part-visor-spin360`).
     - **Chest Core**: Pulses outward with radiant shockwaves and spinning conduits (`animate-part-core-pulse`).
     - **Body Chassis**: Performs squishy jelly bounces (`animate-part-body-jelly`) or mid-air aerial somersaults (`animate-civi-backflip`).
7. **Circus & Robotic Stunt Tricks Engine**:
   - Interactive stunts menu with 6 full-routine tricks and a surprise randomizer:
     - 🚀 **Rocket Blast-Off**: Dual thruster flames burst under hands, Civi launches up 55px into card, hovers, and descends.
     - 🤹 **Energy Orb Juggling**: 3 glowing civic energy orbs arc across Civi's chest while hands bob rhythmically.
     - 🌀 **360° Cartoon Head Spin**: Head spins 720° with dizzy spiral eyes and orbiting stars.
     - 🤧 **Confetti Sneeze**: Inhale build-up followed by an explosive sneeze burst of 24+ colorful confetti shapes.
     - 🕺 **Breakdance Windmill**: Drops to handstand, spins 360°, and freezes in cool sunglasses pose.
     - 🎩 **Magic Star Summon**: Tips hat, conjures a glowing floating star that descends into the chest core.
8. **Procedural Web Audio Synthesizer (`CiviAudioSynth`)**:
   - Zero external audio files or MP3 network requests. Synthesizes rich real-time SFX using browser `AudioContext` oscillators (sine, square, sawtooth, triangle):
     - Single Tap: High-pitched playful pop blips (`playPop`).
     - Double Tap / Bloom: Harmonic arpeggiated chimes (`playChime`, C5-E5-G5-C6).
     - High-Fives & Fist Bumps: Punchy low-end impact with snappy snap overtone (`playHighFive`).
     - Visor Cyber Mode: Retro 8-bit futuristic equalizer sweep (`playCyber`).
     - Core Overdrive: Resonant rising sawtooth hum (`playOverdrive`).
     - Hold / Supernova Release: Orchestral chord fanfare and deep low-frequency bass rumble (`playSupernova`).
     - Mid-Air Backflip: Aerodynamic swoosh glide (`playWhoosh`).
     - Rocket Blast-Off: Thruster roar and whoosh (`playRocket`).
     - Juggling: Syncopated arpeggiated chime tones (`playJuggle`).
     - Sneeze: Inhale pitch slide + confetti pop (`playSneeze`).
     - Breakdance: Funk beat kick & synth brass hit (`playBreakdance`).
     - Magic Star: Sparkling fairy dust arpeggio (`playMagic`).
     - Cheeks Petting: Tender purring frequency modulation coo (`playPet`).
     - Costume Switcher: Joyful double blip (`playCostume`).
     - Multi-Tap Combos: Ascending pitch combo ramp (`playCombo`).
     - Live Charge Meter: Frequency-rising hum steps (200Hz to 800Hz) as the charge meter fills (`playChargeStep`).
     - Paper Slap: Crisp paper flutter noise burst + soft thud (`playPaperSlap`).
   - Includes accessible Sound Mute / Unmute toggle button with `Volume2` and `VolumeX` icons, persisting student preference and respecting quiet classroom environments.
9. **Brawl Stars Sprout Sticky Paper Face System**:
    - Modeled directly after Sprout's iconic aesthetic from Brawl Stars: a yellow square sticky post-it note (`#FEF08A` to `#FDE047`) taped onto the glass dome with translucent tape and a curled bottom-right corner.
    - Features **14 hand-drawn marker doodle expressions**:
      - `sproutDefault` (Classic Sprout marker smile + pink blush lines)
      - `derp` (Goofy mismatched eyes + pink tongue sticking out)
      - `catSmile` (:3 Kitty face smile)
      - `shocked` (Wide marker circle eyes + blue sweat drop)
      - `angry` (Fierce marker brows + determined scowl)
      - `sleepy` (Snooze eyes + floating Zzz)
      - `heartEyes` (Dual red marker hearts)
      - `cool` (Marker sunglasses + confident smirk)
      - `crying` (Trembling eyes + cascading blue teardrop streams)
      - `dead` (X_X knockout eyes + flat mouth)
      - `dizzy` (Hypno spiral swirls)
      - `mustache` (Classic eyes + dapper handlebar mustache)
      - `wink` (Playful marker wink)
      - `smug` (Knowing half-lidded smirk)
    - Tapping the visor in sticky mode slaps on a new face with realistic paper slap audio (`playPaperSlap()`) and flap recoil animation (`animate-sticky-slap`).
    - Includes a dedicated **"Faces 📝"** drawer and toggle between **Sticky Paper 📝** and **Cyber Screen 🥽**.
10. **Zero Parent Layout Shift & In-Card Overlay Architecture**:
    - **Root Container Fixed Footprint**: `CivicCompanion` has a strict bounding box of `w-full max-w-[340px] h-[415px]` with `border border-primary/15 bg-card/60 rounded-3xl p-3 shadow-sm`.
    - **Rigid Speech Bubble Height**: Speech container has a rigid fixed height (`h-13 w-full max-w-[315px] shrink-0`) with `line-clamp-2`, ensuring text length variations never jitter or resize the container.
    - **Fixed 250px Mascot Viewport**: Designated 250px viewport guarantees tall hats (wizard, chef, top hat) and leaping stunts (rocket flight, sneeze jump) never breach or push neighboring components.
    - **In-Card Overlay Drawers (`absolute inset-0 z-30`)**: All 3 option drawers (Sticky Faces, Wardrobe, and Tricks) render as absolute overlay sheets within the companion card instead of appending to document flow. Opening or closing any drawer never shifts or resizes the parent hero command center card.
    - **Toolbar Quick Flippers**: Both Sticky Faces and Hats feature `<` and `>` arrow flippers for instant cycling without opening full drawers.

---

### D-20260906-001 — Underline Indicator Line Tabs for Drawer Navigation

- **Status**: Accepted
- **Date**: 2026-09-06
- **Decision owner**: Joint (User feedback & Agent design)
- **Scope**: Drawer navigation bars in administrative sheets (`scenario-drawer.tsx`, `classroom-roster-drawer.tsx`, `components/ui/tabs.tsx`)
- **Supersedes**: [D-20260905-001](#d-20260905-001--forced-solid-primary-block-tabs-with-drop-shadows)
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-010
- **Related implementation**: `app/admin/dashboard/scenarios/scenario-drawer.tsx`, `components/ui/tabs.tsx`, `app/globals.css`

#### Context
In a previous iteration, active tabs in `scenario-drawer.tsx` were forced by a global CSS override to display as heavy solid pine-green blocks with 4px drop shadows protruding below the hairline divider. The user reviewed the resulting visual output and requested: *"maybe redesign it, it does not look good"*.

#### Decision
Drawer navigation tabs must use clean underline line tabs (`variant="line"`):
1. The container sits flush on a single bottom border (`border-b border-border/80 bg-background/95`).
2. Redundant divider borders on `DrawerHeader` are removed to prevent claustrophobic double-border strips.
3. Active tabs display `text-primary font-bold` with an active indicator border (`border-b-2 border-primary -mb-px`) sitting flush on the hairline separator.
4. Inactive tabs display muted typography with smooth hover transitions to `text-foreground`.
5. Global `!important` overrides forcing solid backgrounds and shadows onto tab triggers in `globals.css` are permanently removed.

#### Evidence
User feedback screenshot (`media_1788626217010.png`) demonstrated the clunky visual clash of solid blocks against horizontal divider borders. The revised implementation eliminates visual noise, respects the design system, and passed TypeScript verification (`exit code: 0`).

#### Alternatives Considered
- *Segmented capsule pill bar*: Clean, but consumes vertical space and feels like a toolbar rather than page-level navigation.
- *Retaining solid block with reduced padding*: Rejected because solid blocks clash with full-width horizontal divider rules.

#### Consequences
- Clean, modern, accessible tab navigation consistent across admin drawers.
- Component-level styling is respected without global stylesheet contamination.

---

### D-20260906-002 — Dynamic Contrast Pill Badges for Tab Navigation

- **Status**: Accepted
- **Date**: 2026-09-06
- **Decision owner**: Agent with evidence
- **Scope**: Counter badges inside tab navigation triggers
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006
- **Related implementation**: `app/admin/dashboard/scenarios/scenario-drawer.tsx`, `app/admin/dashboard/classrooms/classroom-roster-drawer.tsx`

#### Context
Tab counter badges previously used generic `Badge variant="secondary"`, which rendered as yellow-green status labels. When placed inside active tab triggers, contrast degraded and text numbers became muddy and difficult to read.

#### Decision
Tab badges inside navigation triggers must dynamically adapt contrast:
- **When tab is active**: Render as a soft emerald pill (`bg-primary/15 text-primary border border-primary/25 font-bold text-[10px] px-1.5 rounded-full`).
- **When tab is inactive**: Render as a neutral muted pill (`bg-muted text-muted-foreground border border-border/60 text-[10px] font-semibold px-1.5 rounded-full`).

#### Evidence
Visual verification in `media_1788626217010.png` showed unreadable green-on-green numbers. The dynamic pill pattern ensures high legibility in both light and dark themes.

#### Alternatives Considered
- *Static neutral badge*: Legible, but active tabs lose contextual vitality.
- *Solid primary badge on active*: Creates heavy visual weight on small numbers.

#### Consequences
- Distinct, readable counter badges that highlight the active section while keeping inactive sections subtle.

---

### D-20260906-004 — Neutral Form Controls & Toolbar Surfaces (Removal of Blue Hue 220)

- **Status**: Accepted
- **Date**: 2026-09-06
- **Decision owner**: User
- **Scope**: Form inputs, select triggers, comboboxes, and toolbar control groups (`app/globals.css`, `components/ui/input.tsx`, `components/ui/select.tsx`)
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-007
- **Related implementation**: `app/globals.css` (`.control-field`, `.toolbar-control-group`, `[role="combobox"]`, `--surface-muted`, `--muted`, `--accent`, `--border`, `--input`)

#### Context
Toolbar elements (the mission search input, sort dropdown, filter button track, and view mode switcher) were rendering with an unintended pale blue / cyan background. The user explicitly requested: *"remove the blue color here"*.

#### Decision
1. In `app/globals.css`, `.control-field` and `.toolbar-panel [role="combobox"]` must use `background: var(--card);` (crisp white in light mode) instead of `var(--surface-muted)`.
2. `.toolbar-control-group` uses `background: color-mix(in oklch, var(--foreground), transparent 94%);` (neutral soft grey).
3. The underlying OKLCH tokens (`--muted`, `--accent`, `--border`, `--input`, `--sidebar`, `--surface-muted`) are adjusted from hue `220` (blue/cyan) to neutral/brand-aligned hues (`oklch(... 174)` or zero chroma).

#### Evidence
User screenshot demonstrating the unwanted blue tint across toolbar elements. Verification of `app/globals.css` confirmed `var(--surface-muted)` was using `--accent` at hue `220`.

#### Alternatives Considered
- *Retaining blue accent for inputs*: Rejected by explicit user instruction.
- *Transparent inputs*: Reduces contrast when layered against structured dashboard panels.

#### Consequences
- Search inputs, select triggers, and toolbar capsule tracks now render with clean, crisp, neutral backgrounds consistent with the user's neutral `--background` setting.

---

### D-20260906-005 — Role-Aware Route Guarding & Client-Side Cookie Eviction

- **Status**: Accepted
- **Date**: 2026-09-06
- **Decision owner**: Agent with evidence
- **Scope**: Root proxy router (`proxy.ts`), Data Access Layer (`lib/dal.ts`), session lifecycle
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-010
- **Related implementation**: `proxy.ts`, `lib/dal.ts`

#### Context
Users continuously encountered browser error `ERR_TOO_MANY_REDIRECTS` ("localhost redirected you too many times") when accessing `/admin`, `/login`, or administrative routes. Inspection revealed a cyclic redirect loop between `proxy.ts` (which optimistically redirected all authenticated sessions on auth routes to `/dashboard` without role checks) and `app/dashboard/layout.tsx` (which rejected admin sessions and redirected back to `/login`). Additionally, invalid or expired cookies were mutated only in the server's in-flight request object rather than deleted on the client via `response.cookies.delete("session")`.

#### Decision
1. **Role-Aware Proxy Routing**: `proxy.ts` decodes the JWT session payload and inspects `role`:
   - `admin` sessions accessing `/admin`, `/login`, or `/register` redirect deterministically to `/admin/dashboard`.
   - `admin` sessions attempting to access `/dashboard` redirect to `/admin/dashboard`.
   - `student` sessions accessing `/login`, `/register`, or `/admin` redirect deterministically to `/dashboard`.
   - `student` sessions attempting to access `/admin/dashboard` redirect to `/dashboard`.
   - Unauthenticated requests to `/admin/dashboard` redirect to `/admin`.
   - Unauthenticated requests to `/dashboard` redirect to `/login`.
2. **Client-Side Cookie Eviction**: When a session cookie fails decryption/verification, `response.cookies.delete("session")` is executed on the response headers so the browser immediately purges corrupted cookies.
3. **Non-Throwing DAL Verification**: `lib/dal.ts` `verifySession()` returns `null` instead of throwing `redirect("/login")`, allowing admin layouts to direct unauthenticated users cleanly to `/admin`.
4. **Removal of Invalid Proxy Calls**: Remove `updateSession()` from `proxy.ts` because calling `cookies()` from `next/headers` inside proxy/middleware violates Next.js 16 runtime conventions.

#### Evidence
Confirmed via source code inspection in `proxy.ts` (lines 34-40) and `app/dashboard/layout.tsx` (lines 10-13). Verified with `npx tsc --noEmit` (`exit code: 0`).

#### Alternatives Considered
- *Blindly redirecting all users to `/dashboard` and relying on layout guards*: Rejected; directly caused the infinite `ERR_TOO_MANY_REDIRECTS` loop.
- *Single shared login page for both students and admins*: Violates DepEd civic inquiry product model (LRN vs. admin credentials).

#### Consequences
- Eliminates `ERR_TOO_MANY_REDIRECTS` loops permanently.
- Clean separation between admin and student authentication and dashboard boundaries.
- Corrupted or expired cookies are proactively purged by the browser.

---

### D-20260906-006 — Comprehensive Adoption of Combobox for Filtering, Sorting, and Selection

- **Status**: Accepted
- **Date**: 2026-09-06
- **Decision owner**: User steering
- **Scope**: All administrative toolbars, views, drawers, and modal dialogs (`scenarios-view.tsx`, `classrooms-view.tsx`, `classroom-roster-drawer.tsx`, `edit-classroom-dialog.tsx`, `components/ui/combobox.tsx`)
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006
- **Related implementation**: `app/admin/dashboard/scenarios/scenarios-view.tsx`, `app/admin/dashboard/classrooms/classrooms-view.tsx`, `app/admin/dashboard/classrooms/classroom-roster-drawer.tsx`, `app/admin/dashboard/classrooms/edit-classroom-dialog.tsx`, `components/ui/combobox.tsx`

#### Context
Following the replacement of the mission library sort `<Select>` with the searchable `<Combobox>`, the user requested: *"apply it all to all pages"*, mandating the systematic replacement of legacy `<select>` and `<Select>` controls across all admin screens with the standardized `<Combobox>` primitive.

#### Decision
1. **Mission Library Toolbar (`scenarios-view.tsx`)**: Searchable combobox for sorting ("Newest First", "Title (A-Z)", "Most Classrooms", "Most Constraints").
2. **Classrooms Toolbar (`classrooms-view.tsx`)**: Replaced native `<select>` with `<Combobox>` for classroom sorting ("Newest First", "Name (A - Z)", "Most Students", "Most Missions").
3. **Classroom Roster Drawer (`classroom-roster-drawer.tsx`)**:
   - Replaced native `<select>` for student team/group filtering with `<Combobox>`.
   - Replaced native `<select>` for quick civic mission assignment with searchable `<Combobox>`.
4. **Edit Classroom Dialog (`edit-classroom-dialog.tsx`)**: Replaced `<Select>` with `<Combobox>` featuring rich sublabels for status ("Active" — *Students can join & submit*, "Archived" — *Read-only historical view*).
5. **Standardized Combobox Styling**:
   - Triggers inherit clean card background (`var(--card)`) and neutral border (`var(--surface-border)`).
   - Search inputs within popover panels use `bg-transparent` without nested card borders.
   - Selected options highlight in soft pine green (`bg-primary/10 text-primary font-bold`) with a checkmark.
6. **MultiSelectCombobox Layout & Overflow Protection**:
   - Triggers maintain a strict fixed height (`h-10`) and `overflow-hidden` to prevent collisions with neighboring toolbar controls.
   - For multiple selections, individual full-text badges are replaced with a single category title (`Missions`) and a high-contrast emerald counter pill (`[ 2 ]` in `bg-primary/15 text-primary border border-primary/25 font-bold`).
   - An inline clear button (`(x)`) allows resetting filters without opening the popover.

#### Evidence
Direct user steering: *"apply it all to all pages"*. User-provided screenshot demonstrating badge overflow collision in Submissions Viewer toolbar. Verification via `npx tsc --noEmit` (`exit code: 0`).

#### Alternatives Considered
- *Retaining native `<select>` in secondary dialogs*: Rejected per explicit user instruction to apply comboboxes uniformly across all pages.
- *Wrapping badges inside multi-select button*: Rejected because button `whitespace-nowrap` caused uncontrollable horizontal expansion into adjacent toolbar toggles.

#### Consequences
- Consistent, searchable, and keyboard-navigable dropdown experience across every administrative view and drawer.
- Toolbar layouts remain completely stable and collision-free regardless of how many items are selected.

---

### D-20260906-007 — Obsidian-Pine Dark Mode Palette & Elevation Architecture

- **Status**: Accepted
- **Date**: 2026-09-06
- **Decision owner**: User steering
- **Scope**: Dark mode theme variables (`app/globals.css`, `.dark`), card elevations, form inputs, badge styling, ambient shadows
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-007
- **Related implementation**: `app/globals.css` (`.dark`)

#### Context
The user requested: *"improve the darkmode colors"*. The previous dark mode palette used a muddy 20% lightness cyan-teal background (`oklch(0.2 0.035 180)`), a washed-out card surface with insufficient contrast delta, harsh 39% lightness borders that created glowing cyan wireframes around inputs and cards, a toxic lime secondary color (`oklch(0.73 0.14 117)`), and lacked dark overrides for custom surface tokens (`--surface-border`, `--surface-background`, `--surface-muted`, `--label-background`).

#### Decision
1. **Canvas & Layered Elevation**:
   - Canvas (`--background`): Deep obsidian slate with subtle pine undertone `oklch(0.135 0.015 175)` (~#0c1413).
   - Elevated Cards (`--card`): `oklch(0.18 0.018 175)` (~#14201e), establishing clear hierarchy above the canvas.
   - Popovers/Modals (`--popover`): `oklch(0.20 0.02 175)` (~#192624) for crisp floating surfaces.
   - Sidebar (`--sidebar`): `oklch(0.15 0.016 175)` (~#101918) for structured navigation.
2. **Refined Hairline Borders**:
   - Replaced harsh `0.39` lightness borders with refined `oklch(0.27 0.02 175)` borders.
3. **Luminous Emerald Brand Identity**:
   - `--primary`: `oklch(0.68 0.14 165)` (luminous emerald pine, highly visible, non-glaring).
   - `--primary-foreground`: `oklch(0.12 0.02 175)` (deep obsidian for crisp >8:1 contrast on primary buttons).
   - `--secondary`: `oklch(0.65 0.11 150)` (gentle sage-leaf accent).
   - `--muted-foreground`: `oklch(0.68 0.025 175)` for balanced typographic hierarchy.
4. **Surface & Badge Tokens**:
   - Added dark overrides for `--surface-border`, `--surface-background`, `--surface-muted`, and `--label-background` (`color-mix(in oklch, var(--primary), transparent 85%)`), giving secondary badges soft emerald translucence.
5. **High-Contrast 4px Offset Brutalist Shadows**:
   - Restored the signature `4px 4px 0` hard offset shadows in dark mode using `color-mix(in oklch, var(--primary), black 40%)` (opaque deep pine emerald shelf), ensuring the brutalist offset shelf has >0.25 contrast delta against the dark canvas and dark cards.

#### Evidence
Direct user steering: *"improve the darkmode colors"*, followed by *"the offset shadow is not visible in the dark mode'"*. Verification via `npx tsc --noEmit` (`exit code: 0`).

#### Consequences
- Dark mode delivers a luxurious, comfortable, high-contrast visual experience aligned with the pine green civic brand.
- The platform's signature 4px offset brutalist card and button aesthetic remains distinctly visible and impactful in both light and dark themes.

---

### D-20260906-008 — Brutalist 4px Offset Shadow Styling for Navigation Systems

- **Status**: Accepted
- **Date**: 2026-09-06
- **Decision owner**: User steering
- **Scope**: Primary header navigation, desktop admin sidebar navigation, mobile drawer navigation, and mission editor steps navigation (`components/navigation.tsx`, `components/admin-sidebar-nav.tsx`, `app/admin/dashboard/layout.tsx`, `components/admin/mission-editor/index.tsx`, `app/globals.css`)
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-007
- **Related implementation**: `components/navigation.tsx`, `components/admin-sidebar-nav.tsx`, `app/admin/dashboard/layout.tsx`, `components/admin/mission-editor/index.tsx`, `app/globals.css`

#### Context
Following the restoration of high-contrast 4px offset shadows in dark mode for cards and action buttons, the user requested: *"apply the same effect on the navigatuion"*. Previously, the top header used a weak divider and subtle blur shadow (`shadow-2xs`), while the admin sidebar navigation and mission steps vertical navigation consisted of flat, low-contrast text links lacking route-aware active state and tactile elevation.

#### Decision
1. **Top Header Container (`components/navigation.tsx`)**:
   - Upgraded to a firm bottom boundary with the signature 4px offset shadow shelf: `border-b border-border bg-background/90 shadow-xs backdrop-blur-xl supports-[backdrop-filter]:bg-background/75`.
   - Brand mark (`CT`) badge given a crisp 4px brutalist offset shelf: `rounded-lg bg-primary text-xs font-black text-primary-foreground shadow-xs border border-primary/20`.
2. **Top Navigation Links & Actions**:
   - Active link (e.g. Dashboard) rendered as an elevated card badge: `border border-surface-border bg-card text-primary shadow-xs font-extrabold`.
   - Inactive links transition smoothly on hover: `hover:border-surface-border/60 hover:bg-card/50 hover:text-foreground hover:shadow-2xs`.
   - Mobile menu trigger and logout button styled with brutalist outlines and offset shadows (`shadow-xs` / `shadow-2xs`).
3. **Admin Dashboard Sidebar Navigation (`components/admin-sidebar-nav.tsx`)**:
   - Extracted into a dedicated client navigation component with `usePathname()` active route awareness.
   - Active sidebar destination renders as an elevated brutalist card: `border border-surface-border bg-card text-primary shadow-xs font-bold` with luminous emerald icon highlight.
   - Inactive items provide subtle hover feedback: `hover:border-surface-border/60 hover:bg-card/50 hover:text-foreground hover:shadow-2xs`.
4. **Mission Steps Vertical Navigation (`components/admin/mission-editor/index.tsx`)**:
   - Active step trigger renders with the exact same elevated card shelf: `data-active:border-surface-border data-active:bg-card data-active:text-primary data-active:shadow-xs data-active:font-bold`.
   - Active step badge highlights in solid emerald: `group-data-active/trigger:bg-primary group-data-active/trigger:text-primary-foreground group-data-active/trigger:shadow-2xs`.
5. **Tailwind Theme Utility Tokens (`app/globals.css`)**:
   - Registered `--color-surface-border`, `--color-surface-background`, and `--color-surface-muted` in `@theme inline` for seamless compilation across all views.

#### Evidence
Direct user steering: *"apply the same effect on the navigatuion"*. Full TypeScript compilation verified via `npx tsc --noEmit` (`exit code: 0`).

#### Consequences
- Visual consistency across the entire platform: top navigation, sidebar navigation, cards, and buttons all share the same tactile, brutalist 4px offset shadow depth.
- Clear route and step orientation for administrators and students across both light and obsidian-pine dark modes.

---

### D-20260905-002 — Pine Green Active State & Subtle Primary Tint Hover for Filter Toolbars

- **Status**: Accepted
- **Date**: 2026-09-05
- **Decision owner**: User
- **Scope**: Filter toggle buttons in administrative toolbars (`scenarios-view.tsx`, `classrooms-view.tsx`, `submissions-view.tsx`)
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006
- **Related implementation**: `app/globals.css` (`.toolbar-toggle`)

#### Context
User requested a cohesive styling pattern for toolbar status filter buttons ("All", "Active", "Archived"):
- Active toggle buttons should stand out distinctly.
- Inactive toggle buttons should provide subtle, elegant feedback on hover without harsh coloring.

#### Decision
All `.toolbar-toggle` buttons follow this contract:
- **Active state**: Solid pine green (`background: var(--primary)`), white text (`color: var(--primary-foreground)`), and crisp drop shadow (`box-shadow: var(--shadow-xs)`).
- **Inactive hover state**: Subtle primary tint (`background: color-mix(in oklch, var(--primary), transparent 88%)`, `border-color: color-mix(in oklch, var(--primary), transparent 82%)`, and `color: var(--primary)`).

#### Evidence
Explicit user requests across iterations 1, 3, 5, and 7 confirmed this visual preference for toolbar controls.

#### Alternatives Considered
- *Default grey hover*: Rejected by user as too plain.
- *High-saturation hover*: Rejected by user as visually overwhelming; replaced by 88% transparent subtle wash.

#### Consequences
- Clear tactile feedback on list filters across all admin dashboard views.

---

### D-20260901-001 — DepEd 12-Digit LRN and Join Code Student Authentication

- **Status**: Accepted
- **Date**: 2026-09-01
- **Decision owner**: Joint
- **Scope**: Student data model, signup schemas, and authentication flow
- **Supersedes**: [D-20260901-004](#d-20260901-004--standard-emailpassword-login-for-student-accounts)
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-003, F-CIV-008
- **Related implementation**: `lib/definitions.ts`, `app/login/`, `app/signup/`

#### Context
In Philippine basic and secondary education, students do not universally possess institutional email addresses, but every registered student has a unique 12-digit Learner Reference Number (LRN) issued by the Department of Education.

#### Decision
Student authentication requires:
1. Valid 6-character classroom Join Code (e.g. `S43ZQ8`).
2. Exact 12-digit numeric LRN validated via Zod regex `/^\d{12}$/`.
3. Password with complexity requirement (at least 8 chars, 1 letter, 1 number).
4. Optional collaborative group assignment upon registration.

#### Evidence
DepEd order standards and `lib/definitions.ts` Zod validation schemas (`SignupFormSchema`, `LoginFormSchema`).

#### Alternatives Considered
- *Email-based registration*: Impractical for K-12 students lacking email access.
- *Auto-generated usernames*: Increases credential loss and classroom friction.

#### Consequences
- Students enroll quickly using official credentials and classroom codes without third-party email dependencies.

---

### D-20260901-002 — 7-Step Civi-Tech Civic Inquiry Simulation Model

- **Status**: Accepted
- **Date**: 2026-09-01
- **Decision owner**: Joint
- **Scope**: Simulation activity workflow, constraint evaluation, and data schemas
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-001, F-CIV-003, F-CIV-004
- **Related implementation**: `lib/definitions.ts`, `app/dashboard/activity/[scenarioId]/`, `components/admin/mission-editor/`

#### Context
Civic problem-solving requires structured pedagogy so students do not jump prematurely to solutions without investigating systemic causes, verifiable evidence, and conflicting stakeholder perspectives.

#### Decision
Simulation exercises are structured into 7 sequential steps:
1. `identify` — Define the core problem and distinguish symptoms.
2. `analyze` — Root cause analysis and systemic drivers.
3. `evidence` — Synthesizing data from the mission evidence library.
4. `stakeholders` — Mapping community stakeholder perspectives.
5. `intervention` — Developing policy proposals.
6. `challenge` — Responding to an unexpected real-time crisis event.
7. `reflection / tips` — Post-intervention synthesis.

Each step evaluates student text responses against scenario constraints via Google Gemini AI before unlocking subsequent steps.

#### Evidence
Pedagogical civic inquiry frameworks and implemented schemas in `lib/definitions.ts`.

#### Alternatives Considered
- *Single-page essay submission*: Lacks formative scaffolding and dynamic AI feedback per stage.

#### Consequences
- High pedagogical rigor and structured simulation telemetry for teacher evaluation.

---

### D-20260901-003 — Base UI Primitives and Tailwind CSS v4 Integration

- **Status**: Accepted
- **Date**: 2026-09-01
- **Decision owner**: Joint
- **Scope**: Frontend component system
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-006, F-CIV-007
- **Related implementation**: `components/ui/`, `app/globals.css`, `package.json`

#### Context
Next.js 16 with React 19 requires headless, accessible UI primitives that minimize bundle overhead and integrate cleanly with Tailwind CSS v4 and OKLCH color spaces.

#### Decision
All core UI primitives (tabs, dialogs, drawers, popovers, badges) use `@base-ui/react` primitives styled with Tailwind CSS v4 and `class-variance-authority` (CVA).
- Base UI attributes (`data-active`, `data-variant`, etc.) must be targeted in place of legacy Radix attributes.

#### Evidence
`package.json` dependencies: `@base-ui/react: ^1.6.0`, `tailwindcss: ^4.x`.

#### Alternatives Considered
- *Radix UI*: Traditional choice, but heavier bundle footprint.

#### Consequences
- Fast rendering and modern headless accessibility with clean styling hooks.

---

### D-20260906-003 — Peer-Review Policy Audit Workflow

- **Status**: Provisional
- **Date**: 2026-09-06
- **Decision owner**: Agent with evidence
- **Scope**: Advanced submission review
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-011
- **Related implementation**: `[Proposed]`

#### Context
Educators have expressed interest in allowing collaborative student groups to audit and critique other groups' proposed interventions during Step 5.

#### Decision
`[Provisional]` A peer-review stage may be added where anonymized group interventions can be reviewed and scored by peer cohorts before final submission.

#### Evidence
`[Unknown]` Requires user validation and teacher feedback before full implementation.

#### Alternatives Considered
- *Teacher-only grading*: Current default behavior.

#### Consequences
- Would increase student collaboration but adds orchestration complexity for classroom pacing.

---

### D-20260905-001 — Forced Solid Primary Block Tabs with Drop Shadows

- **Status**: Superseded
- **Date**: 2026-09-05
- **Decision owner**: Agent (Misinterpretation of user request)
- **Scope**: Global tab triggers
- **Supersedes**: None
- **Superseded by**: [D-20260906-001](#d-20260906-001--underline-indicator-line-tabs-for-drawer-navigation)
- **Related foundation sections**: F-CIV-010
- **Related implementation**: Previous version of `app/globals.css` lines 338–358

#### Context
In response to a request to "apply the effect to tabs", a global `!important` rule was introduced forcing `[data-slot="tabs-trigger"][data-active]` to render as a solid primary box with `var(--shadow-xs)`.

#### Decision
Applied solid green block background and shadow to all active tab triggers.

#### Evidence
Failed user acceptance: User immediately uploaded screenshot `media_1788626217010.png` stating *"maybe redesign it, it does not look good"*.

#### Alternatives Considered
- Superseded in favor of D-20260906-001.

#### Consequences
- Block styling collided with horizontal drawer divider lines and rendered child badge text unreadable. Reversed.

---

### D-20260901-004 — Standard Email/Password Login for Student Accounts

- **Status**: Rejected
- **Date**: 2026-09-01
- **Decision owner**: Joint
- **Scope**: Student authentication
- **Supersedes**: None
- **Superseded by**: None
- **Related foundation sections**: F-CIV-002, F-CIV-010
- **Related implementation**: `lib/definitions.ts`

#### Context
Initial authentication proposal assumed conventional email/password registration for all users.

#### Decision
Rejected for student accounts. Admin accounts retain email/password, but students use DepEd 12-digit LRN and 6-character classroom Join Codes.

#### Evidence
Many public school students in the target demographic do not have reliable personal email addresses, leading to registration abandonment.

#### Alternatives Considered
- Adopted D-20260901-001 instead.

#### Consequences
- Eliminated onboarding friction for classrooms.
