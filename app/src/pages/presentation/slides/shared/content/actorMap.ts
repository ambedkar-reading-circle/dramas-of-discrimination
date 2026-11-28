/**
 * The Actor map a Group filled in at a past workshop (public/slides/05-part-sheet.jpg),
 * transcribed so the mockup can write it back in, one keystroke at a time.
 */

/** A cell the writers type into. */
type TextCell = Readonly<{ id: string; kind: 'text'; text: string }>
/** A printed label the writers strike out, or leave; `struck` is whether it ends up struck. */
type StrikeCell = Readonly<{
  id: string
  kind: 'strike'
  text: string
  struck: boolean
}>

export type SheetCell = TextCell | StrikeCell

/** How much a cell holds once filled: its characters, or 1 for a struck label. */
export function fullLength(cell: SheetCell) {
  if (cell.kind === 'strike') return cell.struck ? 1 : 0
  return cell.text.length
}

export type ActorRow = Readonly<{
  actor: SheetCell
  ideal: SheetCell
  failures: SheetCell
}>

const textCell = (id: string, text: string): TextCell => ({
  id,
  kind: 'text',
  text,
})

export const scenarioCell = textCell(
  'scenario',
  'Aspiration: a girl from a waste-picking family wants to open a beauty parlour near her home.',
)

/** The sheet's three columns, left to right, each with the question it asks (manual, pp. 18–19). */
export const columns: Readonly<Record<keyof ActorRow, Readonly<{ name: string; hint: string }>>> = {
  actor: { name: 'Actor', hint: 'Who is involved' },
  ideal: { name: 'Ideal behaviour', hint: 'What they should do' },
  failures: { name: 'Failures', hint: 'What stops them' },
}

/** What the sheet asks of the Group about the values below (manual, pp. 18–19). */
export const valuesInstruction =
  'Strike out each constitutional value this Scenario violates.'

/** The constitutional values printed across the top of the sheet. */
export const constitutionalValues: ReadonlyArray<StrikeCell> = [
  {
    id: 'value-justice',
    kind: 'strike',
    text: 'Justice',
    struck: true,
  },
  {
    id: 'value-liberty',
    kind: 'strike',
    text: 'Liberty',
    struck: false,
  },
  {
    id: 'value-equality',
    kind: 'strike',
    text: 'Equality',
    struck: true,
  },
  {
    id: 'value-fraternity',
    kind: 'strike',
    text: 'Fraternity',
    struck: true,
  },
]

const rows: ReadonlyArray<[string, string, string]> = [
  [
    'The girl (beautician)',
    'Takes responsibility for starting the parlour',
    'Confusion, no support, financial crisis',
  ],
  [
    'Her family members',
    'Financial, emotional and moral support',
    'Financial crisis, taboos, patriarchy, stereotypes',
  ],
  [
    'Friends',
    'Supportive, and not demotivating',
    'Fear of what others will say',
  ],
  [
    'Community',
    'Supports her, and does not pull her down',
    'No awareness, no habit of supporting each other',
  ],
  [
    'Building owner',
    'Open to renting her the shop, whatever her caste',
    'Biased, judgemental, greedy',
  ],
  [
    'Other castes',
    'Willing to take her service',
    'Biased, no equality, blind to the struggle',
  ],
  [
    'Bank',
    'Gives her a fair loan to set up the parlour',
    'Asks for collateral, caste bias at the desk',
  ],
  [
    'Customers',
    'Choose her parlour, and recommend it',
    'Taboos of purity and pollution',
  ],
  [
    'Area leaders',
    'Back her shop, and speak up for her',
    'Caste loyalties, and no will to act',
  ],
  [
    'Police dept.',
    'Protects her shop from harassment',
    'Caste bias, pressure from the powerful',
  ],
]

export const actorRows: ReadonlyArray<ActorRow> = rows.map(
  ([actor, ideal, failures], index) => ({
    actor: textCell(`actor-${index}`, actor),
    ideal: textCell(`ideal-${index}`, ideal),
    failures: textCell(`failures-${index}`, failures),
  }),
)

export const allCells: ReadonlyArray<SheetCell> = [
  scenarioCell,
  ...constitutionalValues,
  ...actorRows.flatMap((row) => [row.actor, row.ideal, row.failures]),
]

/** Cells that end up with something in them; the empty ones are never visited. */
const filled = (cells: ReadonlyArray<SheetCell>) =>
  cells.filter((cell) => fullLength(cell) > 0).map((cell) => cell.id)

/** Whoever fills the sheet: the room's one device in Local mode, or a Member in Cloud mode. */
export type Writer = Readonly<{
  id: string
  name: string
  color: string
  /** The cells this writer fills, in order. */
  queue: ReadonlyArray<string>
  /** Keystrokes per tick; people type at different speeds. */
  pace: number
}>

/** Local mode: the room's one shared device, filling the sheet the way a scribe would, top to bottom. */
export const scribe: Writer = {
  id: 'device',
  name: 'This device',
  color: 'var(--fac-navy)',
  queue: filled([
    scenarioCell,
    ...actorRows.map((row) => row.actor),
    ...actorRows.flatMap((row) => [row.ideal, row.failures]),
    // Last: the room strikes out values once the whole map is in front of it.
    ...constitutionalValues,
  ]),
  pace: 1,
}

const ideal = (...indexes: number[]) =>
  indexes.map((index) => actorRows[index].ideal)
const failures = (...indexes: number[]) =>
  indexes.map((index) => actorRows[index].failures)

/** Cloud mode: four Members of one Group, each on their own device, splitting the sheet between them. */
export const memberById = {
  asha: {
    id: 'asha',
    name: 'Asha',
    color: '#b23a48',
    queue: filled([
      scenarioCell,
      ...actorRows.map((row) => row.actor),
      ...failures(8, 9),
    ]),
    pace: 1.2,
  },
  ravi: {
    id: 'ravi',
    name: 'Ravi',
    color: '#1f7a6d',
    queue: filled([...ideal(0, 1, 2), ...failures(3, 4), ...ideal(6, 7)]),
    pace: 0.9,
  },
  meena: {
    id: 'meena',
    name: 'Meena',
    color: '#b0701c',
    queue: filled(failures(0, 1, 5, 2, 6, 7)),
    pace: 0.8,
  },
  imran: {
    id: 'imran',
    name: 'Imran',
    color: '#6a3fa0',
    queue: filled([...ideal(3, 4, 5, 8, 9), ...constitutionalValues]),
    pace: 1,
  },
} as const satisfies Record<string, Writer>

export const members: ReadonlyArray<Writer> = Object.values(memberById)
