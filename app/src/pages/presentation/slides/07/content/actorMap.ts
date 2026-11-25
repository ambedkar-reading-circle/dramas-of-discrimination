/**
 * The Actor map a Group filled in at a past workshop (public/slides/05-part-sheet.jpg),
 * transcribed so the mockup can write it back in, one keystroke at a time.
 */

/** A cell the writers type into. */
type TextCell = Readonly<{ id: string; kind: 'text'; text: string }>
/** A category box the writers tick; its text is the printed label. */
type TickCell = Readonly<{
  id: string
  kind: 'tick'
  text: string
  ticked: boolean
}>

export type SheetCell = TextCell | TickCell

/** How much a cell holds once filled: its characters, or 1 for a ticked box. */
export function fullLength(cell: SheetCell) {
  if (cell.kind === 'tick') return cell.ticked ? 1 : 0
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

export const categories: ReadonlyArray<TickCell> = [
  {
    id: 'cat-education',
    text: 'Educational hurdles',
    kind: 'tick',
    ticked: false,
  },
  { id: 'cat-health', text: 'Health & addiction', kind: 'tick', ticked: false },
  { id: 'cat-economic', text: 'Economic', kind: 'tick', ticked: true },
  { id: 'cat-family', text: 'Family', kind: 'tick', ticked: true },
  {
    id: 'cat-social',
    text: 'Social & institutional',
    kind: 'tick',
    ticked: true,
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
  ['Friends', 'Supportive, and demotivating', ''],
  [
    'Community',
    '10% support; demotivating, pulling her down',
    'No awareness, no habit of supporting each other',
  ],
  [
    'Building owner',
    'Will not rent the shop, for caste and occupation',
    'Biased, judgemental, greedy',
  ],
  [
    'Other castes',
    'Not ready to take her service',
    'Biased, no equality, blind to the struggle',
  ],
  ['Bank', '', ''],
  ['Customers', '', ''],
  ['Area leaders', '', ''],
  ['Police dept.', '', ''],
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
  ...categories,
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
    ...categories,
    ...actorRows.map((row) => row.actor),
    ...actorRows.flatMap((row) => [row.ideal, row.failures]),
  ]),
  pace: 1,
}

const ideal = (...indexes: number[]) =>
  indexes.map((index) => actorRows[index].ideal)
const failures = (...indexes: number[]) =>
  indexes.map((index) => actorRows[index].failures)

/** Cloud mode: four Members of one Group, each on their own device, splitting the sheet between them. */
export const members: ReadonlyArray<Writer> = [
  {
    id: 'asha',
    name: 'Asha',
    color: '#b23a48',
    queue: filled([scenarioCell, ...actorRows.map((row) => row.actor)]),
    pace: 1.2,
  },
  {
    id: 'ravi',
    name: 'Ravi',
    color: '#1f7a6d',
    queue: filled([...ideal(0, 1, 2), ...failures(3, 4)]),
    pace: 0.9,
  },
  {
    id: 'meena',
    name: 'Meena',
    color: '#b0701c',
    queue: filled(failures(0, 1, 5)),
    pace: 0.8,
  },
  {
    id: 'imran',
    name: 'Imran',
    color: '#6a3fa0',
    queue: filled([...categories, ...ideal(3, 4, 5)]),
    pace: 1,
  },
]
