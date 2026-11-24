import type { Slide } from '../../types'

export const slide = {
  id: '09',
  kicker: 'The room',
  heading: 'Rehearsal in action',
  body: <p className="section-lede-copy">Groups mid-Workshop: mapping Actors, scripting Dialogues, stepping into the scene.</p>,
  assets: [{ role: 'video', note: 'A second clip, from a Rehearsal' }],
  layout: 'split',
} satisfies Slide
