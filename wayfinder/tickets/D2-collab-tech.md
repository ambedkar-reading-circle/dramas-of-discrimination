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

- If CRDT: **Convex's Yjs integration** (`@convex-dev/yjs`) as the realtime transport + shared document store.
- If save-merge: plain Convex reactive queries + optimistic UI + last-write-wins.

Define the realtime transport, the shared-state shape, and how it stays within free-tier limits.

### What resolving this decides
The concrete realtime implementation approach.
