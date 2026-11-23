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
- The SEO/public page exists only after a facilitator-triggered batch-**"Syndicate"** rebuild emits a **static** snapshot.
- Open for G2: the Syndicate state machine (who triggers it, batch mechanics), immutability/versioning of the static snapshot, and the Convex public-read access rule for unsyndicated manifestos (coordinate with C1/A2).

### Candidate framing (not yet decided)
The *candidate* shape of this bridge is a **Syndicate Worker** seam (fog [A3](../MAP.md)):

- **Consensus reached** (Convex state; see [G1](G1-consensus-semantics.md)) → **the Facilitator triggers** the Syndicate action ([B1](B1-auth-and-group-provisioning.md)).
- The Worker **fetches** the agreed manifesto from Convex → **renders static HTML** → **deploys it as a Static Asset** (the only path by which a manifesto reaches the indexable public surface).
- Open within this candidate: **static-snapshot immutability/versioning** — once deployed, is the snapshot frozen, versioned, or retractable?

This stays a candidate in shape only — the Worker count is now fixed at **2** ([B1](B1-auth-and-group-provisioning.md): identity lives in Convex — Convex Auth — so no auth Worker), which a dedicated Syndicate Worker fits comfortably. Whether each seam warrants its own script (vs collapsing Syndicate into the LLM Generation Worker) is [A3](A3-compute-decomposition.md)'s call; the *render-and-deploy-static* contract above holds either way.
