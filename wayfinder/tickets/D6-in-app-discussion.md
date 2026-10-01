---
id: D6
title: "Do groups need in-app discussion, or is talk external?"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

When groups are "**discussing**" while filling the tables — do they need **in-app discussion** (comments / a chat side-panel anchored to a row or field), or is the conversation happening **externally** (in person / another channel) and the app only captures the shared table outcome?

### Context
In-app discussion materially expands the collab surface (presence, threads, persistence). If external, the app stays a shared-editing surface only. May interact with [How live?](D1-how-live.md).

### What resolving this decides
Whether to scope a discussion/comments feature at all.

### Candidate framing (not yet decided)
If in-app discussion is scoped in, under the working decomposition (fog [A3](../MAP.md)) it is **Convex data + realtime** (comments/threads persisted in Convex, live via the realtime path) — **no Worker** in that path. This keeps any discussion feature aligned with the client↔Convex data model rather than introducing a new compute seam.
