import type { Slide } from '../../types'
import { ClosingSlideBody } from './ClosingSlideBody'

export const slide = {
  id: '10',
  kicker: 'Thank you',
  heading: 'Any questions?',
  body: <ClosingSlideBody />,
  layout: 'centered',
  speakerNotes: ['Thank the audience.', 'Open the floor for questions.'],
} satisfies Slide
