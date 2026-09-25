# Engineering Learnings

This document records non-obvious engineering lessons, traps, and debugging discoveries in CiviConnect to prevent future agents and developers from repeating past mistakes.

---

## Index

- [L-20260906-001: Base UI Tabs Use `data-active` and `data-variant`, Not Radix's `data-[state=active]`](#l-20260906-001--base-ui-tabs-use-data-active-and-data-variant-not-radixs-data-stateactive)
- [L-20260906-002: Global `!important` Slot Overrides Break Contextual Component Layouts](#l-20260906-002--global-important-slot-overrides-break-contextual-component-layouts)
- [L-20260906-003: Double-Border Clipping in Drawer Headers](#l-20260906-003--double-border-clipping-in-drawer-headers)
- [L-20260906-004: Next.js 16 Proxy Redirect Ping-Pong & In-Memory Cookie Deletion Traps](#l-20260906-004--nextjs-16-proxy-redirect-ping-pong--in-memory-cookie-deletion-traps)
- [L-20260906-005: Multi-Select Combobox Trigger Width Explosion and Toolbar Collisions](#l-20260906-005--multi-select-combobox-trigger-width-explosion-and-toolbar-collisions)
- [L-20260925-006: Combobox Option Duplicate Key Collision Defense](#l-20260925-006--combobox-option-duplicate-key-collision-defense)
- [L-20260925-007: Vercel Serverless Navigation Latency & Supabase HTTP REST Full-Table Scans](#l-20260925-007--vercel-serverless-navigation-latency--supabase-http-rest-full-table-scans)

---

## L-20260906-001 — Base UI Tabs Use `data-active` and `data-variant`, Not Radix's `data-[state=active]`

- **Area**: UI Primitives / Tabs
- **Symptoms**: Tailwind classes like `data-[state=active]:border-primary` fail to apply active styling to tab triggers when clicked.
- **Trigger**: Copying standard shadcn/ui or Radix UI snippets into a codebase built with `@base-ui/react`.
- **Root cause**: `@base-ui/react/tabs` sets `data-active=""` (or boolean `data-active`) and `aria-selected="true"`. It does **not** set Radix UI's `data-state="active"`.
- **Resolution**:
  - In component definitions, use `data-active:border-primary` or group variants like `group-data-[variant=line]/tabs-list:data-active:text-primary`.
  - When supporting mixed legacy call-sites, use compound selectors: `data-active:border-primary data-[state=active]:border-primary`.
- **Prevention**: Always verify the underlying primitive library in `components/ui/*.tsx` before writing state selectors. Check `node_modules/@base-ui/react` conventions.
- **Evidence**: `components/ui/tabs.tsx` imports from `@base-ui/react/tabs`. Inactive underline indicators failed until `data-active` selectors were applied.
- **Related decisions**: `D-20260901-003`, `D-20260906-001`
- **Applicable scope**: All components wrapping `@base-ui/react` primitives (tabs, dialogs, drawers, popovers).
- **Not applicable when**: Using raw Radix UI primitives (`@radix-ui/react-slot`, `@radix-ui/react-label`).

---

## L-20260906-002 — Global `!important` Slot Overrides Break Contextual Component Layouts

- **Area**: Global Styling / CSS Architecture
- **Symptoms**: Active tabs in slide-over drawers rendered as heavy dark solid green blocks with 4px hard black drop shadows cutting across horizontal divider lines, obscuring counter badge text.
- **Trigger**: Attempting to apply a button-like active state globally across all tab instances via `[data-slot="tabs-trigger"][data-active] { background: var(--primary) !important; box-shadow: var(--shadow-xs) !important; }` in `globals.css`.
- **Root cause**: Tabs serve multiple distinct UI patterns (e.g. segmented capsule buttons vs. horizontal underline navigation bars). Applying `!important` at the global stylesheet level overrides component variant scoping (`variant="line"`) and destroys nested child contrast (e.g. secondary badges become illegible green-on-green).
- **Resolution**:
  - Keep global CSS scoped strictly to specific utility classes (e.g. `.toolbar-toggle` for toolbar buttons).
  - Manage tab variants through `class-variance-authority` (CVA) inside `components/ui/tabs.tsx`.
- **Prevention**: Never use `!important` in `globals.css` on generic component slots (`[data-slot="..."]`) unless intentionally implementing an unskippable theme primitive.
- **Evidence**: Removing lines 338–358 in `globals.css` instantly resolved the drawer visual clash and restored clean line indicators.
- **Related decisions**: `D-20260906-001`, `D-20260905-001`, `D-20260905-002`
- **Applicable scope**: All component styling across `globals.css` and `components/ui/`.
- **Not applicable when**: Scoped utility classes targeting explicit classnames (e.g. `.toolbar-toggle`).

---

## L-20260906-003 — Double-Border Clipping in Drawer Headers

- **Area**: Layout Design / Drawer Architecture
- **Symptoms**: Navigation tabs appear trapped in an awkward, narrow rectangular strip between the drawer title and the panel body.
- **Trigger**: Stacking a `DrawerHeader` with `border-b` directly above a `Tabs` container that also possesses `border-b`.
- **Root cause**: Independent subcomponents each defining their own bottom divider border (`border-b`) without realizing they are rendered consecutively.
- **Resolution**:
  - Remove `border-b` from `DrawerHeader`.
  - Let the header title flow seamlessly into the tab bar.
  - Place a single `border-b border-border/80` at the base of the tab container (`sticky top-0 z-10`), with active tab indicators sitting flush (`-mb-px border-b-2 border-primary`).
- **Prevention**: When composing drawers or modals with tab navigation, ensure the header and tabs share a single boundary divider.
- **Evidence**: Layout inspection in `app/admin/dashboard/scenarios/scenario-drawer.tsx`.
- **Related decisions**: `D-20260906-001`
- **Applicable scope**: All slide-over drawers and sheet modals with multi-tab bodies (`scenario-drawer.tsx`, `classroom-roster-drawer.tsx`, `submission-drawer.tsx`).
- **Not applicable when**: Drawers without tab bars.

---

## L-20260906-004 — Next.js 16 Proxy Redirect Ping-Pong & In-Memory Cookie Deletion Traps

- **Area**: Authentication / Routing Architecture / Next.js 16 Proxy
- **Symptoms**: Browser displays `ERR_TOO_MANY_REDIRECTS` ("localhost redirected you too many times") when visiting `/admin`, `/login`, or dashboards.
- **Trigger**: Logging in as admin and revisiting `/admin` or `/login`, or having an expired/invalid JWT session cookie.
- **Root cause**:
  1. `proxy.ts` blindly redirected any authenticated session on `/login`, `/register`, or `/admin` to `/dashboard` (student dashboard) without inspecting `payload.role`.
  2. The student layout (`app/dashboard/layout.tsx`) called `getCurrentStudent()`, which returned `null` for admin roles and redirected to `/login`.
  3. This created an infinite ping-pong loop: `/admin` -> `/dashboard` -> `/login` -> `/dashboard` -> `/login`.
  4. `request.cookies.delete("session")` inside `proxy.ts` only mutates the incoming Node `NextRequest` object; it does **not** send a `Set-Cookie` expiration header to the browser. A corrupted cookie was therefore repeatedly resent on every redirect.
  5. `proxy.ts` called `await updateSession()`, which illegally attempted to invoke `cookies()` from `next/headers` inside proxy/middleware context.
- **Resolution**:
  - In `proxy.ts`, inspect `payload.role`: route `admin` sessions to `/admin/dashboard` and `student` sessions to `/dashboard`.
  - Delete corrupted/unverifiable cookies on the outgoing response object (`response.cookies.delete("session")`) so the browser immediately drops them.
  - Remove `await updateSession()` from `proxy.ts`.
  - Refactor `lib/dal.ts` `verifySession()` to return `null` instead of throwing `redirect("/login")` so admin layouts can handle unauthenticated state by cleanly redirecting to `/admin`.
- **Prevention**: Always enforce role-aware guards symmetrically in both the root proxy router and layout guards. Never rely on `request.cookies.delete()` for browser cookie eviction—always use `response.cookies.delete()`.
- **Evidence**: `proxy.ts` line 38 previously hardcoded `/dashboard`. Inspecting the network loop confirmed alternating 307 redirects between `/dashboard` and `/login`.
- **Related decisions**: `D-20260906-005`
- **Applicable scope**: `proxy.ts`, `lib/dal.ts`, `lib/session.ts`, `app/admin/dashboard/layout.tsx`, `app/dashboard/layout.tsx`.
- **Not applicable when**: Static unauthenticated public marketing pages without route guards.

---

## L-20260906-005 — Multi-Select Combobox Trigger Width Explosion and Toolbar Collisions

- **Area**: UI Primitives / Combobox / Toolbar Layout
- **Symptoms**: `MultiSelectCombobox` trigger explodes in width (from 200px to ~320px+) and height (to ~60px), directly overlapping and occluding neighboring toolbar controls (such as view toggles `[ = ] [ school ] [ :: ]`).
- **Trigger**: Selecting 2 or more options in a multi-select filter situated within a compact horizontal toolbar.
- **Root cause**:
  1. Base button primitive (`components/ui/button.tsx`) includes `whitespace-nowrap`.
  2. When `MultiSelectCombobox` rendered individual badge elements for each selected option with their full un-truncated titles (e.g. "Dengue Outbreak Prevention", "Stray Animal Population and Rabies Threat"), the button could not wrap the text and was forced to break its CSS width constraints (`lg:w-[200px]`).
  3. `h-auto` and `min-h-10` allowed the button to vertically expand unpredictably, ruining toolbar horizontal alignment.
- **Resolution**:
  - Enforce strict fixed height (`h-10`) and `overflow-hidden` on the trigger button.
  - Replace individual badge spam with a compact summary:
    - 0 items: placeholder in muted foreground (`Filter Missions...`).
    - 1 item: truncated option label (`Dengue Outbreak Prev...`).
    - 2+ items: category title (`Missions`) + high-contrast count pill (`[ 2 ]` in `bg-primary/15 text-primary font-bold`).
  - Provide an inline, one-tap clear button (`(x)`) directly on the trigger to reset filters instantly without opening the popover.
  - Set popover dropdown to `w-[var(--anchor-width)] min-w-[240px]` so long titles have ample room in the dropdown without pushing toolbar elements.
- **Prevention**: Never render unbounded tag lists inside fixed-width button triggers. Always use a counter summary pill when selections exceed 1 item.
- **Evidence**: Submissions Viewer toolbar collision shown in user screenshot; resolved via `components/ui/combobox.tsx`.
- **Related decisions**: `D-20260906-006`
- **Applicable scope**: `components/ui/combobox.tsx` (`MultiSelectCombobox`), and all toolbars hosting multi-select filters (`submissions-view.tsx`, `assign-scenario-dialog.tsx`).
- **Not applicable when**: Full-page forms with unlimited vertical space designed for multi-tag inputs.

---

## L-20260925-006 — Combobox Option Duplicate Key Collision Defense

- **Area**: UI Primitives / Combobox / React Keys
- **Symptoms**: React console error: `"Encountered two children with the same key, 'New Stakeholder (Community Representative)'. Keys should be unique so that components maintain their identity across updates."`
- **Trigger**: Opening a `Combobox`, `MultiSelectCombobox`, or `BadgeCombobox` dropdown when the underlying data source contains multiple items with identical names/labels (such as default unedited mission stakeholders created as `"New Stakeholder"` with role `"Community Representative"`).
- **Root cause**:
  1. Dropdown options were keyed strictly with `key={opt.value}`.
  2. `filteredOptions` did not enforce deduplication by `value`.
  3. Parent forms passing dynamic arrays (like `consultedStakeholders.map(...)`) did not deduplicate identical value strings.
- **Resolution**:
  - In `components/ui/combobox.tsx` across `BadgeCombobox`, `Combobox`, and `MultiSelectCombobox`:
    - Deduplicate options by `value` using a `Set<string>` during `filteredOptions` computation.
    - Compound React keys with index: `key={`${opt.value}-${i}`}` as a defensive fallback.
  - In parent callers (e.g. `CommunityActionPlanForm` in `community-action-plan-form.tsx`), use a `Set<string>` to deduplicate option arrays before passing to comboboxes, and ensure fallback indexing on mapped buttons (`key={s.id || `consulted-${idx}`}`).
- **Prevention**: Never rely solely on user-generated data fields as unique React keys in lists. Always sanitize collections for uniqueness and use composite keys (`${value}-${index}`) in rendered loops.
- **Evidence**: Fixed React key collision reported in `components/ui/combobox.tsx` line 593; verified clean compilation with `npx tsc --noEmit`.
- **Related decisions**: `D-20260925-008`
- **Applicable scope**: `components/ui/combobox.tsx`, `components/simulation/community-action-plan-form.tsx`, and all dropdown/combobox list renderers.
- **Not applicable when**: Guaranteed unique database primary keys are used without string transformation.

---

## L-20260925-007 — Vercel Serverless Navigation Latency & Supabase HTTP REST Full-Table Scans

- **Area**: Performance / Data Access Layer / Next.js Server Components
- **Symptoms**: Route navigation is instantaneous on localhost (~0–50ms) but takes 2–5 seconds on production deployment (Vercel). Clicking any navigation link (e.g. Dashboard, Classrooms, Mission Library, Submissions, Activity) hangs with noticeable delay before rendering.
- **Trigger**: Navigating between App Router routes on production Vercel serverless functions connected to Supabase Postgres over HTTP REST.
- **Root causes**:
  1. **Full-Table Scans in `lib/db.ts`**: Helper functions (`findStudentById`, `findClassroomById`, `findScenarioById`, `findStudentByLrn`, `findAdminByEmail`, `findSubmissionById`) were implemented by querying the *entire* table (`supabase.from("...").select("*")`) over HTTP REST and filtering rows in JavaScript memory with `.find()` or `.filter()`. On Vercel, this caused huge payloads (including every submission's entire simulation state JSON) to be downloaded across the internet on every single route transition.
  2. **Sequential Await Waterfalls**: Server components and layouts executed 4 to 6 database queries in serial (`await A; await B; await C; ...`). In cross-region cloud environments, sequential HTTPS round-trips compounded (e.g. 5 roundtrips × 300ms = 1,500ms).
  3. **N+1 Query Loop in Admin Classrooms**: `ClassroomsPage` looped over every classroom and called `getScenariosByClassroom(c.id)`, triggering `getAllClassroomScenarios()` and `getAllScenarios()` for each classroom sequentially (generating 10–15 roundtrips).
  4. **Lack of Per-Request Memoization**: Repeated DAL lookups across layouts and page components duplicated identical database queries within the same request lifecycle.
- **Resolution**:
  - Refactored all `find*` and `get*By*` queries in `lib/db.ts` to execute direct Supabase indexed queries (`.eq()`, `.maybeSingle()`, `.in()`).
  - Added targeted queries: `getSubmissionsForStudent`, `findSubmissionForStudent`, `findClassroomScenario`, `getClassroomScenariosByClassroom`.
  - Wrapped request-scoped lookups with React `cache()` to eliminate duplicate queries within a single render pass.
  - Replaced sequential `await` cascades with `Promise.all([ ... ])` in `StudentDashboard`, `ActivityPage`, `AdminDashboardOverview`, `ClassroomsPage`, `ScenariosPage`, `SubmissionsPage`, and `StudentsPage`.
  - Eliminated the N+1 loop in `ClassroomsPage` by computing the `scenariosMap` in memory from batch-fetched scenarios and classroom-scenarios.
- **Prevention**: Never query full database tables to filter a single row in server-side functions. Always use indexed database `.eq()` or `.filter()` predicates, batch concurrent independent queries in `Promise.all`, and memoize per-request lookups with React `cache()`.
- **Evidence**: Production build `npm run build` completed cleanly; 0 TypeScript errors (`npx tsc --noEmit`); queries reduced from 5–15 serial full-table scans to single concurrent targeted indexed queries.
- **Related decisions**: `decisions.md`
- **Applicable scope**: All database query helpers (`lib/db.ts`), Data Access Layer (`lib/dal.ts`), Server Components, and Server Actions.

