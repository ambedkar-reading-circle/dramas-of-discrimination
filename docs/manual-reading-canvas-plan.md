# Manual reading pages and blue canvas pages

Status: implemented on 2026-10-20. The page map and placeholder scope below describe the delivered design; verification is recorded in the manual flipbook implementation notes.

Visual revision after implementation: page kickers and visible canvas labels/instructions were removed. Blue pages now hold independent random 5×6 symbol arrays in blue and white; click/tap or Enter/Space changes a symbol and swaps its colors, with arrow-key grid navigation. All seven Rough Notation styles are used across the letter. Odd-page folios read “Dramas of Discrimination,” and folios, symbols, and signature details use the letter’s handwritten font. The earlier marker/reset demonstration described in the planning tasks below is superseded by this revision.

Subsequent animation/font revision: the shared page font is now Handlee, inherited from the site's body font. The static symbol grid is replaced by an original animated ASCII shader, inspired by the linked 21st.dev public preview. Pointer/keyboard input bends the flow and click/touch changes its pattern. Visible pages use WebGL2, with a Canvas 2D animation fallback and a static ASCII layer. Hidden pages/tabs stop animating, and portrait curl copies preserve the last bitmap. See `manual-flipbook-plan.md` for current implementation details.

Reading-layout revision: Handlee body text now has more line/letter spacing and sits in a vertically centered block, including the greeting and signature. A reserved footer area keeps the text clear of the folios. Folios use smaller Cascadia Mono type, with smaller page numbers in subtle highlighted pills. The title text on odd folios is unchanged.

Per-page ASCII revision: blue pages 2, 4, 6, 8, and 10 have fixed turbulence, marbling, crossgrain, strata, and diffusion textures respectively. These dense abstract fields replace the earlier recognizable shapes and continue through the canvas edges. The random seed and interactive phase vary the flow within each field, while both WebGL and Canvas 2D preserve its assigned texture. Density tests require at least 80% populated character cells and substantial strong-glyph detail; browser checks additionally measure visible glyph cells across more than half of each blue page. The shared typography, palette, controls, and animation limits are unchanged.

## Intended result

Remove the eight editorial page titles, such as “Inclusion & belonging,” and their supporting data and styles. Keep the original letter intact and use a few inline Rough Notation marks to guide reading. Move each blue page’s letter text to the next white page, before that white page’s existing text. Every blue inner page becomes an interactive canvas placeholder.

The cover title, subtitle, credits, “A letter to the reader” label, salutation, signature, and folios remain. “White” refers to the existing cream paper surface. This change concerns the manual’s inner pages, not the surrounding blue website section or illustrated covers.

## Page arrangement

The current book has a front cover, eight alternating white/blue inner pages, and an illustrated back cover. The last blue page contains the closing sentence and signature; it has no following white reading page. Add a final white/blue pair before the back cover so that text can move forward while retaining paired desktop spreads and separate covers.

Numbers below are inner-page folios; the front cover remains engine index 0.

| New page   | Surface      | Content                                                  |
| ---------- | ------------ | -------------------------------------------------------- |
| 1          | White        | Current page 1, including “Dear Reader”                  |
| 2          | Blue         | Canvas placeholder                                       |
| 3          | White        | Current page 2 followed by current page 3                |
| 4          | Blue         | Canvas placeholder                                       |
| 5          | White        | Current page 4 followed by current page 5                |
| 6          | Blue         | Canvas placeholder                                       |
| 7          | White        | Current page 6 followed by current page 7                |
| 8          | Blue         | Canvas placeholder                                       |
| 9          | White, added | Current page 8, including closing sentence and signature |
| 10         | Blue, added  | Canvas placeholder                                       |
| Back cover | Illustrated  | Existing back-cover artwork                              |

Result: five white reading pages, five blue canvas pages, and two covers. Desktop spreads remain white on the left and blue on the right. Portrait visits each face in order. Preserve paragraph boundaries when joining text, as well as exact wording and reading order.

## Design and implementation decisions

- Keep `manual.letter` as the canonical plain-text letter for the transcript, reduced motion, print, and content-integrity checks. Page blocks reference that content rather than maintaining another independently edited copy.
- Replace the title-bearing `LetterPage` model with explicit reading/canvas page kinds and stable IDs. Derive the back-cover index and physical page count from the resulting page list. Do not rely on even/odd indexes to decide page behavior.
- Use the existing local `useRoughAnnotation` hook and annotation library; no additional annotation package. Identify phrases explicitly within page text blocks, preserving the exact original text and spaces. Do not generate annotations with broad string replacement or injected HTML.
- Start with one or two marks per reading page. Suggested phrases include “inclusion and belonging,” “systemic in nature,” “constitutional values,” “participatory social lab,” and “adapt and modify.” Use restrained underlines and translucent highlights with readable contrast. Annotations decorate real selectable text and convey no information unavailable in the text itself.
- Use a small manual-specific inline annotation component with stable configuration, multiline support, and cleanup on unmount. Draw after fonts and page layout are ready; keep the marks with their printed page during turns. Verify coordinates inside the transformed flipbook before extending this to all pages: the local library currently measures viewport rectangles. Refresh at settled layout changes, avoiding measurements on every animation frame.
- Treat the canvas as a future interaction slot with a minimal working demonstration: a marker moved with pointer/touch or arrow keys and a reset action. Include a short temporary label and instructions. No drawing tools, saved work, backend, or new canvas framework in this scope. Keep state per page during a mounted book session; persistence across resize/remount is outside this placeholder scope.
- Prefer a simple DOM/SVG surface for this placeholder; a literal bitmap `<canvas>` is only needed if the eventual interaction requires it. Scope touch handling to the marker so ordinary page scrolling remains available elsewhere.
- Interactive controls cannot remain inside the current `aria-hidden="true"` book wrapper. Preserve the single linear letter transcript, hide duplicate visual letter text individually, and expose only the settled visible canvas controls. Hidden leaves and any engine copies must have no active focus targets. Suspend automatic turns while a canvas has focus or pointer capture, reconcile to current scroll position after interaction ends, and explicitly handle focus when the section leaves view.
- Reduced motion, enhancement failure, assistive reading, and print retain the full reflowing letter. Empty canvas placeholders need not appear in the text/print fallback. Any future substantive canvas content will need an equivalent accessible presentation.

## Ordered tasks

### 1. Restructure one reading/canvas pair

Files: `manualContent.ts`, `ManualPages.tsx`, `ManualFlipbook.css`, under `app/src/components/manual-flipbook/`.

Introduce explicit page kinds, render one combined white reading page and one blue placeholder shell, and remove the page-title element from that slice. Use the densest combined text as the layout proof before migrating everything.

Acceptance:

- The blue shell has no letter copy; its moved text precedes the destination white page’s original text.
- The combined page fits above its folio at supported portrait sizes without reducing the existing 14px minimum body-size check.
- The cover and transcript continue rendering.

Verification: inspect the densest page at 320px width and short portrait heights, after fonts load; check content order and folio clearance in the browser. Adjust reclaimed title spacing, paragraph spacing, and panel padding before reducing type. If it cannot fit readably, revisit pagination before continuing.

Dependencies: none. Scope: 3 files.

### 2. Complete pagination and title cleanup

Files: `manualContent.ts`, `ManualPages.tsx`, `ManualFlipbook.css`, `spreadPlan.ts`, `spreadPlan.test.ts`.

Apply the page map, including the added final pair. Remove `LetterPage.title`, all editorial title values, title markup, and title-only CSS. Remove the obsolete title underline and index-specific pencil decorations that depend on the old layout; retain paper textures and folio styling that still serve the design. Update folios to count physical inner pages consistently.

Acceptance:

- All original letter text appears exactly once across the five white pages, in order; only the first has the salutation and only the final white page has the signature.
- All five blue pages are placeholder shells, including the new trailing blue page.
- Both layouts can reach the back cover before the exit begins at 80% scroll progress. Derive spread heads and redistribute thresholds for the new count; the current fixed portrait interval would put added pages too late.

Verification: extend content/order, page-kind, final-signature, and forward/reverse/restored-scroll assertions in `test:spread`; inspect every spread. Search for removed title fields and selectors.

Dependencies: task 1. Scope: 5 files.

Checkpoint: the complete letter and all canvas slots are reachable with correct cover geometry before adding annotations or controls.

### 3. Add phrase annotations

Files: `ManualPages.tsx`, `manualContent.ts`, `ManualFlipbook.css`, a new manual-specific `AnnotatedPhrase.tsx`; touch the shared annotation hook only if the layout proof requires it.

Render explicitly selected phrases through the local annotation hook. Begin with a wrapped phrase on the densest page to prove alignment, contrast, and lifecycle behavior, then apply the remaining marks.

Acceptance:

- Removing the editorial titles does not remove letter content; annotations preserve the exact readable text.
- Marks align after font loading, resize, page turns, and remount, including multiline phrases; no duplicate SVGs or lingering observers.
- Plain text remains readable with marks absent, reduced motion, print, and forced colors.

Verification: inspect settled and turning pages at desktop and mobile sizes, including dark theme and live reduced-motion changes. Run content-integrity checks after inline markup is added. If viewport measurements misalign under transforms, make the smallest coordinate correction and regression-check the header’s existing annotations.

Dependencies: task 2. Scope: 4–5 files.

### 4. Activate the canvas placeholders accessibly

Files: new `ManualCanvasPlaceholder.tsx`, `ManualPages.tsx`, `ManualBook.tsx`, `ManualFlipbook.css`, `useManualFlipbook.ts`.

Add the small marker interaction to each blue page. Pass settled page visibility and busy state to the page layer, gate interaction during turns, and remove the blanket accessibility hiding around interactive content. Keep the transcript as the single accessible letter.

Acceptance:

- Every blue page supports pointer/touch movement, keyboard movement, and reset, with visible focus and distinct accessible labels.
- Hidden pages and engine copies cannot receive focus or input. Letter content is not announced twice. Focus and active pointer capture cannot be stranded during page changes or section exit.
- Marker interaction does not trigger a page turn; scrolling outside the interaction remains usable. No persistence or network calls are introduced.

Verification: keyboard-only traversal, accessibility-tree inspection, pointer/touch checks, fast scroll during interaction, reverse scroll, route unmount/remount, and resize. Confirm the engine forwards the chosen surface’s input events; adjust its event settings only if required, while preserving scroll-led page navigation.

Dependencies: task 2; integrate after task 3 to limit concurrent changes in shared page files. Scope: 5 files.

Checkpoint: full reading flow, annotations, and all five interactive slots work on desktop and portrait.

### 5. Update regression coverage

Files: `app/scripts/manual-flipbook.mjs`, `app/scripts/manual-flipbook-visual.mjs`, and `spreadPlan.test.ts` if additional assertions are needed.

Replace assumptions about eight letter pages, back-cover index 9, uniform portrait timings, and the absence of all preview buttons. Iterate using page kinds and the actual page sequence. Keep the prohibition on the removed reading-toggle/footer link specific to those controls, allowing canvas reset buttons.

Acceptance:

- Coverage checks exact letter preservation on white pages, empty blue-page letter content, signature placement, and the final added pair.
- Visible text, signature, marks, and folios do not overlap at the existing viewport matrix; canvas controls work only on visible settled pages.
- Scroll restoration, rapid reversal, resize during turns, entry/exit travel, cover geometry, reduced motion, route lifecycle, themes, and print still pass.

Verification: run `test:spread`, `test:manual`, and `test:manual-visual`. Use `test:flipbook-react` if event forwarding or wrapper behavior changes; use `test:flipbook-engine` if engine patches change. Do not modify the patched engine unless a reproduced failure requires it.

Dependencies: tasks 3–4. Scope: 2–3 files.

### 6. Validate integration and update documentation

Files: existing manual plan/migration documentation where current-behavior notes need updating.

Acceptance:

- Production build, TypeScript, lint, and changed-file formatting pass, with unrelated working-tree failures identified separately.
- `test:grid` passes and the manual still hands off cleanly to the next website section.
- Documentation reflects five reading pages, five canvas pages, the new scroll schedule, inline annotations, accessibility behavior, and placeholder limits.

Verification: run the relevant project checks once after integration and visually review each spread plus portrait, print, and reduced-motion views. The working tree already contains extensive changes; avoid unrelated cleanup.

Dependencies: task 5. Scope: 1–2 documentation files.

## Main risks to resolve early

1. Combined white-page copy may overflow short screens. Prove the densest page first and preserve readable type.
2. Annotation rectangles may misalign inside transformed leaves. Test a multiline phrase before widespread markup changes.
3. New pages will overrun the existing scroll timing if thresholds are simply extended. Recalculate both layout schedules before canvas work.
4. The currently decorative, accessibility-hidden book needs visibility and focus management before it can host real controls.

Implementation follows this page map. The placeholders use DOM/SVG markers, with no saved work or network requests. The original flip engine and its patches remain unchanged.
