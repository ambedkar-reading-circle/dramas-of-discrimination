---
id: H1
gh: 6
title: "Research: free-tier limits, durability & gotchas (Cloudflare, Convex, auth, LLM)"
type: research
status: open
labels: [wayfinder:research]
blocked-by: []
claim: null
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
