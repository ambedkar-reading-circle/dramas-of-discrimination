# Spec: Presentation Page (`/presentation`)

## Objective

Add a presentation page at `/presentation` — a slide deck, presented live in ~15 minutes to external audiences (funders, partners, prospective Facilitators), and browsable by anyone afterwards. The deck is one slide on screen at a time, with navigators to change slides, a selector to jump to any slide, and interactive elements the presenter operates while presenting.

The page is built from what the codebase already has: the manual flipbook, the workshop-method deck, rough annotations, the pencil trail, worksheet previews, and the tablet video frame. Assets we do not yet have are rendered as generic placeholders — this spec deliberately does not enumerate which assets are wanted; each placeholder carries only its role (image / video / document), and specifics are filled in as assets are procured.

## Tech Stack

- TanStack Start (React + TanStack Router), file-based routing via `createFileRoute`
- Styling: Tailwind v4 utilities over existing CSS layers (`base.css`, `theme.css`, `notebook.css`, `motion.css`) plus one local stylesheet, following the `WorkshopMethod.css` / `ManualFlipbookSection.css` pattern
- Animation: `motion` (framer-motion) with `prefers-reduced-motion` respected via `#/lib/use-media-query`
- No new dependencies

## Commands

```bash
npm run dev              # dev server on port 3000
npm run lint             # eslint
npm run build            # type-check + production build (vite)
npm run check            # prettier --check
npm test                 # unit tests
npm run generate-routes  # regenerate TanStack route tree after adding the route
```

## Route & Navigation

### Route

```tsx
// app/src/routes/presentation.tsx
import { createFileRoute } from '@tanstack/react-router'
import NotebookSurface from '#/components/NotebookSurface'
import PresentationDeck from '#/pages/presentation/PresentationDeck'

export const Route = createFileRoute('/presentation')({
  // Keep the presenter's place across refresh and deep links: /presentation?slide=7
  validateSearch: (search: Record<string, unknown>) => ({
    slide: typeof search.slide === 'number' ? search.slide : 1,
  }),
  head: () => ({
    title: 'Presentation — Dramas of Discrimination',
    meta: [{ name: 'description', content: 'The Dramas of Discrimination workshop, presented as an interactive deck.' }],
  }),
  component: Presentation,
})

function Presentation() {
  return (
    <NotebookSurface as="main" id="main-content" className="content-page" tabIndex={-1}>
      <PresentationDeck />
    </NotebookSurface>
  )
}
```

The current slide index is the single source of truth in the URL search param (`?slide=n`, 1-based). Every navigation — button, keyboard, selector — updates the search param; every load reads it. Refresh and shared links land on the same slide.

### Navbar

Add the page to `navLinks` in `app/src/components/Header.tsx`:

```ts
const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About', exact: false },
  { to: '/presentation', label: 'Intro', exact: false },
  { to: '/team', label: 'Team', exact: false },
] as const
```

The existing `NavLink` rough-bracket hover/active treatment applies automatically. No footer changes required.

## Page Architecture

```
app/src/
├── routes/
│   └── presentation.tsx
└── pages/presentation/
    ├── PresentationDeck.tsx        # shell: stage + navigators + selector + progress
    ├── SlideStage.tsx              # renders the current slide with transitions
    ├── SlideNav.tsx                # prev / next navigators
    ├── SlideIndex.tsx              # slide selector strip + expandable overview grid
    ├── SlideAssetPlaceholder.tsx   # generic placeholder for not-yet-procured assets
    ├── PresentationDeck.css        # deck layout styles (local stylesheet)
    ├── hooks/
    │   └── usePresentationDeck.ts  # index state, URL sync, keyboard, clamping
    ├── content/
    │   └── slides.tsx              # slide data: content, layout, interactive element
    └── index.ts
```

### `usePresentationDeck`

Owns all deck state; returns `{ slide, total, goTo, next, prev }`.

- Reads the initial index from `Route.useSearch()`; writes each change back via `navigate({ search: { slide } })` (replace, not push, to avoid history spam)
- Clamps to `[1, total]`; `next` on the last slide and `prev` on the first are no-ops (the closing slide ends the deck — no wrap-around)
- Keyboard, bound on the deck container:
  - `ArrowRight` / `PageDown` / `n` → next
  - `ArrowLeft` / `PageUp` / `p` → prev
  - `Home` / `End` → first / last
- Touch: horizontal swipe (> 48px, within 400ms) advances or retreats, via the pointer-event pattern from `#/lib/pencil/usePointerTrace`

### `SlideStage`

- Renders exactly one slide; siblings are unmounted so interactive embeds (flipbook, video) reset between visits
- Transition: directional slide + fade using `motion`, matching `deckChoreography.spring`; duration 0 under reduced motion
- Accessibility: container is `role="group"` with `aria-roledescription="slide"` and `aria-label="Slide x of y"`; slide changes announce via an `aria-live="polite"` visually-hidden counter; focus moves to the stage heading on slide change (keyboard users are not stranded inside the previous slide's embed)

### `SlideNav` — changing slides

- Previous / Next buttons flanking or below the stage, styled as `notebook-text` controls consistent with existing button patterns
- Buttons carry `aria-label`s; disabled state at the deck's ends
- A slide counter ("4 / 15") and a thin progress rule (`shadow-[inset_0_1px_...]` idiom) sit beside them

### `SlideIndex` — selecting a slide

- A compact numbered chip strip (01…15) below the stage, styled after `MethodIndex`'s numbered buttons in `#/pages/home/workshop-method/components/MethodIndex.tsx`. Beyond that pattern, the current chip must use `aria-current` (not `MethodIndex`'s `aria-pressed`) and roving tabindex
- An expand toggle reveals an overview grid — every slide as a small card (kicker + heading) — for direct selection; collapsing returns focus to the matching chip
- Selecting a chip or card calls `goTo` and closes the overview

### Presenter affordances

- **Fullscreen toggle** — `requestFullscreen()` on the deck container, with an exit control visible in fullscreen
- **Pencil overlay** — a toggle that mounts a `PencilSheet` canvas (from `#/lib/pencil`) over the stage, letting the presenter sketch on any slide; the stage carries `data-pencil-surface` so the canvas activates, and unmounting the overlay clears the drawing on slide change. Unavailable under reduced motion (`PencilSheet` returns null, existing behavior). Off by default

## Slide Content Model

Slides are data-driven in `content/slides.tsx`:

```ts
export type Slide = Readonly<{
  id: string
  kicker: string
  heading: string
  body: ReactNode
  interactive?: ReactNode   // existing component operated during the talk
  assets?: ReadonlyArray<AssetSlot>
  layout?: 'default' | 'split' | 'grid' | 'centered'
}>
```

`AssetSlot` is `{ role: 'image' | 'video' | 'document'; note?: string }`. When an asset exists it is rendered in its slot; when it does not, the slot renders `SlideAssetPlaceholder`.

### Placeholder convention

`SlideAssetPlaceholder` renders a framed, paper-tear-styled box at the slot's aspect ratio containing only the role ("Image", "Video", "Document") — visually intentional, not broken. This spec intentionally does not name specific hoped-for assets; procurement notes, if any, live beside the slot in the slide data and nowhere else. Placeholders are swapped for real assets by adding files and updating the slide's slot — no layout change.

### Assets we already have

- 25 manual page scans: `docs/Manual Pages/ARC_DoD_Manual_Page-0..24.jpg` (feed the flipbook embed)
- Worksheet sheets: `/DD_ARC_WS_Sheet1.jpg` (Actor map) and `/DD_ARC_WS_Sheet2.jpg` (Play script) in `app/public/`
- Workshop video: the existing YouTube embed (`youtube-nocookie.com/embed/_H9tByQyBv8`)

## Slide Inventory (15 slides)

| # | Slide | Content | Interactive element (existing) |
|---|-------|---------|-------------------------------|
| 01 | Title | "Dramas of Discrimination", subtitle, Boal attribution | Rough-notation brackets drawn on load (`useRoughAnnotation`), `rise-in` |
| 02 | The collective | ARC, Cubbon Park, Bangalore, 2023; sibling circles | Placeholder image slot |
| 03 | What ARC does | Lectures & talks, film screenings, workshops, panel discussions | Four cards; each reveals a line of detail on click |
| 04 | The objective | Why the Workshop exists: rehearse responses, name caste in workplaces, build a rehearsal platform | Bullets emphasised with rough annotation, revealed one by one |
| 05 | What it measures | Articulation capacity; intervention capacity | Two cards, flip open on click |
| 06 | The Workshop in five acts | Intro Time → Part-Time A/B → Story Time → Playtime → Overtime | Embedded `WorkshopMethod` deck — presenter fans the ActivitySheets and opens each via `MethodIndex` |
| 07 | The manual | The printed manual groups follow | Embedded `ManualBook` flipbook — presenter turns pages live (text fallback under reduced motion) |
| 08 | The two tables | The Scenario staged twice: the Actor map (actors, Ideal behaviours, Failures) and the Play script (Dialogues tagged to Failures) | `WorksheetGallery`-style previews linking the full sheets |
| 09 | Scenarios & interventions | Scenario / intervention pairs (peer groups, schools & villages, workplaces, neighbours, media) | Grid; each pair reveals its intervention on click |
| 10 | Rehearsal in action | Groups mid-workshop | Embedded tablet video frame (`TabletVideoSection` embed); placeholder video slot if another clip is procured |
| 11 | What groups say | Verbatim feedback | Quote cards revealed one by one |
| 12 | One method, two modes | Local mode — everything in one browser, nothing leaves the device; Cloud mode — Facilitator, Join codes, Groups, sync | Mode toggle switcher demonstrating the difference |
| 13 | From Rehearsal to manifesto | Sign-off → Submission → Generate → manifesto draft | Stepper advanced by click, one stage at a time |
| 14 | Principles | Six step-numbered cards, matching `AboutPrinciples` | Cards with hover/focus states |
| 15 | Closing | "Jai Bhim", contact | Placeholder slot for contact/QR artwork |

Domain language follows `CONTEXT.md` throughout: Workshop, Rehearsal, Group, Community, Facilitator, Member, Actor map, Play script, Scenario, Failure, Sign-off, Generate.

## CSS

Reuse existing classes: `notebook-section`, `notebook-stack`, `page-wrap`, `eyebrow`, `caption`, `step-number`, `section-lede`, `paper-tear`, `worksheet-preview`, `rise-in`, `fade-in`, tone variants on `NotebookSurface`. New styles live only in `PresentationDeck.css`: stage sizing (slide fits the viewport between header and controls), chip strip, overview grid, placeholder box, fullscreen state. All colors and spacing come from theme custom properties — no hardcoded values.

## Accessibility

- Heading hierarchy: one `h1` on slide 01; each slide renders an `h2`; interactive embeds keep their internal headings at `h3+`
- All interactive elements are keyboard-operable with visible focus; Escape closes the overview grid; the deck container keeps focus management as described under `SlideStage`
- Reduced motion: transitions become instant; the flipbook falls back to reading mode (existing behavior)
- Every real image has descriptive alt text; placeholders are `aria-hidden` decoration with a text label

## Testing

- `npm run lint`, `npm run build`, `npm run check`, `npm test` all pass
- Manual pass on `/presentation`:
  - Slide changes via buttons, keyboard, swipe, chip strip, and overview grid
  - `?slide=` survives refresh and deep links; out-of-range values clamp
  - Fullscreen enter/exit; pencil overlay draws and clears on slide change
  - Interactive embeds (method deck, flipbook, video) operate and reset between slides
  - Viewports 375px, 768px, 1440px; keyboard-only walkthrough; reduced-motion check

## Boundaries

| Tier | Rules |
|------|-------|
| **Always** | Reuse existing components for interactive elements; drive deck state from the URL search param; render missing assets as `SlideAssetPlaceholder`; follow `NotebookSurface` / theme-variable conventions; respect reduced motion |
| **Ask first** | New dependencies; changes to `Header.tsx` beyond the navLinks entry; modifying shared components (`WorkshopMethod`, `ManualBook`, `NotebookSurface`); new CSS custom properties |
| **Never** | Hardcode colors/spacing; enumerate or commit hoped-for assets speculatively; duplicate `/about` content — link to it instead; push navigation history per slide change |

## Success Criteria

- [ ] `/presentation` renders from the navbar link labeled "Intro"
- [ ] One slide visible at a time; prev/next navigators, keyboard, and swipe change slides
- [ ] Numbered selector strip and overview grid jump to any slide
- [ ] Slide index lives in `?slide=` and survives refresh
- [ ] 15 slides in order, each with its interactive element working
- [ ] Existing embeds (method deck, flipbook, worksheet previews, video) operate inside slides
- [ ] Unprocured assets render as role-labeled placeholders, unnamed in this spec
- [ ] Fullscreen toggle and pencil overlay work; pencil clears on slide change
- [ ] Keyboard-only walkthrough, focus management, and live announcements work
- [ ] Responsive at 375px / 768px / 1440px; reduced motion honored
- [ ] `lint`, `build`, `check`, and `test` pass

## Implementation Steps

1. Add the route (`app/src/routes/presentation.tsx`), run `npm run generate-routes`, add the navbar entry in `Header.tsx`
2. Build `usePresentationDeck` (state, URL sync, keyboard) and the shell — `PresentationDeck`, `SlideStage`, `SlideNav`, `SlideIndex`, `PresentationDeck.css`
3. Add `SlideAssetPlaceholder` and the slide content model with slides 01–15 as skeleton content
4. Wire interactive elements slide by slide: title (01), reveal cards (03–05, 09, 11, 13), mode toggle (12), then the embeds (06, 07, 08, 10)
5. Add fullscreen toggle and pencil overlay
6. Verify against the testing section; fix; done
