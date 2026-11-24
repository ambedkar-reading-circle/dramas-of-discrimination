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
} satisfies Slide
