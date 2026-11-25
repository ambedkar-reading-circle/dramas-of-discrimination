import type { Slide } from '../../types'
import { ModesMockup } from './ModesMockup'

export const slide = {
  id: '07',
  kicker: 'Future plans · B',
  heading: 'Local & Cloud modes',
  body: <p className="section-lede-copy">In Local mode the room works on one shared device, and nothing leaves it. In Cloud mode the Community opts in, and every Member joins their Group from their own device.</p>,
  interactive: <ModesMockup />,
  speakerNotes: ['Local mode runs entirely in one browser, on one device. There is no account, and the work stays in that browser. Nothing leaves the device.', 'When a Rehearsal is done, Local mode turns its tables into a prompt the room can carry to an LLM of its own choosing. The platform never sees it.', 'Cloud mode is the opt-in. A Facilitator registers the Community, creates its Groups, and hands each Group a Join code.', 'Each Member then joins their Group from their own device, and the Group’s work stays in sync across all of them.'],
} satisfies Slide
