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

For Table 2 (the **play script as a graph**: nodes = actors, edges = dialogues highlighting failures):

- **Rendering library:** xyflow (react-flow) vs Cytoscape.js vs vis-network — which fits a React + free-tier app for authoring/editing a labeled node-edge graph?
- **Script↔graph data model:** is the graph a **derived view** of an editable script (an ordered list of dialogues), do groups **edit the graph directly** (add nodes/edges), or both? Edges carry dialogue text tagged to a failure from Table 1.

### Context
Cross-references [Table data model](D3-form-table-model.md). Authoring UX and storage shape both hang on this.

### What resolving this decides
The graph rendering approach and whether the script or the graph is the source of truth.
