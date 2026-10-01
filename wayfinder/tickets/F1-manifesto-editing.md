---
id: F1
title: "Manifesto editing workflow after generation"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: [D1]
claim: null
---

## Question

After the LLM produces the manifesto, **how do group members edit it**?

- Same **live-collab** model as the tables (depends on [D1](D1-how-live.md))?
- Or **single-editor / sequential / facilitator-only**?
- Who can change what, and are edits free-form or constrained to the template from [E3](E3-manifesto-definition.md)?

### Context
The editing model should be consistent with the table-collab decision where sensible. Resolving graduates the F2 fog (versioning/history).

### What resolving this decides
The post-generation editing workflow and permissions.

### Candidate framing (not yet decided)
Under the working decomposition (fog [A3](../MAP.md)): manifesto editing rides the **realtime path (Convex/Yjs)**, consistent with [D1](D1-how-live.md) — client↔Convex directly, **no Worker** in the editing path. (The generation Worker, [E1](E1-llm-provider.md), and the publish Worker, [G2](G2-publish-bridge.md), bracket editing but are not part of it.)
