import { cuesOf } from '../../../playback/cues'
import type { SpeakerNote } from '../../../types'

const guide = cuesOf('guide')

/** What to say over slide 06, line by line, with the cues that change the slide between them. */
export const speakerNotes: ReadonlyArray<SpeakerNote> = [
  'What follows is a proposal. It does not exist yet, and we are actively working on it and need support to make it happen.',
  'Today the workshop runs fully offline. It needs a trained Facilitator in the room, which usually means an outsider is parachuted into a Community, or someone has to be trained before they can take the room.',
  'We propose to take that facilitation online: a facilitation guide, a program the Community opens on a shared screen, that walks the room seamlessly through the whole workshop.',
  'With it, a Community can self-facilitate. Anyone can nominate themselves to guide the room, and if no one does, the room can run the workshop together from the screen.',
  'That makes the workshop more participatory, more autonomous, and safer, on the Community’s own terms: no one from outside has to be let in for it to happen.',
  guide({ act: 1, step: 0 }),
  'Across the top is the whole journey: the five acts, sized by their length, with a segment for every step. Everyone can see where the room is, what came before, and what comes next.',
  'Below it, the act the room is in lies open as a sheet. Each step gives its instruction, with the question to put to the room at the foot, and the matching manual pages and worksheets to print are pinned above.',
  guide({ act: 1, step: 1 }),
  'Beside the steps is a recorded example from a past workshop, with audio-visual instructions and captions in the room’s language. As the room moves to the next step, the example moves with it, so people learn each activity just in time, when they need it.',
  guide({ act: 1, step: 2 }),
  'The guide’s principle is to hold the room together without directing it. Each activity is timed, and the guide helps the room follow that timing. Yet, without rushing anyone on, the room presses We’re ready when it is ready to move.',
  guide({ act: 2, step: 0 }),
  'Then the next act opens as a fresh sheet, and the journey above keeps the whole workshop in view. The room can go back or linger whenever it wants.',
]
