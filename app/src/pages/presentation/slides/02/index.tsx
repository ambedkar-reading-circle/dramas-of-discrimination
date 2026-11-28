import type { Slide } from '../../types'
import { speakerNotes } from './content/speakerNotes'
import { VideoEmbed } from './VideoEmbed'

export const slide = {
  id: '02',
  kicker: 'The Workshop',
  heading: 'Dramas of Discrimination',
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
  speakerNotes,
} satisfies Slide
