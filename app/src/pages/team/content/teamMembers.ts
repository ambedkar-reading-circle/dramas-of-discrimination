export type TeamMemberLink = Readonly<{
  label: string
  href: string
}>

export type TeamMember = Readonly<{
  id: string
  name: string
  intro: string
  photo?: string
  links?: ReadonlyArray<TeamMemberLink>
}>

const members: ReadonlyArray<TeamMember> = [
  {
    id: 'sumit-sute',
    name: 'Sumit Sute',
    photo: '/team/Sumit Sute.png',
    intro:
      'Engineer; built the DoD open-source web platform; facilitates workshops.',
    links: [
      { label: 'Website', href: 'https://sumitsute.com' },
      { label: 'GitHub', href: 'https://github.com/sutesumit' },
    ],
  },
  {
    id: 'pratham',
    name: 'Pratham',
    photo: '/team/Pratham.png',
    intro:
      'Facilitator of the DoD workshops; MSc Applied Psychology student at MAHE, Bangalore.',
  },
  {
    id: 'roy-anto',
    name: 'Roy Anto',
    photo: '/team/Roy Anto.png',
    intro:
      'Anthropologist; co-founder and convenor of ARC; keeps DoD grounded as a research-informed exercise.',
  },
  {
    id: 'shradha-raj',
    name: 'Shradha Raj',
    photo: '/team/Shradha Raj.png',
    intro:
      "Theatre maker, filmmaker, and convener at ARC; leads DoD's facilitation, training, and film production.",
  },
  {
    id: 'vignesh-shiva-subramaniam',
    name: 'Vignesh Shiva Subramaniam',
    photo: '/team/Vignesh S.png',
    intro: 'Co-founder and convenor at ARC.',
  },
]

export const teamMembers: ReadonlyArray<TeamMember> = [...members].sort(
  (a, b) => a.name.localeCompare(b.name),
)
