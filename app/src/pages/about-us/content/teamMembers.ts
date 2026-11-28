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
      'Engineer; convenor at ARC; built the DoD open-source web platform; facilitates workshops.',
    links: [
      { label: 'Website', href: 'https://sumitsute.com' },
      { label: 'GitHub', href: 'https://github.com/sutesumit' },
    ],
  },
  {
    id: 'pratham',
    name: 'Pratham Swamy',
    photo: '/team/Pratham.png',
    intro:
      'Convenor at ARC; facilitates DoD workshops; MSc Applied Psychology student at MAHE, Bangalore.',
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
      'Theatre maker, filmmaker, and convenor at ARC; leads DoD\u2019s facilitation, training, and film production.',
  },
  {
    id: 'vignesh-shiva-subramaniam',
    name: 'Vignesh Shiva Subramaniam M',
    photo: '/team/Vignesh S.png',
    intro:
      'Co-founder and convenor at ARC; facilitates DoD workshops; National Coordinator at the Alliance of Indian Waste Pickers, working on waste governance and informal labour rights.',
  },
]

export const teamMembers: ReadonlyArray<TeamMember> = [...members].sort(
  (a, b) => a.name.localeCompare(b.name),
)

export function firstName(member: TeamMember) {
  return member.name.split(' ')[0]
}
