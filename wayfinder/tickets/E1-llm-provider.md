---
id: E1
title: "LLM provider — strictly free tier"
type: grilling
status: open
labels: [wayfinder:grilling]
blocked-by: [H1]
claim: null
---

## Question

Which **LLM provider**, **strictly free-tier** (no paid plan), generates the manifesto? Candidates:

- **Cloudflare Workers AI** — free daily Neurons, already on your platform (strong default).
- **Google Gemini** free tier (via AI Studio).
- **Groq** free tier (fast open models).
- **OpenRouter** free models.

Pick one that stays free, is reliable enough for a classroom/facilitated setting, and can take the **two structured tables** as input.

### Context
Blocked by [Free-tier research](H1-free-tier-research.md) so the choice rests on current limits, not memory. "Everything free" is a hard constraint.

### What resolving this decides
The LLM provider and the free-tier envelope it imposes.

### Candidate framing (not yet decided)
Under the working decomposition (fog [A3](../MAP.md)), the provider is invoked from a candidate **LLM Generation Worker** seam:

- **Workers AI** = already on-platform (no external hop); a natural fit for a Worker seam.
- **Gemini / Groq / OpenRouter** = an **external `fetch`** from that Worker. Such a call burns wall-clock (network) time, not CPU budget — so the 10 ms Worker-CPU cap is not the constraint; the provider's own free-tier rate/context limits are.
- **Provider free-tier limits ⇒ Worker-level throttling/back-off.** The envelope researched in [H1](H1-free-tier-research.md) shapes how the Generation Worker must rate-limit itself.
