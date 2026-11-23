import type { Slide } from '../../types'
import { ClosingSlideBody } from './ClosingSlideBody'

export const slide = {
  id: '15',
  kicker: 'Thank you',
  heading: 'Jai Bhim',
  body: <ClosingSlideBody />,
  assets: [{ role: 'image', note: 'Contact & QR artwork' }],
  layout: 'centered',
} satisfies Slide
