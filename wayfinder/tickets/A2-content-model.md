---
id: A2
gh: 1
title: "Content model for public pages (Markdown vs Convex + admin)"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

What's the **content model** for the public pages (homepage, info, about, resources, articles)?

- **(a) File-based Markdown** in the repo — simple, git-versioned, free, requires a deploy to change.
- **(b) Convex-stored content + a small admin editor** — editable without deploys, but adds an editing UI to build.
- **(c) Hybrid** — file-based for static info pages; Convex for dynamic published manifestos.

### Context
Published manifestos must flow from private Convex data into this public surface (see [Publish bridge](G2-publish-bridge.md)). The info/articles pages are mostly static.

### What resolving this decides
Where public content lives and how it's edited; sets up G2.

### Candidate framing (not yet decided)
Under the working decomposition (fog [A3](../MAP.md)): the **static info pages** (homepage, info, about, resources, articles) are **file-based static** (option (a)); manifestos reach the indexable public surface **only via the candidate Syndicate Worker** ([G2](G2-publish-bridge.md)) emitting static snapshots. This strengthens the **hybrid (c)** answer — file-based for static content, Convex→static-snapshot for published manifestos — but it stays a candidate, not a decision.
