/** The five acts of the workshop, in order. */
export type ActivityName =
  'IntroTime' | 'PartTime' | 'StoryTime' | 'PlayTime' | 'OverTime'

export interface WorkshopActivity {
  name: ActivityName
  title: string
  duration: number
  preview: string
  summary: string
  steps: ActivityStep[]
  prompt: string
  manual: ManualExcerpt[]
  /** Stickers for the activity's worksheet, under the drawing. */
  worksheets?: WorksheetSticker[]
}

/** One instruction; a step with photographs opens them from its own text. */
export interface ActivityStep {
  text: string
  photos?: Photo[]
}

/** A photograph from a past workshop; the caption carries what it adds. */
export interface Photo {
  src: string
  alt: string
  caption: string
}

/** The worksheet as the manual prints it, or as a group filled it in. */
export type WorksheetSticker =
  | { kind: 'manual'; label: string; pages: number[] }
  | { kind: 'photo'; label: string; photo: Photo }

export interface ManualExcerpt {
  part?: string
  pages: number[]
}

export function manualPageSrc(page: number) {
  return `/manual/ARC_DoD_Manual_Page-${page}.jpg`
}

export const workshopActivities: WorkshopActivity[] = [
  {
    name: 'IntroTime',
    title: 'Greetings, introductions & check-in',
    duration: 20,
    preview: 'Share examples of privilege.',
    summary:
      'Ground the workshop in lived experience of caste privilege, through introductions and a shared check-in on everyday examples.',
    steps: [
      {
        text: 'Each person shares their name and where they come from.',
        photos: [
          {
            src: '/slides/05-intro-a.jpg',
            alt: 'About twenty people seated in a wide circle of chairs in a sunlit studio, with a framed portrait of Dr. B. R. Ambedkar on the far wall.',
            caption:
              'The whole group sits in one circle, and the round goes chair by chair, so every voice is heard once before any discussion opens.',
          },
        ],
      },
      {
        text: 'Each person offers one instance of caste privilege, with identifying details optional.',
        photos: [
          {
            src: '/slides/05-intro-b.jpg',
            alt: 'People seated side by side in a circle, one speaking while the others listen.',
            caption:
              'Each person names one privilege they have witnessed or lived while the circle listens. Names and places can be left out.',
          },
        ],
      },
    ],
    prompt: 'Where have you seen caste privilege at work in everyday life?',
    manual: [{ pages: [6, 7] }],
  },
  {
    name: 'PartTime',
    title: 'Group formation & actor mapping',
    duration: 30,
    preview: 'Define the shape and actors of discrimination.',
    summary:
      'Trace how discrimination is upheld by people and institutions, through paired examples of reward and penalty, and a group map of actors, their ideal behaviour, their failures and constitutional values.',
    steps: [
      {
        text: 'In pairs, name one instance of downplayed encouragement or reward, and one of overplayed punishment or penalty.',
        photos: [
          {
            src: '/slides/05-part-a.jpg',
            alt: 'Two people talk as a pair, one listening with arms folded.',
            caption:
              'Pairs look past the reservation debate, to the everyday ways encouragement is held back and penalties are inflated.',
          },
        ],
      },
      {
        text: 'Pool the examples, form mixed groups, and have each group choose one issue.',
        photos: [
          {
            src: '/slides/05-part-d.jpg',
            alt: 'Small groups sit on the grass under tall trees in a park, one person cross-legged over a large sheet spread on the lawn.',
            caption:
              "Each pair brings its examples to the room. Then a count of 'Liberty, Equality, Fraternity' scatters the pairs into new groups, and each group settles on one issue.",
          },
        ],
      },
      {
        text: 'Map the actors involved, their ideal behaviour, the failures that stop them, and the constitutional values at stake.',
        photos: [
          {
            src: '/slides/05-part-c.jpg',
            alt: 'A group sits on a mat on the grass around a large sheet, one person writing on it, markers scattered around.',
            caption:
              "On the 'Actors, Activities, Challenges' sheet, a group lists who is involved, what each should ideally do and what stops them, then marks Justice, Liberty, Equality or Fraternity wherever the scenario violates one.",
          },
        ],
      },
    ],
    prompt:
      'Who holds responsibility here, and what keeps them from acting on it?',
    manual: [
      { part: 'A', pages: [8, 9] },
      { part: 'B', pages: [10, 11] },
    ],
    worksheets: [
      { kind: 'manual', label: 'Blank sheet', pages: [18, 19] },
      {
        kind: 'photo',
        label: 'Filled sheet',
        photo: {
          src: '/slides/05-part-sheet.jpg',
          alt: "A hand-filled 'Actors, Activities, Challenges' sheet, held up at both edges: ten actors listed on the left, with each one's ideal behaviour and failures written across the next two columns.",
          caption:
            "One group's sheet: a girl from a waste-picking family wants to open a beauty parlour near her home. Her family, friends, community, building owner and the other castes each get an ideal behaviour, and each behaviour its failures, from financial crisis to bias.",
        },
      },
    ],
  },
  {
    name: 'StoryTime',
    title: 'Crafting the play & interactions',
    duration: 20,
    preview: 'Lay the system map as a play script.',
    summary:
      'Render one instance of discrimination as a dramatic situation, by building dialogue from the actor map around the person who faces it, and leaving it unresolved.',
    steps: [
      {
        text: 'Build interactions and dialogue from the actors and failures on the map.',
        photos: [
          {
            src: '/slides/05-story-a.jpg',
            alt: 'Seen from above: people seated on the floor around the play script sheet, laid over their filled-in actor map.',
            caption:
              'The play script sheet goes on top of the finished map. The person from the oppressed caste community sits at its centre, and every interaction is drawn out from there.',
          },
        ],
      },
      {
        text: 'Centre the aspirations and difficulties of a person from a discriminated caste or religious minority community.',
        photos: [
          {
            src: '/slides/05-story-c.jpg',
            alt: 'Seen from above: a person writes on the play script sheet spread across a wooden table, while another leans in, laughing.',
            caption:
              "The 'Member of the Oppressed Caste Community' box stays fixed at the centre of the sheet. Each actor's note is written in relation to that person.",
          },
        ],
      },
      {
        text: 'End the scene unresolved, so that other groups can propose interventions.',
        photos: [
          {
            src: '/slides/05-story-b.jpg',
            alt: 'People crouch on a tiled floor around their written sheets, pointing and talking.',
            caption:
              'The group talks the scene through on the floor and stops it at the point of conflict, leaving the resolution for the other groups to attempt.',
          },
        ],
      },
    ],
    prompt:
      'What passes between these people? Show the discrimination before attempting to resolve it.',
    manual: [{ pages: [12, 13] }],
    worksheets: [
      { kind: 'manual', label: 'Blank sheet', pages: [20, 21] },
      {
        kind: 'photo',
        label: 'Filled sheet',
        photo: {
          src: '/slides/05-story-sheet.jpg',
          alt: 'A hand-filled play script sheet held up at both edges: a member of the oppressed caste community at the centre, bank staff, customers, housekeeping and security around her, joined by numbered arrows and notes on each interaction.',
          caption:
            "One group's scene at a bank: a manager from the oppressed caste community at the centre. Each actor carries a caste and religion, and numbered arrows order the interactions, from a staff member who does not greet her to incorrect paperwork and segregated seating at lunch.",
        },
      },
    ],
  },
  {
    name: 'PlayTime',
    title: 'Staging the skit & trying interventions',
    duration: 60,
    preview: 'Perform the scene. Try interventions.',
    summary:
      'Test possible responses to discrimination in practice, through staged performances that spect-actors enter by taking over an actor’s part or adding a new actor.',
    steps: [
      {
        text: 'Each group performs its scene for the others (about 5 minutes).',
        photos: [
          {
            src: '/slides/05-play-a.jpg',
            alt: 'A hall ringed with chairs; two people stand in the open middle, playing a scene, while the rest of the room watches from the circle.',
            caption:
              'The circle of chairs is the stage. A group plays its scene in the middle, as written and left unresolved, for the other groups to witness.',
          },
        ],
      },
      {
        text: 'Spect-actors take over an existing actor or add a new one to try an intervention (about 15 minutes per group).',
        photos: [
          {
            src: '/slides/05-play-b.jpg',
            alt: 'Seen from the audience: people on their feet mid-scene, one man with a notebook in hand gesturing as he speaks to a woman with her hand on her hip.',
            caption:
              'A spect-actor steps in from the audience, takes over an actor’s part or adds a new actor, and tries an intervention at the moment they choose.',
          },
        ],
      },
      {
        text: 'Repeat for each group, adjusting the timing to the room.',
        photos: [
          {
            src: '/slides/05-play-c.jpg',
            alt: 'An open-air stage under a tiled roof: three people seated on the red floor play a scene, while another walks in from the side, arms open, beside a framed portrait of Dr. B. R. Ambedkar.',
            caption:
              'Group after group takes the stage, until every scene has been played and opened to the room.',
          },
        ],
      },
    ],
    prompt: 'At what moment would you intervene, and as whom?',
    manual: [{ pages: [14, 15] }],
  },
  {
    name: 'OverTime',
    title: 'Debrief & constitutional commitments',
    duration: 10,
    preview: 'Reflect on real-world plausibility.',
    summary:
      "Weigh what intervening would take in real life, through a facilitated reflection on actors' constraints, selective inclusion and shared ways of defining discrimination.",
    steps: [
      {
        text: 'Discuss what makes interventions difficult outside the rehearsal, and what preparation they would require.',
        photos: [
          {
            src: '/slides/05-over-a.jpg',
            alt: 'A large seminar room under a long mural: people on swivel chairs turned towards one another in small clusters, workshop slides on the screens behind them.',
            caption:
              'Out of the scenes and back in the room. People turn to those beside them and weigh what an intervention would take outside the rehearsal, where it is neither safe nor predictable.',
          },
        ],
      },
      {
        text: 'Revisit the actors: what prevents them from fulfilling their responsibilities, and what support would help.',
        photos: [
          {
            src: '/slides/05-over-b.jpg',
            alt: 'A hall with chairs in a wide circle; a few people stand in the open middle, one speaking with his hands raised, while the rest listen from their seats.',
            caption:
              'The circle turns back to the actors. What kept each of them from their ideal role, and what support would help them act on it?',
          },
        ],
      },
      {
        text: 'Reflect on constitutional values and selective inclusion, and arrive at a shared definition of discrimination.',
        photos: [
          {
            src: '/slides/05-over-c.jpg',
            alt: 'People seated around a round table; one speaks into a microphone while the others listen, a hand to the chin.',
            caption:
              'The microphone goes around the room. Together, the room works towards a definition of discrimination plain enough to name it without hesitation.',
          },
        ],
      },
    ],
    prompt:
      'What would it take to uphold these constitutional values in our everyday relationships?',
    manual: [{ pages: [16, 17] }],
    worksheets: [
      { kind: 'manual', label: 'Manifesto of Inclusion', pages: [22, 23] },
    ],
  },
]
