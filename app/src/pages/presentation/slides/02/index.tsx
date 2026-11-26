import type { Slide } from '../../types'
import { VideoEmbed } from './VideoEmbed'

export const slide = {
  id: '02',
  kicker: 'The Workshop',
  heading: 'Dramas of Discrimination',
  // The tablet is the whole slide. The heading stays for screen readers and
  // for the stage's focus-on-arrival, but is not drawn.
  ownsHeading: true,
  body: (
    <>
      <h2 className="sr-only" tabIndex={-1}>
        Dramas of Discrimination
      </h2>
      <VideoEmbed />
    </>
  ),
  layout: 'fill',
  speakerNotes: [
    'To make this less abstract, let me show you a short film of the workshop.',
    'It also shows who we are. The Ambedkar Reading Circle is an informal collective.',
    { set: 'film', to: 'playing', wait: 'video' },
    'Our work is rooted in the values of the Constitution. Liberty, equality, fraternity, and justice.',
    "Above all, it is rooted in Babasaheb's vision of fraternity.",
  ],
} satisfies Slide
