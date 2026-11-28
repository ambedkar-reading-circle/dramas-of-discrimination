import type { Slide } from '../../types'
import { proposedKicker } from '../shared/content/proposed'
import { speakerNotes } from './content/speakerNotes'
import { ManifestoMockup } from './ManifestoMockup'

export const slide = {
  id: '08',
  kicker: proposedKicker('C'),
  heading: 'The Manifesto of Inclusion',
  interactive: <ManifestoMockup />,
  speakerNotes,
} satisfies Slide
