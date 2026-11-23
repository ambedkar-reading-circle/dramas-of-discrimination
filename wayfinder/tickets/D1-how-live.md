---
id: D1
gh: 5
title: "How live does collaborative editing need to be? (LOAD-BEARING / first ticket)"
type: grilling
status: closed
labels: [wayfinder:grilling]
blocked-by: []
claim: kilo
---

## Question

How **live** does collaborative editing of the two tables need to be?

- **(a) True simultaneous, field-level editing** with automatic conflict resolution — **CRDT via Yjs** over Convex (`@convex-dev/yjs`). Best UX, most moving parts.
- **(b) Presence + save-and-merge** — see who's online / which field, save on blur, **last-write-wins** per field. Simpler, adequate for low contention.
- **(c) Field-locking** — one editor per field at a time.

### Context
This is **load-bearing**: it determines the entire editing experience and the tech in [Collab tech](D2-collab-tech.md), and influences [Manifesto editing](F1-manifesto-editing.md). Groups are small (4–5), contention is low, but it still sets the whole realtime architecture. Recommend defaulting to **(a) Yjs** for a true-collab feel on the free tier.

### What resolving this decides
The collaboration model; unblocks D2, F1, and graduates D4 (conflict/merge UX).

### Candidate framing (not yet decided)
Regardless of which liveness option (a)/(b)/(c) is chosen, under the working decomposition (fog [A3](../MAP.md)) the **realtime/Yjs path bypasses Workers entirely** — it goes client↔Convex. So this ticket's choice is unconstrained by Worker-CPU concerns; the load-bearing constraint is Convex's realtime/Yjs free-tier caps (see [H1](H1-free-tier-research.md)), not Worker budgets.

## Resolution

**Split by mode** (terms per `CONTEXT.md` — *Local mode* / *Cloud mode*):

- **Local mode**: one browser, **one concurrent editor** (pass-the-keyboard is sequential). **No realtime layer, no connection.** The editing engine is still a **Yjs document** persisted continuously to browser storage — autosave on every keystroke, no explicit save action (a no-account tool cannot afford lost workshop work).
- **Cloud mode**: **(a) true simultaneous, field-level editing via CRDT — Yjs over Convex (`@convex-dev/yjs`)**, client↔Convex directly, bypassing Workers. Includes **presence + live cursors** via Yjs Awareness (who's online, which cell, remote selections) riding the same connection.
- **One engine, two modes** — *normative, not incidental*: both modes edit the **same Yjs doc shape**; Local = Y.Doc + browser persistence, Cloud = Y.Doc + Convex sync. This collapses fog L1's engine question and makes the L2 local→cloud upgrade a **sync-attach**, not a data migration.

**Conditionality:** the Cloud-mode pick is **conditional on [H1](H1-free-tier-research.md)** confirming `@convex-dev/yjs` fits Convex's free tier (connection/update/ops caps vs 4–5 editors × 4–5 groups). If H1 kills it, **fall back to (b): presence + last-write-wins per field** — the presence requirement stands under any fallback.

**Why not (b) outright:** groups are 4–5 and contention is low, but (a)'s "most moving parts" cost is mostly paid once and buys the Local/Cloud engine unification; (b) would buy simplicity the workshop flow doesn't need at the price of two engines and a migration-shaped upgrade. (c) field-locking fights the communal Theatre-of-the-Oppressed flow.

**Unblocks:** [D2 — Collab tech](D2-collab-tech.md) (stack specifics: provider, persistence, awareness details), [F1 — Manifesto editing](F1-manifesto-editing.md) (inherits the engine). **Graduates from fog:** D4 → ticket (same-cell merge readability), L3 → ticket (single-device facilitation flow). **Hands off to:** [D3 — Form/table model](D3-form-table-model.md) must shape both tables as **Yjs-compatible structures** (the doc shape is now mode-shared).

**Also settled here:** the map's destination was extended to name both modes first-class (Local mode is the README's default posture, not an afterthought); local-mode fog L1/L2/L3 entered the map this session.

### Conditionality outcome (recorded when H1 closed)

[H1](H1-free-tier-research.md) found the official Convex Yjs integration is gone — `@convex-dev/yjs` 404s on npm and in the docs; only a 3-star community `y-convex` remains. Capacity was never the issue (~40× margin). The condition **fails**, so per the clause above the **fallback is in force: Cloud mode = presence + last-write-wins per field; the presence requirement stands**. "One engine, two modes" survives only if [Collab tech](D2-collab-tech.md) keeps editing the same Yjs doc shape client-side under an LWW sync — that is now D2's question, not settled here.
