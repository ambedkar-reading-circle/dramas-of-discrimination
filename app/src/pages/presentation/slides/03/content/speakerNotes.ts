import { cuesOf } from '../../../playback/cues'
import type { SpeakerNote } from '../../../types'

const circles = cuesOf('circles')

/** What to say over slide 03, line by line, with the cues that change the slide between them. */
export const speakerNotes: ReadonlyArray<SpeakerNote> = [
  'The Ambedkar Reading Circle started in Cubbon Park, Bangalore, in 2023.',
  circles('bangalore'),
  "Reading circles like ours are inspired by, and founded on, Babasaheb's call:",
  circles(null),
  'Educate, Agitate, Organize.',
  circles('agitate'),
  'We wanted to take anti-caste literature and anti-caste iconography into public spaces. To occupy those spaces with them.',
  'And to invite others to sit with this literature and these images, and to talk back to them.',
  circles('organize'),
  'For Dalits who have migrated to the city, we wanted the circle to feel like belonging. Like home.',
  'It is open to all liberals too, who come looking for solidarity and allyship.',
  circles('educate'),
  'Since then we have met about once a month. A circle usually draws twenty to forty people.',
  'Roughly half are coming back, and half are there for the first time. We see that split almost every time.',
  'Other circles were inspired by us and stay in touch.',
  circles('mumbai'),
  'ARC Mumbai,',
  circles('delhi'),
  'ARC Delhi,',
  circles('chennai'),
  'ARC Chennai,',
  circles('hyderabad'),
  'BARC Hyderabad, among others.',
]
