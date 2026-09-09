# Decision Register

This document is the authoritative record of accepted, provisional, superseded, and rejected decisions for the CiviConnect project.
When guidance in other documentation conflicts with an accepted decision recorded here, the accepted decision in this document governs.

---

## Active Decisions

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
