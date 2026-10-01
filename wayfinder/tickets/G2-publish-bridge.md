---
id: G2
title: "Publish bridge — private manifesto → public SEO page"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: [G1, A1]
claim: null
---

## Question

Define the **publish bridge**: how an agreed manifesto moves from **private Convex data** to the **public SEO surface**.

- **Who** can publish, and the **state transitions** (draft → generated → edited → agreed → published).
- **Post-publish immutability:** can a published manifesto be edited or retracted once public? Versioned snapshots?
- **Rendering:** how the published manifesto becomes an indexable public page (ties to [A1](A1-public-rendering.md) and [A2](A2-content-model.md)).

### Context
This is the seam between the private app and the public website. Partly graduates the H3 fog (public↔private data-bridge & caching).

### What resolving this decides
The publish workflow, state machine, immutability policy, and the public-rendering integration.

### Input from A1 (resolved)
Public rendering is decided ([A1](A1-public-rendering.md)): **no SSR on the public surface**. So the bridge is **not** "render on request" — it is a **build/snapshot** step:
- A manifesto is **CSR-readable from Convex** (public-read) once approved, but **not** SEO-indexed.
- The SEO/public page exists only after an admin batch-**"Syndicate"** rebuild emits a **static** snapshot.
- Open for G2: the Syndicate state machine (who triggers it, batch mechanics), immutability/versioning of the static snapshot, and the Convex public-read access rule for unsyndicated manifestos (coordinate with C1/A2).

### Candidate framing (not yet decided)
The *candidate* shape of this bridge is a **Syndicate Worker** seam (fog [A3](../MAP.md)):

- **Consensus reached** (Convex state; see [G1](G1-consensus-semantics.md)) → **admin triggers** the Syndicate action.
- The Worker **fetches** the agreed manifesto from Convex → **renders static HTML** → **deploys it as a Static Asset** (the only path by which a manifesto reaches the indexable public surface).
- Open within this candidate: **static-snapshot immutability/versioning** — once deployed, is the snapshot frozen, versioned, or retractable?

This stays a candidate — the 2-vs-3-Worker count (and thus whether a dedicated Syndicate Worker exists at all) is not fixed until [B1](B1-auth-and-group-provisioning.md) resolves. If a dedicated Worker is not warranted, the Syndicate step collapses into the existing private Worker or an admin build step; the *render-and-deploy-static* contract above still holds either way.
