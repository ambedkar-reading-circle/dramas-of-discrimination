import type { Slide } from '../../types'
import { ModesMockup } from './ModesMockup'

export const slide = {
  id: '07',
  kicker: 'Future plans · B',
  heading: 'Who holds the data',
  interactive: <ModesMockup />,
  speakerNotes: [
    { set: 'mode', to: 'local' },
    'Both modes run the same facilitation guide. What changes is where the data lives, and that is for the Community to decide.',
    'Local mode is about data sovereignty. The guide is only a shell: it runs in one browser on the room’s shared screen, with no account, and the Group’s worksheets never leave that device.',
    'On screen, one cursor fills the Actor map. The room talks it through, and one person writes it down.',
    'When the worksheets are done, Local mode turns them into a prompt the Community can take to an LLM of its own choosing. The platform never sees it.',
    { set: 'mode', to: 'cloud' },
    'Cloud mode is the opt-in. The Community chooses to share its data with the platform, and through it with other Communities working through the same questions.',
    'In return it gets a live, shared platform. A Facilitator registers the Community and hands each Group a Join code. Every Community keeps its own space.',
    'On screen, every Member writes into the same sheet from their own device, at the same time, each under their own name.',
    'There is no single scribe. In a truly participatory spirit, everyone charts the course together.',
  ],
} satisfies Slide
