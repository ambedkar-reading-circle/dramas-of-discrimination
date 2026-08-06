---
id: A2
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
