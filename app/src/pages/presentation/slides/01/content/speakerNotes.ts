import { cuesOf } from '../../../playback/cues'
import type { SpeakerNote } from '../../../types'

const approach = cuesOf('approach')
const wordmark = cuesOf('wordmark')

/** What to say over slide 01, line by line, with the cues that change the slide between them. */
export const speakerNotes: ReadonlyArray<SpeakerNote> = [
  'Dramas of Discrimination is a workshop we made at the Ambedkar Reading Circle.',
  wordmark(true),
  'Discrimination already works like a play. Everyone knows their part, the lines are familiar, and the people watching keep quiet. We put it on a real stage so we can rewrite the script, and the new script becomes a policy.',
  "It's for groups that are already diverse, and want to create inclusion and belonging for everyone.",
  wordmark(false),
  approach('systems'),
  'In small groups, you pick a scenario of discrimination. Real, or fictionalized from real events.',
  'You look for the structure underneath: the roles, relationships, beliefs, institutions, and incentives that hold it together.',
  approach('forum'),
  'Then you act it out as a short play.',
  'Others step in and try to shift one role in that structure.',
  'What resists shows which belief, institution, or incentive is holding it together.',
  'So it is a place to rehearse. An idea that sounds easy from an armchair gets tested here.',
  approach('result'),
  'What comes out depends on who is in the room. The more varied the group, the richer it gets.',
  'Systems thinking can feel abstract.',
  'Theatre feels real, but it can shrink a big problem into one bad person.',
  'So we took the best of both, and left their limits behind.',
  approach(null),
]
