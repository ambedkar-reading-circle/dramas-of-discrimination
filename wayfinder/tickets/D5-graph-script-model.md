---
id: D5
gh: 8
title: "Play-script graph: rendering + script↔graph data model"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

For the **Play script** (the script as a graph: nodes = speakers, edges = dialogues that highlight failures):

- **Rendering library:** xyflow (react-flow) vs Cytoscape.js vs vis-network — which fits a React + free-tier app for authoring/editing a labeled node-edge graph?
- **Script↔graph data model:** is the graph a **derived view** of an editable script (an ordered list of dialogues), do groups **edit the graph directly** (add nodes/edges), or both?

### Context
Cross-references [Table data model](D3-form-table-model.md) — **resolved**; D5 inherits its shape: the stored **Dialogue** is a directed node→node line carrying text, **0..n Failure tags**, and a reading-order field; a **Node** links to an Actor **at creation only** (ad-hoc speakers stay unlinked forever) and carries a **name snapshot**; layout coordinates are deliberately absent from the schema — adding them to Node (or a sibling view doc) is this ticket's to decide, as is which single-line/multiline affordances each field gets (D3 kept all fields free text). Authoring UX and storage shape both hang on this.

### What resolving this decides
The graph rendering approach and whether the script or the graph is the source of truth.
