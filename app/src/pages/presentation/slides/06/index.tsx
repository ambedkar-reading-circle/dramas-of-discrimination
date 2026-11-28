import type { Slide } from '../../types'
import { proposedKicker } from '../shared/content/proposed'
import { speakerNotes } from './content/speakerNotes'
import { FacilitationGuideMockup } from './FacilitationGuideMockup'

export const slide = {
  id: '06',
  kicker: proposedKicker('A'),
  heading: 'A guide for the room to run itself',
  interactive: <FacilitationGuideMockup />,
  speakerNotes,
} satisfies Slide
