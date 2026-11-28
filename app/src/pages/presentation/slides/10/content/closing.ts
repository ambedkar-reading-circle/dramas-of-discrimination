/**
 * Slide 10: the closing ask. It borrows the last words of the Preamble, in
 * which the people "adopt, enact and give to ourselves this Constitution",
 * with adopt turned to adapt, since a Community makes the Workshop its own:
 * three ways to take the Workshop up, then who made it.
 */

import { manualEmail } from '#/pages/home/manual-flipbook'

export const closingLede =
  'The Preamble ends with its people adopting, enacting and giving the Constitution to themselves. The Workshop asks one change of every Community that takes it up: adapt it, before you enact it.'

export type ClosingAction =
  | Readonly<{ kind: 'method'; label: string; hash: string }>
  | Readonly<{ kind: 'email'; label: string; address: string }>
  | Readonly<{ kind: 'external'; label: string; href: string }>

export type ClosingWay = Readonly<{
  numeral: string
  verb: string
  line: string
  action: ClosingAction
  /** The way we ask for most, set apart from the others. */
  lead?: boolean
}>

export const ways: ReadonlyArray<ClosingWay> = [
  {
    numeral: 'I',
    verb: 'Adapt it',
    line: 'Take the Workshop to your workplace, college, hostel or neighbourhood. The manual is open source: adapt it to your Community’s needs, and run it yourselves.',
    action: { kind: 'method', label: 'See the method', hash: 'workshop-method' },
  },
  {
    numeral: 'II',
    verb: 'Enact it with us',
    line: 'Write to us. We will help your own facilitators prepare and run it, or come and facilitate it in your Community.',
    action: { kind: 'email', label: 'Write to us', address: manualEmail },
    lead: true,
  },
  {
    numeral: 'III',
    verb: 'Give to it',
    line: 'The guide, the Manifesto and the portal are open source. Give code, design, translation, a Community to pilot it, or funding.',
    action: {
      kind: 'external',
      label: 'Build with us on GitHub',
      href: 'https://github.com/ambedkar-reading-circle/dramas-of-discrimination',
    },
  },
]

export const teamLabel = 'Made at the Ambedkar Reading Circle'

export const instagram = { handle: 'arc.bangalore', href: 'https://www.instagram.com/arc.bangalore/' }

export const aboutLabel = 'Meet the team'

export const arcSiteLabel = 'arc-community.in'

/** A steady tilt per card and per portrait, so they look pinned by hand but the same on every visit. */
export const cardTilts: ReadonlyArray<number> = [-1.2, 0.6, 1.4]
export const portraitTilts: ReadonlyArray<number> = [-4, 3, -2, 4, -3]

export const floorLine = 'The floor stays open: write to us with any question, any time.'
