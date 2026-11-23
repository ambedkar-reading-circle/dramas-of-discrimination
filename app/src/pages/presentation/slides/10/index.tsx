import type { Slide } from '../../types'
import { VideoEmbed } from './VideoEmbed'

export const slide = {
  id: '10',
  kicker: 'The room',
  heading: 'Rehearsal in action',
  body: <p className="section-lede-copy">Groups mid-Workshop: mapping Actors, scripting Dialogues, stepping into the scene.</p>,
  interactive: <VideoEmbed />,
  layout: 'split',
} satisfies Slide
