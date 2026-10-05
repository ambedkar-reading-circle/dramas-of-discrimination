---
title: "Dramas of Discrimination — Brand Mark Brief"
type: brief
created: 2026-10-04
updated: 2026-10-04
status: stub
summary: "Designer handoff for the DoD symbol mark. Scope: the mark and its rules only. Six candidate territories, none chosen. Not time-bound."
---

# Dramas of Discrimination — Brand Mark Brief

**Status: stub.** No direction has been chosen. This brief commissions options across six territories and asks you to recommend one, or to reject all six and propose something better. Nothing here is a decision yet.

**Who this is for:** a graphic designer working from scratch. You do not need the codebase, the funding history, or any prior artwork beyond what §6 describes in words. Nothing here depends on documents you don't have.

---

## 1. The assignment

Design a **symbol mark** for Dramas of Discrimination.

That is the whole deliverable. Not a logo system, not a lockup, not a rebrand of the parent organisation, not a typeface. One mark, plus the rules needed to use it without breaking it.

**Where it has to work:**

| Context | Notes |
|---|---|
| App icon | The companion web app; square crop. |
| Favicon | 16px in a browser tab. The harshest test in the whole project. |
| Public-portal masthead | Beside the existing wordmark, small and large. |
| Conference slides and proceedings | Projected in a room; printed in a PDF. |
| Workshop signage | Workshops that happen **on paper, in parks, on flipchart sheets**. Painted by hand. |

The last row is not a formality. The workshops are physical and often have no projector, no screen, no printing. A marker and a sheet of chart paper is a first-class medium for this mark.

**Timeline: none.** This is not tied to a conference talk or a funding deadline. Take the time the work deserves.

---

## 2. The organisation and the work

**Ambedkar Reading Circle (ARC)** — an anti-caste collective in Bengaluru, founded April 2023. Volunteer-driven and informal. Reading circles, workshops, talks and film screenings in public spaces; its signature practice is holding them in Cubbon Park rather than behind institutional doors. Its stated aim is making anti-caste worldviews more accessible in public space and public consciousness.

**Dramas of Discrimination (DoD)** — ARC's flagship. An interactive, art-based workshop addressing caste-based discrimination in Indian workplaces and places of higher education. Two method pillars, combined:

- **Systems thinking** — the frame is the system, not the person who acted badly inside it.
- **Theatre of the Oppressed, staged as forum theatre** — participants analyse a real or imagined discrimination scenario, map it, stage it, and try interventions. Forum theatre is spectator-participatory: an audience member can step into a role, change what happens, and step back out.

**How a session runs:** a community picks a discrimination scenario → works through a systemic lens → actively maps it → stages it in forum theatre and intervenes → drafts a **manifesto of inclusion**. The manifesto is a policy document for that specific community, written by that community about itself.

**The app** is DoD's facilitation manual becoming a self-facilitation tool — logged-in communities run the exercises themselves, in person or online — plus a public portal of published manifestos. Two design decisions shape how it should look:

- **Local-first, data owned by the community.** Participants' responses stay in their own browser by default. Nothing is stored server-side unless a community opts in, and opting in means the community owns and edits its own data.
- **Communities author their own manifestos**, in their own voice, grounded in constitutional values — equality, liberty, fraternity — and publish them alongside each other as a participant-authored reference document for inclusion policy.

**Scale:** 50+ executions of the offline, paper-and-paint workshop, across institutions and public places — Cubbon Park; NLSIU; the Museum of Art and Photography; the Indian Institute for Human Settlements; Hasiru Dala; and the 2nd Global Conference on Caste, Business and Society at the University of Bath.

**The argument the mark has to sit inside.** ARC's position is that legal frameworks for anti-discrimination work, but work *antagonistically*: perpetrator, breach, penalty. That produces compliance, never ownership. Belonging has to be built alongside law, by the communities it concerns — which is why the workshop exists at all, and why the manifesto is written by the community rather than issued to it.

This is the background that makes §4 non-negotiable.

---

## 3. What the mark has to mean

Three principles, quoted from the project's own design intent. They are the brief; the mark is an argument in three strokes.

> **Rehearsal over discussion.** Change is practised, not only talked about.

> **Enough structure to hold people together, not to direct it.**

> **Systemic, not heroic.** The frame is systems, not individuals.

A note on the second one, because it is the hardest to draw: the mark should look like it *holds* something without appearing to *instruct* it. A frame that closes becomes a directive. An arrow that points becomes a leader. Watch for that.

---

## 4. Anti-brief

**Do not use:** scales of justice · gavels · raised fists · broken chains · masks · hearts · speech bubbles · chess pieces · footprints.

**Why each is out:** every one of these encodes a frame the project argues against — **law as the thing that punishes** (scales, gavels, broken chains), **heroism or resistance as the answer** (raised fists), or **victimhood as the identity** (masks, hearts). A mark drawn from that set would state, in one glance, the opposite of the argument in §2: that discrimination is a series of individual wrongs to be prosecuted, or a wound to be mourned, rather than a living system a community can rehearse its way out of.

**Also excluded:** gradients · drop shadows · 3D · swooshes.

Rationale for the technical exclusions: the mark is painted with a marker and must survive a fax-quality print and a 16px browser tab. Effects that depend on rendering depth collapse at both ends of that range.

---

## 5. Non-negotiable constraints

**Size — design at 16px first.** Produce the idea at 16px actual size before drawing it large. If it only works at 200px, it does not work. Scale up second. Nothing thinner than will hold a one-pixel stroke at 16px.

**Colour — one colour only.** Two values, both fixed:

| Use | Colour |
|---|---|
| Primary mark | navy `#131857` on cream `#ffffee` |
| Reversed (dark surfaces) | cream `#ffffee` on navy `#0e1236` |

No third colour. No tints. If a territory seems to need two colours, it needs a different construction instead.

**Greyscale print.** Must read as pure black on white.

**One-colour paint.** Must work traced once, in one pass, by a person with a marker.

**Stroke-only.** Outlines and strokes, flat or round caps. No fills smaller than a stroke, no gradient fills, no tonal hierarchy inside the mark. It may be solid overall — but if it is, its solid form must come from strokes joining, not from a mass being filled in.

**These are not negotiable.** They come from the medium, not from taste. A proposal that violates them is not a weaker proposal; it is a different assignment.

---

## 6. What already exists

There is **no symbol today**. The identity is typography only.

**The wordmark.** Set as "Dramas / *of* / Discrimination" on two lines. The word *of* is set at roughly 2.5× the surrounding size in **Italianno**, a high-contrast calligraphic script, sitting slightly low against the caps. The effect is a word that leans into the name, at the size of the thing that matters. There is a `DodLogo.tsx` component with `hero` and `inline` variants; the mark must sit beside or above both without competing.

**Type stack.**

| Role | Face |
|---|---|
| Body | Miriam Libre |
| Display / titles | Cascadia Mono |
| The script *of* | Italianno |

**Palette tokens** (from `app/src/styles.css`): `--primary-blue #131857` (ink), `--primary-white #ffffee` (paper), dark surfaces `#0e1236` and `#151a63`. The mark uses the two brand colours in §5 and nothing else.

**The parent mark is out of scope.** ARC already has a logo: a **raster PNG** — bitmap, not vector — displayed inside a thin bordered box. It is not being redrawn, and no ARC + DoD lockup is being commissioned. What matters to you is one constraint: **your mark must not fight it.** The two will appear together on workshop material. Keep the visual registers separable — if ARC's mark reads as a filled or boxed emblem, yours should not be trying to be the same thing.

---

## 7. Six candidate territories

Each is a **direction, not a sketch.** Construction is described in words and the geometry is yours to solve. For each: what it is, what it encodes, where it fails, and what to preserve if you take it.

They are not six neat options — they were chosen because they fail differently, and the failures are informative. You may combine two if that produces something better than either. You may reject all six.

### Territory A — The Turn

- **Construction:** a single stroke with one 45° kink in it.
- **Encodes:** the turn — the moment someone steps in rather than watching.
- **Where it fails:** at 16px a 45° kink is the first thing to disappear; it will degrade into a plain line. Very hard to distinguish from a checkmark, a slash, or a lightning bolt once it's small.
- **If you take it:** protect the kink. Give the two segments visibly unequal weight, or change the angle away from 45°, so the joint survives the size drop.

### Territory B — Open Frame

- **Construction:** a square with one edge interrupted — a deliberate gap.
- **Encodes:** the second design principle directly: structure that holds without directing. A boundary with a door in it.
- **Where it fails:** this is the territory most likely to collapse into "generic tech logo," and a square-with-a-gap is well-trodden. It also risks implying the boundary is permeable in a way that flatters rather than holds.
- **If you take it:** the gap is the entire idea. It must be unmistakably intentional — one clear gap, generous enough to read as designed. Weight the square's corners so it doesn't read as a UI wireframe.

### Territory C — Chorus Arc

- **Construction:** three concentric arcs, one of them detached.
- **Encodes:** forum theatre — the chorus is the audience, and one voice has stepped out of it to become an actor.
- **Where it fails:** arcs are the most over-used shape in this whole category; every media and civic mark of the last decade has concentric arcs. It also degenerates badly — thin concentric strokes at 16px merge into grey mush. "Detached" is invisible if the gap is small.
- **If you take it:** the detachment must be large and asymmetric. The three strokes must be separated enough to survive 16px, which will change the shape substantially — solve that first, then decide what it looks like at 200px.

### Territory D — Two Tables

- **Construction:** two horizontal rules, the lower one broken.
- **Encodes:** the workshop's own two tables — actors / ideal behaviour / failures, and the play-script graph — with the lower one open for writing.
- **Where it fails:** two horizontal lines read as a menu, a list, a text placeholder, or a hamburger-adjacent nothing. It is the most abstract territory and the least self-explanatory; without context it will not read as anything at all.
- **If you take it:** it only works paired with the wordmark, never alone. Vertical rhythm between the two rules becomes load-bearing. Do not let it become a generic "lines of text" glyph.

### Territory E — Scene Graph

- **Construction:** three nodes, one thread overshooting the last.
- **Encodes:** the app's play-script graph — nodes are actors, edges are the dialogue that reveals the failure — plus the line that doesn't end. The rehearsal keeps going past the last scripted beat.
- **Where it fails:** node-and-edge diagrams are the visual cliché of exactly this kind of project (network maps, social graphs, system diagrams). At 16px the nodes become indistinguishable dots. The overshoot has to be obvious in one pixel of travel.
- **If you take it:** push it away from the diagram. The overshooting thread is the idea — make it the dominant gesture rather than a flourish, and break the even rhythm so it does not read as "network."

### Territory F — Declaration

- **Construction:** four rules, the last one a short bar.
- **Encodes:** a period instead of a line — the manifesto that gets written, and finished, instead of the endless sentence of discussion.
- **Where it fails:** extremely close to a paragraph mark, a text-alignment icon, or a "quote." It also sits uncomfortably near Territory D — both are horizontal rules — and the two will be confused with each other if they are ever shown side by side. That comparison matters at §10.
- **If you take it:** the short final bar must be short enough to read as *ended* rather than as *still going*. Vertical position and the ratio of the last bar to the first three carry all the meaning.

### Fallback — DD ligature

If no icon survives §5's tests, there is a deliberate fallback: a **DD ligature** with a **shared stem** — two D's built on one vertical stroke, so the mark is simultaneously two letters and one structure. It is guaranteed to pass at 16px, because it is a letterform. Its cost is exactly that: it is typographic rather than conceptual, and it will read as "DoD" without saying anything about the work.

If you take this route, say so explicitly in your write-up. It is a legitimate answer, not a failure.

---

## 8. References to gather

**Directions, not a reading list, and not citations.** Nothing here is verified. Look at the actual work before you put any of it in front of anyone — including yourself.

- **Swiss/Ulm one-colour mark tradition.** Marks constrained to a single ink at small sizes. Otl Aicher's Erding / Munich airport work and the Ulm school exercises are the reference points.
- **Massimo Vignelli's unigrid systems** — including his US national park marks — as the high-water mark for a mark that is *system*, not decoration, and for the discipline of a strict grid applied to simple geometry.
- **Indian anti-caste movement graphics.** Dalit Panthers, Safai Karmachari Andolan, and comparable movement print work. Culturally proximate reference, and the part of the list most likely to be missed by a designer working from European precedent. This is worth real time.
- **Anti-apartheid movement poster marks.** One-colour, high-contrast, reproduced on bad paper at scale.
- **Tattle** — a sibling Indian civic-tech organisation working on the same method tradition (Theatre of the Oppressed, participatory, community-defined harm). Its identity is a live comparison point, not a precedent to copy.

Do not imitate any of these. They are calibration.

---

## 9. What to hand back

- **Primary mark**, as vector. Outline or stroked — your call, but it must be supplied with strokes live or consistently converted, and I need to be able to change stroke weight without redrawing.
- **One-colour** version: navy `#131857` on cream `#ffffee`.
- **Reversed** version: cream `#ffffee` on navy `#0e1236`.
- **Raster proofs at 16px and 32px**, at actual pixel dimensions, not scaled-down previews. Include the 16px one viewed at 100% on a standard monitor — that is the view that decides this project.
- **A stated clearspace rule**, measured in cap-heights (not in arbitrary multiples of the mark's own size — cap-heights, so it survives a change of size).
- **The favicon crop**: how the mark sits in a square at 16px, and what it loses.

**No coordinates from us.** There is no reference artwork beyond the wordmark in §6. The geometry is entirely yours.

**Write-up:** which territory you took, what you changed, where you think it is still weak, and your honest read on §7's failure mode for it. A candid weakness list is worth more to us than a confident rationale.

---

## 10. How we will judge it

Applied to whatever comes back, **before anyone falls for a rendering.** A mark that looks good in a large preview has not passed this.

1. **16px, actual size, on screen.** No zoom. Fails if the silhouette or the meaning is not immediately legible.
2. **Greyscale, on paper.** Printed or photocopied. Fails if it relies on colour distinction.
3. **On a projector.** Projectors wash out and add contrast noise; a mark that needs a hairline dies.
4. **Painted in one colour on flipchart paper** — traced once, by hand, with a marker, no correction. Fails if it needs a second pass.
5. **Beside the wordmark, at 24px and at 200px.** Beside it, not alone. Fails if it competes with the type, or disappears against it.
6. **Squint test.** Blur it until it is a blob. If the silhouette is not distinct from the other five territories, it fails — and it does not get rescued by detail that only shows up at 200px.

Test 6 is the one that will actually decide it. Design at 16px and the rest follows.

---

## 11. Open questions for round one

Bring answers, or a position, on each:

1. **Does the wordmark keep the script *of*?** It is the most distinctive thing about the current identity, and it is also the least scalable — high-contrast script is fragile at small sizes. Keeping it is a constraint on your mark's proportions. Our inclination is to keep it.
2. **Favicon** — `DD` monogram, `D|D` ligature, or the symbol alone?
3. **Must the mark contain a letterform, or is pure abstraction acceptable?** There is no house view. We lean abstract, because the pure-typographic route has already been tried and abandoned.
4. **Clearspace in cap-heights, or in the mark's own stroke width?** Cap-heights is what §9 asks for, but it fails if the mark sits beside unrelated artwork.
5. **Is a solid variant needed** for embroidery and rubber-stamping, or is one-colour stroke enough? We have no embroidery plans. If you think a solid variant is cheap insurance, recommend it and say what it costs.

Add anything you think is missing. If the brief is ambiguous, the ambiguity is ours to fix — tell us which clause is unusable and we will rewrite it.