import type { Slide } from '../../types'
import { proposedKicker } from '../shared/content/proposed'
import { speakerNotes } from './content/speakerNotes'
import { PortalMockup } from './PortalMockup'

export const slide = {
  id: '09',
  kicker: proposedKicker('D'),
  heading: 'The Manifesto portal',
  interactive: <PortalMockup />,
  speakerNotes,
} satisfies Slide
