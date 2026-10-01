---
id: B1
gh: 3
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

### Candidate framing (not yet decided)
Under the working compute decomposition (fog [A3](../MAP.md)), the auth choice carries a **Worker-count consequence** — it is the single decision that fixes 2-vs-3:

- **Convex Auth** ⇒ identity lives in Convex, so the private app needs **no extra Worker for auth** → **2 Workers** total (LLM Generation + Syndicate/Publish).
- **Better-Auth** ⇒ self-hosted on your own compute; in the candidate framing that forces a thin **3rd Private-API Worker** to front it → **3 Workers**.

So B1 doesn't only pick an identity provider — it also fixes the Worker-seam count (which in turn gates free-tier script/quotas; see [H1](H1-free-tier-research.md)). The candidate framing graduates A3 once B1 resolves.
