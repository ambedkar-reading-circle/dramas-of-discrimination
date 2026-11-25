/**
 * Slide 09: the Manifesto portal, where every Manifesto of Inclusion a
 * Community chooses to share is gathered. The Communities and their
 * Manifestos are illustrative, written for the mockup.
 */

export type CommunityKind =
  'workplace' | 'college' | 'neighbourhood' | 'housing' | 'readingCircle'

export const kindLabels: Record<CommunityKind, string> = {
  workplace: 'Workplaces',
  college: 'Colleges',
  neighbourhood: 'Neighbourhoods',
  housing: 'Housing',
  readingCircle: 'Reading circles',
}

/** A pledge many Manifestos make in their own words, counted across the portal. */
export type PledgeId =
  'ask' | 'speak' | 'access' | 'work' | 'redress' | 'voice' | 'share'

export const sharedPledges: Record<PledgeId, string> = {
  ask: 'Never ask, assume or act on caste',
  speak: 'Speak up when discrimination happens',
  access: 'Equal access to homes, work and services',
  work: 'Dignity of every kind of work',
  redress: 'A fair way to raise and settle complaints',
  voice: 'A seat at the table for the unheard',
  share: 'Shared food, water and common spaces',
}

export type PortalManifesto = Readonly<{
  id: string
  community: string
  place: string
  kind: CommunityKind
  people: number
  adopted: string
  opening: string
  values: ReadonlyArray<string>
  pledges: ReadonlyArray<string>
  sharedPledges: ReadonlyArray<PledgeId>
}>

export const manifestos: ReadonlyArray<PortalManifesto> = [
  {
    id: 'garment',
    community: 'Garment workers’ collective',
    place: 'Bengaluru',
    kind: 'workplace',
    people: 24,
    adopted: '12 Feb',
    opening:
      'We, the workers of this floor, resolve that no one among us is lesser for the work their family has done.',
    values: [
      'Dignity of every hand',
      'Equal pay and equal breaks',
      'Fraternity on the floor',
    ],
    pledges: [
      'We will not ask anyone’s caste, nor guess it from their name.',
      'We will share one water point and one lunch room.',
      'We will take complaints to a committee we elect ourselves.',
    ],
    sharedPledges: ['ask', 'share', 'redress', 'work'],
  },
  {
    id: 'hostel',
    community: 'Hostel residents, engineering college',
    place: 'Pune',
    kind: 'college',
    people: 21,
    adopted: '3 Mar',
    opening:
      'We, the residents of this hostel, resolve that every room, mess table and study group is open to all of us.',
    values: [
      'Belonging',
      'Equality in rooms and mess',
      'Voice in hostel decisions',
    ],
    pledges: [
      'We will not sort rooms or tables by caste, region or language.',
      'We will speak up when a joke is a slur.',
      'We will keep a seat on the hostel council for first-generation students.',
    ],
    sharedPledges: ['ask', 'speak', 'share', 'voice'],
  },
  {
    id: 'ward',
    community: 'Ward residents’ forum',
    place: 'Nagpur',
    kind: 'neighbourhood',
    people: 25,
    adopted: '18 Mar',
    opening:
      'We, the residents of this ward, resolve that its streets, taps and temples belong to everyone who lives here.',
    values: [
      'Dignity',
      'Equal access to water and roads',
      'Fraternity across bastis',
    ],
    pledges: [
      'We will back the shops and trades of every family in the ward.',
      'We will speak up when anyone is turned away.',
      'We will bring every lane’s voice to the ward meeting.',
    ],
    sharedPledges: ['access', 'speak', 'work', 'voice'],
  },
  {
    id: 'tenants',
    community: 'Tenants’ association',
    place: 'Chennai',
    kind: 'housing',
    people: 19,
    adopted: '2 Apr',
    opening:
      'We, the tenants of these buildings, resolve that a home is let on rent and trust, never on caste, creed or diet.',
    values: [
      'A home for everyone',
      'Equal terms for every tenant',
      'Privacy and respect',
    ],
    pledges: [
      'We will not ask a tenant’s caste, religion or what they eat.',
      'We will report any landlord who refuses on those grounds.',
      'We will settle disputes in an open meeting, minuted.',
    ],
    sharedPledges: ['ask', 'access', 'speak', 'redress'],
  },
  {
    id: 'reading-circle',
    community: 'Sunday reading circle',
    place: 'Patna',
    kind: 'readingCircle',
    people: 16,
    adopted: '14 Apr',
    opening:
      'We, who read together, resolve to make our circle a place where every voice is heard to its end.',
    values: ['Liberty of thought', 'Equality of voice', 'Fraternity'],
    pledges: [
      'We will let the least heard among us speak first.',
      'We will speak up against discrimination, in the circle and outside it.',
      'We will honour every kind of work, as we honour books.',
    ],
    sharedPledges: ['voice', 'speak', 'work'],
  },
  {
    id: 'nurses',
    community: 'Nursing staff, district hospital',
    place: 'Kochi',
    kind: 'workplace',
    people: 23,
    adopted: '6 May',
    opening:
      'We, the nurses and attendants of this hospital, resolve that care is given and received without regard to caste.',
    values: [
      'Dignity of care work',
      'Equal duties, fairly rostered',
      'Courage to speak',
    ],
    pledges: [
      'We will not leave the cleaning and the night shifts to the same few.',
      'We will not ask, assume or act on anyone’s caste.',
      'We will raise discrimination through a confidential channel, and see it through.',
    ],
    sharedPledges: ['work', 'ask', 'redress', 'speak'],
  },
  {
    id: 'shg',
    community: 'Women’s self-help group',
    place: 'Lucknow',
    kind: 'neighbourhood',
    people: 18,
    adopted: '20 May',
    opening:
      'We, the women of this group, resolve that credit, work and respect are owed to each of us alike.',
    values: ['Dignity', 'Equal access to credit', 'Sisterhood'],
    pledges: [
      'We will lend on need and trust, never on caste or family.',
      'We will buy from and back each other’s trades.',
      'We will not ask anyone’s caste.',
    ],
    sharedPledges: ['access', 'work', 'ask'],
  },
  {
    id: 'law',
    community: 'Law students’ society',
    place: 'Delhi',
    kind: 'college',
    people: 22,
    adopted: '4 Jun',
    opening:
      'We, students of the law, resolve to practise among ourselves the equality the Constitution promises to all.',
    values: [
      'Equality before one another',
      'Fraternity',
      'Justice that is seen',
    ],
    pledges: [
      'We will not ask, assume or act on caste in our moots, our clubs or our friendships.',
      'We will speak up when discrimination happens before us.',
      'We will run a fair, public process for every complaint.',
    ],
    sharedPledges: ['ask', 'speak', 'redress', 'access'],
  },
]

/** The whole portal: every Manifesto shared so far, the eight above among them. */
export const collection = {
  manifestos: 2_400,
  people: 52_800,
  cities: 312,
  /** The share of Manifestos making each pledge, from 0 to 1. */
  shares: {
    ask: 0.86,
    speak: 0.81,
    access: 0.74,
    redress: 0.69,
    work: 0.64,
    voice: 0.55,
    share: 0.44,
  },
} as const satisfies {
  manifestos: number
  people: number
  cities: number
  shares: Record<PledgeId, number>
}
