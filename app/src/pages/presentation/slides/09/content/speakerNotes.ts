import { cuesOf } from '../../../playback/cues'
import type { SpeakerNote } from '../../../types'

const portal = cuesOf('portal')

/** What to say over slide 09, line by line, with the cues that change the slide between them. */
export const speakerNotes: ReadonlyArray<SpeakerNote> = [
  portal('explore'),
  'Every Manifesto of Inclusion a Community chooses to share comes here, to one open portal.',
  'This is where Communities will explore and share their articulations of what inclusion is, and what it means to them: a garment workers’ collective, a college hostel, a ward’s residents’ forum, each in its own words.',
  'Filter by the kind of Community, or search for a word, and open any Manifesto to read it whole: the Scenario it came from, the rules drawn from it, and who adopted it.',
  'A Community about to run its own Workshop can read what others have already committed to. Sharing stays its choice: a Community in Local mode can bring its finished Manifesto here, or keep it to itself.',
  portal('common'),
  'Read together, the Manifestos show where Communities agree. Each bar is the share of Manifestos that make the same rule, whatever Scenario it came from and whatever words they put it in.',
  'A handful of Manifestos is only a conversation. Gathered in thousands, the same rules keep rising to the top, across workplaces, colleges and neighbourhoods.',
  'With a sizable collection, the portal becomes significant and credible enough to drive inclusion policy, centrally and legally.',
  'That is participatory consultation in its true sense: policy drawn from what tens of thousands of people wrote and adopted, with every rule traced back to the Manifestos that make it, and to the Scenarios behind them.',
]
