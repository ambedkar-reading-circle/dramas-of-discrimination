---
id: E2
title: "Manifesto trigger — what starts generation, on what input"
type: grilling
status: closed
labels: [wayfinder:grilling]
blocked-by: [D3]
claim: kilo/2026-11-23
---

## Question

**What triggers** manifesto generation, and on **what input**?

- **Trigger:** both tables marked complete by the group? A facilitator action? A member pressing "Generate"?
- **Input scope:** per-group tables only (each group gets its own manifesto), or aggregated across all groups into one? (The Destination implies per-group manifestos that are later consensus-published.)
- **Assembly:** exactly how Table 1 + Table 2 are serialized into the LLM input.

### Context
Depends on the [table data model](D3-form-table-model.md). Feeds the E4 fog (prompt assembly) and informs [Manifesto definition](E3-manifesto-definition.md).

### What resolving this decides
The trigger condition, the input scope, and the table→prompt boundary.

### Candidate framing (not yet decided)
Under the working decomposition (fog [A3](../MAP.md)), the candidate trigger **fires an LLM Generation Worker** (see [E1](E1-llm-provider.md)) with the assembled tables. So "what triggers generation" also answers *who invokes that Worker seam and with what serialized payload*. The trigger is a private-app/admin action; it is distinct from the publish/Syndicate step ([G2](G2-publish-bridge.md)).

## Resolution

Grilled 2026-11-23, one question at a time, recommendations attached. The headline stance (one explicit overrule of my per-group recommendation, which cascaded): **generation is a community-wide act** — one manifesto per Workshop, assembled from *every* Group's tables, gated by a two-level sign-off-and-submit ritual, fired by the Facilitator.

### The container rename (Q1's consequence)

The unit of generation is **the whole Workshop**, not one Group's work — colliding with D3's coinage of "Workshop" as the *group-owned* container. The glossary now splits two levels (terms in `CONTEXT.md`):

- **Workshop** — the community-wide run: every Group working its own Rehearsal; owns the Facilitator's Generate trigger and the manifesto drafts. Belongs to exactly one Community in Cloud mode; **has no Local-mode form**.
- **Rehearsal** — one Group's run: its Scenario, Actor map, and Play script; the unit of submission. Group-owned in Cloud mode; standalone in browser storage in Local mode.

D3's entity formerly called "Workshop" is now the **Rehearsal**; D3 is patched accordingly (below). The Destination's "groups refine it and upon consensus publish" reads as cross-group convergence happening in the consensus/editing layer ([G1](G1-consensus-semantics.md)/[F1](F1-manifesto-editing.md)), not in the generator's input.

### The gate (Q2–Q3)

Two levels, one member act (the user explicitly merged completion and submit for members — "essentially the same thing for the members"):

- **Sign-off** (member act) — a Member's visible declaration that their Group's Rehearsal is ready. Each Group shows its **Sign-off count (x of y)** to its Members *and* the Facilitator. One act per Member per Rehearsal; no auto-submission when the count fills.
- **Submission** (facilitator act) — the Facilitator hands a Rehearsal over to its Workshop. Ideally at full count; **permitted (and recorded as forced) at a lower count** — the release valve for absent or stalling members.
- **Generate unlocks when every Rehearsal in the Workshop is submitted**; the Facilitator presses it.
- **D3 patch:** the per-table `actorMapStatus`/`playScriptStatus` toggles are **dropped from the schema** — the group's done-ness signal *is* the Sign-off count; the system never derives per-table completeness. (D3's "carried, not enforced" stance survives, carried differently.)

### Freeze at Submit (Q4)

A submitted Rehearsal's tables are **read-only for Members**; Generate serializes exactly what was signed off. The Facilitator retains an **un-submit** lever (reopens a Rehearsal to editing, a visible act like the force) for the spotted-typo case. Deterministic input; the gate has teeth.

### Local mode (Q5)

Local mode **never invokes the platform's LLM** — no generation endpoint is reachable from an account-less browser, and "nothing leaves the device" stays unqualified. (A facilitator-issued generation-code scheme was explored and rejected as accidental complexity.)

- The only route from local work to platform generation is **switching to Cloud** — the [L2](L2-local-to-cloud-upgrade.md) upgrade attaches the Rehearsal to a Group inside a Community's Workshop.
- Local mode instead offers **prompt export**: the app renders the Rehearsal's tables as a copy-paste prompt the user carries by hand to their own chosen LLM. The user is the egress, not the app. Whether a pasted-back result can be stored as a local manifesto draft is [F1](F1-manifesto-editing.md)'s call.

### Regeneration (Q6)

Regeneration is **allowed, Worker-throttled, destructive-with-confirm**: the Facilitator can re-Generate while the all-submitted gate holds; a **per-Workshop daily cap** (sized by [E1](E1-llm-provider.md)'s provider envelope) is enforced Convex-side; each regen **replaces the current draft after explicit confirm**. Versioning/history is exactly the F2 fog and stays there.

### Invocation & payload (Q7)

**Facilitator's client → authenticated Convex action → Generation Worker.** The action verifies Facilitator authority from the Convex Auth context ([B1](B1-auth-and-group-provisioning.md)'s identity home), reads the frozen Rehearsals, runs the serializer, checks the daily cap, and invokes the Worker over HTTP with the finished text; the Worker calls the LLM and returns the manifesto text; the action writes the draft into Convex. The Worker stays a **stateless, credential-free text-in → LLM → text-out proxy** — no Convex secrets, no DB reads, CPU-light. If provider latency ever strains the action's await, the Worker calls back a Convex mutation instead — [A3](A3-compute-decomposition.md)/E1 refine; the payload contract is unchanged.

### Serialization (Q8)

**One deterministic linear-text rendering**, per-Rehearsal blocks in stable Group order:

```
Rehearsal 1 of N — Group "<name>"
Scenario: <title>
<scenario text>

Actor map:
- Actor: <name>
  Ideal behaviour: <text>
  Failures:
  - <label>: <detail>

Play script (reading order):
SPEAKER → LISTENER: "<text>" [shows: <failure label>, …]
```

Tags resolve to Failure labels at serialization time (IDs never leave); ad-hoc speakers render under their snapshot names; monologues as SPEAKER → (self). **One renderer serves both the Worker payload and Local mode's prompt export.** It is previewable — "what the AI sees" is a transparency affordance the workshop ethos wants. **E4 boundary:** E2 owns the serializer (content, order, determinism); the E4 fog owns the prompt wrapper (system prompt, instructions, the template scaffolding around [E3](E3-manifesto-definition.md)'s manifesto shape).

### Consequences

- **Patches** [D3](D3-form-table-model.md): the Workshop→Rehearsal rename; per-table statuses dropped; the Sign-off count replaces them as the done-ness signal; submission freezes what D3's deletes-degrade-gracefully policies keep well-formed.
- **Feeds** [E3](E3-manifesto-definition.md) (the draft this trigger produces) and the E4 fog (wrapper around this serializer); **informs** [G1](G1-consensus-semantics.md) (the Sign-off/Submission ritual is the visible-approval pattern G1 can reuse for manifesto consensus) and [F1](F1-manifesto-editing.md) (destructive-with-confirm regen bounds what editing must protect).
- **Renames ripple:** open tickets referring to the group-owned container as "Workshop" now say Rehearsal ([L1](L1-local-storage-engine.md), [L2](L2-local-upgrade-path.md), [D5](D5-graph-script-model.md) swept this session).
- **Glossary gains** (`CONTEXT.md`): Workshop redefined (community-wide), Rehearsal, Sign-off, Submission, Generate, Prompt export.
- ADR skipped: the rename is cheap pre-build; the two-level container is self-evident once the glossary states it; no hard-to-reverse trade-off among the tests.
