/**
 * Slide 08 carries on from slide 07's workshop: the same Scenario and Actor
 * map. Local mode exports the Group's worksheets as a prompt for the
 * Community's own LLM; Cloud mode generates the Manifesto of Inclusion and
 * lets the Group's Members edit it together.
 *
 * The Manifesto is the Community's own policy on discrimination, rooted in
 * the Scenario its Groups acted out: each rule answers a Failure on the
 * Actor map, and names who acts. It names no individual.
 */
import {
  actorRows,
  columns,
  constitutionalValues,
  memberById,
  scenarioCell,
} from '../../shared/content/actorMap'
import type { Writer } from '../../shared/content/actorMap'

const filledRows = actorRows.filter(
  (row) => row.ideal.text || row.failures.text,
)

/** Local mode's Prompt export: the Group's worksheets, as a prompt to paste into any LLM. */
export const prompt = [
  'You are helping a Community write its Manifesto of Inclusion after a Dramas of Discrimination workshop. In the workshop, a Group acted out a real situation of discrimination and mapped who was involved, what was expected of each of them, and how they failed. Their worksheets are below.',
  '',
  '## Scenario',
  scenarioCell.text,
  `Constitutional values it violates: ${constitutionalValues
    .filter((item) => item.struck)
    .map((item) => item.text)
    .join(', ')}`,
  '',
  '## Actor map',
  ...filledRows.flatMap((row, index) => [
    `${index + 1}. ${row.actor.text}`,
    `   ${columns.ideal.name}: ${row.ideal.text || '(left blank)'}`,
    `   ${columns.failures.name}: ${row.failures.text || '(left blank)'}`,
  ]),
  '',
  '## Write',
  'A Manifesto of Inclusion: the Community’s rules for making sure what happened in this Scenario does not happen again. Write it as plain, practical policy, not as a statement of values. About 200 words, in four parts:',
  '1. An opening that names the Scenario the rules are drawn from, and says they hold for anyone in that place.',
  '2. "When a member sets up a business": three rules, for those who rent, lend and buy.',
  '3. "When it happens anyway": three rules, for those who lead, raise complaints and protect.',
  '4. A closing line on when it was adopted and how it is reviewed.',
  'Root every rule in one of the Failures above: name the Actor who acts, what they do and when, so the rule could be checked. Name no individual.',
].join('\n')

export type DraftBlock = Readonly<{
  id: string
  /** `opening` says what the Manifesto covers; `heading` starts a section of `policy` lines; `closing` adopts it. */
  kind: 'opening' | 'heading' | 'policy' | 'closing'
  text: string
}>

/** The draft the platform generates in Cloud mode, before any Member touches it. */
export const draft = [
  {
    id: 'opening',
    kind: 'opening',
    text: 'These rules come from a Scenario our Groups acted out: a girl from a waste-picking family who wants to open a beauty parlour near her home, and everyone who stood in her way. They hold for anyone in her place.',
  },
  { id: 'h-business', kind: 'heading', text: 'When a member sets up a business' },
  {
    id: 'rent',
    kind: 'policy',
    text: 'Owners rent shops on the same terms to everyone, and never ask a tenant’s caste, creed or the work their family does.',
  },
  {
    id: 'lend',
    kind: 'policy',
    text: 'Loans are judged on the plan, not the family; where a bank asks for collateral, the Community finds a guarantor.',
  },
  {
    id: 'back',
    kind: 'policy',
    text: 'Families, friends and neighbours back a new business with our trust and our custom: we use it first, and recommend it.',
  },
  { id: 'h-anyway', kind: 'heading', text: 'When it happens anyway' },
  {
    id: 'speak',
    kind: 'policy',
    text: 'Area leaders speak up when a member is pulled down for their caste or their work, and raise it with the Facilitator that week.',
  },
  {
    id: 'police',
    kind: 'policy',
    text: 'If a shop is harassed, two members go with the owner to file the complaint, and follow it up until the police act.',
  },
  {
    id: 'purity',
    kind: 'policy',
    text: 'No one refuses a service, or is refused one, over ideas of purity and pollution.',
  },
  {
    id: 'adopt',
    kind: 'closing',
    text: 'Adopted in our Workshop on this day, and reviewed each year against the next Scenario we act out.',
  },
] as const satisfies ReadonlyArray<DraftBlock>

/** A paragraph of the draft, by its id. */
export type BlockId = (typeof draft)[number]['id']

/**
 * One Member's change to the draft: `find` is replaced by `replace`; an empty
 * `find` adds `replace` to the end. Each block takes one edit at most, so
 * concurrent edits never shift each other's place.
 */
export type DraftEdit = Readonly<{
  block: BlockId
  find: string
  replace: string
}>

export type Editor = Readonly<{
  writer: Writer
  edits: ReadonlyArray<DraftEdit>
}>

/** The same four Members as slide 07, each reworking the draft in their own words. */
export const editors: ReadonlyArray<Editor> = [
  {
    writer: memberById.asha,
    edits: [
      {
        block: 'back',
        find: 'with our trust and our custom',
        replace: 'with our trust, our custom and our time',
      },
    ],
  },
  {
    writer: memberById.ravi,
    edits: [
      {
        block: 'speak',
        find: '',
        replace: ' The same applies to our institutions.',
      },
      {
        block: 'purity',
        find: 'ideas of purity and pollution',
        replace: 'caste, or ideas of purity and pollution',
      },
    ],
  },
  {
    writer: memberById.meena,
    edits: [
      {
        block: 'lend',
        find: 'the plan, not the family',
        replace: 'the plan, not the family or the surname',
      },
    ],
  },
  {
    writer: memberById.imran,
    edits: [
      {
        block: 'rent',
        find: 'caste, creed',
        replace: 'caste, religion, gender',
      },
    ],
  },
]
