import type { Slide } from '../../types'
import { PortalMockup } from './PortalMockup'

export const slide = {
  id: '09',
  kicker: 'Future plans · D',
  heading: 'The Manifesto portal',
  interactive: <PortalMockup />,
  speakerNoteTabs: [
    {
      label: 'Explore',
      speakerNotes: [
        'Every Manifesto of Inclusion a Community chooses to share comes here, to one open portal.',
        'This is where Communities will explore and share their articulations of what inclusion is, and what it means to them: a garment workers’ collective, a college hostel, a ward’s residents’ forum, each in its own words.',
        'Filter by the kind of Community, or search for a word, and open any Manifesto to read it whole: its values, its pledges, and who adopted it.',
        'A Community about to run its own Workshop can read what others have already committed to. Sharing stays its choice: a Community in Local mode can bring its finished Manifesto here, or keep it to itself.',
      ],
    },
    {
      label: 'Common ground',
      speakerNotes: [
        'Read together, the Manifestos show where Communities agree. Each bar is the share of Manifestos that make the same pledge, whatever words they put it in.',
        'A handful of Manifestos is only a conversation. Gathered in thousands, the same pledges keep rising to the top, across workplaces, colleges and neighbourhoods.',
        'With a sizable collection, the portal becomes significant and credible enough to drive inclusion policy, centrally and legally.',
        'That is participatory consultation in its true sense: policy drawn from what tens of thousands of people wrote and adopted, with every pledge traced back to the Manifestos that make it.',
      ],
    },
  ],
} satisfies Slide
