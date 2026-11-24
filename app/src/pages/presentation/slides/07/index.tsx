import type { Slide } from '../../types'
import { TablesPreview } from './TablesPreview'

export const slide = {
  id: '07',
  kicker: 'The Rehearsal',
  heading: 'The two tables',
  body: (
    <>
      <p className="section-lede-copy">One Scenario, staged twice. The Actor map lists each Actor, its Ideal behaviour, and its Failures; the Play script stages the Scenario as directed Dialogues, each tagged to the Failures it shows.</p>
      <TablesPreview />
    </>
  ),
} satisfies Slide
