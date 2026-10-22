# Notebook layout grid

The notebook ruling is a layout contract: content can grow, but the next block
must still start on a row boundary. The origin is the top of `main`. Section
boundaries use whole rows; text baselines sit half a row after each boundary.
Horizontal content edges come from `.page-wrap`; column layouts share
`--notebook-gutter`.

## Shared primitives

`app/src/styles/notebook.css` owns the layout vocabulary. Component utilities
own appearance, column proportions, and content-specific dimensions.

| Class                        | Contract                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `.notebook-section`          | Shared responsive vertical padding; contains child margins. Can also be a grid or flex layout.                          |
| `.notebook-section--compact` | Two rows of padding at each edge.                                                                                       |
| `.notebook-stack`            | Content-sized grid rows, one notebook row between children, no child block margins.                                     |
| `.notebook-text`             | Baseline correction for standalone labels. Paragraphs, headings, eyebrows, and step numbers receive this automatically. |
| `.notebook-frame`            | Rounds a known content height plus padding up to whole rows. Keeps spare space below the content.                       |

Typical composition:

```html
<section class="notebook-section page-wrap">
  <div class="notebook-stack">
    <h2>A heading that can wrap</h2>
    <p>Copy that can grow by as many lines as it needs.</p>
  </div>
</section>
```

Set `--notebook-stack-gap` to a whole-row length to vary stack spacing. Use
`--notebook-frame-content-height` for a known media height, such as available
width divided by its aspect ratio, and `--notebook-frame-padding` for padding
(default zero). See `.worksheet-preview` for an example. Its containing
`.worksheet` establishes the inline-size container used by `cqi`.

Frames are for calculable media, not arbitrary text: CSS `round()` cannot round
`auto`. Text grows naturally through whole-row line heights. A new embed with
unknown intrinsic dimensions needs an explicit sizing contract before it can
participate in the ruled flow.

The manual's printed page faces form an independent typesetting surface, marked
with `data-notebook-independent` on the book frame. The grid audit excludes those
descendants and non-rendered print copies. Its containing section still has a
row-aligned height, and the reflowing reading view still uses the notebook grid.

## Style ownership

Styles live where they are used, with four rules applied in order:

1. **Tokens, themes, base element styles** → `styles/theme.css`,
   `styles/base.css`.
2. **Layout-contract primitives and reusable compounds** (used by two or more
   components, or referenced by central rules) → `styles/notebook.css` /
   `styles/shared.css`: `.site-shell`, `.page-wrap`, `.eyebrow`,
   `.step-number`, `.section-lede`, `.paper-tear*`, `.skip-link`,
   `.printed-ink`, `.action-link*`, `.site-footer`, `.notebook-*`,
   `.argument-band`, `.landing-page`, `.content-page`.
3. **Single-component styles expressible as utilities** → Tailwind classes in
   the component's JSX.
4. **Single-component styles not expressible as utilities** (root-state
   selectors such as `:root[data-theme] .circle`, complex pseudo-element and
   mask stacks, multi-layer background recipes, print/forced-colors overrides)
   → a co-located `ComponentName.css` imported by that component.
   `components/ThemeToggle.css` is the current example.

Never convert rule-2 classes to utilities: notebook.css's
`:where(p, h1, …, .eyebrow, .step-number)` baseline selector treats them as the
shared vocabulary. Keep these class names emitted in JSX next to utilities when
central rules key off them: `argument-band`, `worksheet-preview`,
`landing-page`, `content-page`, `paper-tear`, `printed-ink`, all `notebook-*`,
`eyebrow`, `step-number`, plus the grid-test and dev-overlay hooks
(`hero-section`, `hero-copy`, `hero-wordmark`, `hero-thesis`, `hero-actions`,
`worksheet`, `workshop-illustration`, `about-hero`, `dod-logo-first`,
`dod-logo-last`).

### Utility conventions

- Breakpoints mirror the notebook media queries exactly, defined once in
  `theme.css`'s `@theme`: `sm`/`max-sm` = ≥481/≤480px, `md`/`max-md` =
  ≥701/≤700px, `lg`/`max-lg` = ≥1001/≤1000px.
- Vertical spacing only through whole-row tokens (`gap-row`, `py-section`,
  `gap-gutter`) or exact arbitrary values (`pt-[calc(2*var(--notebook-row))]`);
  never convenience spacing such as `p-2`, which breaks the row contract.
- Prefer color token utilities (`text-ink`, `text-ink-soft`, `bg-hl-bg`,
  `text-hl-text`, `bg-link-bg-hover`, `text-stage-red`, `bg-surface-warm`).
  They reference theme custom properties, so dark mode keeps flipping without
  any `dark:` variant.
- Use the v4 var shorthand for other custom properties: `bg-(--surface-warm)`,
  `leading-(--notebook-row)`, `shadow-(--sheet-shadow)`.
- In arbitrary values, underscores stand for required CSS spaces
  (`calc(100svh_-_2*var(--notebook-row))`); `*` and `/` need no spaces.
- Two utilities setting the same property resolve by stylesheet order, not by
  class-string order. Make stateful colors conditional
  (`active ? 'text-ink' : 'text-ink-soft'`) instead of stacking both.

### CSS import order

`main.tsx` imports `./styles.css` before the router. Component CSS imports
(such as `ThemeToggle.css`) reopen `@layer components`, so Tailwind's entry
must establish the layer order (`theme, base, components, utilities`) first.
If a component stylesheet loads before it, the layers reorder and the ruled
layout collapses.

## Tokens and typography

| Token                      | Meaning                                              |
| -------------------------- | ---------------------------------------------------- |
| `--notebook-row`           | `1.75rem` through 700px; `2rem` above 700px          |
| `--notebook-baseline`      | Half a row from the grid origin                      |
| `--notebook-rule-width`    | One CSS pixel                                        |
| `--notebook-rule-color`    | Theme-aware rule color; overridden on inverse paper  |
| `--notebook-gutter`        | One row; two rows above 1000px                       |
| `--notebook-section-space` | Two, three, or four rows at the existing breakpoints |
| `--notebook-font-body`     | Handlee baseline correction: `0.27em`                |
| `--notebook-font-title`    | Fredericka the Great baseline correction: `0.36em`   |
| `--notebook-font-mono`     | Cascadia Mono baseline correction: `0.34375em`       |

Body text advances one row per line. Section headings advance two rows; the
desktop About title uses three. Font size and line height are separate choices.
The wordmark rounds its line height up to whole rows; its decorative Italianno
“of” does not determine the surrounding layout.

Text uses relative positioning by
`0.5lh - row + baseline - font-baseline`. This moves the ink without changing
its allocated line boxes. Metrics are calibrated against the current fonts,
including enlarged text. A font change must update its token and pass the
baseline checks. Set `--font-baseline` to the appropriate font token when a
text role changes family, as the identity label does.

Never nest corrected text classes or offset a parent containing multiple grid
blocks. Both would shift already-corrected children. Header labels are centered
inside unruled controls and are exempt from ink alignment.

## Growth and section boundaries

All participating boxes must begin on a row boundary and occupy whole rows,
including vertical padding and gaps. A 91px image in a 32px grid reserves 96px;
a 105px image reserves 128px. Neighbours move by whole rows as content grows.

- Use stacks for prose groups instead of accumulating paragraph margins.
- Use whole-row vertical spacing. Fractional rows inside controls are only safe
  if the complete allocation and text placement still satisfy the contract.
- Start-align columns. The tallest column determines a whole-row section height.
- Paint separators with inset shadows or outlines; borders can add stray pixels.
- Keep decoration outside normal flow. Do not clip text to enforce a row count.
- Preserve image aspect ratios and width/height attributes during lazy loading.

The hero stays in normal flow. Its minimum height rounds approximately one
viewport, less a two-row desktop or four-row mobile header allowance, UP to
whole rows. This allowance is intentionally approximate: header size is
independent of the sheet. Longer content expands the hero. Its automatic spacer
is a whole-row remainder because both the minimum height and the content's total
allocation are whole rows. No parent flexible track can leave a fractional-row
gap after the hero.

Main never stretches to fill spare viewport space. The footer absorbs spare
space on short pages. The inverse band paints its own ruling from a top boundary
that already aligns with the main sheet.

## Development overlay

Open either route with `?notebook-grid` while running the development server.
The overlay outlines checked blocks in green, marks drifting blocks in red,
and reports the first failure. It watches resizing, font loading, content
changes, and route transitions. Reload without the parameter to remove it.

The overlay checks block geometry; the browser test also checks text baselines.
The diagnostic module and its CSS are excluded from production builds. There is
no production runtime measurement or JavaScript layout correction.

## Verification

From `app`:

```sh
npx playwright install chromium
npm run test:grid
npm run build
npx tsc --noEmit
npm run lint
```

For an already installed Chrome, set `PLAYWRIGHT_CHANNEL=chrome` instead of
installing Chromium (PowerShell: `$env:PLAYWRIGHT_CHANNEL = 'chrome'`). Tests
start and stop their own local server. The normal font-baseline checks require
access to Google Fonts; a separate test intentionally blocks those fonts and
checks that fallback preserves block geometry.

The suite checks both routes at 320, 480, 700, 701, 768, 913, 1000, 1024, and
1440px. It verifies block starts/heights and text baselines within one CSS pixel,
then grows headings, paragraphs, button labels, and media frames at three widths
and repeats with 200% text. It checks light/dark themes, forced colors, print
ruling removal, lazy image loading, unavailable Google fonts, horizontal overflow,
hero clipping, and the overlay's ability to detect and recover from injected drift.
Temporary baseline markers are removed immediately after measurement.

Also inspect screenshots when changing layout or typography. Keep content
readable at enlarged sizes; font fallback may change ink placement but must not
break the whole-row allocation. Print and forced-color modes remove decorative
ruling; reduced motion disables entrance animation.
