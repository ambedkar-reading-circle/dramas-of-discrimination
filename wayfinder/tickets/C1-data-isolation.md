---
id: C1
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
