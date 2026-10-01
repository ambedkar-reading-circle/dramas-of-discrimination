# Dramas of Discrimination

An open-source web application through which communities **rehearse ethical responses to caste-based discrimination** in workplaces and higher education — and **author their own manifestos of inclusion**.

Built by the [Ambedkar Reading Circle](https://github.com/ambedkar-reading-circle), an anti-caste collective in Bengaluru, out of an interactive, art-based workshop that has run across universities, NGOs, museums, and public spaces.

---

## Why

Laws, policies, and guidelines curb discrimination, but they work through antagonistic frames — perpetrator, breach, penalty — that produce compliance without ownership. Belonging has to be built *in parallel to law*, by the communities it concerns, through constitutional values: equality and fraternity practised, not just legislated.

**Dramas of Discrimination** is a platform for rehearsing that change. Participants don't only discuss discrimination — they name it, map it systemically, stage it, intervene in it, and then draft what inclusion should mean in their own context.

## The workshop

A participatory, art-based method combining **systems thinking** and **Theatre of the Oppressed**:

1. A community takes a real or imagined discrimination scenario and analyses it through a systemic lens.
2. The scenario is actively mapped — actors, ideal behaviour, failures.
3. It is staged as **forum theatre**: participants step in and rehearse interventions.
4. The community distills the rehearsal into a **manifesto of inclusion** — its own policy of belonging, grounded in constitutional values.

The community, not the facilitators, defines what safety and inclusion mean in its own context. The structure only holds people together; it does not direct them.

## The web app

The app converts the workshop's facilitation manual into a freely accessible, open-source tool so any community or student group can run the process independently. Three functions:

1. **Online facilitation guide** — dual-mode: groups log in and self-facilitate through the exercises (recorded guidance at each step), or an in-person trained facilitator leads the room.
2. **Repository** — workshop exercise materials in one place.
3. **Data portal** — opt-in: a community submits its workshop instance, drafts its manifesto with LLM assistance, edits it into its own voice, and publishes it on a public portal alongside manifestos from other communities — a participant-authored reference document for inclusion policy.

Two surfaces:

1. **A public, SEO-optimized surface** — homepage, info, about, resources, articles, and published manifestos.
2. **An auth-walled collaborative area** — where a group (~20–25 people in 4–5 smaller groups) takes a chosen discrimination scenario and **collaboratively builds two tables**:
   - **Table 1** — *actors | ideal behavior | failures*
   - **Table 2** — a **play-script graph** (nodes = actors, edges = dialogues that highlight the failures)

   An **LLM turns those tables into a draft manifesto of inclusion**. The group refines it and, upon **consensus**, **publishes** it to the public surface.

## Data sovereignty

The app is a shell over locally owned data. Participants' forms and responses stay in their own browser — nothing is stored server-side by default, and unpublished work never leaves the community's own devices.

Publishing is always the community's choice. A group that opts in can sync to cloud storage, log in as a group, and take ownership of its data — and then choose to **publish its workshop documents and its manifesto of inclusion** on the **publicly available portal** of this website and database, where they appear alongside manifestos from other communities as a participant-authored reference document for inclusion policy. What gets published, and when, is decided solely by the community that authored it.

As it grows, this public collection becomes more than an archive. For **other communities** — including those just setting out to cultivate inclusivity and belonging of their own — it offers kinship and precedent: manifestos to learn from, adapt, and answer in their own voice. For **agencies working in this domain** and **research institutes**, it offers grounded, community-authored evidence that can inform policy.

## Design principles

- **Rehearsal over discussion** — change is practised, not only talked about.
- **Community ownership** — communities draft their own policies of inclusion and own the onus of belonging.
- **Alongside law** — the app complements external legal and policy frameworks; it does not replace them.
- **Built in the open** — developed through collaborative open-source coding, inviting software engineers from the communities themselves to pitch in.

## Where the workshop has run

Public sessions in Cubbon Park; the National Law School of India University; the Museum of Art and Photography; the Indian Institute for Human Settlements; Hasiru Dala; and the 2nd Global Conference on Caste, Business, and Society at the University of Bath, UK — where the workshop-as-research-methodology was selected for presentation.

---

## This repository

A buildable, opinionated, **architecture-level design spec** for the web app described above.

### Standing constraints

- **Strictly free-tier-bounded** — every service stays on a free plan.
- **Durable** — data survives across sessions.
- **Scale-later** — correctness first, scale figured out later.
- **Not self-hostable** — managed free-tier services, no self-hosting.
- **Opinionated** — the spec *picks*, it does not present menus.

### Candidate stack

(confirmed by individual decision tickets, not yet locked here)

- **TanStack** (Start or Router) on **Cloudflare**
- **Convex** for data + realtime
- **Free auth** (Convex Auth or Better-Auth)
- **shadcn/ui**
- A **free-tier LLM**

### Status

This repo is in the **architecture spec phase** — no application code yet. Planning and decision-tracking happen in [**GitHub Issues**](../../issues); the original decision-tree snapshot is in [`wayfinder/MAP.md`](wayfinder/MAP.md).

---

## About the Ambedkar Reading Circle

The [Ambedkar Reading Circle](https://www.instagram.com/arc.bangalore/) is a volunteer-driven anti-caste collective founded in Bengaluru in April 2023, making anti-caste worldviews accessible in public spaces and public consciousness through reading circles, workshops, talks, and film screenings — including regular open-air sessions in Cubbon Park.

## License

[GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0). Anyone may use, study, modify, and share this work — including running modified versions on a network — provided that the source and the original copyright notice stay attached and derivatives are released under the same license.
