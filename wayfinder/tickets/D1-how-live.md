---
id: D1
title: "How live does collaborative editing need to be? (LOAD-BEARING / first ticket)"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
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
