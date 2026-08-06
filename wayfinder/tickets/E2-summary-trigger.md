---
id: E2
title: "Manifesto trigger — what starts generation, on what input"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: [D3]
claim: null
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
