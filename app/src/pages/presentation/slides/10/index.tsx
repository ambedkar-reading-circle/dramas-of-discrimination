import type { Slide } from '../../types'
import { QuoteDeck } from './QuoteDeck'

export const slide = {
  id: '10',
  kicker: 'Verbatim',
  heading: 'What groups say',
  body: <p className="section-lede-copy">Feedback from the room, verbatim. Reveal the quotes one at a time.</p>,
  interactive: <QuoteDeck />,
} satisfies Slide
