import type { Slide } from '../../types'
import { speakerNotes } from './content/speakerNotes'
import { MissionBoard } from './MissionBoard'

export const slide = {
  id: '04',
  kicker: 'The mission',
  heading: 'What the tool sets out to do',
  body: <MissionBoard />,
  layout: 'centered',
  speakerNotes,
} satisfies Slide
