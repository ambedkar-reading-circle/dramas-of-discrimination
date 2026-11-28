import type { Slide } from '../../types'
import { speakerNotes } from './content/speakerNotes'
import { TitleSlideBody } from './TitleSlideBody'

export const slide = {
  id: '01',
  kicker: 'An Ambedkar Reading Circle workshop',
  heading: 'Dramas of Discrimination',
  body: <TitleSlideBody />,
  layout: 'centered',
  ownsHeading: true,
  speakerNotes,
} satisfies Slide
