import type { Slide } from '../../types'
import { ClosingSlideBody } from './ClosingSlideBody'

export const slide = {
  id: '10',
  kicker: 'Thank you',
  heading: 'Any questions?',
  body: <ClosingSlideBody />,
  layout: 'centered',
  speakerNotes: [
    'Thank you for staying with us through the Workshop and the plans ahead.',
    'If your Community could use it, whether a workplace, a college, a hostel or a neighbourhood, write to us. We will facilitate it with you, and leave you able to run it yourselves.',
    'This is what we are building next: the facilitation guide, Local and Cloud modes, the Manifesto of Inclusion, and the Manifesto portal. Each one links back to its slide, so we can return to it for a question.',
    'The Workshop was made at the Ambedkar Reading Circle by us, with designers and facilitators who shaped it along the way.',
    'Now, the floor is yours.',
  ],
} satisfies Slide
