import type { RoughAnnotationType } from '#/lib/rough-notation/model'
import { asciiVariants } from '../engine/asciiPatterns.ts'
import type { AsciiVariant } from '../engine/asciiPatterns'

export const manual = {
  title: 'Dramas of Discrimination',
  subtitle: 'A Letter on Inclusion, Belonging, and Our Shared Possibilities',
  credit: 'Design & Modifications: Sumit Sute',
  origin: '(Derivative of ARC’s Picker’s Play Workshop)',
  letter: [
    'Warm affections and solidarity as we collectively strive to build inclusive societies and foster belonging within our diverse communities. While we often celebrate diversity, it appears that we consistently struggle to create genuine inclusivity and foster a sense of belonging. To embrace and unlock the potential of diversity and progress as a civilization rooted in holistic social integration and growth, there is no substitute for inclusion and belonging.',
    'Yet, discrimination and exclusion remain persistent, complex realities that are difficult to eradicate entirely. Responses to these issues are often framed as conflicts, but we know that they are systemic in nature—rooted in networks of people, beliefs, institutions, and vested, myopic interests.',
    'So, how do we find alternative approaches that are rooted in fraternity and a commitment to equitable coexistence? Can these alternatives be participatory, nuanced, and grounded in constitutional values? Can we create a participatory social lab to experiment sensitively and safely with solutions to discrimination? Can our methodologies to mitigate exclusion also actively strengthen fraternity and inclusion? And, through this process, can we collaboratively create our own manifestos for inclusion?',
    'With the hope of addressing these questions, and with the same affection and solidarity in our collective endeavors, the Ambedkar Reading Circle shares this facilitation manual for Dramas of Discrimination. We encourage you to document your thoughts, critiques, improvements, and innovations in the Facilitation Notes section as you facilitate iterations of this workshop. Designed as a participatory workshop tool, it invites you to adapt and modify the workshop for your own communities. Again, for a more just, liberal, and egalitarian society.',
  ],
  signature: 'ARC Bangalore Team',
  email: 'ambedkarreadingcircle.bangalore@gmail.com',
  date: 'Nov 2024',
}

// Page breaks follow complete sentences; the original letter also supplies
// the linear transcript for assistive technology, reduced motion, and print.
const sentences = manual.letter.map((paragraph) =>
  paragraph.split(/(?<=[.!?])\s+/),
)
export type LetterBlock = {
  text: string
  emphasis?: readonly { text: string; type: RoughAnnotationType }[]
}

export type ReadingPage = {
  kind: 'reading'
  id: string
  blocks: readonly LetterBlock[]
  salutation?: boolean
  signature?: boolean
}

export type CanvasPage = { kind: 'canvas'; id: string; variant: AsciiVariant }
export type ManualInnerPage = ReadingPage | CanvasPage

export const readingPages: readonly ReadingPage[] = [
  {
    kind: 'reading',
    id: 'welcome',
    blocks: [
      {
        text: sentences[0].slice(0, 2).join(' '),
        emphasis: [
          { text: 'foster belonging', type: 'circle' },
          { text: 'genuine inclusivity', type: 'underline' },
        ],
      },
    ],
    salutation: true,
  },
  {
    kind: 'reading',
    id: 'inclusion',
    blocks: [
      {
        text: sentences[0][2],
        emphasis: [{ text: 'inclusion and belonging', type: 'highlight' }],
      },
      {
        text: manual.letter[1],
        emphasis: [
          { text: 'discrimination and exclusion', type: 'strike-through' },
          { text: 'systemic in nature', type: 'box' },
          { text: 'myopic interests', type: 'crossed-off' },
        ],
      },
    ],
  },
  {
    kind: 'reading',
    id: 'possibilities',
    blocks: [
      {
        text: manual.letter[2],
        emphasis: [
          { text: 'constitutional values', type: 'bracket' },
          { text: 'participatory social lab', type: 'highlight' },
        ],
      },
    ],
  },
  {
    kind: 'reading',
    id: 'invitation',
    blocks: [
      {
        text: sentences[3].slice(0, 3).join(' '),
        emphasis: [
          { text: 'Facilitation Notes', type: 'box' },
          { text: 'adapt and modify', type: 'underline' },
        ],
      },
    ],
  },
  {
    kind: 'reading',
    id: 'solidarity',
    blocks: [
      {
        text: sentences[3][3],
        emphasis: [{ text: 'egalitarian society', type: 'circle' }],
      },
    ],
    signature: true,
  },
]

export const manualPages: readonly ManualInnerPage[] = readingPages.flatMap(
  (page, index): ManualInnerPage[] => [
    page,
    { kind: 'canvas', id: `${page.id}-canvas`, variant: asciiVariants[index] },
  ],
)
export const manualBackCover = manualPages.length + 1
