---
id: L2
title: "Local→Cloud upgrade — facilitator, provisioning & doc attach"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: [D2]
claim: null
---

## Question

A community runs its Rehearsal in **Local mode**, then opts into **Cloud mode** — possibly mid-run ([E2](E2-summary-trigger.md) renamed D3's group-owned container to Rehearsal; the community-wide Workshop has no Local-mode form, so the upgrade *creates* the parent). Per [B1](B1-auth-and-group-provisioning.md), Cloud identity is Facilitator + Join codes; per [D1](D1-how-live.md) + [H1](H1-free-tier-research.md), Cloud editing is presence + last-write-wins (server-side CRDT is out) and the Local doc is a client-side Yjs doc. Decide:

- **Who becomes the Facilitator** on upgrade — presumably the Local-mode device-holder registers with a verified email and provisions the Community + Groups; confirm, and handle the community wanting a different person in the role.
- **What members do** on first Cloud join (redeem Join codes; is pre-upgrade Local work attributed to "the group" until then?).
- **What attaches:** how the local Yjs doc's state becomes Cloud's LWW-synced fields — one-time replay vs continuous attach. D1 called this a *sync-attach, not a migration*; H1's fallback reopened whether that framing survives. This ticket settles it (blocked by [D2](D2-collab-tech.md), which fixes the doc shape/engine split).
- **What remains on the device** afterward — does the local copy persist as a fallback, and what is the privacy posture of work that now lives in the cloud?

### What resolving this decides
The upgrade flow, its provisioning story, and the doc hand-off mechanism. Replaces the former fog patch L2 (graduated from [B1](B1-auth-and-group-provisioning.md)).
