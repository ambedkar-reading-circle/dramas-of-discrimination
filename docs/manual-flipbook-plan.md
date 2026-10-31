# Manual flipbook introduction — implementation plan

## Implementation notes

- Migrated on 2026-10-15 to `react-pageflip` 2.0.3 / `page-flip` 2.0.7, retaining Motion for the surrounding scroll choreography. The original engine supplies the requested moving curl highlight. A version-checked, idempotent `postinstall` script applies narrowly scoped lifecycle and progress patches to the published builds; see `manual-flipbook-migration-plan.md` and `third-party-notices.md`.
- The book uses `showCover`. It contains twelve faces: a title cover, five white reading pages alternating with five blue canvas pages, and an illustration back cover. Desktop spread heads are 0, 1, 3, 5, 7, 9, and 11, turning at 12%, 24.8%, 37.6%, 50.4%, 63.2%, and 76% pinned progress. Portrait visits all twelve faces with thresholds distributed from 8% to 76%; both schedules derive from the page count. Adjacent turns reconcile toward the latest scroll destination without queuing stale turns.
- Moving shadows use `maxShadowOpacity={0.65}`. The printed pages no longer carry crease/gutter gradients. A narrow stationary gutter appears only on settled open spreads and disappears during turns; an opaque leaf-root background prevents underlying pages bleeding through the fold.
- The engine remounts when its measured width changes, then restores the destination from current scroll progress. The patched geometric `turnProgress` event keeps cover positioning and the drop-shadow footprint tied to the engine's actual fold. Upstream page/state events are normalized in the existing hook; page elements remain memoized.
- The original letter is preserved in full on five cream reading pages. Blue-page text moves forward to the next white page, ahead of its existing text; a final white/blue pair accommodates the closing sentence and signature. Editorial headings, page kickers, and their decorative SVGs are removed. Inline circles, boxes, brackets, highlights, underlines, strike-throughs, and crossed-off marks use the local Rough Notation hook, measured after font loading on settled pages and carried with each turning leaf. The marks use the primary blue, with translucent blue highlights. Handwritten body text remains at least 14px. Odd-page folios read “Dramas of Discrimination”; even-page folios retain “Ambedkar Reading Circle.” Folios use smaller Cascadia Mono text; page numbers are smaller still, inside a subtle tinted pill that follows each page's ink color. See `manual-reading-canvas-plan.md` for the page map.
- The sticky sheet establishes a block formatting context (`display: flow-root`); without it the stage grid's top margin collapsed out of the pinned sheet and the heading hid behind the navbar. The contained margin plus `align-content: center` keeps heading, book, and footer centered below the navbar for the whole pinned runway.
- The inverse band is painted on the sticky `.manual-stage` sheet (it carries the `argument-band` class in animated mode), not on the tall section runway, which stays transparent. The sheet is one viewport tall, rounded to notebook rows, and stays pinned through the book's exit.
- Entrance has its own `start end` → `start start` scroll range, so the cover arrives as the section enters and settles when it pins. Entry and exit mirror one another spatially: −110vw → 0 → +110vw, with matching ±6° tilt and ±4° Y rotation. Both map linearly to their respective scroll ranges; entry spans one viewport of scrolling, while exit spans the final 20% of the pinned runway. Page-turn thresholds and exit timing are unchanged.
- Closed desktop covers are centered independently of the reserved spread. A separate shadow footprint and the gutter follow the engine's `onTurnProgress`; the footprint expands after an opening cover crosses the spine and contracts before a closing cover crosses it. Covers have no spread gutter. Turns take 900ms.
- Desktop scroll choreography starts at 1001px width and 800px height. Smaller viewports use a single-page reader. Section heights are 540svh on desktop and 900svh in portrait, rounded to notebook rows, to retain reading time across the added pages.
- Reading text, signature details, and canvas glyphs inherit the site's `--font-body` (Handlee). The former Sue Ellen Francisco override and unused font request are removed. Body sizing is `max(14px, 4.2cqi)`, with 1.45 line height (1.35 on pages no wider than 320px), 0.012em letter spacing, and 5cqi paragraph gaps. Greeting, paragraphs, and signature form one vertically centered block inside a reserved reading area above the folio. This keeps short and dense pages balanced while preserving a 14px phone minimum and clearance from the footer. Folio typography is `clamp(9px, 2.4cqi, 11px)` Cascadia Mono, with page-number pills at 90% of that size.
- Page navigation remains scroll-driven; direct pointer curling and keyboard page turns are disabled. Each blue page contains animated ASCII flow in blue and white. The original WebGL2 shader samples a Handlee glyph atlas over a procedural field; Canvas 2D supplies an animated fallback without WebGL, and a static ASCII layer remains if rendering fails. The visual reference is [Portfolio Hero with Paper Shaders](https://21st.dev/@moazamtrade/components/portfolio-hero-with-paper-shaders), whose public preview was inspected; its component source is locked and no code was copied. The [Paper dithering documentation](https://shaders.paper.design/dithering) informed the two-color motion treatment. No new shader package is required.
- Blue pages have stable, distinct abstract texture assignments in `manualContent.ts`: page 2 = turbulence, page 4 = marbling, page 6 = crossgrain, page 8 = strata, page 10 = diffusion. Domain-warped waves extend across the full canvas without a radial envelope or recognizable object. The density bias preserves small blue gaps while populating at least 80% of character cells in sampled frames. `asciiPatterns.ts` defines the variant vocabulary and fallback fields; `asciiShader.ts` mirrors those fields on the GPU. The assigned variant is independent of the random seed and interactive phase, so reloads, renderer changes, and click/touch flow changes preserve each page's identity. The palette, Handlee glyph atlas, sizing, input controls, and animation limits are shared.
- Pointer movement and arrow keys bend the flow; click, touch, Enter, or Space changes the pattern. Each canvas has a single tab stop and screen-reader-only instructions, with no visible labels or controls. Focus pauses page turns; Escape returns focus to the manual heading and resumes toward the latest scroll destination. Leaving the pinned range in either direction releases focus. Each page has its own random seed, reset on resize/remount. A centered “Scroll” nudge remains the only section footer element.
- Renderers are created only when a page is first visible and settled. Only the active page animates, capped at 30fps and a device-pixel ratio of 1.5; hidden tabs and turning/hidden pages stop their loops. React state is not updated per frame. Renderer resources are disposed on unmount. The last rendered bitmap remains attached to its printed page; the portrait-curl observer copies canvas pixels into temporary DOM copies because `cloneNode` does not preserve them.
- The book wrapper is no longer blanket-hidden from assistive technology: duplicate visual letter text and covers are individually hidden, while only settled visible canvas controls are exposed. Hidden canvas pages are inert. A scoped observer makes portrait curl DOM copies inert and removes duplicate instruction IDs. The original linear transcript remains the single accessible letter; reduced motion, enhancement failure, and print use that transcript without placeholder canvases.
- Reduced-motion preference changes are observed directly with `matchMedia`; the installed Motion hook only snapshots the initial preference. Reduced motion, enhancement failure, assistive technology, and print retain the shared reflowing content without a visible mode toggle.
- The MAP support panel uses a text credit. Only legible title credits from the reference were transcribed; original fine-print design/support credits remain to be supplied for exact reproduction.
- Browser regression coverage lives in `app/scripts/manual-flipbook.mjs` (`npm run test:manual`), including the complete page sequence, visible canvas controls, copy preservation, scroll restoration, resize during turns, themes, and print. `test:manual-canvas` checks all five GPU pattern selections and animations, all five animated 2D fallbacks, stable assignments across reloads, Handlee, inactive-page pause, keyboard/pointer/touch input, focus, both exit directions, curl bitmap copying, phone layout, and reduced motion. It captures each GPU pattern as `ascii-<variant>-desktop.png` and each phone fallback as `ascii-<variant>-phone-fallback.png`. `test:spread` includes deterministic procedural-field tests for each variant's time, seed, pointer, and phase behavior, plus stable page assignments. `test:flipbook-engine` verifies resource cleanup and geometric progress; `test:flipbook-react` exercises the real wrapper in Strict Mode with repeated mount/unmount and mid-turn resize. `test:manual-visual` checks moving shadows and captures early/middle/late turns under a controlled browser clock. Captures are written to ignored `app/node_modules/.cache/manual-visual/` unless `MANUAL_CAPTURE_DIR` is supplied. The notebook audit skips hidden content and the explicitly marked printed-page surface, while still checking the section boundaries and reflowing text.
- Verified on 2026-10-20: production build, TypeScript, full ESLint, and changed-file formatting. The spacing/folio revision passes `test:manual` and `test:manual-canvas`; the preceding shader revision also passed `test:spread` (nine tests) and `test:manual-visual`. Browser checks used installed Microsoft Edge (`$env:PLAYWRIGHT_CHANNEL='msedge'`). The manual suite traverses every page at 320×568, 320×900, 700×900, 1001×900, and 1440×900, checking Handlee body/signature clearance, vertical centering within the reading area, smaller Cascadia folios, highlighted page numbers, and active-canvas visibility. ASCII checks confirm the WebGL renderer, movement over time, pointer/keyboard/touch input, Handlee body/art and Cascadia folio fonts, no renderer allocation on unvisited pages, hidden-page and background-tab pause/resume, focus handling in both exit directions, portrait bitmap copies, forced-color palette changes, an animated 2D fallback with WebGL disabled, and reduced motion. Screenshots were inspected for desktop, phone reading/canvas pages, and centered annotated spreads. No page errors were observed. The earlier layout implementation also passed `test:grid` on both routes at nine widths, 200% text, font fallback, themes, and forced colors; this revision changes only the printed book. Physical-device, Firefox, and WebKit testing has not been performed.

## Outcome and scope

Per-page variant verification (2026-10-20): `test:spread` passes all 16 tests; production build, TypeScript, full ESLint, and changed-file formatting pass. `test:manual-canvas` confirms every variant animates on the GPU and in the Canvas 2D fallback, plus stable assignments, input, pause/resume, focus exits, bitmap copies, and reduced motion. `test:manual-visual` passes the curl/shadow checks. All five GPU captures and the phone fallback captures were visually inspected. The earlier full manual/layout results above remain the baseline; no reading layout or scroll schedule changed for this revision.

Dense abstract texture verification (2026-10-20): replaces the recognizable fields above. Production build, TypeScript, full ESLint, and `test:spread` (17 tests) pass. `test:manual-canvas` passes all five GPU textures and five phone Canvas 2D fallbacks, with visible glyphs in 84–98% of sampled grid cells. These populated cells span 59–69% of the blue page area; this measures the area occupied by character cells, not solid white ink. Animation, input, hidden-page pause, focus, curl bitmap copies, forced colors, and reduced motion remain covered.

Add an introductory flipbook section between `HomeHero` and `WorkshopMethod` in `app/src/routes/index.tsx`. The existing method heading is “Constitutional morality is not a natural sentiment.”

Treat the two supplied screenshots as two consecutive preview spreads (four HTML pages), not as proof of the physical manual's pagination. Preserve their blue-and-white editorial design. Rebuild text and layout in HTML/CSS; use image or SVG assets only for illustrations and logos. The screenshots are visual/content references, not implementation instructions.

The section is an unnumbered introduction to the manual; the method retains its current 01 label. The hero's “Explore the method” link continues to reach the method directly. Add a local “Continue to the method” link to the preview.

## Proposed experience

On a sufficiently wide, tall viewport, a sticky stage holds the open book beneath the header while normal document scrolling drives this sequence. Start around 300–350 viewport heights of section space, rounded to notebook rows, and tune in the browser.

| Section progress | Visual state                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| 0–18%            | Book moves inward from below with a subtle tilt; scale rises from roughly 0.86 to 1 and opacity reaches 1. |
| 18–42%           | First spread rests flat and still: illustration/support panel on the left, title page on the right.        |
| Around 45%       | A single page turn reveals the reader's letter.                                                            |
| 52–82%           | Letter spread remains still and readable; stopping scroll stops the outer movement.                        |
| 82–100%          | Book recedes slightly, moves upward, and fades as the method enters the viewport.                          |

Reverse scrolling brings the book back and turns to the first spread. No wheel interception or forced scrolling. The page-turn animation completes in a short fixed duration; it is triggered by scroll position, not continuously scrubbed through a curl. Continuous curl scrubbing is a separate scope because the proposed library's documented API exposes page-turn commands, not a normalized curl-progress control.

## Technical choices

- Begin with `react-pageflip` (`HTMLFlipBook`, backed by StPageFlip) for HTML page rendering, paper bending, and shadows. First validate its compatibility with this app's React 19, TypeScript 6, and Vite 8. If the wrapper fails, evaluate a small lifecycle adapter around `page-flip` before changing the visual design. [Library documentation](https://github.com/Nodlik/react-pageflip)
- Add Motion for React through `motion`, importing from `motion/react`, for the outer book's position, scale, rotation, and opacity. Track the untransformed section with `useScroll`; map progress with `useTransform`. Keep Motion transforms on an outer wrapper so they do not overwrite the flip engine's internal transforms. Neither library is currently installed. [Scroll documentation](https://motion.dev/docs/react-use-scroll), [transform documentation](https://motion.dev/docs/react-use-transform)
- Use an open two-page layout on desktop, with four independent page elements and `showCover={false}`. Match the approximate portrait page ratio in the references (0.70 width/height). Align the blue panel on pages three and four at the spine using shared dimensions.
- Keep content separate from animation control. One content source supplies both the designed pages and a reflowing reading view. Use stable page elements and forwarded DOM refs where required by the wrapper.
- Preserve the notebook layout contract around the section, including row-aligned section height and the method's start position. Scope resets inside the book for global paragraph/heading offsets, fonts, margins, and line heights. The printed pages use their own typography and fixed blue/white colors in both site themes.

## Ordered implementation tasks

### 1. Prove the flipbook integration

**Scope:** Small; package manifest/lockfile and a temporary four-page prototype.

Verify initial spread, next/previous turns, resize, repeated mount/unmount, and the state-change events. Exercise outer scale/rotation alongside the flip engine, including pointer coordinate accuracy.

**Acceptance:** Exactly one turn reaches the second spread; returning reaches the first; no duplicate instances, runtime errors, or incompatible peer/type requirements.

**Verification:** Type check, production build, and a real-browser interaction check. Record the selected package versions. Remove the temporary prototype after integration.

**Dependencies:** None. Resolve this risk before detailed page styling.

### 2. Build the two reference spreads

**Scope:** Medium; `ManualPages.tsx`, `manualContent.ts`, `ManualFlipbook.css`, and any needed assets in `app/public/`.

- Page 1: pale blue line illustration with the support-credit panel.
- Page 2: ARC logo, facilitation-manual subtitle, “Dramas of Discrimination” title, and credits.
- Pages 3–4: continuous blue letter panel, two text columns, large cropped decorative title fragments, and signature/date.

Inspect `ARCLogo-blue.png` and `bg-image.svg` for reuse. A separate MAP logo is not present in the listed public assets; use an original source if available, otherwise retain a clearly identified temporary text credit in the development preview. Transcribe only legible reference copy; flag uncertain fine print for proofing rather than inventing it. Do not add unprovided manual pages or a download link without a real target.

**Acceptance:** Editable, selectable text; aligned spread backgrounds and margins; no clipping of substantive text. Decorative fragments are hidden from assistive technology.

**Verification:** Compare both spreads to the supplied references in-browser at the intended desktop size; proof the letter and credits. Checkpoint: page design and dependency integration both work before adding scrolling.

**Dependencies:** Task 1.

### 3. Integrate the scroll sequence

**Scope:** Medium; `ManualFlipbookSection.tsx`, `useManualFlipbook.ts`, the co-located stylesheet, and `app/src/routes/index.tsx`.

Create the sticky stage and entrance/hold/exit transforms. Use section progress to request a target spread. Trigger the forward turn at about 45% and the reverse turn below about 40%, providing a small dead band against boundary jitter. Allow only one turn in flight; retain the latest requested spread and reconcile when the engine returns to its reading state. Handle initialization at a restored scroll position, fast scrolling, direction changes, and resize.

Provide previous/next controls and a spread indicator. On desktop, explicit page navigation takes control of page selection for the current visit to the section; subsequent scrolling still controls entrance/exit but does not immediately undo the reader's selection. Re-entering the section restores scroll-led selection. Pause automatic turns while keyboard focus is inside the reader.

**Acceptance:** Forward/reverse sequences settle on the intended spread; rapid scrolling does not queue repeated flips; the hero anchor and local continuation link land below the header.

**Verification:** Browser checks for slow scroll, fast scroll, rapid reversal, restored position, direct method navigation, and leaving/re-entering the section.

**Dependencies:** Tasks 1–2.

### 4. Provide readable small-screen and accessible modes

**Scope:** Medium; section/page components and stylesheet.

On narrow or short viewports, use a compact, non-sticky single-page reader with explicit navigation and normal vertical document scrolling. Fit pages without horizontal overflow and provide “Read as text” for the dense letter. Use the reflowing reading view for reduced motion and print, removing the artificial scroll runway, perspective, and automatic turns. Honor preference changes while mounted. [Reduced-motion documentation](https://motion.dev/docs/react-use-reduced-motion)

Supply labelled controls, visible focus, keyboard previous/next within the reader, and a polite page indicator. Prevent hidden pages and flip-engine clones from producing duplicate accessible content or focus targets. Keep focused content visible through the exit phase. Preserve adequate touch targets and avoid trapping touch scrolling.

**Acceptance:** All four pages are reachable without animation; text remains readable at enlarged text sizes; keyboard and touch users can leave the section normally.

**Verification:** Narrow portrait, short landscape, keyboard-only, accessibility-tree inspection, reduced-motion changes, 200% text, and print preview. Checkpoint: both animated and reflowing experiences work end to end.

**Dependencies:** Tasks 2–3.

### 5. Verify integration and polish

**Scope:** Small; focused browser checks/scripts and existing notebook-grid checks as needed.

Run the build, type check, lint, formatting checks on changed files, and the existing `test:grid` suite. Compare any failures against the pre-change baseline, since the working tree already contains substantial changes. Ensure the grid checks distinguish the internally typeset book from the surrounding notebook layout without weakening existing coverage.

Verify light/dark themes, viewport widths 320, 700, 1001, and 1440, resizing during a turn, font/asset loading, route navigation away and back, and console errors. Add focused behavioral coverage for reverse/rapid scrolling and explicit navigation; avoid snapshot tests that merely restate styling.

Reserve layout space before enhancement, consider loading the flip engine as the section approaches, and keep per-frame progress out of React state. A failed enhancement should leave the reflowing content usable. Inspect smoothness on a modest mobile device or throttled browser; tune shadows and rotation before increasing effects.

**Acceptance:** No horizontal overflow, stranded hidden book, page-turn races, inaccessible text, or displaced notebook section boundaries. Build and relevant checks pass, with any unrelated baseline failures documented.

**Dependencies:** Tasks 1–4.

## Remaining decisions and limits

- Four preview pages and the above timing are proposed defaults, adjustable during visual review.
- Exact source artwork and tiny credits may require the original manual/design assets for faithful reproduction; the supplied screenshots are sufficient to establish structure and the main visual treatment.
- This plan adds an introductory preview, not a full manual reader. More pages can follow the same page model once content is supplied.
- The plan below records the proposed implementation; the notes above track implementation decisions.
