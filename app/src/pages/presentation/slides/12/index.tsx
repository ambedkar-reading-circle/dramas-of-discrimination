import type { Slide } from '../../types'
import { ProgressionStepper } from './ProgressionStepper'

export const slide = {
  id: '12',
  kicker: 'The consensus',
  heading: 'From Rehearsal to manifesto',
  body: <p className="section-lede-copy">How a Group’s tables become the Community’s manifesto. Advance the stepper one stage at a time.</p>,
  interactive: <ProgressionStepper />,
} satisfies Slide
