# Dramas of Discrimination

The domain of a workshop platform where communities rehearse responses to discrimination and author manifestos of inclusion. This glossary is the project's shared language.

## Language

### Modes

**Local mode**:
Everything runs entirely in one browser on one device; work persists to browser storage; no account; nothing leaves the device.
_Avoid_: offline mode, solo mode

**Cloud mode**:
The community opts in: a Facilitator registers, members join their Group via Join codes, and their work syncs to the platform's remote database; any member can join from their own device.
_Avoid_: online mode, synced mode, hosted mode

**Group**:
The unit of collaboration — one set of ~4–5 people working through one Scenario and its two tables.
_Avoid_: team, circle

**Member**:
An individual person in Cloud mode, authenticated as themselves on their own device and belonging to a Group; the unit of presence, editing identity, and consensus attribution.
_Avoid_: user, account, participant

**Facilitator**:
The person who registers a Community with a verified email, creates its Groups, issues Join codes, and holds community-level authority (roaming access, the publish trigger).
_Avoid_: admin, organizer, moderator

**Join code**:
The facilitator-issued, group-scoped credential a person redeems — with a chosen username and password — to become a Member; without one there is no path in.
_Avoid_: invite link, invite email, access code

**Community**:
The body that owns a Workshop — ~20–25 people organized into 4–5 groups.
_Avoid_: organization, cohort

### Workshop artifacts

**Workshop**:
The community-wide run of the method — every Group working its own Rehearsal in parallel, plus the manifesto drafts that follow; the Facilitator's Generate trigger reads the Workshop as a whole. Belongs to exactly one Community in Cloud mode; has no Local-mode form.
_Avoid_: session, project, workspace, event

**Rehearsal**:
One Group's run of the method — its chosen Scenario, Actor map, and Play script; the unit of submission to the Workshop. Owned by exactly one Group in Cloud mode; standalone in browser storage in Local mode.
_Avoid_: workshop (that is the community-wide parent), session, run, Table bundle

**Sign-off**:
A Member's visible declaration that their Group's Rehearsal is ready; each Group shows its Sign-off count (x of y) to its Members and the Facilitator.
_Avoid_: approval, vote, ack, check-in

**Submission**:
The Facilitator's act of handing a Rehearsal over to its Workshop — ideally once every Member has signed off, but permitted (and recorded as forced) at a lower count.
_Avoid_: upload, hand-in

**Generate**:
The Facilitator's Workshop-level trigger that assembles every submitted Rehearsal's tables into one input and produces the manifesto draft; available only when all Rehearsals are submitted.
_Avoid_: summarize, publish (that is the later Syndicate step)

**Prompt export**:
Local mode's affordance that renders a Rehearsal's tables as a copy-paste prompt for the person's own chosen LLM; the platform's generation is never invoked, and nothing leaves the device unless the person carries it out.
_Avoid_: offline generation, export manifesto

**Scenario**:
The real or imagined discrimination situation a Group works through; the input both tables are built from.
_Avoid_: case, story, prompt

**Actor map**:
The first of the Rehearsal's two tables — one row per Actor: its name, its Ideal behaviour, and its Failures.
_Avoid_: Table 1, actor table, stakeholder map

**Actor**:
A person, group, or institution in the Scenario with ideal behaviour expected of it — one row of the Actor map, one candidate node of the Play script.
_Avoid_: character, role, stakeholder

**Ideal behaviour**:
The conduct the Scenario expects of an Actor; the Actor map's second column, one per Actor.
_Avoid_: responsibility, duty

**Failure**:
A specific way an Actor falls short of its Ideal behaviour; a first-class child of the Actor's row, addressable by the tags Dialogues carry.
_Avoid_: challenge, barrier, mistake

**Play script**:
The second of the Rehearsal's two tables — the Scenario staged as directed Dialogues between speakers, each Dialogue tagged to the Failures it shows.
_Avoid_: Table 2, dialogue graph, storytime sheet, scene graph

**Dialogue**:
A directed line in the Rehearsal's Play script — one speaker to one listener — which may carry tags naming the Failures it shows. A speaker without an Actor row stays unlinked forever.
_Avoid_: line, utterance, edge
