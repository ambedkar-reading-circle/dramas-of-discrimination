---
id: B1
gh: 3
title: "Auth provider + group provisioning & roles"
type: grilling
status: closed
labels: [wayfinder:grilling]
blocked-by: []
claim: kilo
---

## Question

Which **free auth** approach, and how are **groups of 4–5 provisioned and invited**?

- **Auth options:** **Convex Auth** (integrated with the Convex data layer) vs **Better-Auth** (open-source, self-hosted on your own compute, no vendor lock-in). Both free; clarify true cost (Better-Auth "free" = your compute).
- **Provisioning:** who creates a group, how the 4–5 members join (invite link / code / email), and whether there's a **facilitator/admin role** distinct from members.

### Context
Auth is **load-bearing**: group isolation, the publish gate, and the public/private split all rest on it. See [Data isolation](C1-data-isolation.md) and [Consensus](G1-consensus-semantics.md).

### What resolving this decides
The identity model, the group lifecycle/invite flow, and the role set.

### Candidate framing (not yet decided)
Under the working compute decomposition (fog [A3](../MAP.md)), the auth choice carries a **Worker-count consequence** — it is the single decision that fixes 2-vs-3:

- **Convex Auth** ⇒ identity lives in Convex, so the private app needs **no extra Worker for auth** → **2 Workers** total (LLM Generation + Syndicate/Publish).
- **Better-Auth** ⇒ self-hosted on your own compute; in the candidate framing that forces a thin **3rd Private-API Worker** to front it → **3 Workers**.

So B1 doesn't only pick an identity provider — it also fixes the Worker-seam count (which in turn gates free-tier script/quotas; see [H1](H1-free-tier-research.md)). The candidate framing graduates A3 once B1 resolves.

## Resolution

**Identity model — individual Member identities.** "Log in as a group" means *membership*, not a shared credential: each person authenticates as themselves on their own device — required by D1's presence pick and by G1's need to attribute consensus. Glossary gained **Member** (`CONTEXT.md`).

**Credential — username + password, no email, for Members.** Display name + password chosen at join; zero PII; rejoinable on any device (the borrowed-device probe passes). Facilitators carry the email dependency instead.

**Roles — Facilitator / Member. No platform Admin.**
- **Facilitator**: self-registers with **email + password, email-verified** (via Resend free tier + the platform's domain — this is the anti-spam gate, and it keeps facilitation fully independent). Creates the Community and its Groups; each Group gets a **Join code** — high-entropy, capacity-capped (~5 redemptions), rotatable/revocable, attempt-throttled. Roams all Groups in their Community (feeds [L3](L3-local-mode-facilitation-flow.md)). Holds the publish trigger — G1/G2's "admin trigger" is the Facilitator's; their framings are patched accordingly.
- **Member**: redeems a Join code with a chosen username + password → belongs to **exactly one Group**. No code, no registration surface. Lost-password recovery is facilitator-mediated (members have no email): remove the member, re-issue the code.
- **No open signup anywhere** — every identity is issued by someone upstream or gated by a live code. This is the spam/attack answer: there is no cold-registration endpoint to farm. [C1](C1-data-isolation.md) receives this membership model to key its access rules on.

**Provider — Convex Auth.** Native to the backend-of-record: Username+Password (Members) and Email+Password (Facilitators) are both built-in; join codes, roles, and membership are plain Convex functions. Included on free — $0, no MAU cap, counts as ordinary function calls, and overage **hard-fails rather than bills** ([free-tier-limits](../research/free-tier-limits.md)). Better-Auth rejected: since H1 found the official `@convex-dev/better-auth` component it would also run inside Convex at 2 Workers, but it adds a second auth framework whose portability pitch is moot — the destination is explicitly not self-hostable and the data plane is Convex either way.

**Worker consequence — 2, and no longer contingent.** The 2-vs-3 question dissolves: identity lives in Convex under *either* provider. Private compute = **LLM Generation Worker + Syndicate/Publish Worker**; no Private-API auth Worker. **Graduates fog A3** → [ticket](A3-compute-decomposition.md). **Graduates fog L2** → [ticket](L2-local-to-cloud-upgrade.md), blocked by D2 (the H1 fallback reopened what "attaches").

**Dependency added:** Resend (free) + a verified sending domain, for facilitator emails only — the sole external dependency of this decision.
