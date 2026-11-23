---
id: D2
title: "Collab tech given the liveness decision"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: [D1]
claim: null
---

## Question

Given [D1](D1-how-live.md)'s answer, which **collab tech**?

- ~~CRDT via `@convex-dev/yjs`~~ — **mooted by [H1](H1-free-tier-research.md)**: the official integration no longer exists (npm 404; 3-star community fork only), so D1's conditionality tripped and Cloud mode runs the **fallback: presence + last-write-wins per field**.
- The question is now threefold: **(1)** the realtime transport for presence + LWW field sync (candidate: plain Convex reactive queries + optimistic UI); **(2)** whether Cloud mode still edits the **same Yjs doc shape client-side** — preserving D1's "one engine, two modes" and the sync-attach upgrade — or Local/Cloud split engines; **(3)** if Yjs stays client-side, what serializes Yjs state into the LWW-synced fields.

Before finalizing the fallback, action [free-tier-limits](../research/free-tier-limits.md) ambiguity #3: ask Convex (Discord) whether a successor to the vanished `@convex-dev/yjs` is planned — a GO-WITH-CAVEATS reversal is possible if the project accepts the community `y-convex` package or a DIY provider (capacity numbers pass with ~40× margin).

Define the realtime transport, the shared-state shape, and how it stays within free-tier limits.

### What resolving this decides
The concrete realtime implementation approach.

### Candidate framing — constraint (not yet decided)
Under the working decomposition (fog [A3](../MAP.md)), the realtime transport (Convex/Yjs via `@convex-dev/yjs`, or plain Convex reactive queries) goes **client↔Convex directly** and **must not route through a Worker**. This is a hard constraint on this ticket: the chosen collab tech cannot assume a Worker in the realtime path.
