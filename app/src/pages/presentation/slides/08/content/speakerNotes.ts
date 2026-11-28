import { cuesOf } from '../../../playback/cues'
import type { SpeakerNote } from '../../../types'

const mode = cuesOf('mode')
const manifesto = cuesOf('manifesto')

/** What to say over slide 08, line by line, with the cues that change the slide between them. */
export const speakerNotes: ReadonlyArray<SpeakerNote> = [
  mode('cloud'),
  'The last part of the proposal is how the workshop ends: where it began, with the Community. In the guide we are building, what its Groups worked through becomes a Manifesto of Inclusion, the rules the whole Community holds itself to.',
  'The worksheets here are the same as on the last slide: the girl who wants to open a beauty parlour, and the Actor map her Group filled in.',
  'In Cloud mode, each Group’s Members sign off their worksheets when they are ready, and the Facilitator submits them to the Workshop.',
  'Once every Group is in, the Facilitator presses Generate Manifesto.',
  manifesto('generate'),
  'The platform reads every Group’s worksheets together and writes a single draft.',
  'It reads as policy, not as a statement of values. It opens with the Scenario it came from, the girl and her beauty parlour, and every rule after that answers one of the Failures her Group found.',
  'The building owner’s bias becomes a rule on renting. The bank’s collateral becomes a guarantor. The customers’ taboos of purity and pollution, the leaders who would not act, the police under pressure: each gets a rule that names who acts and when.',
  manifesto('edit'),
  'The draft is only a starting point. Every Member opens it on their own device and reworks it at the same time, the way they filled the Actor map.',
  mode('local'),
  'In Local mode the platform does none of that. It never sees the worksheets, so it cannot write the draft. Instead it turns them into a prompt, and one click copies it.',
  'The prompt asks for the same Manifesto the platform would have written: the same sections, and the same condition that every rule answers a Failure on the Actor map.',
  'The Community pastes it into an LLM of its own choosing, and reads the draft together. Nothing leaves the device unless the room carries it out.',
  'Whichever mode it chose, the finished Manifesto can join the Manifesto portal beside the Manifestos of every other Community, so each Community can read what others have committed to, from workplaces to colleges to neighbourhoods.',
]
