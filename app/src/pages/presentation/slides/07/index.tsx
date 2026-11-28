import type { Slide } from '../../types'
import { proposedKicker } from '../shared/content/proposed'
import { speakerNotes } from './content/speakerNotes'
import { ModesMockup } from './ModesMockup'

export const slide = {
  id: '07',
  kicker: proposedKicker('B'),
  heading: 'Who holds the data',
  interactive: <ModesMockup />,
  speakerNotes,
} satisfies Slide
