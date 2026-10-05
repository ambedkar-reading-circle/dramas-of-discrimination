# Plan — Dramas of Discrimination mark: a wayfinder ticket

## Decision

**Ticket it, in the repo.** The tracker's destination is "a buildable, opinionated design spec for the web app" whose public surface includes a masthead and a favicon — a mark is a real input to that, and the artifact ships in this repo. It should be versioned with it.

```
wayfinder/tickets/I1-brand-mark.md      ← the ticket
wayfinder/brand-mark-brief.md           ← the brief it points at
```

`wayfinder/` already holds one non-ticket artifact (`MAP.md`), so a second is a new file, not a new convention. The brief is inlined self-contained — it must not depend on the wiki, so the repo copy is readable on its own.

**Dropped:** the wiki plan. No new page, no `index.md` entry, no `log.md` entry. The DoD context the brief needs gets inlined instead of wikilinked.

---

## Placement decisions

### ID: `I1` — new letter, not a free slot in an existing one

The letters are *areas*, not a queue. H2/H3, D4, E4, F2, G3, A3 are all reserved by the "Not yet specified" fog, so the next genuinely free ID is a new letter. `I` also avoids a semantic collision: **"identity" in this tracker already means auth identity** (B1, and the A3 compute decomposition). A brand mark is not that, and reusing the word would be a small, permanent source of confusion.

### Type: `grilling` — not `prototype`

MAP.md says to reach for `/prototype` "when *how should it look/behave* is the question," which is close. But all 13 sibling tickets are `grilling`, and this tracker's output is *decisions*, not artifacts. The decision here is genuinely interrogable: which of the six territories, what must the mark encode, what must it never encode, what are the non-negotiable constraints. So: `type: grilling`, and **the ticket resolves when the direction is signed off and handed to a designer** — the artwork itself stays outside the tracker. That keeps the ticket honest about what it decides.

### Claim: `sumit` — this is the load-bearing choice

With `blocked-by: []` and `claim: null`, I1 lands on the frontier beside 10 others and the frontier reads as *do this next*. This work is not time-bound, blocks nothing, and is executed by a human designer. Claiming it drops it off the frontier by the tracker's own definition — and that is not a trick, it is a true statement: the designer relationship and the judgement calls are Sumit's, not the next agent session's.

**Do not manufacture a `blocked-by` edge to manipulate the frontier.** If A2 (content model) genuinely wants to know the mark exists, add a sentence to A2, not a fake dependency.

### Status: `open`, `labels: [wayfinder:grilling]`

---

## `wayfinder/tickets/I1-brand-mark.md`

House frontmatter, matching the 14 existing tickets exactly:

```yaml
---
id: I1
title: "Brand mark: the Dramas of Discrimination symbol (mark only, no lockup)"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: sumit
---
```

Note: **no `gh:` field yet** — same as the 8 tickets pending publication, because the GitHub account is suspended (MAP.md, "GitHub sync state").

Body, in ticket house style (`## Question` / `### Context` / `### What resolving this decides` / `## Resolution` left empty):

**Question.** What symbol mark should Dramas of Discrimination carry — given that the current identity is type-only (`app/src/components/DodLogo.tsx` sets "Dramas / *of* / Discrimination", the *of* in Italianno script), and given the mark must read at 16px, print in one colour, and be paintable on flipchart paper?

**Context bullets.**
- **Scope: the mark only.** The ARC + DoD lockup is explicitly out — ARC's existing raster mark (`ARCLogo.tsx`) stays untouched. A full identity system is out.
- **What the mark has to mean**, quoted from the project's own design principles: *rehearsal over discussion* (change is practised, not only talked about); *enough structure to hold people together, not to direct it*; *systemic, not heroic* (the frame is systems, not individuals).
- **Anti-brief** — do not use scales of justice, gavels, raised fists, broken chains, masks, hearts, speech bubbles, chess pieces, footprints. Each encodes law-as-violation, heroism, or victimhood — frames the project argues against in its own abstract. Also: no gradients, no drop shadows, no 3D, no swooshes.
- **Non-negotiable constraints:** must read at **16px** (design at 16 first); **one colour**, navy `#131857` on cream `#ffffee`, reversed cream on `#0e1236` for dark mode; must survive **greyscale print** and **one-colour paint**; stroke-only, flat or round caps. Tokens in `app/src/styles.css`.
- **Six candidate territories** — one line each on construction and meaning, so the ticket is answerable without opening the brief: **The Turn** (one stroke, one 45° kink — the moment someone steps in), **Open Frame** (square with one edge interrupted — structure that doesn't direct), **Chorus Arc** (three concentric arcs, one detached — audience, one voice stepped out), **Two Tables** (two rules, the lower broken — the workshop's two tables), **Scene Graph** (three nodes, one thread overshooting the last), **Declaration** (four rules, the last a short bar — a period instead of a line). Fallback if no icon: a **DD ligature** with a shared stem.
- **Executor:** a human designer. **Deadline:** none — explicitly *not* driven by the Nov 25 Perth talk, so nobody later mistakes this for urgent.
- **Exists today:** a typographic wordmark and no symbol. Nothing to preserve but the type.

**What resolving this decides.** Which territory the brief commissions, and the constraint set it locks. It does not decide the artwork.

**Open questions to carry into the brief** (posed, not pre-solved): does the wordmark keep the script *of*? Favicon — `DD` monogram, `D|D` ligature, or symbol alone? Must the mark contain a letterform, or is pure abstraction acceptable? Clearspace in cap-heights or in the mark's own stroke width? Is a solid variant needed for embroidery and rubber-stamping, or is one-colour stroke enough?

**`## Resolution`** — left empty; MAP.md only lists closed tickets under "Decisions so far", so nothing goes there until it closes.

---

## `wayfinder/brand-mark-brief.md`

The artifact I1 hands off. Self-contained, inlined context, no wiki links. Frontmatter matching the wiki's house shape so it reads the same wherever it travels:

```yaml
---
title: "Dramas of Discrimination — Brand Mark Brief"
type: brief
created: 2026-10-04
updated: 2026-10-04
status: stub
summary: "Designer handoff for the DoD symbol mark. Scope: the mark and its rules only. Six candidate territories, none chosen. Not time-bound."
---
```

Sections, in order:

1. **The assignment** — one page. What it's for: app icon, favicon, public-portal masthead, conference slides and proceedings, signage for workshops that happen on paper and paint in parks.
2. **The organisation and the work** — compressed, self-contained. ARC: anti-caste collective, Bengaluru, founded April 2023. DoD: systems thinking + Theatre of the Oppressed, staged as forum theatre, 50+ executions (Cubbon Park, NLSIU, Museum of Art and Photography, IIHS, Hasiru Dala, 2nd Global Conference on Caste, Business and Society at Bath). The app: local-first, data owned by the community, unpublished work never leaves their devices, communities author their own manifestos of inclusion. Enough for a designer to find the idea.
3. **What the mark has to mean** — the three principles, quoted.
4. **Anti-brief** — the exclusion list, with the reason each is excluded.
5. **Non-negotiable constraints** — the 16px rule, the one-colour rule and exact hexes, greyscale print, paint-on-paper, stroke-only.
6. **What already exists** — the type-only wordmark and its Italianno *of*; the type stack (Miriam Libre body, Cascadia Mono display, Italianno); the navy/cream tokens. Note that ARC's mark is a raster PNG in a bordered box and is out of scope, but the new mark must not fight it.
7. **Six candidate territories** — for each: construction in words, what it encodes, where it fails, what to preserve if the designer takes it. Plus the DD-ligature fallback.
8. **References to gather** — directions, not links: the Swiss/Ulm one-colour mark tradition; Massimo Vignelli's unigrid systems and his US national-park marks; Indian anti-caste movement graphics (Dalit Panthers, Safai Karmachari Andolan) as culturally proximate reference; Tattle's identity as a sibling civic-tech org; anti-apartheid movement one-colour poster marks. **Flagged: verify each before putting it in front of a designer — do not cite from memory.**
9. **Deliverable spec** — what the designer hands back: primary mark as vector, one-colour and reversed versions, 16px and 32px raster proofs, a stated clearspace rule measured in cap-heights, the favicon crop. No coordinates — geometry is theirs.
10. **How we will judge it** — the test set, applied before anyone falls for a rendering: 16px actual size on screen, greyscale on paper, on a projector, painted one colour on flipchart paper, beside the wordmark at 24px and at 200px, and a squint test — blur to a blob; if the silhouette isn't distinct from the other five, it fails.
11. **Open questions for round one** — the five carried from the ticket.

---

## MAP.md edits

Two, both small. MAP.md has **no open-ticket index** — tickets appear only as links in Notes — so this is the whole footprint.

1. **"Pending publication" list** — append the new ticket at the end so the expected-number chain stays intact:
   `I1→#17 (area:brand, ready, claimed)`
2. **Notes** — one line, for discoverability, next to the existing skill line:
   `**Brand:** the public surface needs a mark; see [Brand mark](tickets/I1-brand-mark.md) — scope is the symbol only, ARC lockup out, not time-bound, claimed so it stays off the frontier.`

Nothing goes in "Not yet specified" (it graduates to a ticket immediately, so it is not fog) and nothing in "Decisions so far" (that list is for closed tickets only).

---

## Order of work

1. Write `wayfinder/tickets/I1-brand-mark.md`.
2. Write `wayfinder/brand-mark-brief.md`.
3. Two MAP.md edits (pending-publication line, Notes line).
4. Stop. No SVG generation, no `app/public/` changes, no GitHub publish — the account is suspended and #s are expectations, not assignments.

## Verification before closing

- Both files' frontmatter parses and matches the house field set; I1 has no `gh:` field.
- `I1` appears in MAP.md exactly twice (Notes, pending-publication) and nowhere else.
- The brief is readable by someone who has never seen the wiki, the ABEN abstract, or the codebase — no dangling `[[...]]`, no "see the entity page".
- Every hex value and file path in the brief is one I actually read this session (`styles.css` tokens, `DodLogo.tsx`, `ARCLogo.tsx`).
- Frontier is unchanged: still 10 unclaimed open tickets. I1 is claimed, so it does not appear.

## Deferred

- **GitHub publish** of I1 as #17 — blocked on the account suspension, same as the other 8. Add the `gh:` field when it exists.
- **SVG assets in `app/public/`** — only after a direction is chosen. The brief asks for vector back; it does not ask anyone to code-draw one.
- **ARC lockup, full identity system** — separate projects, separate briefs, when someone actually needs them.
- **A wiki page** — dropped. If the design work later develops its own long-tail history worth cataloguing, that is when a wiki project folder earns its place.
