---
id: L1
title: "Local-mode storage engine & doc layout"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: [D2]
claim: null
---

## Question

Pick the **local persistence engine** and the **exact client-side doc layout** for Local mode.

- **Engine:** y-indexeddb vs alternatives (IndexedDB wrappers, OPFS, localStorage-tier fallbacks). D1 already fixed Local mode's editing engine as a **Yjs document** with continuous autosave — H1's NO-GO doesn't touch it (no Convex integration involved). This ticket picks the *persistence* layer under that Y.Doc.
- **Doc layout:** how one [Rehearsal](D3-form-table-model.md)'s entities (Actor map rows, Failures, Nodes, Dialogues — one entity per client-generated stable ID, per D3's shape) map onto Yjs structures (Y.Map-per-entity vs nested Y.Maps/Y.Text-per-field), and how the layout stays the shape D2 decides Cloud mode edits client-side — preserving D1's "one engine, two modes" if it survives.

### Context

D3 fixed the logical entity/field shape; D2 decides whether Cloud mode edits the same Yjs doc shape client-side under LWW sync. This ticket is blocked by D2 because the Local layout is only constrained (and shareable) if Cloud keeps the Yjs client-side doc; otherwise Local's layout is free.

### What resolving this decides

The Local-mode persistence library, the Yjs doc layout, and the autosave/recovery story (a no-account tool cannot afford lost workshop work).
