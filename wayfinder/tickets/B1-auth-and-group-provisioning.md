---
id: B1
title: "Auth provider + group provisioning & roles"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

Which **free auth** approach, and how are **groups of 4–5 provisioned and invited**?

- **Auth options:** **Convex Auth** (integrated with the Convex data layer) vs **Better-Auth** (open-source, self-hosted on your own compute, no vendor lock-in). Both free; clarify true cost (Better-Auth "free" = your compute).
- **Provisioning:** who creates a group, how the 4–5 members join (invite link / code / email), and whether there's a **facilitator/admin role** distinct from members.

### Context
Auth is **load-bearing**: group isolation, the publish gate, and the public/private split all rest on it. See [Data isolation](C1-data-isolation.md) and [Consensus](G1-consensus-semantics.md).

### What resolving this decides
The identity model, the group lifecycle/invite flow, and the role set.
