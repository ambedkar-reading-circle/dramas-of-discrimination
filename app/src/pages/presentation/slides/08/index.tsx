import type { Slide } from '../../types'
import { ManifestoMockup } from './ManifestoMockup'

export const slide = {
  id: '08',
  kicker: 'Future plans · C',
  heading: 'The Manifesto of Inclusion',
  body: <p className="section-lede-copy">Once every Group has submitted its Rehearsal, the Facilitator generates the Workshop’s Manifesto of Inclusion. It joins a repository beside the Manifestos of every other Workshop.</p>,
  interactive: <ManifestoMockup />,
  speakerNotes: ['Each Group’s Members sign off their Rehearsal when it is ready, and the Facilitator submits it to the Workshop.', 'Once every Rehearsal is in, the Facilitator generates a manifesto draft from all of their tables together: the Actors, their Failures, and the interventions the room rehearsed.', 'Every Manifesto joins a shared repository, so each Community can read what others have committed to, from workplaces to colleges to neighbourhoods.'],
} satisfies Slide
