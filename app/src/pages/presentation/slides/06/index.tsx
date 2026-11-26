import type { Slide } from '../../types'
import { FacilitationGuideMockup } from './FacilitationGuideMockup'

export const slide = {
  id: '06',
  kicker: 'Future plans · A',
  heading: 'The facilitation guide',
  interactive: <FacilitationGuideMockup />,
  speakerNotes: [
    'So far the workshop has needed a trained Facilitator. That usually means an outsider is parachuted into a community, or someone has to be trained to enter it. The facilitation guide removes that need.',
    'Anyone in the community can nominate themselves to facilitate. And if no one does, the room can run the workshop together from the screen.',
    { set: 'guide', to: { act: 1, step: 0 } },
    'Across the top is the whole journey: the five acts, sized by their length, with a segment for every step. Everyone can see where the room is, what came before, and what comes next.',
    'Each step shows its instruction and the question to put to the room. Beside them is a recorded example from a past workshop, with audio-visual instructions, so people learn each activity just in time, when they need it.',
    'The worksheets and the matching manual pages sit under the video, so the room has what it needs for the activity in front of it.',
    'Its guiding principle is to hold the room together without directing it.',
    { set: 'guide', to: { act: 1, step: 1 } },
    'Timings are only suggestions.',
    { set: 'guide', to: { act: 1, step: 2 } },
    'The room moves on when it says it is ready,',
    { set: 'guide', to: { act: 2, step: 0 } },
    'and can go back or linger whenever it wants.',
  ],
} satisfies Slide
