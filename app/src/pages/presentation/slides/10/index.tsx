import type { Slide } from '../../types'
import { speakerNotes } from './content/speakerNotes'
import { ClosingSlideBody } from './ClosingSlideBody'

export const slide = {
  id: '10',
  kicker: 'Thank you · Over to you',
  heading: 'Adapt it. Enact it. Give to it.',
  body: <ClosingSlideBody />,
  layout: 'centered',
  speakerNotes,
} satisfies Slide
