---
id: A4
title: "Public-surface discoverability: robots.txt, sitemap, JSON-LD, Open Graph, llms.txt"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: [A1]
claim: null
---

## Question

What **crawler/preview/AI-agent discoverability layer** does the public surface carry, on top of the rendering decision already made in [Public rendering](A1-public-rendering.md)?

- **robots.txt** — what's allowed; does it exclude the auth-walled app shell and unsyndicated (CSR-only) manifesto routes?
- **sitemap.xml** — fixed pages plus syndicated manifesto pages; regenerated when the admin **Syndicate** batch runs, or stale-until-rebuilt?
- **JSON-LD (`schema.org`)** — which types for which page (e.g. `AboutPage`/`WebSite` for fixed pages, `Article` for manifestos/articles); where emitted (prerender step vs Syndicate snapshot).
- **Open Graph + Twitter cards** — which pages get them; per-page images vs one default image (candidate source: the [Brand mark](I1-brand-mark.md), 1200×630); canonical URLs.
- **llms.txt** — do we publish one, and is it generated (from the same content model as the sitemap) so LLM agents get a curated index of manifestos/articles?

### Context

- [Public rendering](A1-public-rendering.md) (resolved) fixed the shape: fixed pages **prerendered**, manifestos **CSR until syndicated** to static SEO pages. This ticket is the metadata layer *on* that shape — it needed A1, nothing else.
- `docs/inspiration.md` §7 already lists the standard layer (Open Graph 1200×630, Twitter cards, canonical, robots meta, JSON-LD) — this ticket decides which of it we adopt and how it's generated.
- **Coordinate, don't block:** sitemap/snapshot mechanics touch the [Publish bridge](G2-publish-bridge.md) seam (the Syndicate rebuild is the natural regeneration hook) and the OG default image touches the [Brand mark](I1-brand-mark.md) — but the *decision* of what the layer contains is makeable now.

### What resolving this decides

The full list of discoverability/metadata artifacts the public surface ships, how each is generated (build-time prerender vs Syndicate rebuild), and what each contains. Not per-page markup contracts — architecture level.

## Resolution

<!-- empty; MAP.md lists only closed tickets under "Decisions so far" -->
