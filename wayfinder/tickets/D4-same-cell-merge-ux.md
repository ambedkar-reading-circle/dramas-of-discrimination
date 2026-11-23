---
id: D4
title: "Same-cell merge UX — what happens when two members edit one cell?"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

[D1](D1-how-live.md) chose field-level CRDT merge (Yjs): two members typing in the **same cell at the same time** interleave characters — visible but not prevented by the presence/cursors that also came out of D1. What should the group experience when it happens anyway?

- **(i) Accept character-interleaved merge** as-is (Yjs default) — presence discourages, merge resolves.
- **(ii) Per-cell presence deferral** — occupied cells are highlighted strongly enough that entering one is a deliberate act (soft signal, *not* a lock).
- **(iii) Commit-time cell-level last-write-wins** — disables intra-cell CRDT; the second typist's text replaces the first on commit.

### Context
Groups are 4–5 people, low contention, and presence already signals occupancy. This is the residue of D1's conflict question that CRDT auto-merge does not answer on its own.

### What resolving this decides
The same-cell conflict policy for the spec; feeds implementation notes in [D2 — Collab tech](D2-collab-tech.md).
