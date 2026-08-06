# Dramas of Discrimination — Wayfinder Map

> **Tracker:** local-markdown. Map = this file. Tickets = `wayfinder/tickets/<ID>-<slug>.md`. Research = `wayfinder/research/`. Each ticket carries frontmatter: `status` (open|closed), `type` (research|prototype|grilling|task), `blocked-by` (list of IDs), `claim` (assignee). The **frontier** = open tickets whose `blocked-by` are all *closed* and whose `claim` is empty. Refer to tickets by **title**, never a bare ID.

## Destination

A buildable, opinionated, **architecture-level design spec** for the "Dramas of Discrimination" web app: a public, SEO-optimized surface (homepage, info, about, resources, articles, and **published manifestos**) alongside an auth-walled area where ~20–25 people in 4–5 groups of 4–5 each **collaboratively build two tables** from a chosen discrimination scenario — (1) *actors | ideal behavior | failures*, and (2) a **play-script graph** (nodes = actors, edges = dialogues that highlight the failures). An LLM turns those tables into a **policy manifesto** for a more inclusive/fair community; groups refine it and, upon consensus, **publish** it to the public surface. **Strictly free-tier-bounded; durable; scale-later; not self-hostable.** The team builds it themselves from the spec.

## Notes

- **Domain:** discrimination-scenario roleplay → structured tables → LLM-generated fairness manifesto → consensus → public publish.
- **Skills every session should consult:** `/grilling` + `/domain-modeling` (resolve decisions one at a time), `/research` (fact-finding), `/prototype` (when "how should it look/behave" is the question).
- **Standing preferences:** free-tier-bounded *and* durable; not self-hostable; scale figured later; spec is **opinionated** (it picks, not presents menus); **architecture-level** depth (not per-endpoint contracts).
- **Candidate stack (confirmed by tickets, not here):** TanStack (Start or Router) on Cloudflare; Convex for data + realtime; free auth (Convex Auth or Better-Auth); shadcn/ui; a free-tier LLM.
- **Tracker convention:** see the blockquote at the top of this file.

## Decisions so far

<!-- one line per closed ticket: gist + link. Empty until the first ticket resolves. -->

_None yet._

## Not yet specified

<!-- in-scope fog, too coarse to ticket yet; graduates as the frontier advances -->

- **D4 — Conflict/merge UX** for simultaneous table edits. Graduates after [How live does editing need to be?](tickets/D1-how-live.md).
- **E4 — Prompt assembly & table→prompt mapping.** Graduates after [Manifesto trigger](tickets/E2-summary-trigger.md) + [Manifesto definition](tickets/E3-manifesto-definition.md).
- **F2 — Manifesto versioning/history.** Graduates after [Manifesto editing workflow](tickets/F1-manifesto-editing.md).
- **G3 — Publish lifecycle** (revisions, retraction, versioning once public). Graduates after [Consensus semantics](tickets/G1-consensus-semantics.md).
- **H2 — Observability / error-handling within the free tier.**
- **H3 — Public↔private data-bridge & caching strategy** (partly graduates after [Publish bridge](tickets/G2-publish-bridge.md)).

## Out of scope

<!-- consciously ruled out of this effort -->

_Nothing ruled out yet._ Candidates to confirm with the human: payments/monetization, email/push notifications, internationalization (i18n), mobile-native apps. (Product is web-only and free-tier-bounded for now.)
