# SOLID refactoring plan for the uncommitted public-page redesign

Date: 2026-10-06

## Implementation status

Completed all six core tasks on 2026-10-06. Optional follow-ups remain deferred.

- [x] Record the visual and behavioral baseline.
- [x] Extract the worksheet collection into `features/home/worksheets.ts` and `WorksheetGallery.tsx`.
- [x] Extract `WorkshopMethod.tsx`, including its process-step content.
- [x] Extract `HomeHero.tsx` and the three editorial sections in `HomeStorySections.tsx`; keep route registration, the main landmark, and page ordering in `routes/index.tsx`.
- [x] Move theme and base styles to `styles/theme.css` and `styles/base.css`.
- [x] Move shared, page-specific, and motion styles to their owners, retaining `styles.css` as the central import entry point.

### Verification results

- Type checking, ESLint, production build, formatting checks on refactored files, and `git diff --check` pass.
- Compared the original and refactored production pages in headless Chrome across **80 cases**: two routes, ten widths (320, 480, 481, 700, 701, 768, 1000, 1001, 1024, and 1440), and four combinations of theme mode and system preference. Element structure, copy, link destinations, accessible labels, geometry, and sampled computed styles match exactly. No horizontal overflow or browser errors were observed.
- **24 full-page screenshot comparisons** pass at 320, 768, and 1440 pixels. Comparison excludes antialiasing noise and permits at most ten isolated differing pixels; it does not permit layout shifts. Desktop and mobile output were also visually inspected.
- Verified skip-link focus, the method anchor below the sticky header, active navigation, one H1 per route, four process steps, worksheet image responses, and reduced-motion behavior.
- Confirmed development navigation and persisted explicit light/dark modes after reload. Production CSS still follows the system theme with JavaScript disabled.
- Compared all **161 selector/context declaration sequences** with the original stylesheet; all are preserved. The initial theme/base-only split produced byte-identical production CSS. The final style ownership split adds approximately 0.20 kB of uncompressed CSS from separated rule groups.
- Verified a temporary third worksheet record renders its own link, image, caption, and accessible name without changing the renderer. The source collection remains two worksheets.
- Independent implementation review found no actionable issues.

Browser tooling and screenshots were kept outside the repository. No dependencies, test framework, application behavior, or public assets were added or changed by this refactor. Browser verification used Chrome; other browser engines were not tested.

## Scope and baseline

Reviewed the working tree against HEAD `faf591dba02dbe9162b84ed2710a56b41fff329e`: eight modified source files, the new `WorkshopIllustration.tsx`, and references to the untracked public assets. There are no staged changes. The principal changes are the home/about pages and shared presentation styles.

Preserve current copy, appearance, routes, section order, asset URLs, keyboard behavior, and light/dark/auto behavior. This is a structural refactor, not a redesign or a content-platform migration. Keep the current TanStack Router architecture. The public-content storage decision remains open in `wayfinder/tickets/A2-content-model.md`; this plan does not resolve it.

Type checking (`tsc --noEmit`) and `npm run lint` pass on the current working tree. No test script or existing test files were found. A production build and browser verification were not run for this planning review.

## Review findings

### Standards

No documented coding-standard violations were identified. These are architectural judgments:

- **Repeated worksheet markup:** `app/src/routes/index.tsx:97` and `:123` duplicate image, link, accessible label, and caption structure. This is the clearest extraction opportunity.
- **Mixed page responsibilities:** `app/src/routes/index.tsx:40` combines hero, workshop method, worksheets, rationale, evidence, and CTA. The file is 220 lines; coherent sections offer better change boundaries.
- **Mixed style ownership:** `app/src/styles.css` is 839 lines, containing theme tokens, resets, shared components, both pages, and interleaved responsive rules. Its size is a symptom; unrelated reasons to edit it are the underlying issue.
- **Duplicated theme values:** explicit dark tokens at `app/src/styles.css:56` are repeated for system-dark mode at `:87`. This pattern predates the redesign, which adds more repeated tokens.
- **Optional About extraction:** chapters at `app/src/routes/about.tsx:22` and `:37`, and principles at `:61`, repeat structures. At 91 lines, this page does not need wholesale decomposition.

Five opportunities; the largest maintenance concern is CSS ownership. Header, footer, logos, and the new illustration already have useful, narrow responsibilities.

### Spec

No originating specification for this redesign was found, so a formal spec-compliance review was skipped. The README and brand brief supply project context, not acceptance criteria for this diff. Preserve the current working-tree behavior as the refactoring baseline. Do not treat broader, unfinished product requirements as refactoring defects.

## Applying SOLID proportionately

| Principle | Application here |
| --- | --- |
| Single responsibility | Separate page composition, worksheet rendering, and style ownership. |
| Open/closed | Add worksheets through a typed collection without editing repeated markup. Keep the existing mapped process steps and locations. |
| Liskov substitution | No inheritance or demonstrated substitutability defect exists. Preserve native element semantics and existing component contracts during extraction. |
| Interface segregation | Give each extracted component only its own data. Avoid a universal section/card interface with unrelated flags or a whole-page content object. |
| Dependency inversion | No clear violation in the changed static UI. A later theme refactor can isolate browser effects behind a narrow hook contract if theme complexity grows. |

Prefer React composition, small functions, and local types. Do not add base classes, repositories, dependency-injection containers, a page-schema engine, or a CMS for this work.

## Ordered implementation tasks

### 1. Record the visual and behavioral baseline

**Scope:** Small; no application edits. **Dependencies:** None.

- Capture home and about at mobile, tablet, and desktop widths, including both sides of the existing 480px, 700px, and 1000px breakpoints where layout changes.
- Check explicit light/dark and auto mode, navigation active states, skip-to-content, the method anchor, worksheet links, keyboard focus, and reduced motion.

**Acceptance/verification:** Save reference screenshots and a short behavior checklist. Run the existing build and record any baseline failure before refactoring. Use these references at subsequent checkpoints; do not add snapshots of incidental component structure.

### 2. Extract the worksheet collection

**Scope:** Medium, about three files. **Dependencies:** Task 1.

**Likely files:** `app/src/routes/index.tsx`, new `app/src/features/home/WorksheetGallery.tsx`, and new `app/src/features/home/worksheets.ts`.

- Define a local readonly `Worksheet` shape containing an ID, displayed label, title, description, image URL, and intrinsic width/height.
- Keep a small `WorksheetCard` renderer in the gallery module and map the two records. Use one URL for the current preview/full-size destination; derive the accessible link name from the title.
- Preserve figure/caption semantics, empty decorative image alt text within the named link, lazy loading, dimensions, and class names.

**Acceptance/verification:** Both existing sheets render and open correctly. A temporary third record requires no renderer change; remove the temporary record after checking. Compare the gallery against the baseline and run type checking/linting.

### 3. Extract the cohesive workshop-method section

**Scope:** Small, two files. **Dependencies:** Task 2.

**Likely files:** `app/src/routes/index.tsx` and new `app/src/features/home/WorkshopMethod.tsx`.

- Move method heading, process-step data, ordered-list rendering, and gallery composition together.
- Let the route retain registration, the main landmark, and section ordering. Keep `id="workshop-method"` on the same section.

**Acceptance/verification:** The hero anchor still reaches the method section below the sticky header; steps retain their order and list semantics. Type checking/linting pass.

### 4. Separate the remaining home-page sections

**Scope:** Medium, three to four files. **Dependencies:** Task 3.

**Likely files:** `app/src/routes/index.tsx`, new `app/src/features/home/HomeHero.tsx`, and new `app/src/features/home/HomeStorySections.tsx`.

- Extract `HomeHero` and named rationale, workshop-evidence, and CTA components. Related small editorial sections may share one module.
- Keep static content next to its owning component. Keep the existing logo and illustration components intact.
- The route should make the page sequence easy to read without introducing configurable section registries or prop plumbing for fixed copy.

**Acceptance/verification:** Preserve one H1, the heading hierarchy, all links, and the single focusable `main` landmark. Check both routes to catch shared-component regressions.

**Checkpoint after Tasks 2–4:** Type checking, linting, production build, and home-page visual/keyboard checks pass.

### 5. Separate theme and base styles

**Scope:** Medium, three files. **Dependencies:** Task 4.

**Likely files:** `app/src/styles.css`, new `app/src/styles/theme.css`, and new `app/src/styles/base.css`.

- Keep `styles.css` as the stylesheet entry point. Move palette/theme definitions and base rules into clearly owned files.
- Preserve Tailwind directives, CSS layer membership, import order, and media-query behavior. Make this a mechanical move before considering token renaming or deduplication.
- Preserve the existing CSS fallback for system dark mode before React effects run.

**Acceptance/verification:** Computed colors, typography, focus outlines, and reduced-motion behavior match the baseline in all theme modes. Verify emitted production CSS as well as the development page.

### 6. Separate component and page styles

**Scope:** Medium, four to five files. **Dependencies:** Task 5.

**Likely files:** `app/src/styles.css`, new `app/src/styles/shared.css`, new `app/src/features/home/home.css`, and new `app/src/features/about/about.css`; a small motion stylesheet only if needed.

- Put header/footer, branding, buttons, and shared layout primitives in shared styles. Put home sections, worksheets, and illustration styling with home; put chapters/principles with about.
- Move each responsive rule with its owner. Split grouped selectors spanning owners carefully so the same declarations still apply.
- Keep stable class names and current layer order. Continue importing through the central stylesheet initially, avoiding route-dependent global-style loading changes.

**Acceptance/verification:** Both routes match the baseline at the existing breakpoints and in all themes. The illustration mask still loads, the wordmark fits, and no horizontal overflow appears.

**Final core checkpoint:** Type checking, linting, build, reference screenshots, navigation, anchors, worksheet loading, keyboard focus, and reduced motion all pass. Formatting changes remain limited to touched files.

## Optional follow-ups, outside the core refactor

- **About repetition:** If this content will grow, add a narrow `AboutChapter` component with an explicit layout variant, and render principles from local data. Preserve DOM reading order when reversing visual columns. Do not unify these with worksheet cards merely because both contain a title and body.
- **Theme logic:** Only the toggle's class name changed in this diff. A separate refactor could introduce pure mode-resolution/cycling functions and a `useThemeMode` hook returning `{ mode, cycleMode }`, isolating storage, media subscriptions, and DOM updates. Add focused behavior tests for stored values, mode cycling, auto-mode system changes, explicit overrides, and subscription cleanup if undertaking this logic change.
- **Theme palette deduplication:** Retain the pre-React system-theme fallback. Choose a consolidation approach only after proving explicit-light-on-dark-system and explicit-dark-on-light-system behavior; do not simply delete the media-query palette and rely on a mount effect.
- **Asset inventory:** Some new assets are not explicitly referenced by source. Treat them as unverified additions, not automatically unused files; browsers can discover some icons by convention. Asset deletion or favicon integration is separate work.

## Principal risks

The main risk is a CSS cascade change during file movement. Keep selectors and layers stable and compare both routes after every stylesheet split. The next risk is losing accessible semantics while extracting markup; preserve the current landmarks, headings, labels, and native link behavior. Keep content decisions and future workshop/application architecture outside this refactor.
