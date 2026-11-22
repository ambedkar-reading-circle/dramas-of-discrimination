# App folder architecture

This document is the single source of truth for where code lives in `app/src`.
It codifies conventions that already exist in this codebase (the exemplars
below) so that new code and refactors move in one direction. Out of scope:
`app/scripts/`, `wayfinder/`, and generated files such as `routeTree.gen.ts`.

## The homes — exactly one per kind of code

| Kind of code                                   | Home                             | Exemplar                                         |
| ---------------------------------------------- | -------------------------------- | ------------------------------------------------ |
| Route wiring                                   | `src/routes/<route>.tsx`         | `routes/index.tsx`                               |
| Page-scoped feature (multi-file)               | `src/pages/<page>/<feature>/`    | `pages/home/manual-flipbook/`                    |
| Page-scoped single-file section                | `src/pages/<page>/<Section>.tsx` | `pages/home/HomeHero.tsx`                        |
| Copy shared across one page's sections         | `src/pages/<page>/content/`      | `pages/home/content/`                            |
| Cross-page shareable behavior module           | `src/lib/<feature>/`             | `lib/rough-notation/`, `lib/notebook-align/`     |
| App-shell single-file presentational component | `src/components/<Component>.tsx` | `components/Header.tsx`, `components/Footer.tsx` |
| App-shell component that owns private subfiles | `src/components/<Component>/`    | `components/ThemeToggle/`                        |
| Global styles                                  | `src/styles/`                    | `styles/theme.css`                               |
| Dev-only tooling (loaded behind a query flag)  | `src/dev/`                       | `dev/notebook-debug.ts`                          |

### `lib/<feature>/` — cross-page behavior modules

A lib feature is a behavior module: typically a hook, an engine or model, its
types, co-located tests, and an `index.ts` barrel that publishes the public
contract. Everything except the barrel is internal. Existing exemplars:
`lib/rough-notation/` (engine + hook + model), `lib/notebook-align/`
(alignment engine + hook + co-located test), `lib/pencil/` (pointer-trace
hook + canvas renderer), `lib/parse-color/`, `lib/use-media-query/`.

### `pages/<page>/<feature>/` — page-scoped features

A page feature may contain any of these subfolders, created only when needed:
`components/`, `hooks/`, `engine/`, `content/`, `context/`, `types/`, plus an
`index.ts` barrel. Exemplar: `pages/home/manual-flipbook/` and
`pages/home/workshop-method/`.

### `components/` — app-shell presentation

Single-file presentational components only (the Header / Footer / ThemeToggle
pattern). A folder appears here only when a component owns private subfiles
(e.g. `ThemeToggle/` owns its stylesheet and hook); the folder gets an
`index.ts` barrel so the `#/components/<Component>` import stays stable. Hooks
do not live loose in `components/` — a hook either belongs to the component
that consumes it (as a private subfile) or to `lib/<feature>/`.

### `content/` — all copy and text

User-facing copy, labels, and data describing real-world things live in a
`content/` folder — either the feature's (`pages/<page>/<feature>/content/`)
or the page's shared one (`pages/<page>/content/`). No inline prose constants
in component files.

### Tests — always co-located

`*.test.ts` files sit next to the module they test and run with
`node --test` (aggregate: `npm test`). A module that moves takes its tests
with it.

## The global-vs-local decision rule

A behavior module goes to `lib/` only when it is:

- consumed by two or more routes, or
- mounted in `routes/__root.tsx` (used on every route).

Otherwise it stays page-scoped. When in doubt, keep it local: promotion is a
cheap follow-up (move the folder, point consumers at the new barrel) once a
second consumer actually appears.

## Import rules

1. Cross-module imports use the `#/` alias and address the barrel:
   `import { PencilSheet } from '#/lib/pencil'`.
2. Inside a module, use relative imports (`./types.ts`).
3. Deep imports that cross a module boundary (e.g.
   `#/lib/rough-notation/useRoughAnnotation`) are forbidden — extend the
   barrel instead.
4. Exception: dynamic imports created for code splitting may target a deep
   file, because routing them through the barrel would pull the split payload
   into the eager chunk. Precedent: `pages/home/manual-flipbook/ManualBook`
   (see the comment in that feature's `index.ts`).

## SOLID mapping

- **Single responsibility** — one folder, one reason to change. The
  `engine/` vs `components/` vs `content/` split inside a feature separates
  computation, presentation, and copy so each can change independently.
- **Open/closed** — grow the app by adding feature modules, not by editing
  lib internals. New annotation styles extend `rough-notation` usage, not its
  render loop.
- **Liskov substitution** — the barrel publishes the contract (exported
  functions and types); any internal rewrite that honors the contract is
  invisible to consumers.
- **Interface segregation** — barrels stay narrow: export only what consumers
  need (`rough-notation` exports `annotate`, the hook, and types — not its
  render internals).
- **Dependency inversion** — consumers depend on the stable barrel seam via
  the `#/` alias, not on concrete file paths. Internals can reorganize
  freely without consumer churn; that seam is what makes pure-move refactors
  possible.

## Known deviations

- `ManualFlipbookSection.tsx` deep-imports `manual-flipbook/ManualBook` via
  `lazy()` — the sanctioned code-splitting exception (rule 4 above).
- `WorksheetGallery.tsx` and `WorkshopRationale.tsx` currently have no
  importers. They are kept compiling and their content data lives in
  `pages/home/content/`; deleting or rewiring them is a product decision,
  not an architecture one.
