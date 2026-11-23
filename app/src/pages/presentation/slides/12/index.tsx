import type { Slide } from '../../types'
import { ModeSwitcher } from './ModeSwitcher'

export const slide = {
  id: '12',
  kicker: 'The platform',
  heading: 'One method, two modes',
  body: <p className="section-lede-copy">The same Workshop runs alone or together. Switch modes to show the difference.</p>,
  interactive: <ModeSwitcher />,
} satisfies Slide
