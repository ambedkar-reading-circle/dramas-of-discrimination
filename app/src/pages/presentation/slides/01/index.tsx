import type { Slide } from '../../types'
import { TitleSlideBody } from './TitleSlideBody'

export const slide = {
  id: '01',
  kicker: 'An Ambedkar Reading Circle workshop',
  heading: 'Dramas of Discrimination',
  body: <TitleSlideBody />,
  layout: 'centered',
  ownsHeading: true,
} satisfies Slide
