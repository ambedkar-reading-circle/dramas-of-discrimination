# Manual flipbook migration to react-pageflip

Status: implemented, 2026-10-15. Validation details follow; the original task breakdown is retained below as the acceptance record.

## Implementation record

- Replaced the GulLabs packages with pinned `react-pageflip` 2.0.3 and `page-flip` 2.0.7. An npm override keeps the wrapper on the same core version.
- Preserved the existing HTML content, desktop/portrait scroll thresholds, cover positioning, accessible transcript, reduced-motion fallback, and print layout.
- Removed per-page crease gradients, narrowed the settled gutter to 10px, and hid it during turns. Upstream moving shadows use maximum opacity 0.65. Leaf roots have opaque paper backgrounds.
- `app/scripts/patch-flipbook.mjs` applies version-checked replacements to both published core bundles and both React wrapper bundles during `postinstall`. It cancels frame/init work, removes resize listeners even with pointer input disabled, restores React-owned page nodes, refreshes callbacks, and emits geometric progress. Unexpected versions/builds fail with a patch mismatch. It is safe to run again.
- Added engine and Strict Mode lifecycle regressions. The teardown test failed on the unpatched engine, then passed after the patch. Added controlled-clock visual captures of forward/reverse turns and cover opening. Extended the manual suite for restored scroll, in-flight resizing, theme colors, and print. Settled-page assertions now wait for the engine's final paint rather than inspecting temporary turn copies.
- Edge visual inspection confirmed the moving highlight on the cream and blue HTML pages. Full manual, notebook-grid, engine lifecycle, React lifecycle, and visual suites pass; production build, TypeScript, lint, and changed-file formatting pass. An isolated `npm ci` applied the patches automatically, and its production build and full manual suite also passed. No physical-device, Firefox, or WebKit claim is made.

Maintenance: use `npm ci` with install scripts enabled. If scripts were deliberately disabled, run `npm run postinstall` before starting/building the app. Review and update patches before upgrading either pinned library; run `test:flipbook-engine`, `test:flipbook-react`, `test:manual-visual`, and `test:manual` afterward. The permanent fixture under `app/scripts/fixtures/` tests the upstream wrapper and is not imported by the production app.

## Outcome

Subsequent page redesign (2026-10-20): the reader now has twelve faces, with five white letter pages and five blue interactive placeholders between the covers. Scroll schedules derive from that page count; canvas focus pauses turns and hidden pages/curl copies are inert. The engine and its versioned patches are unchanged. See `manual-reading-canvas-plan.md` and the current implementation notes in `manual-flipbook-plan.md`; the migration scope below records the earlier ten-page state.

Replace `@gullabs/react-flipbook` 3.2.2 with the `react-pageflip` 2.0.3 / `page-flip` 2.0.7 combination used in `C:/Users/Sute/Documents/dodpage`. Match the supplied reference's moving light/dark band along a curled paper leaf, while eliminating the conspicuous stationary/doubled spine band from the current preview.

The screenshot is a visual target, not proof that swapping dependencies alone will reproduce it. Curl geometry, shadow strength, page colors, and custom shading all affect the result. Verify the effect with our actual cream/blue HTML pages before completing the migration.

## Scope and assumptions

- Keep the ten current HTML pages, their text and typography, hard covers, and accessible transcript. Migrating to the old site's 25 JPEG pages is a separate content decision.
- Keep scroll-triggered turns, current thresholds and reversal dead band, adjacent-turn reconciliation, entrance/exit motion, responsive layouts, and restored-scroll behavior.
- Keep direct pointer turning disabled. The old site's pointer-driven curl is a reference for appearance; verify that programmatic turns produce the desired effect too.
- Keep reduced-motion, print, and enhancement-failure reading modes.
- Use the original engine's moving shadows as the starting point. Remove page-attached crease gradients; fade any retained stationary gutter during a turn. Keep the external book drop shadow separate.
- Do not claim that the upstream library intrinsically renders a better curl: both libraries share StPageFlip ancestry.
- This document is the migration plan. Do not change application behavior as part of planning.

## Evidence and integration differences

The older viewer lives at `C:/Users/Sute/Documents/dodpage/src/app/resources/facilitation-manual/page.tsx`; its lockfile resolves the versions above. It renders 25 images, enables portrait adaptation, uses stretch sizing, and leaves animation shadows at their defaults. The inspected source adds no custom spine shading. Its dependency is absent from that checkout's current `node_modules`, so this review is source-based rather than a live comparison.

Our implementation uses the following fork-specific interfaces:

| Current interface                       | Upstream migration                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| `sizing="fixed"`                        | `size="fixed"`; retain measured dimensions initially                                 |
| `hardCovers`                            | `showCover={true}`; verify the same spread indices                                   |
| `pointerInput={[]}`                     | `useMouseEvents={false}` and disable corner-hover effects with the supported setting |
| `onLoaded(snapshot)`                    | Normalize `onInit(event)` and `event.data`; verify initialization timing             |
| `onPageChange(snapshot)`                | Normalize `onFlip(event)` with page index in `event.data`                            |
| `onChangeState({ state })`              | Normalize the state string in `event.data`                                           |
| Handle `flipToPage(target)`             | `ref.current.pageFlip().flip(target)`                                                |
| Handle `turnToPage(target)`             | `ref.current.pageFlip().turnToPage(target)`                                          |
| Engine `isReady()`                      | Explicit readiness after initialization, cleared on teardown                         |
| `onTurnProgress`                        | No documented upstream equivalent; resolve in Task 3                                 |
| `controls`, `useKeyboard`, `liveRegion` | Remove unsupported props; preserve our existing transcript and interaction behavior  |

The upstream wrapper source does not return unmount cleanup from its engine effect. The upstream render loop schedules animation frames recursively without retaining a cancellation handle, and `destroy()` removes the host element. Verify these observations against the exact installed releases; a wrapper call to `destroy()` alone must not be assumed to fix lifecycle behavior.

Sources:

- [Upstream React API and shadow settings](https://github.com/Nodlik/react-pageflip#props).
- [Upstream React wrapper source](https://github.com/Nodlik/react-pageflip/blob/master/src/html-flip-book/index.tsx).
- [Upstream renderer lifecycle](https://github.com/Nodlik/StPageFlip/blob/master/src/Render/Render.ts).
- [Upstream engine lifecycle and methods](https://github.com/Nodlik/StPageFlip/blob/master/src/PageFlip.ts).
- [Current fork and turn-progress contract](https://github.com/gul-labs/flipbook#recipes-and-common-mistakes).

These source links track branches; inspect and record the installed release sources before implementing a patch.

## Task 1: Prove the requested appearance

**Description:** Add the pinned upstream packages alongside the existing dependency and create a temporary development comparison using representative existing pages: a cream page, blue page, and hard covers. Use the same dimensions and 900 ms programmatic turn duration. Compare a single fixed input sequence with custom spine/page shading disabled. Start with upstream default shadows, then tune downward if needed; do not invent a final opacity before visual comparison.

**Acceptance:**

- Forward and reverse interior turns show a moving highlight/shadow band tied to the curled leaf, without a fixed duplicate band.
- Our HTML page colors remain opaque and text does not show through the folding surface.
- The effect works on scroll-equivalent programmatic turns, with evidence from early, middle, and late turn frames.

**Verification:** Real-browser captures at a fixed viewport after fonts load; compare identical animation phases against the user reference. Capture the current implementation as a baseline. Do not treat a settled-spread screenshot as proof of the curl.

**Dependencies:** None. **Scope:** Medium.

**Likely files:** `app/package.json`, `app/package-lock.json`, temporary development comparison component, development-only entry point, capture script.

## Task 2: Make upstream lifecycle safe

**Description:** Exercise mount/unmount before wiring the production reader. Inspect the exact installed wrapper/core releases for frame cancellation, timeout/listener cleanup, and React ownership of removed DOM. If the observed upstream gaps remain, use a small reproducible package patch that survives clean installs. Do not manually edit installed files as the delivered fix, disable Strict Mode, or leave an invisible engine running. Keep any patch narrowly scoped and retain upstream notices.

**Acceptance:**

- Repeated mount/unmount, route changes, breakpoint changes, and reduced-motion toggles leave no engine-owned animation frames, delayed callbacks, or listeners running after teardown.
- React development Strict Mode causes no duplicate book, detached-node errors, or missing pages.
- Any required patch applies on a clean install and has a focused lifecycle regression check.

**Verification:** Instrument the temporary harness to count engine-owned pending frames/listeners before mounting and after teardown; repeat at least ten cycles and unmount during a turn. Confirm no increasing residual work, duplicate hosts, or console errors. A DOM count alone is insufficient.

**Dependencies:** Task 1. **Scope:** Medium.

**Likely files:** package manifest and lockfile, tracked dependency patch(es), lifecycle regression script. Choose the smallest reproducible patch mechanism after examining installed artifacts.

### Checkpoint: appearance and lifecycle

Proceed to production integration only when the desired effect is demonstrated and cleanup is verified. If the curl does not improve or the patch becomes a substantial engine fork, report that concrete result before expanding scope. Keep the existing reader functional throughout this checkpoint.

## Task 3: Preserve scroll and cover behavior

**Description:** Adapt `ManualBook` and `useManualFlipbook` to upstream props, event payloads, and methods. Keep the existing desired-page reconciliation and stable page elements. Replace `BookSnapshot` / `FlipBookHandle` with correctly typed upstream-facing interfaces; do not copy the old viewer's TypeScript suppression.

Resolve cover progress before removing the existing `onTurnProgress` usage. Preferred approach: expose a narrow, tested geometric progress event through the tracked engine patch if needed to retain exact centering. The callback must derive from actual engine turn geometry, settle on completion, and stop after teardown. Do not assume elapsed time divided by 900 ms is equivalent to engine progress. If a smooth transition based only on start/end state is proposed instead, show the changed cover behavior for review before accepting it as a substitute.

**Acceptance:**

- Desktop lands on 0, 1, 3, 5, 7, 9; portrait reaches every page. Fast scrolling and reversal settle on the latest requested spread without queued stale turns.
- Front/back covers and their drop-shadow footprints stay centered during opening/closing and when settled; initialization at a restored scroll position works.
- Resizing during a turn reinitializes or updates safely and restores the intended destination with no stranded busy state.

**Verification:** Extend the existing browser sequence with in-flight cover geometry checks, restoration, and resize during animation. Verify readiness and events for the pinned upstream release, including state/page event ordering.

**Dependencies:** Task 2. **Scope:** Medium.

**Likely files:** `app/src/features/home/ManualBook.tsx`, `app/src/features/home/useManualFlipbook.ts`, tracked engine patch if needed, `app/scripts/manual-flipbook.mjs`.

## Task 4: Tune the moving light and gutter

**Description:** Remove the broad `::after` shading and sharp crease currently attached to letter pages. Let the upstream moving shadow create the curl effect. Retain a subtle stationary gutter only on settled open spreads and fade it out during turns. Tune `drawShadow`, `maxShadowOpacity`, and the active turn corner with the reference visible; keep hard-cover behavior distinct from flexible paper.

**Acceptance:**

- Highlight/shadow follows the moving fold in both directions without a stationary stripe crossing the raised page.
- No visible text bleed, detached shadow, seam gap, or abrupt shadow jump on cream or blue pages.
- Settled spreads retain readable text and sufficient page separation in both site themes.

**Verification:** Inspect forward/reverse cream-to-blue and blue-to-cream turns, plus cover transitions. Save matching early/middle/late captures or a short recording. Review at desktop and narrow portrait sizes.

**Dependencies:** Task 3. **Scope:** Small.

**Likely files:** `app/src/features/home/ManualFlipbook.css`, `app/src/features/home/ManualBook.tsx`.

### Checkpoint: integrated reader

Compare the actual scroll-driven reader against the reference and baseline. Verify cover centering, moving shimmer, and settled readability together; an attractive isolated curl is not sufficient.

## Task 5: Complete regression verification

**Description:** Update existing browser checks to assert visible behavior rather than requiring the old shading implementation. In particular, replace any hard-coded stationary spine opacity expectation with the intended settled/turning behavior. Add focused regression coverage for lifecycle, mid-turn resize, scroll restoration, and portrait reverse turns; preserve the existing content, layout, and accessibility checks.

**Acceptance:**

- Existing manual and notebook-grid suites pass, including preserved letter text, narrow-screen readability, entry/exit, fast/reverse scrolling, reduced motion, and route navigation.
- The new lifecycle and in-flight visual checks pass; print and enhancement-failure modes still provide readable content.
- Production build, TypeScript, lint, and changed-file formatting pass, with unrelated pre-existing failures identified separately.

**Verification:** Run from `app`: `npm run test:manual`, `npm run test:grid`, `npm run build`, `npx tsc --noEmit`, `npm run lint`, and targeted formatting checks. Use the installed Edge channel for browser suites as documented. Inspect widths 320, 700, 1001, and 1440, including short viewports. Check Firefox/WebKit where available and report any untested browser rather than claiming full compatibility.

**Dependencies:** Task 4. **Scope:** Small to medium.

**Likely files:** `app/scripts/manual-flipbook.mjs`, focused lifecycle/visual regression script(s).

## Task 6: Remove the old dependency and document the result

**Description:** Remove the GulLabs packages only after the integrated replacement passes. Delete the temporary comparison and instrumentation, update implementation notes and third-party attribution, and document any maintained patches and the reason for them.

**Acceptance:**

- Production code and lockfile contain no unused GulLabs dependency, and no temporary development comparison ships.
- Documentation records the actual engine versions, shadow choices, lifecycle/progress patches, and validation limitations.
- A clean install reproduces patches and the final build/manual checks pass after dependency removal.

**Verification:** Search imports and lockfile, inspect the final diff for unrelated changes, perform clean-install verification in an isolated checkout, then run the affected build and manual checks once on the final dependency graph.

**Dependencies:** Task 5. **Scope:** Medium, split cleanup from documentation if more than five files change.

**Likely files:** `app/package.json`, `app/package-lock.json`, `docs/manual-flipbook-plan.md`, `docs/third-party-notices.md`, temporary harness removal.

## Risks and decision rules

| Risk                                                  | Response                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Pointer-drag reference differs from programmatic curl | Establish visual feasibility in Task 1 using programmatic turns.                                 |
| Upstream cleanup defects return                       | Test and patch the exact releases before production integration.                                 |
| Loss of turn-progress callback breaks cover centering | Resolve actual geometric progress explicitly in Task 3; do not hide the regression with a timer. |
| Portrait reverse curl or fold opacity regresses       | Test both directions and contrasting pages early and after integration.                          |
| Strong shimmer harms readability                      | Tune on the actual HTML pages and inspect the entire turn.                                       |
| Migration expands into a broad engine rewrite         | Stop at the evidence checkpoint and report the scope change.                                     |
| Existing working-tree changes are overwritten         | Keep edits scoped to this migration and preserve unrelated work.                                 |

The plan is complete when the user can review the proposed migration and its visual/behavioral acceptance criteria. The migration itself is complete only after all six tasks pass; dependency installation alone is not completion.
