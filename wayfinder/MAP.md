# Dramas of Discrimination — Wayfinder Map

> **Tracker:** local-markdown. Map = this file. Tickets = `wayfinder/tickets/<ID>-<slug>.md`. Research = `wayfinder/research/`. Each ticket carries frontmatter: `status` (open|closed), `type` (research|prototype|grilling|task), `blocked-by` (list of IDs), `claim` (assignee). The **frontier** = open tickets whose `blocked-by` are all *closed* and whose `claim` is empty. Refer to tickets by **title**, never a bare ID.

## Destination

A buildable, opinionated, **architecture-level design spec** for the "Dramas of Discrimination" web app: a public, SEO-optimized surface (homepage, info, about, resources, articles, and **published manifestos**) alongside **two workshop modes** — **Local mode** (default posture: one browser, one device, browser storage, no account, nothing leaves the device) and **Cloud mode** (opt-in: the community logs in as a group, work syncs to the platform's remote database, any member joins from their own device) — where ~20–25 people in 4–5 groups of 4–5 each **collaboratively build two tables** from a chosen discrimination scenario — (1) *actors | ideal behavior | failures*, and (2) a **play-script graph** (nodes = actors, edges = dialogues that highlight the failures). An LLM turns those tables into a **policy manifesto** for a more inclusive/fair community; groups refine it and, upon consensus, **publish** it to the public surface. **Strictly free-tier-bounded; durable; scale-later; not self-hostable.** The team builds it themselves from the spec.

## Notes

- **Domain:** discrimination-scenario roleplay → structured tables → LLM-generated fairness manifesto → consensus → public publish.
- **Skills every session should consult:** `/grilling` + `/domain-modeling` (resolve decisions one at a time), `/research` (fact-finding), `/prototype` (when "how should it look/behave" is the question).
- **Standing preferences:** free-tier-bounded *and* durable; not self-hostable; scale figured later; spec is **opinionated** (it picks, not presents menus); **architecture-level** depth (not per-endpoint contracts).
- **Candidate stack (confirmed by tickets, not here):** TanStack **Router** on Cloudflare (Start ruled out — SSR hits the free 10 ms CPU cap; see [A1](tickets/A1-public-rendering.md)); Convex for data + realtime; auth = **Convex Auth** (decided by [B1](tickets/B1-auth-and-group-provisioning.md)); shadcn/ui; a free-tier LLM.
- **Working topology (identity + Worker count decided by [B1](tickets/B1-auth-and-group-provisioning.md); seam detail is [A3](tickets/A3-compute-decomposition.md)'s to formalize):** Convex is the **backend-of-record** (owns the data API, access rules, realtime, and **identity** — Convex Auth); the **public surface has no Worker** (Static Assets + CSR, per [A1](tickets/A1-public-rendering.md)); the private app's data/realtime path is **client↔Convex directly**, bypassing any Worker; Workers are exactly **2 glue seams** — the **LLM Generation** Worker and the **Syndicate/Publish** Worker. No Private-API/auth Worker (H1 found `@convex-dev/better-auth`, but Convex Auth was chosen).
- **Free-tier Worker discipline (validated by external evidence, see A1):** no SSR on Workers — the 10 ms cap is a *soft, burst-triggered circuit-breaker*, and SSR frameworks sit ~8–12 ms at baseline (a mid-2026 1102 regression broke in-budget projects). Public surface = static assets + CSR (0 Worker CPU); realtime/Yjs bypasses the Worker (goes to Convex); keep the private Worker CPU-light (push compute to Convex/client). `$5/mo` is the escape hatch only if SSR is ever genuinely required.
- **Tracker convention:** see the blockquote at the top of this file.
- **Completion protocol:** when no open tickets or fog remain, the terminal session *assembles* (no new deciding) the decisions into the spec the Destination names — `docs/SPEC.md`, via a consistency pass over all ticket Resolutions + research + `CONTEXT.md`; gaps become final tickets or explicit defaults. The build that follows is out of scope for this map.
- **Brand:** the public surface needs a mark; see [Brand mark](tickets/I1-brand-mark.md) — scope is the symbol only, ARC lockup out, not time-bound, claimed so it stays off the frontier.

## Decisions so far

<!-- one line per closed ticket: gist + link. Empty until the first ticket resolves. -->

- [Public rendering: TanStack Start (SSR) vs Router (SPA + prerender)](tickets/A1-public-rendering.md) — **Router + Workers Static Assets**: fixed pages prerendered; manifestos are **CSR** until an admin batch-**"Syndicate"** rebuilds them to **static SEO** pages; **no SSR on the public surface** (sidesteps the 10 ms Worker-CPU cap). Unblocks part of G2.
- [How live does collaborative editing need to be?](tickets/D1-how-live.md) — **Split by mode** (Local/Cloud coined here, now in `CONTEXT.md`): Local = one editor, no realtime, Yjs doc persisted to browser storage, continuous autosave; Cloud = **presence + last-write-wins per field** — the CRDT pick (Yjs over Convex) was conditional on H1 and **H1 tripped it**, so the fallback is in force; presence stands under any fallback. **One engine, both modes** survives only if [Collab tech](tickets/D2-collab-tech.md) keeps the same doc shape client-side — now D2's question. Destination extended to make Local mode first-class. Unblocks D2, F1; graduates D4, L3.
- [Research: free-tier limits, durability & gotchas](tickets/H1-free-tier-research.md) — findings in [free-tier-limits](research/free-tier-limits.md): **NO-GO on Yjs-over-Convex** — capacity passed (~40× margin) but the official integration is gone (npm 404; 3-star community fork only), so D1's fallback applies. Workers free: **100 scripts/account, 100k req/day account-wide** (not per-Worker); DOs (SQLite-backed) now free; Workers AI ≈ 47–175 manifestos/day free; **Convex Auth free** (email sign-in needs Resend); official `@convex-dev/better-auth` exists — **Better-Auth no longer forces a 3rd Worker**. Unblocks [LLM provider](tickets/E1-llm-provider.md).
- [Auth provider + group provisioning & roles](tickets/B1-auth-and-group-provisioning.md) — **Convex Auth; Facilitator/Member, no Admin**. "Log in as a group" = *membership*: Members are individuals (username + password, no email) redeemed via facilitator-issued **Join codes** — no open signup anywhere, the spam answer; Facilitators self-register with verified email (Resend free) and own Communities, Groups, codes, roaming, and the publish trigger. **Worker count fixed at 2** (identity lives in Convex either way, per H1). Graduates fog A3 + L2 → tickets; feeds [Data isolation](tickets/C1-data-isolation.md) the membership model; G1/G2's trigger-holder is now the Facilitator.
- [Data model for the two fixed-schema tables](tickets/D3-form-table-model.md) — **Workshop** coined as the mode-agnostic container; **Actor map** = Actor rows `{name, idealBehaviour}` with first-class **Failure** children `{label, detail}`; **Play script** = Nodes (actor-linked **at creation only**, ad-hoc speakers allowed and **never bindable**) + directed **Dialogues** `{speaker→listener, text, 0..n Failure tags, reading order}`. Stance: **loose capture** — all fields free text (no short/long split), tags optional, deletes degrade gracefully, Table-1→2 sequence is guidance not a gate; per-table draft/complete status hands [Manifesto trigger](tickets/E2-summary-trigger.md) its hook. One doc per entity, client-generated stable IDs (D1's LWW + Yjs dual mandate). Glossary +8 terms. Unblocks E2; patches [Play-script graph model & rendering](tickets/D5-graph-script-model.md); graduates fog L1 → [ticket](tickets/L1-local-storage-engine.md).
- [Manifesto trigger — what starts generation, on what input](tickets/E2-summary-trigger.md) — **Generation is community-wide**: one manifesto per Workshop assembled from *every* Group's submitted tables; D3's group-owned container renamed **Rehearsal**, "Workshop" promoted to the community-wide run (two-level split in `CONTEXT.md`; D3 patched, L1/L2/L3 swept). Gate: Members **Sign-off** (visible x-of-y count to Group + Facilitator) → Facilitator **Submits** each Rehearsal (force allowed, recorded) → **Generate** unlocks when all Rehearsals are submitted; submitted tables **freeze** (facilitator un-submit reopens). Regeneration throttled per-Workshop/day, destructive-with-confirm (history stays F2 fog). Invocation: Facilitator's client → auth'd **Convex action** (reads frozen tables, serializes, checks cap) → stateless **Generation Worker** (text-in → LLM → text-out, no credentials). Serialization: one deterministic **linear-text renderer** (tags→labels, reading order) serving both the Worker payload and **Local mode's prompt export** — Local never calls the platform LLM; the L2 join is the only route from local work to generation. Feeds E3, G1, F1; E4 fog keeps only the prompt wrapper (needs E3). Glossary +6 terms/redfinitions.

## GitHub sync state

Local tickets mirror GitHub issues by an `gh:` frontmatter field. **Sync is partial** — the GitHub account (`sutesumit`) returned HTTP 403 *account suspended* mid-run.

**Published (local `gh:` wired):** A1→#2, A2→#1, B1→#3, C1→#4, D1→#5, H1→#6, D3→#7, D5→#8.

**Pending publication (no `gh:` field yet) — expected issue #s if created next, in this order:**
- D6→#9 (area:collab, ready)
- E3→#10 (area:manifesto, ready)
- G1→#11 (area:publish, ready, load-bearing)
- D2→#12 (area:collab, blocked — Blocked by #5)
- E1→#13 (area:llm, blocked — Blocked by #6)
- E2→#14 (area:llm, **resolved locally 2026-11-23 before publication** — create it closed with the decision comment, or skip)
- F1→#15 (area:manifesto, blocked — Blocked by #5)
- G2→#16 (area:publish, blocked — Blocked by #11, #2)
- I1→#17 (area:brand, ready, claimed)
- A4→#18 (area:public, ready — added after the sync ran)

**Also pending on GitHub:** close **#2** (A1 resolved locally), **#5** (D1 resolved locally), **#3** (B1 resolved locally), **#6** (H1 resolved locally), and **#7** (D3 resolved locally) with their decision comments. New tickets **D4** and **L3** have no `gh:` field yet, nor do **A3** and **L2** (graduated from B1) or **L1** (graduated from D3). To resume, re-auth (`gh auth refresh`) / resolve the suspension, create the 10 issues above + D4 + L3 + A3 + L2 + L1, close #2, #5, #3, #6, and #7, then add the matching `gh:` fields to those local tickets.

## Not yet specified

<!-- in-scope fog, too coarse to ticket yet; graduates as the frontier advances -->

- **E4 — Prompt assembly & table→prompt mapping.** Half-fixed by [Manifesto trigger](tickets/E2-summary-trigger.md): the serializer is decided (deterministic linear text; one renderer for the Worker payload and Local's prompt export). The wrapper half (system prompt, instructions, template scaffolding) graduates after [Manifesto definition](tickets/E3-manifesto-definition.md).
- **F2 — Manifesto versioning/history.** Graduates after [Manifesto editing workflow](tickets/F1-manifesto-editing.md).
- **G3 — Publish lifecycle** (revisions, retraction, versioning once public). Graduates after [Consensus semantics](tickets/G1-consensus-semantics.md).
- **H2 — Observability / error-handling within the free tier.**
- **H3 — Public↔private data-bridge & caching strategy** (partly graduates after [Publish bridge](tickets/G2-publish-bridge.md)). Partly scoped by the **candidate** Syndicate Worker seam (see [A3](tickets/A3-compute-decomposition.md)) but stays open — nothing is decided, so it is **not** graduated.

*(Fog graduated so far: A3 + L2 via [B1](tickets/B1-auth-and-group-provisioning.md); D4 + L3 via [D1](tickets/D1-how-live.md); L1 via [D3](tickets/D3-form-table-model.md) → [L1](tickets/L1-local-storage-engine.md).)*

## Out of scope

<!-- consciously ruled out of this effort -->

_Nothing ruled out yet._ Candidates to confirm with the human: payments/monetization, email/push notifications, internationalization (i18n), mobile-native apps. (Product is web-only and free-tier-bounded for now.)
