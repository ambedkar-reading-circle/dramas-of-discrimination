# Dramas of Discrimination

A buildable, opinionated, **architecture-level design spec** for the "Dramas of Discrimination" web app.

## What this is

A web app with two surfaces:

1. **A public, SEO-optimized surface** — homepage, info, about, resources, articles, and published manifestos.
2. **An auth-walled collaborative area** — where ~20–25 people (in 4–5 groups of 4–5 each) take a chosen discrimination scenario and **collaboratively build two tables**:
   - **Table 1** — *actors | ideal behavior | failures*
   - **Table 2** — a **play-script graph** (nodes = actors, edges = dialogues that highlight the failures)

An **LLM turns those tables into a policy manifesto** for a more inclusive / fair community. Groups refine it and, upon **consensus**, **publish** it to the public surface.

## Standing constraints

- **Strictly free-tier-bounded** — every service stays on a free plan.
- **Durable** — data survives across sessions.
- **Scale-later** — correctness first, scale figured out later.
- **Not self-hostable** — managed free-tier services, no self-hosting.
- **Opinionated** — the spec *picks*, it does not present menus.

## Candidate stack

(confirmed by individual decision tickets, not yet locked here)

- **TanStack** (Start or Router) on **Cloudflare**
- **Convex** for data + realtime
- **Free auth** (Convex Auth or Better-Auth)
- **shadcn/ui**
- A **free-tier LLM**

## Status

This repo is in the **architecture spec phase** — no application code yet. Planning and decision-tracking happen in [**GitHub Issues**](../../issues); the original decision-tree snapshot is in [`wayfinder/MAP.md`](wayfinder/MAP.md).
