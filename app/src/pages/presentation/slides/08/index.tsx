import type { Slide } from '../../types'
import { ManifestoMockup } from './ManifestoMockup'

export const slide = {
  id: '08',
  kicker: 'Future plans · C',
  heading: 'The Manifesto of Inclusion',
  interactive: <ManifestoMockup />,
  speakerNoteTabs: [
    {
      label: 'Local mode',
      speakerNotes: ['The workshop ends where it began: with the Community. What its Groups worked through becomes a Manifesto of Inclusion, a pledge of the values the whole Community holds itself to.', 'The worksheets here are the same as on the last slide: the girl who wants to open a beauty parlour, and the Actor map her Group filled in.', 'In Local mode the platform generates nothing. It turns the Group’s worksheets into a prompt, and one click copies it.', 'The prompt lets the Failures decide what the Community pledges against, but asks for a general pledge: no Scenario, no person, no incident. It should hold for every member, whatever their story.', 'The Community pastes it into an LLM of its own choosing, and reads the draft together. Nothing leaves the device unless the room carries it out.'],
    },
    {
      label: 'Cloud mode',
      speakerNotes: ['In Cloud mode, each Group’s Members sign off their worksheets when they are ready, and the Facilitator submits them to the Workshop.', 'Once every Group is in, the Facilitator presses Generate Manifesto of Inclusion. The platform reads every Group’s worksheets together and writes a single draft.', 'It reads like a constitution’s preamble: we, the members of this Community, resolve to secure dignity, equality, fraternity and voice to all of us, and pledge what we will do.', 'The draft is only a starting point. Every Member opens it on their own device and reworks it at the same time, the way they filled the Actor map. Each change stays in its writer’s colour, so the room can see whose words are whose before it agrees on the final text.', 'The finished Manifesto can join the Manifesto portal beside the Manifestos of every other Community, so each Community can read what others have committed to, from workplaces to colleges to neighbourhoods.'],
    },
  ],
} satisfies Slide
