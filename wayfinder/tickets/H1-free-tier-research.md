---
id: H1
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
