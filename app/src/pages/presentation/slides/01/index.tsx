import type { Slide } from '../../types'
import { TitleSlideBody } from './TitleSlideBody'

export const slide = {
  id: '01',
  kicker: 'An Ambedkar Reading Circle workshop',
  heading: 'Dramas of Discrimination',
  body: <TitleSlideBody />,
  layout: 'centered',
  ownsHeading: true,
  speakerNotes: [
    'Dramas of Discrimination is a workshop we made at the Ambedkar Reading Circle.',
    "It's for groups that are already diverse, and want everyone to truly belong.",
    { set: 'approach', to: 'systems' },
    'In small groups, you pick a story of discrimination. Real or made up.',
    'You take it apart to see the system behind it. Who is involved, and what keeps it going.',
    { set: 'approach', to: 'forum' },
    'Then you act it out as a short play.',
    'Others step in and try to change the ending. And we see who pushes back.',
    'So it is a place to rehearse. An idea that sounds easy from an armchair gets tested here.',
    { set: 'approach', to: 'result' },
    'What comes out depends on who is in the room. The more varied the group, the richer it gets.',
    'Systems thinking can feel abstract.',
    'Theatre feels real, but it can shrink a big problem into one bad person.',
    'So we took the best of both, and left their limits behind.',
    { set: 'approach', to: null },
  ],
} satisfies Slide
