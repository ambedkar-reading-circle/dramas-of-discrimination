---
id: C1
gh: 4
title: "Per-group data isolation in Convex"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

How is **per-group data isolation** enforced in Convex so group A can *never* read group B's tables, forms, or manifesto drafts — via **document-level access rules keyed by group membership**, table partitioning, or another model?

### Context
~4–5 groups run concurrently on shared infrastructure. A leak between groups would be a serious failure. Relates to [Auth & provisioning](B1-auth-and-group-provisioning.md) (membership) but can be reasoned independently.

### What resolving this decides
The Convex schema/access-rule pattern that guarantees group isolation.

### Candidate framing (not yet decided)
Under the working decomposition (fog [A3](../MAP.md)), the data path is **client↔Convex directly** (realtime/Yjs bypasses any Worker, and public reads come from Convex too). So isolation **must live in Convex access rules** — a Worker gateway cannot be relied on to enforce it, because in several paths there is no Worker in the data path at all. This reinforces that the answer here is a **Convex-native** access-rule/membership-keyed model, not a proxy-enforced one.
