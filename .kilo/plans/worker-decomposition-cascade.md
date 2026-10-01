# Plan: Weave the Worker-decomposition framing into tickets (candidate only — no decision yet)

## Stance chosen by user
**Candidate framing only.** Do **not** create a closed decision ticket yet. The decomposition stays a *leading candidate*, woven as context notes into the relevant tickets, and is revisited/promoted once **B1 (auth)** resolves (which fixes the Worker count at 2 vs 3).

The candidate framing to weave in (from our discussion):
- **Convex is the backend-of-record** — owns the data API, access rules, realtime, and (if chosen) identity.
- **Public surface has NO Worker** — Static Assets + CSR-from-Convex (per A1).
- **Realtime (Yjs) bypasses any Worker** — client ↔ Convex directly.
- **Two candidate Worker seams:** (1) **LLM Generation** Worker; (2) **Syndicate/Publish** Worker.
- **Optional 3rd** — a thin **Private-API Worker** *only if* B1 chooses Better-Auth.
- **Convex free-tier limits become load-bearing** — the data + realtime plane rests on them.

---

## Proposed changes

### 1. MAP.md
- **"Not yet specified" (fog):** add a new fog line — **"A3 — Compute decomposition (Worker seams + Convex-as-backend). Graduates after B1 (auth)."** This is the conventional home for too-coarse-to-decide-yet items, and keeps it visible without declaring it decided.
- **"Notes"/"Candidate stack":** optionally add a one-line *candidate* note (not a decision): *"Working hypothesis: Convex as backend; Workers limited to glue seams (LLM generation, syndicate); revisit at B1."*
- **Fog H3** (public↔private data-bridge): note it is *partly* scoped by the candidate Syndicate Worker, but stays open (not graduated) since nothing is decided.
- Do **NOT** add to "Decisions so far" (nothing is closed).

### 2. Existing tickets — candidate-framing context notes (not decisions)

| Ticket | Impact | Note to add |
|---|---|---|
| **H1** (open, in progress) | **Expand scope** *(independent of the decision — research these regardless)* | Add: per-account Worker-script count limit, request quotas across multiple Workers, and **precise Convex free-tier limits** (read/write ops, realtime/Yjs connection caps, durability) — the data+realtime plane rests on these. **Highest leverage.** |
| **B1** (open) | **Reframe** | Add: under the candidate decomposition, **Convex Auth ⇒ 2 Workers; Better-Auth ⇒ forces a 3rd Private-API Worker.** So the auth choice carries a Worker-count consequence. |
| **G2** (open, blocked G1+A1) | **Strong reframe** | Add: the *candidate* shape of the bridge is a **Syndicate Worker** — consensus (Convex) → admin triggers → fetch manifesto → render static HTML → deploy as Static Assets; plus static-snapshot immutability/versioning. (Keep as candidate; not decided.) |
| **C1** (open) | **Reinforce** | Add: isolation must live in **Convex access rules**; the data path is client↔Convex, so a Worker gateway cannot be relied on. |
| **E1** (open, blocked H1) | **Reframe** | Add: under the candidate framing, the provider is invoked from an **LLM Generation Worker**. Workers AI = on-platform; others = external fetch (wall-clock, fine for CPU budget). Provider free-tier limits ⇒ Worker-level throttling. |
| **E2** (open, blocked D3) | **Reframe** | Add: the candidate trigger **fires an LLM Generation Worker** with the assembled tables. |
| **G1** (open) | **Reframe** | Add: consensus = Convex state; reaching it **enables** (not triggers) the candidate Syndicate Worker; publish stays admin-gated. |
| **D2** (open, blocked D1) | **Add constraint** | Add: realtime transport is Convex/Yjs direct; must **not** route through a Worker. |
| **A2** (open) | **Reinforce** | Add: info pages = file-based static; manifestos reach the public surface only via the candidate Syndicate Worker (strengthens hybrid (c)). |
| **D1** (open) | **Reinforce** | Add: realtime/Yjs bypasses Workers regardless of the liveness choice. |
| **D3** (open) | **Minor** | Add: tables live in Convex; authored via the realtime path, read via Convex queries. |
| **D6** (open) | **Minor** | Add: in-app discussion (if any) = Convex data + realtime, no Worker. |
| **F1** (open, blocked D1) | **Minor** | Add: manifesto editing via the realtime path (Convex/Yjs), consistent with D1. |
| **A1** (closed) | **None** | No change — its "Worker reserved for private app + Syndicate trigger" line already aligns. |
| **D5** (open) | **Minimal** | Unaffected by the decomposition. |
| **E3** (open) | **Minimal** | Unaffected. |

### 3. Ordering
1. **MAP.md** — add the fog line (A3 candidate) + optional candidate note; keep H3 open.
2. **H1** — expand scope (de-risks the Convex reliance; unblocks E1). Highest leverage.
3. **B1, G2, C1** — the most materially reframed tickets.
4. **E1, E2, G1, D2, A2, D1** — context notes.
5. **D3, D6, F1** — minor notes.
6. **A1, D5, E3** — skip.

### 4. Follow-up (after B1 resolves)
- Revisit the fog; if the candidate holds, **promote A3 to a closed decision ticket** and move its line from "Not yet specified" to "Decisions so far" in MAP.md.

---

## Notes
- Every ticket edit is a **context/framing addition**, explicitly marked *candidate* / *working hypothesis* — no `status` flips, no new resolutions.
- H1's scope expansion is safe to do now regardless of whether the decomposition is ever decided (those limits matter either way).
