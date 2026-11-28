import { manualPageSrc } from '#/pages/home/workshop-method'
import type { ActivityName } from '#/pages/home/workshop-method'

export type RecordedExample = Readonly<{
  srcs: ReadonlyArray<string>
  alt: string
  caption: string
  focus?: string
}>

const photo = (name: string) => `/facilitation/${name}.jpg`

export const recordedExamples: Readonly<
  Record<ActivityName, ReadonlyArray<RecordedExample>>
> = {
  IntroTime: [
    {
      srcs: [photo('intro-circle')],
      alt: 'A large group sits on the grass under tall trees in a park while one person stands and speaks to them.',
      caption:
        'The whole room settles into one circle, and each person says their name and where they come from.',
    },
    {
      srcs: [photo('intro-privilege')],
      alt: 'A woman in a blue shawl speaks from her chair, beside a framed portrait of Dr. B. R. Ambedkar.',
      caption:
        'One instance of caste privilege, witnessed or lived. Names and places can be left out.',
    },
  ],
  PartTime: [
    {
      srcs: [photo('part-pairs')],
      alt: 'Three people seated side by side; one gestures as she speaks while the others listen.',
      caption:
        'In pairs: one encouragement or reward that was downplayed, and one penalty that was overplayed.',
    },
    {
      srcs: [photo('part-regroup')],
      alt: 'People stand in a seminar room under three projected screens, moving into new groups.',
      caption:
        "Pairs pool their examples, then a count of 'Liberty, Equality, Fraternity' scatters them into mixed groups.",
    },
    {
      srcs: [photo('part-actor-map')],
      alt: "A close view of a hand-filled 'Actors, Activities, Challenges' sheet, with Equality ticked.",
      caption:
        'On the sheet: each actor, what they should ideally do, what stops them, and the constitutional values at stake.',
    },
  ],
  StoryTime: [
    {
      srcs: [photo('story-script')],
      alt: 'A hand writes on the play script sheet, laid over the filled actor map.',
      caption:
        'The play script sheet goes over the finished map, and the failures become interactions between the actors.',
    },
    {
      srcs: [photo('story-centre')],
      alt: 'Two men hold up a play script sheet; one points to the box at its centre.',
      caption:
        'The member of the oppressed caste community stays at the centre, and every interaction is drawn out from there.',
    },
    {
      srcs: [photo('story-unresolved')],
      alt: 'A small group sits on the floor in a close circle, talking a scene through.',
      caption:
        'The group talks the scene through and stops it at the point of conflict, leaving the ending to the room.',
    },
  ],
  PlayTime: [
    {
      srcs: [photo('play-perform')],
      alt: 'Four people play a scene on low wooden chairs on a red-floored stage, a portrait of Dr. Ambedkar behind them.',
      caption:
        'A group plays its scene as written, unresolved, for the other groups to witness.',
      focus: '50% 60%',
    },
    {
      srcs: [photo('play-spect-actor')],
      alt: 'Two people on stage, one with an arm around the other, mid-scene under a tiled roof.',
      caption:
        "A spect-actor steps in, takes over an actor's part or adds a new one, and tries an intervention.",
    },
    {
      srcs: [photo('play-next-group')],
      alt: 'A seminar room with chairs turned towards an open floor, where two people stand performing.',
      caption:
        'Group after group takes the floor, until every scene has been played and opened to the room.',
    },
  ],
  OverTime: [
    {
      srcs: [photo('over-real-world')],
      alt: 'A man in a yellow shirt speaks into a microphone in front of a projected screen.',
      caption:
        'Outside the rehearsal, what would an intervention take? The microphone goes around the room.',
      focus: '50% 30%',
    },
    {
      srcs: [manualPageSrc(2), manualPageSrc(3)],
      alt: "The manual's opening letter, 'Dear Reader', on two blue pages.",
      caption:
        'Back to the actors: discrimination is systemic, rooted in networks of people, beliefs and institutions.',
    },
    {
      srcs: [manualPageSrc(23), manualPageSrc(24)],
      alt: "The manual's last pages: the Manifesto of Inclusion sheet, and the back cover.",
      caption:
        'The room closes on a shared definition of discrimination, and writes its Manifesto of Inclusion.',
    },
  ],
}
