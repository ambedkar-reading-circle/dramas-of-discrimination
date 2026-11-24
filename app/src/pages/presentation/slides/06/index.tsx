import type { Slide } from '../../types'
import { ManualEmbed } from './ManualEmbed'

export const slide = {
  id: '06',
  kicker: 'The Facilitator',
  heading: 'The manual',
  body: <p className="section-lede-copy">The printed manual the Facilitator carries: a letter of invitation, the acts, and the sheets groups fill in. Turn the pages live during the talk.</p>,
  interactive: <ManualEmbed />,
} satisfies Slide
