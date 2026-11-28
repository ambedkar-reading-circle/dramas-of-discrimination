export type CommunityKind =
  'workplace' | 'college' | 'neighbourhood' | 'housing' | 'readingCircle'

export const kindLabels: Record<CommunityKind, string> = {
  workplace: 'Workplaces',
  college: 'Colleges',
  neighbourhood: 'Neighbourhoods',
  housing: 'Housing',
  readingCircle: 'Reading circles',
}

export type RuleId =
  'ask' | 'speak' | 'access' | 'work' | 'redress' | 'voice' | 'share'

export const sharedRules: Record<RuleId, string> = {
  ask: 'No one is asked their caste, religion or category',
  speak: 'Whoever sees it raises it, not only the one who bears it',
  access: 'The same terms for homes, work, credit and posts',
  work: 'Cleaning and night duties rotate',
  redress: 'Every complaint answered within a set time',
  voice: 'Seats and turns kept for the least heard',
  share: 'One water point and one table for all',
}

export type PortalManifesto = Readonly<{
  id: string
  community: string
  place: string
  kind: CommunityKind
  people: number
  adopted: string
  opening: string
  rules: ReadonlyArray<string>
  ruleIds: ReadonlyArray<RuleId>
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
      'Drawn from a Scenario our Groups acted out: a sorter put on the toilet-cleaning roster in her first week, once a supervisor learned her surname.',
    rules: [
      'Cleaning and night shifts rotate across the whole floor, posted on the board each Monday.',
      'Supervisors never ask a worker’s caste, and never assign duties by surname.',
      'One water point and one lunch room for everyone, with no separate glasses.',
      'Complaints go to a committee the floor elects, which answers within ten days.',
    ],
    ruleIds: ['work', 'ask', 'share', 'redress'],
  },
  {
    id: 'hostel',
    community: 'Hostel residents, engineering college',
    place: 'Pune',
    kind: 'college',
    people: 21,
    adopted: '3 Mar',
    opening:
      'Drawn from a Scenario our Groups acted out: a first-generation student whose roommates asked to move out once they learned where she was from.',
    rules: [
      'Rooms and mess tables are allotted by lottery, never by caste, region or language.',
      'A request to change rooms needs a written reason; discomfort with a roommate’s background is not one.',
      'A slur passed off as a joke is reported to the hostel council, which hears it that week.',
      'Two council seats are kept for first-generation students.',
    ],
    ruleIds: ['access', 'ask', 'speak', 'voice'],
  },
  {
    id: 'ward',
    community: 'Ward residents’ forum',
    place: 'Nagpur',
    kind: 'neighbourhood',
    people: 25,
    adopted: '18 Mar',
    opening:
      'Drawn from a Scenario our Groups acted out: a family from the basti turned away from the common tap in the morning queue.',
    rules: [
      'The ward’s taps, roads and temple are open to every household, at the same hours.',
      'Anyone who sees a neighbour turned away raises it with the ward committee that day.',
      'The committee posts tap timings, and every complaint about them, on the notice board.',
      'Every lane, the bastis included, sends a representative to the monthly ward meeting.',
    ],
    ruleIds: ['access', 'speak', 'redress', 'voice'],
  },
  {
    id: 'tenants',
    community: 'Tenants’ association',
    place: 'Chennai',
    kind: 'housing',
    people: 19,
    adopted: '2 Apr',
    opening:
      'Drawn from a Scenario our Groups acted out: a couple refused a flat over the phone once the owner heard their surname and asked whether they ate meat.',
    rules: [
      'Listings shared through the association never ask caste, religion or diet.',
      'A refusal on those grounds is reported to the association, which names the building to its members.',
      'Deposits, terms and rent rises are the same for every tenant, and written down.',
      'Disputes are settled in an open meeting within a month, and minuted.',
    ],
    ruleIds: ['ask', 'speak', 'access', 'redress'],
  },
  {
    id: 'reading-circle',
    community: 'Sunday reading circle',
    place: 'Patna',
    kind: 'readingCircle',
    people: 16,
    adopted: '14 Apr',
    opening:
      'Drawn from a Scenario our Groups acted out: a member talked over, week after week, until she stopped coming.',
    rules: [
      'Each session, those who have spoken least speak first.',
      'The convenor keeps time, and no one is cut off before they finish.',
      'When a member stops coming, two others call to ask why, and bring back what they hear.',
      'A caste remark, in the circle or outside it, is named there and then by whoever hears it.',
    ],
    ruleIds: ['voice', 'redress', 'speak'],
  },
  {
    id: 'nurses',
    community: 'Nursing staff, district hospital',
    place: 'Kochi',
    kind: 'workplace',
    people: 23,
    adopted: '6 May',
    opening:
      'Drawn from a Scenario our Groups acted out: a ward attendant whose patients’ families refused her care and asked for “someone else”.',
    rules: [
      'A request for a different carer because of who the carer is gets refused, and logged.',
      'The duty nurse speaks up for the attendant there and then; it is not left to her.',
      'Cleaning and night duties are rostered in rotation, and the roster is posted.',
      'Staff raise discrimination through a confidential channel, answered within a week.',
    ],
    ruleIds: ['ask', 'speak', 'work', 'redress'],
  },
  {
    id: 'shg',
    community: 'Women’s self-help group',
    place: 'Lucknow',
    kind: 'neighbourhood',
    people: 18,
    adopted: '20 May',
    opening:
      'Drawn from a Scenario our Groups acted out: a member passed over for a loan twice, though she had never missed a repayment.',
    rules: [
      'Loans are decided on need and repayment record, and the reason for every refusal is minuted.',
      'Members buy from one another’s trades first: tailoring, snacks, beauty work.',
      'No one is asked their caste, or their husband’s family’s, when they join.',
      'The chair rotates every year, so no one family holds it.',
    ],
    ruleIds: ['access', 'work', 'ask', 'voice'],
  },
  {
    id: 'law',
    community: 'Law students’ society',
    place: 'Delhi',
    kind: 'college',
    people: 22,
    adopted: '4 Jun',
    opening:
      'Drawn from a Scenario our Groups acted out: a student dropped from a moot team after a senior asked whether she had come in through reservation.',
    rules: [
      'Moot teams and society posts are picked by open trial, with the marks published.',
      'No one asks how a student was admitted, or their rank or category.',
      'Anyone who hears that question asked raises it with the society’s committee.',
      'Every complaint gets a hearing within two weeks, and a written decision.',
    ],
    ruleIds: ['access', 'ask', 'speak', 'redress'],
  },
]

export const collection = {
  manifestos: 2_400,
  people: 52_800,
  cities: 312,
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
  shares: Record<RuleId, number>
}
