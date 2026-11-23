---
id: A3
title: "Compute decomposition — formalize the 2-Worker seams & Convex-as-backend"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

The outline is now decided ([B1](B1-auth-and-group-provisioning.md) fixed identity-in-Convex and the Worker count at **2**; [A1](A1-public-rendering.md) fixed the public surface as static + CSR; [H1](H1-free-tier-research.md) confirmed the quota model). Formalize the topology:

- **Seam responsibilities:** what exactly does the **LLM Generation** Worker own, what does the **Syndicate/Publish** Worker own, and what stays in Convex functions / on the client?
- **Trigger mechanics:** how each Worker is invoked — facilitator action, Convex action call, Cron (5/account free) — plus failure/retry semantics inside the 10 ms-per-invocation CPU cap.
- **Whether each seam warrants its own script** (e.g., does Syndicate collapse into the Generation Worker?), given [free-tier-limits](../research/free-tier-limits.md): 100 scripts allowed, but **100k req/day is account-wide**; static asset serving is unmetered; service bindings count as one request.
- **The Worker→Convex seam:** how a Worker authenticates to Convex, and how the Syndicate Worker deploys static assets, without any Private-API surface.

### Context
H1's numbers are the budget envelope (account-wide quotas; DOs free; cron 5/account). Coordinates with [Publish bridge](G2-publish-bridge.md) (Syndicate seam) and [LLM provider](E1-llm-provider.md) (Generation seam) but is decided independently.

### What resolving this decides
The final compute topology: what runs where, what triggers it, and the free-tier envelope it lives in. This ticket replaces the former fog patch A3 (graduated from [B1](B1-auth-and-group-provisioning.md)).
