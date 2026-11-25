/**
 * Slide 08 carries on from slide 07's workshop: the same Scenario and Actor
 * map. Local mode exports the Group's worksheets as a prompt for the
 * Community's own LLM; Cloud mode generates the Manifesto of Inclusion and
 * lets the Group's Members edit it together.
 *
 * The Manifesto itself names no Scenario and no person: it is the
 * Community's pledge of values, drawn from what its Groups worked through.
 */
import {
  actorRows,
  categories,
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
  `Kinds of hurdle: ${categories
    .filter((item) => item.ticked)
    .map((item) => item.text)
    .join(', ')}`,
  '',
  '## Actor map',
  ...filledRows.flatMap((row, index) => [
    `${index + 1}. ${row.actor.text}`,
    `   Ideal behaviour: ${row.ideal.text || '(left blank)'}`,
    `   Failures: ${row.failures.text || '(left blank)'}`,
  ]),
  '',
  '## Write',
  'A Manifesto of Inclusion: the whole Community’s pledge of values, in the solemn voice of a constitution’s preamble ("We, the members of this Community…"). About 200 words, in three parts:',
  '1. A preamble that resolves to make the Community a place where every person belongs.',
  '2. The values it secures to every member, one line each (for example dignity, equality, fraternity, voice).',
  '3. What we pledge: four or five practices, each starting "We will…".',
  'Let the Failures above decide what the Community pledges against, but keep the Manifesto general: name no Scenario, no person and no incident, so it holds for every member whatever their story. Close with a line that adopts the Manifesto.',
].join('\n')

export type DraftBlock = Readonly<{
  id: string
  /** `opening` starts the preamble; `value` and `pledge` are lines of a list; `closing` adopts it. */
  kind: 'opening' | 'value' | 'heading' | 'pledge' | 'closing'
  text: string
}>

/** The draft the platform generates in Cloud mode, before any Member touches it. */
export const draft = [
  {
    id: 'opening',
    kind: 'opening',
    text: 'We, the members of this Community, having seen how caste, class, gender and work are used to shut people out, solemnly resolve to make it a place where every person belongs, and to secure to all of us:',
  },
  {
    id: 'dignity',
    kind: 'value',
    text: 'Dignity, of every person and of every kind of work;',
  },
  {
    id: 'equality',
    kind: 'value',
    text: 'Equality of access to homes, work, credit, learning and care;',
  },
  {
    id: 'fraternity',
    kind: 'value',
    text: 'Fraternity, in standing by one another when anyone is pulled down;',
  },
  {
    id: 'voice',
    kind: 'value',
    text: 'Voice, for those we have most often left unheard.',
  },
  { id: 'h-pledge', kind: 'heading', text: 'And to these ends we pledge' },
  {
    id: 'ask',
    kind: 'pledge',
    text: 'We will not ask, assume or act on anyone’s caste, creed or the work their family does.',
  },
  {
    id: 'back',
    kind: 'pledge',
    text: 'We will back the aspirations of those around us with our trust and our custom.',
  },
  {
    id: 'speak',
    kind: 'pledge',
    text: 'We will speak up when discrimination happens before us, and not leave it to the one who bears it.',
  },
  {
    id: 'adopt',
    kind: 'closing',
    text: 'In our Workshop, on this day, we adopt and give to ourselves this Manifesto.',
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
        replace: ' We will hold our institutions to the same.',
      },
      {
        block: 'voice',
        find: 'we have most often left unheard',
        replace: 'who have too long been kept silent',
      },
    ],
  },
  {
    writer: memberById.meena,
    edits: [
      {
        block: 'equality',
        find: 'learning and care',
        replace: 'learning, health and care',
      },
    ],
  },
  {
    writer: memberById.imran,
    edits: [
      {
        block: 'ask',
        find: 'caste, creed',
        replace: 'caste, religion, gender',
      },
    ],
  },
]
