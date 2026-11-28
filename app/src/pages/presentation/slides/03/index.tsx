import type { Slide } from '../../types'
import { speakerNotes } from './content/speakerNotes'
import { CircleBoard } from './CircleBoard'

export const slide = {
  id: '03',
  kicker: 'The collective',
  heading: 'The Ambedkar Reading Circle',
  body: <CircleBoard />,
  layout: 'centered',
  speakerNotes,
} satisfies Slide
