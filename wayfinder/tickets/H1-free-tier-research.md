---
id: H1
gh: 6
title: "Research: free-tier limits, durability & gotchas (Cloudflare, Convex, auth, LLM)"
type: research
status: closed
labels: [wayfinder:research]
blocked-by: []
claim: "research-subagent"
---

## Question

What are the **current free-tier limits, durability guarantees, and gotchas** for every service this strictly-free app might use? (Fact-finding only — no design decisions.)

Cover: **Cloudflare** (Workers, Pages, KV, D1, Durable Objects — confirm they need the $5 plan, R2, Workers AI — free daily Neurons & model list, Queues); **Convex** (free-tier quotas, reactive/realtime + Yjs support & limits, Convex Auth); **auth cost model** (Convex Auth vs Better-Auth self-hosted); **LLM free tiers** (Workers AI, Gemini, Groq, OpenRouter — rate limits, context size, fit for turning two structured tables into a templated manifesto).

### Resolution in progress
A `/research` subagent was fired at chart time. Findings land in `wayfinder/research/free-tier-limits.md`. This ticket unblocks [LLM provider](E1-llm-provider.md).

### Scope expansion (adds to the in-progress research; independent of any decision)
The data + realtime plane now rests on Convex's free tier, and the candidate compute decomposition (fog [A3](../MAP.md)) introduces Worker seams — so the research must additionally cover these, and the findings in `wayfinder/research/free-tier-limits.md` should capture them explicitly:

- **Precise Convex free-tier limits** — read/write operation quotas, bandwidth, storage & durability, and especially **realtime/Yjs connection & document caps**. The realtime plane bypasses any Worker and goes **client↔Convex directly**, so these numbers are load-bearing for the whole app.
- **Per-account Worker-script count limit** — the candidate decomposition spans up to 2–3 Workers (LLM Generation, Syndicate/Publish, optional Private-API). Confirm how many scripts a free Cloudflare account can actually deploy.
- **Request quotas across multiple Workers** — confirm whether invocation/CPU limits are **per-Worker or account-wide** when several Workers run concurrently.

These matter regardless of whether the 2-vs-3-Worker framing is ever formalized.

### Now gates a decision (raised by D1)
[D1](D1-how-live.md) made the Cloud-mode editing model **Yjs CRDT, conditional on these findings**. The Convex free-tier Yjs/connection/ops numbers above are no longer just load-bearing context — if they don't accommodate 4–5 concurrent editors per group × 4–5 groups, the spec **falls back to presence + last-write-wins per field**. Call this out explicitly in the findings verdict.

## Resolution

Findings: [../research/free-tier-limits.md](../research/free-tier-limits.md) (researched 2026-11-23, official docs only).

**Verdict: NO-GO for Yjs-over-Convex as D1 specified it — on support risk, not capacity.** Convex free capacity passes with huge margin (1,000 concurrent sessions, 16 concurrent queries/mutations, 1M function calls/month vs ~25 editors), but the official Convex Yjs integration no longer exists (`@convex-dev/yjs` gone from npm, zero docs/repos); only a 3-star community `y-convex` remains. Per D1's conditionality, the spec falls back to **presence + last-write-wins per field**; the capacity numbers are recorded so a deliberate community-package/DIY reversal wouldn't be quota-blocked.

Supporting findings: **Convex Auth is free-plan-included (supports the 2-Worker path; Email+Password needs Resend + domain — 3k emails/mo free)**; Workers Free allows **100 scripts/account** but the **100k req/day pool is account-wide, not per-Worker** — the 2-vs-3 Worker choice changes organization, not quota; and the official `@convex-dev/better-auth` component undermines the "Better-Auth forces a 3rd Worker" assumption (B1/A3 own that call). Unblocks [LLM provider](E1-llm-provider.md) with a four-way provider comparison.
