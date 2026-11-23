---
id: D3
gh: 7
title: "Data model for the two fixed-schema tables"
type: grilling
status: closed
labels: [wayfinder:grilling]
blocked-by: []
claim: kilo/2026-11-23
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

## Resolution

Grilled 2026-11-23, one question at a time, recommendations attached. The stance that emerged (three explicit overrules of my stricter recommendations): **Table 2 is a fast, loosely-coupled capture artifact** — nothing polices the group mid-capture; completeness is a gate E2 may set, not a shape the schema enforces.

### Entities (per Workshop)

- **Workshop** — the artifact container for one run: `{ scenarioTitle*, scenarioText, actorMapStatus: draft|complete, playScriptStatus: draft|complete }`. Cloud: owned by exactly one Group (B1's membership model keys access); Local: standalone in browser storage — the parent that makes L2's local→cloud upgrade an attach-a-parent operation. Coined here; in `CONTEXT.md`.
- **Actor** (Actor map row) — `{ name*, idealBehaviour, order }`.
- **Failure** — `{ label*, detail, order }`, a first-class child of its Actor (Q1: failure-level identity is what makes dialogue tags addressable at all).
- **Node** (Play script speaker) — `{ actorId: nullable, set-at-creation-or-never, name }`. Linked nodes display the live Actor's name and keep `name` only as a snapshot; ad-hoc speakers (Q3: allowed, overruling strict refs; Q3b: **never bindable** — anonymous forever, re-create to map) are authored free text.
- **Dialogue** (directed edge) — `{ fromNodeId → toNodeId, text*, failureIds: 0..n, order }`. Direction is domain-settled ("who says what to whom"). Self-lines (monologue) permitted; a collective listener ("the room") is just an ad-hoc node. Tags (Q4: **multiple allowed**, overruling single-tag; optional at capture) point at Failure IDs.

\* = the only required fields: scenarioTitle, Actor.name, Failure.label, Dialogue.text (and Node.name when unlinked). Everything else optional at capture.

### Field types (Q5: **all free text**, overruling the short/long matrix)

No schema-level short/long split — every field is one plain string. Single-line vs multiline is a **view** affordance (D5's). Spec-default storage caps: **2,000 chars per field, 4,000 for Dialogue.text**.

### Policies

- **Deletes degrade gracefully** (Q7): Actor deleted → its linked Nodes fall back to their name snapshot and become ad-hoc; Failure deleted → its tags are stripped from Dialogues (text survives; confirm shows affected count); Node/Dialogue deleted → unconditional. No guards, no dangling references — E2's input stays well-formed.
- **Workflow state is carried, not enforced** (Q6): `order` on Actor/Failure rows and Dialogues (reading order — D5 re-semanticizes freely); per-table `actorMapStatus`/`playScriptStatus` (draft → complete) is the hook E2's trigger reads — who sets it and what "complete" means is E2's. The Table-1-then-Table-2 rhythm is guidance, not a gate.
- **Deliberately absent:** layout coordinates (D5's view state, addable to Node without restructuring); edit attribution (if D2's LWW transport wants `lastEditedBy` for presence UX, it's transport metadata, not workshop content).

### Physical shape (derived from D1, not re-decided here)

One Convex document per entity, **client-generated stable string IDs** everywhere, references by ID. This is the shape that satisfies both D1 mandates: Cloud's fallback **LWW-per-field** (each field is an independently addressable document property) and Local's **Yjs doc** (the same entity/field shape mirrors client-side; D2 owns the serialization bridge, L1 owns local persistence).

### Names (Q8)

The tables are canonically the **Actor map** and the **Play script** — "Play script" deliberately doesn't bake in the graph framing, leaving D5's script-vs-graph source-of-truth question open. Table 1/Table 2 demoted to avoid-status.

### Patch (E2, 2026-11-23)

[E2](E2-summary-trigger.md) reshaped two things decided here:

1. **Rename:** this ticket's "Workshop" (the group-owned artifact container) is now the **Rehearsal** — "Workshop" was promoted to the community-wide run that owns the Facilitator's Generate trigger and the manifesto drafts. Glossary (`CONTEXT.md`) carries both terms.
2. **Statuses dropped:** `actorMapStatus`/`playScriptStatus` are gone from the schema. The group's done-ness signal is E2's **Sign-off count (x of y)**, and the table-freezing moment is E2's **Submission** (facilitator act, force-allowed), not a per-table toggle. "Carried, not enforced" survives — carried as Sign-offs instead of toggles.

Everything else stands: entities, field types, delete policies, one-doc-per-entity physical shape, required fields.

### Consequences

- **Unblocks** [Manifesto trigger](E2-summary-trigger.md): per-table status is its trigger hook; the entity shape above is what it serializes.
- **Patches** [Play-script graph: rendering + script↔graph data model](D5-graph-script-model.md): multi-tags, the Node name snapshot, and the layout-coord home.
- **Graduates fog L1** → [Local-mode storage engine & doc layout](L1-local-storage-engine.md), blocked by [Collab tech](D2-collab-tech.md).
- **Glossary gains** (`CONTEXT.md`): Workshop, Scenario, Actor map, Actor, Ideal behaviour, Failure, Play script, Dialogue.
- ADR skipped: none of the three tests hold hard (schema is cheap to migrate pre-build; the loose-capture stance is self-explanatory once stated).
