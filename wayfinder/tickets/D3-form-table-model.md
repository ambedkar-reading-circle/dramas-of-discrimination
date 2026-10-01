---
id: D3
gh: 7
title: "Data model for the two fixed-schema tables"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

Define the **data model** for the two fixed-schema tables the group fills collaboratively.

- **Table 1 — Actors/ideal/failures:** columns *actor (entity/individual/person) | ideal behavior expected of that actor | failures enacting that ideal behavior*. Rows of text (short + long fields).
- **Table 2 — Play script (graph):** *nodes* = actors, *edges* = dialogues that highlight the failures (each edge carries dialogue text + a tag to the failure it shows).
- The two are filled **one after another** (Table 1, then Table 2) by the same group for a chosen discrimination scenario.

Specify schemas, field types (short text, long text), how rows/edges are authored, and how Table 2 references Table 1's actors & failures.

### Context
Cross-references [Play-script graph model & rendering](D5-graph-script-model.md) for Table 2's graph nature, and [Manifesto trigger](E2-summary-trigger.md) which feeds on these tables.

### What resolving this decides
The Convex schema for both tables; unblocks E2.

### Candidate framing (not yet decided)
Under the working decomposition (fog [A3](../MAP.md)): both tables **live in Convex** — authored via the realtime path ([D2](D2-collab-tech.md), client↔Convex directly) and read via Convex queries. No Worker sits in the table read/write path.
