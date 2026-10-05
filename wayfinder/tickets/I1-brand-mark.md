---
id: I1
title: "Brand mark: the Dramas of Discrimination symbol (mark only, no lockup)"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: sumit
---

## Question

What symbol mark should Dramas of Discrimination carry — given that the current identity is type-only (`app/src/components/DodLogo.tsx` sets "Dramas / *of* / Discrimination", the *of* in Italianno script), and given the mark must read at 16px, print in one colour, and be paintable on flipchart paper?

### Context

- **Scope: the mark only.** The ARC + DoD lockup is explicitly out — ARC's existing raster mark (`app/src/components/ARCLogo.tsx`, a PNG in a bordered box) stays untouched. A full identity system is out.
- **What the mark has to mean**, quoted from the project's own design principles:
  - *Rehearsal over discussion* — change is practised, not only talked about.
  - *Enough structure to hold people together, not to direct it.*
  - *Systemic, not heroic* — the frame is systems, not individuals.
- **Anti-brief** — do not use scales of justice, gavels, raised fists, broken chains, masks, hearts, speech bubbles, chess pieces, footprints. Each encodes law-as-violation, heroism, or victimhood — frames the project argues against in its own abstract. Also: no gradients, no drop shadows, no 3D, no swooshes.
- **Non-negotiable constraints:**
  - Must read at **16px** — design at 16px first, scale up second.
  - **One colour.** Navy `#131857` on cream `#ffffee`; reversed cream on `#0e1236` for dark mode.
  - Must survive **greyscale print** and **one-colour paint**.
  - **Stroke-only**, flat or round caps.
  - Tokens live in `app/src/styles.css`.
- **Six candidate territories** — one line each on construction and meaning, so this ticket is answerable without opening the brief:

  | Territory | Construction | Meaning |
  |---|---|---|
  | **The Turn** | one stroke, one 45° kink | the moment someone steps in |
  | **Open Frame** | square with one edge interrupted | structure that doesn't direct |
  | **Chorus Arc** | three concentric arcs, one detached | audience, one voice stepped out |
  | **Two Tables** | two rules, the lower broken | the workshop's two tables |
  | **Scene Graph** | three nodes, one thread overshooting the last | the script graph; the line that doesn't end |
  | **Declaration** | four rules, the last a short bar | a period instead of a line |

  Fallback if no icon works: a **DD ligature** with a shared stem.
- **Executor:** a human designer. **Deadline:** none — explicitly *not* driven by the Nov 25 Perth talk, so nobody later mistakes this for urgent.
- **Exists today:** a typographic wordmark and no symbol. Nothing to preserve but the type.

### What resolving this decides

Which territory the brief commissions, and the constraint set it locks. It does **not** decide the artwork.

### Open questions to carry into the brief

Posed, not pre-solved:

- Does the wordmark keep the script *of*?
- Favicon — `DD` monogram, `D|D` ligature, or symbol alone?
- Must the mark contain a letterform, or is pure abstraction acceptable?
- Clearspace in cap-heights or in the mark's own stroke width?
- Is a solid variant needed for embroidery and rubber-stamping, or is one-colour stroke enough?

## Resolution

<!-- empty; MAP.md lists only closed tickets under "Decisions so far" -->