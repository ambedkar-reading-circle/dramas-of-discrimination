---
id: A1
gh: 2
title: "Public rendering: TanStack Start (SSR) vs Router (SPA + prerender)"
type: grilling
status: closed
labels: [wayfinder:grilling]
blocked-by: []
claim: kilo
---

## Question

How should the **public, SEO-optimized pages** (homepage, info, about, resources, articles, and published manifestos) be rendered so crawlers see real, indexable HTML — **TanStack Start (SSR on Cloudflare Workers)** or **TanStack Router as an SPA with prerendering/SSG (Cloudflare Pages)** — while staying on the free tier?

### Context
- SSR (Start) is best for dynamic content like freshly-published manifestos; SPA + prerender is simpler and static-friendly for the mostly-fixed info pages.
- shadcn/ui works with **both** (React either way), so it does *not* decide this.
- This gates [Publish bridge](G2-publish-bridge.md) (how a manifesto reaches the public surface).

### What resolving this decides
The public-surface rendering model + hosting target on Cloudflare, free tier.

## Resolution

**Framework + hosting:** **TanStack Router** (not Start) on **Cloudflare Workers Static Assets**.

**Rendering by page type:**
- **Fixed public pages** (home, info, about, resources, articles) → **static prerender** (build-time HTML, served as Static Assets).
- **Published manifestos:**
  - **Unsyndicated** (approved by the group, not yet promoted) → **CSR**: a static HTML shell + the browser fetches the manifesto **directly from Convex**. Viewable by direct link, deliberately **not** SEO-indexed. **Zero Worker CPU.**
  - **Syndicated** (admin batch **"Syndicate"** action) → rebuilt to a **static HTML** page, fully **SEO-indexed**. **Zero Worker CPU.**

**Outcome:** *No SSR anywhere on the public surface*, so the free-tier 10 ms/req Worker-CPU cap never touches crawlable pages. The Worker is reserved for the private (auth-walled) app and the Syndicate-build trigger only.

**Why (facts):**
- CF Workers Free = 10 ms CPU/req; SSR typically 10–20 ms → per-request SSR risks **Error 1102** on crawlable pages (de-indexing). Static Assets are served **without invoking the Worker** (0 CPU) — verified.
- TanStack **Start is still RC**; **Router is stable** and is Start's core. Start's value-add (SSR/server functions/streaming) is exactly the part the public surface doesn't need.
- Convex clients connect **directly** (WebSocket/RPC), so the CSR data fetch and Yjs both **bypass the Worker** → 0 Worker CPU.
- No per-publish webhook needed: rebuilds are admin-batched via "Syndicate" (keeps the 500-builds/mo limit irrelevant).

**Provisions / reversibility:** Router→Start share the same route tree, so any route can move to SSR later without a rewrite; flipping to the $5/mo plan lifts the CPU cap with the same code; edge caching remains available if a route ever needs freshness.

**Hands off to:**
- [G2 — Publish bridge](G2-publish-bridge.md): the Syndicate workflow/state machine (who triggers it, batch mechanics, "approved-but-unsyndicated = CSR" visibility) lives here.
- [C1 — Data isolation](C1-data-isolation.md) / [A2 — Content model](A2-content-model.md): Convex must expose published-but-**unsyndicated** manifestos via a **public-read** access rule (the CSR fetch path). A published-but-not-syndicated manifesto is readable by anyone with the URL; syndication adds SEO, not access.
- [H3](../MAP.md) fog (public↔private data-bridge): the CSR-from-Convex read is one concrete instance; partly graduates after G2.

## Validation (external evidence)

Real-world signal confirms the no-SSR decision:
- Next.js SSR on free Workers sits at the ~10 ms **framework baseline** (8–12 ms per benign request) → constant `Worker exceeded CPU time` / 503s after migrating Pages→Workers. The poster's own root cause: *"the main page isn't static."* (r/CloudFlare — `leszcz`, Sep 2025)
- The 10 ms is a **soft, circuit-breaker limit**, not a hard per-request cap: ~50 concurrent over-budget requests trip it, after which **all** requests hard-kill at 10 ms until a period of idleness. Wall-time waits (D1/R2/external API) don't count. (r/CloudFlare — `xia03`)
- **Mid-2026 regression:** projects previously *within* 10 ms started failing 1102 with **no code change**; the cited escapes were exactly *"Workers Paid **or disabling SSR**."* (r/CloudFlare — `DevJedis`, Jul 2026)
- Static Assets are **$0** — same pricing as Pages. (Comm MVP `KianNH`)

**Implication:** our public surface (static + CSR) and our light private Worker (SPA shell + Convex-proxy API; Yjs/realtime bypass the Worker) sit in the safe zone. SSR on free Workers is *unstable*, not merely risky — we avoid it. $5/mo remains the documented escape hatch if SSR is ever genuinely required.
