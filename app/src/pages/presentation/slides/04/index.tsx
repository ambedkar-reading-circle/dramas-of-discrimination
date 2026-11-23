import type { Slide } from '../../types'
import { ObjectivePoints } from './ObjectivePoints'

export const slide = {
  id: '04',
  kicker: 'The case',
  heading: 'Why the Workshop exists',
  body: (
    <>
      <p className="section-lede-copy">Discrimination is systemic; responses deserve rehearsal, not just sentiment. Reveal the points one at a time.</p>
      <ObjectivePoints />
    </>
  ),
} satisfies Slide
