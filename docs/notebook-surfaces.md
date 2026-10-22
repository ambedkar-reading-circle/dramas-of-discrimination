# Notebook surfaces

`NotebookSurface` opts a page or component into notebook paper. A surface paints
its opaque themed paper and blue ruling, then its moving red margin and words,
then its content. Each surface clips only its decoration; content, shadows, and
animated descendants can overflow. Adjacent surfaces follow the same pointer.

## Usage

Place one `NotebookProvider` around the application. It adds no wrapper element
and owns the pointer listeners and animation-frame batching. `NotebookSurface`
accepts normal HTML attributes, children, styles, and refs for its selected tag.

```tsx
import NotebookSurface from './components/NotebookSurface'
import { NotebookProvider } from './components/NotebookMargins'

<NotebookProvider>
  <NotebookSurface as="main" id="main-content" tabIndex={-1}>
    <h1>Page content</h1>
    <NotebookSurface as="section" tone="inverse">
      <h2>A contrasting notebook sheet</h2>
    </NotebookSurface>
    <NotebookSurface paper="plain" className="rounded-lg p-row">
      This opaque card covers the underlying ruling and margin.
    </NotebookSurface>
  </NotebookSurface>
</NotebookProvider>
```

Defaults: `as="div"`, `tone="default"`, `paper="notebook"`. Supported tags are
`div`, `main`, and `section`. Use `tone="inverse"` for contrasting paper and ink.
Use `paper="plain"` for paper without ruling, crosshair, or margin words. A
default-tone surface nested inside an inverse surface restores default paper.

Surfaces do not add padding, gaps, or layout wrappers. Apply existing notebook
layout classes as needed. A plain surface does not require the provider on its
own; notebook surfaces do.

## Overlapping sheets

Raise the **surface root** when overlapping siblings need an explicit order:

```tsx
<div className="relative">
  <NotebookSurface className="relative z-0">Lower sheet</NotebookSurface>
  <NotebookSurface paper="plain" className="absolute inset-x-row top-row z-10">
    Higher, clean sheet
  </NotebookSurface>
</div>
```

Every surface is an isolated stacking context. Raising a child cannot lift it
above another surface that paints later. Raising a transparent element also
does not hide the paper behind it; choose plain opaque paper when needed.
Header and footer use `--layer-site-foreground: 50` through `site-foreground`.
Keep ordinary sheet elevations below that level.

## Clipping and pointer behavior

The absolutely positioned decoration layer inherits the host's corner radii
and uses `clip-path: border-box`. This is the rounded equivalent of an
`inset(0)` clip: [CSS geometry-box clipping follows border radii](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path).
Only that layer is clipped. Its fixed crosshair and words retain viewport
coordinates as the document scrolls, including while a sheet is sticky.

Keep surface hosts and their ancestors free of transforms, perspective,
filters, or containment that establishes a fixed-position containing block.
Put animation and 3D effects on **content descendants**, as the manual does.
Rotated/scaled notebook sheets need a separate coordinate strategy and are not
supported by this component.

All surfaces draw the same words at the viewport edges, not at component edges.
Their clipping and opaque paper produce one visible pair. A component that
does not reach a viewport edge will not show the words at that edge. Labels can
be clipped at sheet boundaries just like the lines they belong to.

Pointer movement over the header, footer, or plain content still updates exposed
notebook paper elsewhere. Leaving the document or blurring the window hides the
decoration. Moving again restores it. Margin words change on vertical pointer
movement; horizontal movement and scrolling preserve the current word.
Decoration never intercepts input and is hidden from assistive technology.
Print and forced-colors modes suppress ruling, margins, and words.

## Manual integration and verification

The animated manual's outer section is a transparent scroll runway; only its
sticky stage is a notebook surface. Reading and failure fallbacks use the outer
section as the single inverse surface. Do not add paper to both wrappers.

Run `npm run test:notebook-layers` for rendered overlap and clipping checks,
`npm run test:grid` for notebook geometry, and `npm run test:manual` plus
`npm run test:manual-visual` for booklet behavior. Set `PLAYWRIGHT_CHANNEL=msedge`
when using installed Edge rather than Playwright's downloaded Chromium.
