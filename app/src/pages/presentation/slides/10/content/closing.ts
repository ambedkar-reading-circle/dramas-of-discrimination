/** Slide 10: the closing invitation, the plans it asks help with, and who made the Workshop. */

export const closingLede = 'Bring the Workshop to your Community.'

export const invitation = {
  name: 'Run it with us',
  note: 'A workplace, a college, a hostel, a neighbourhood: write to us, and we will facilitate it with you.',
  instagram: { handle: 'arc.bangalore', href: 'https://www.instagram.com/arc.bangalore/' },
}

export type ClosingPlan = Readonly<{
  letter: string
  name: string
  line: string
  /** The deck slide that shows the plan, 1-based. */
  slide: number
}>

export const plansLabel = 'What we are building next'

export const plans: ReadonlyArray<ClosingPlan> = [
  { letter: 'A', name: 'The facilitation guide', line: 'any room can run the Workshop by itself', slide: 6 },
  { letter: 'B', name: 'Who holds the data', line: 'one device in Local mode, or the whole Community in Cloud mode', slide: 7 },
  { letter: 'C', name: 'The Manifesto of Inclusion', line: 'every Rehearsal drafted into one Community pledge', slide: 8 },
  { letter: 'D', name: 'The Manifesto portal', line: 'shared Manifestos, read together, toward policy', slide: 9 },
]

export const teamLabel = 'Made at the Ambedkar Reading Circle by'

/** A steady tilt per portrait, so the strip looks pinned by hand but the same on every visit. */
export const portraitTilts: ReadonlyArray<number> = [-4, 3, -2, 4, -3]
