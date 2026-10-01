# Dramas of Discrimination — Wayfinder Map

> **Tracker:** local-markdown. Map = this file. Tickets = `wayfinder/tickets/<ID>-<slug>.md`. Research = `wayfinder/research/`. Each ticket carries frontmatter: `status` (open|closed), `type` (research|prototype|grilling|task), `blocked-by` (list of IDs), `claim` (assignee). The **frontier** = open tickets whose `blocked-by` are all *closed* and whose `claim` is empty. Refer to tickets by **title**, never a bare ID.

## Destination

A buildable, opinionated, **architecture-level design spec** for the "Dramas of Discrimination" web app: a public, SEO-optimized surface (homepage, info, about, resources, articles, and **published manifestos**) alongside an auth-walled area where ~20–25 people in 4–5 groups of 4–5 each **collaboratively build two tables** from a chosen discrimination scenario — (1) *actors | ideal behavior | failures*, and (2) a **play-script graph** (nodes = actors, edges = dialogues that highlight the failures). An LLM turns those tables into a **policy manifesto** for a more inclusive/fair community; groups refine it and, upon consensus, **publish** it to the public surface. **Strictly free-tier-bounded; durable; scale-later; not self-hostable.** The team builds it themselves from the spec.

## Notes

- **Domain:** discrimination-scenario roleplay → structured tables → LLM-generated fairness manifesto → consensus → public publish.
- **Skills every session should consult:** `/grilling` + `/domain-modeling` (resolve decisions one at a time), `/research` (fact-finding), `/prototype` (when "how should it look/behave" is the question).
- **Standing preferences:** free-tier-bounded *and* durable; not self-hostable; scale figured later; spec is **opinionated** (it picks, not presents menus); **architecture-level** depth (not per-endpoint contracts).
- **Candidate stack (confirmed by tickets, not here):** TanStack **Router** on Cloudflare (Start ruled out — SSR hits the free 10 ms CPU cap; see [A1](tickets/A1-public-rendering.md)); Convex for data + realtime; free auth (Convex Auth or Better-Auth); shadcn/ui; a free-tier LLM.
- **Working hypothesis (candidate, *not* decided — revisit after [B1](tickets/B1-auth-and-group-provisioning.md)):** Convex is the **backend-of-record** (owns the data API, access rules, realtime, and identity); the **public surface has no Worker** (Static Assets + CSR); realtime/Yjs goes **client↔Convex directly**, bypassing any Worker; Workers are limited to **glue seams only** — a candidate **LLM Generation** Worker and a candidate **Syndicate/Publish** Worker, plus an **optional 3rd Private-API Worker only if** B1 chooses Better-Auth. See fog **A3** below.
- **Free-tier Worker discipline (validated by external evidence, see A1):** no SSR on Workers — the 10 ms cap is a *soft, burst-triggered circuit-breaker*, and SSR frameworks sit ~8–12 ms at baseline (a mid-2026 1102 regression broke in-budget projects). Public surface = static assets + CSR (0 Worker CPU); realtime/Yjs bypasses the Worker (goes to Convex); keep the private Worker CPU-light (push compute to Convex/client). `$5/mo` is the escape hatch only if SSR is ever genuinely required.
- **Tracker convention:** see the blockquote at the top of this file.

## Decisions so far

<!-- one line per closed ticket: gist + link. Empty until the first ticket resolves. -->

- [Public rendering: TanStack Start (SSR) vs Router (SPA + prerender)](tickets/A1-public-rendering.md) — **Router + Workers Static Assets**: fixed pages prerendered; manifestos are **CSR** until an admin batch-**"Syndicate"** rebuilds them to **static SEO** pages; **no SSR on the public surface** (sidesteps the 10 ms Worker-CPU cap). Unblocks part of G2.

## GitHub sync state

Local tickets mirror GitHub issues by an `gh:` frontmatter field. **Sync is partial** — the GitHub account (`sutesumit`) returned HTTP 403 *account suspended* mid-run.

**Published (local `gh:` wired):** A1→#2, A2→#1, B1→#3, C1→#4, D1→#5, H1→#6, D3→#7, D5→#8.

**Pending publication (no `gh:` field yet) — expected issue #s if created next, in this order:**
- D6→#9 (area:collab, ready)
- E3→#10 (area:manifesto, ready)
- G1→#11 (area:publish, ready, load-bearing)
- D2→#12 (area:collab, blocked — Blocked by #5)
- E1→#13 (area:llm, blocked — Blocked by #6)
- E2→#14 (area:llm, blocked — Blocked by #7)
- F1→#15 (area:manifesto, blocked — Blocked by #5)
- G2→#16 (area:publish, blocked — Blocked by #11, #2)

**Also pending on GitHub:** close **#2** (A1 is resolved locally) with the decision comment. To resume, re-auth (`gh auth refresh`) / resolve the suspension, create the 8 issues above, close #2, then add the matching `gh:` field to those 8 local tickets.

## Not yet specified

<!-- in-scope fog, too coarse to ticket yet; graduates as the frontier advances -->

- **A3 — Compute decomposition** (Worker seams + Convex-as-backend). Candidate framing only — nothing is decided; this is the home for the 2-Worker vs 3-Worker question. Graduates after [Auth provider + group provisioning](tickets/B1-auth-and-group-provisioning.md), which fixes the Worker count at **2 (Convex Auth)** vs **3 (Better-Auth)**.
- **D4 — Conflict/merge UX** for simultaneous table edits. Graduates after [How live does editing need to be?](tickets/D1-how-live.md).
- **E4 — Prompt assembly & table→prompt mapping.** Graduates after [Manifesto trigger](tickets/E2-summary-trigger.md) + [Manifesto definition](tickets/E3-manifesto-definition.md).
- **F2 — Manifesto versioning/history.** Graduates after [Manifesto editing workflow](tickets/F1-manifesto-editing.md).
- **G3 — Publish lifecycle** (revisions, retraction, versioning once public). Graduates after [Consensus semantics](tickets/G1-consensus-semantics.md).
- **H2 — Observability / error-handling within the free tier.**
- **H3 — Public↔private data-bridge & caching strategy** (partly graduates after [Publish bridge](tickets/G2-publish-bridge.md)). Partly scoped by the **candidate** Syndicate Worker seam (see fog **A3**) but stays open — nothing is decided, so it is **not** graduated.

## Out of scope

<!-- consciously ruled out of this effort -->

_Nothing ruled out yet._ Candidates to confirm with the human: payments/monetization, email/push notifications, internationalization (i18n), mobile-native apps. (Product is web-only and free-tier-bounded for now.)
