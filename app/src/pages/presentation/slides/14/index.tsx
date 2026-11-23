import type { Slide } from '../../types'
import { PrinciplesGrid } from './PrinciplesGrid'

export const slide = {
  id: '14',
  kicker: 'The practice',
  heading: 'Principles',
  body: <PrinciplesGrid />,
  layout: 'grid',
} satisfies Slide
