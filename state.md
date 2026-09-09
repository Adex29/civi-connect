# Current Project State

- **Updated**: 2026-09-08
- **Updated by**: Antigravity Agent
- **Repository/branch**: `main`
- **Current objective**: Zero Parent Layout Shift & In-Card Overlays for Civi Living Mascot
- **Overall status**: Operational & Verified

---

## Completed

1. **Zero Parent Layout Shift & In-Card Overlay Architecture**:
   - Fixed the parent card resizing/stretching issue caused by opening options, switching faces, changing hats/caps, and performing tricks.
   - **Root Container Fixed Footprint**: `CivicCompanion` has a strict, rock-solid bounding box of `w-full max-w-[340px] h-[415px]` with rounded-3xl border and subtle background backdrop.
   - **Rigid Fixed-Height Speech Bubble**: Set rigid `h-13 w-full max-w-[315px] shrink-0` with `line-clamp-2`, ensuring text length differences never cause vertical jitter.
   - **Fixed 250px Mascot Viewport**: Designated 250px viewport guarantees tall hats (wizard, chef, top hat) and leaping stunts (rocket flight, sneeze jump) never push neighboring layout elements.
   - **In-Card Overlay Drawers (`absolute inset-0 z-30`)**: All 3 option drawers (Sticky Faces, Wardrobe, and Tricks) render as absolute overlay sheets within the companion card instead of appending to document flow. Opening or closing any drawer never shifts or resizes the parent hero command center card.
   - **Toolbar Quick Flippers**: Added `<` and `>` arrow flippers to BOTH the Sticky Faces and the Hats switcher for instant cycling without opening drawers.

2. **Brawl Stars Sprout Sticky Paper Face System**:
   - Modeled after Sprout from Brawl Stars: yellow square sticky post-it note (`#FEF08A` $\to$ `#FDE047`) taped to the visor with translucent tape and curled corner.
   - 14 hand-drawn marker doodle expressions (`sproutDefault`, `derp`, `catSmile`, `shocked`, `angry`, `sleepy`, `heartEyes`, `cool`, `crying`, `dead`, `dizzy`, `mustache`, `wink`, `smug`).
   - Interactive Paper Slap SFX (`playPaperSlap()`) and flap recoil animation (`animate-sticky-slap`).
   - Sticky vs Digital mode toggle.

3. **Individual Part Kinematics (Physical Part Motion, Zero Zooming)**:
   - Parts physically translate, rotate, and deform independently rather than scaling the outer container (sprout whips, high-fives, fist bumps, head tilts, backflips).

4. **14-Hat Wardrobe & 6 Circus Stunts**:
   - 14 detailed SVG vector hats and 6 full-routine circus tricks (Rocket, Juggling, Head Spin, Sneeze, Breakdance, Magic).

---

## Current Behavior & Verification

- `[Verified]` `npx tsc --noEmit` passed with 0 errors.
- `[Verified]` Companion container is strictly `h-[415px] max-w-[340px]`.
- `[Verified]` Opening any drawer (Faces, Wardrobe, Tricks) renders inside `absolute inset-0 z-30` and never resizes the parent hero card.
- `[Verified]` Speech bubble has rigid fixed height (`h-13`), completely eliminating vertical jitter.
- `[Verified]` Dev server running at `http://localhost:3000`.

---

## Next Steps

- User verification at `http://localhost:3000/dashboard` to confirm the parent div never resizes when changing faces, tricks, and caps.
