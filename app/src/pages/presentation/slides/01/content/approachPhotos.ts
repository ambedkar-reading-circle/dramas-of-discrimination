import type { InstantPhotoData } from '#/components/InstantPhoto'
import type { ApproachSide } from '../types'

export const approachPhotos: Record<ApproachSide, InstantPhotoData> = {
  systems: {
    src: '/slides/01a.jpg',
    alt: 'Seen from above, workshop participants gather around a table spread with worksheets titled Actors, Activities, Challenges and Storyline, one person gesturing over the handwritten notes.',
    caption: 'mapping who holds power in a scene',
    tilt: -4,
    direction: 'left',
  },
  forum: {
    src: '/slides/01b.jpg',
    alt: 'An audience seated in rows watches performers standing at the front of a studio room, one of them speaking.',
    caption: 'the audience steps in to change the scene',
    tilt: 3,
    direction: 'right',
  },
  result: {
    src: '/slides/01c.jpg',
    alt: 'A large group stands and sits in a wide circle on the grass under tall trees in a park, talking together.',
    caption: 'reflecting together on what must change',
    tilt: -1.5,
    direction: 'bottom',
  },
}
