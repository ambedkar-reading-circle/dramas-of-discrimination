---
id: A1
title: "Public rendering: TanStack Start (SSR) vs Router (SPA + prerender)"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: []
claim: null
---

## Question

How should the **public, SEO-optimized pages** (homepage, info, about, resources, articles, and published manifestos) be rendered so crawlers see real, indexable HTML — **TanStack Start (SSR on Cloudflare Workers)** or **TanStack Router as an SPA with prerendering/SSG (Cloudflare Pages)** — while staying on the free tier?

### Context
- SSR (Start) is best for dynamic content like freshly-published manifestos; SPA + prerender is simpler and static-friendly for the mostly-fixed info pages.
- shadcn/ui works with **both** (React either way), so it does *not* decide this.
- This gates [Publish bridge](G2-publish-bridge.md) (how a manifesto reaches the public surface).

### What resolving this decides
The public-surface rendering model + hosting target on Cloudflare, free tier.
