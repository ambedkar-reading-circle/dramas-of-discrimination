import type { InstantPhotoData } from '#/components/InstantPhoto'

export type MissionKey = 'motivation' | 'gathers'

export type MissionQuoteKey = 'thomas-title' | 'thomas-business' | 'thomas-fuel' | 'thomas-reality' | 'dobbin-title' | 'dobbin-rules' | 'dobbin-champions'

export type MissionPhotoKey = MissionKey | 'result' | MissionQuoteKey

export interface MissionRow {
  label: string
  text: string
}

export interface MissionCard {
  key: MissionKey
  name: string
  lead: string
  rows: ReadonlyArray<MissionRow>
}

export const missionLabel =
  "A tool to gauge and gather participants' collective caste consciousness"

export const cards: ReadonlyArray<MissionCard> = [
  {
    key: 'motivation',
    name: 'What it works toward',
    lead: 'A platform for rehearsing change',
    rows: [
      {
        label: 'Toward',
        text: 'a more just and inclusive work environment',
      },
      {
        label: 'Cultivating',
        text: 'proactive understanding and engagement with caste-based discrimination in Indian workplaces',
      },
    ],
  },
  {
    key: 'gathers',
    name: 'What it gathers',
    lead: 'How a diverse community names caste, and how it responds',
    rows: [
      {
        label: 'Articulating',
        text: 'instances of caste-based discrimination, including what is rarely said out loud',
      },
      {
        label: 'Intervening',
        text: 'in discriminatory situations: the many ways people confront, negotiate, or quietly shift a scene',
      },
    ],
  },
]

export const missionResult = 'Collective caste consciousness'

export const missionResultNote = 'gauged and gathered from a diverse community'

export const missionResultFinding = {
  lead: 'Rules can provoke resistance. Those who help build inclusion',
  quote: 'begin to think of themselves as diversity champions.',
}

const thomasHref = 'https://hbr.org/1990/03/from-affirmative-action-to-affirming-diversity'
const dobbinHref = 'https://hbr.org/2016/07/why-diversity-programs-fail'

export interface MissionExcerpt {
  key: MissionQuoteKey
  label: string
}

export interface MissionSource {
  mark?: string
  text: string
  journal: string
  href: string
  clip: MissionQuoteKey
  excerpts: ReadonlyArray<MissionExcerpt>
}

export const missionSources: ReadonlyArray<MissionSource> = [
  {
    mark: '*',
    text: 'Dobbin, F., & Kalev, A. (2016). Why diversity programs fail.',
    journal: 'Harvard Business Review, 94(7), 52–60.',
    href: dobbinHref,
    clip: 'dobbin-title',
    excerpts: [
      { key: 'dobbin-rules', label: 'force-feeding' },
      { key: 'dobbin-champions', label: 'diversity champions' },
    ],
  },
  {
    text: 'Thomas, R. R., Jr. (1990). From affirmative action to affirming diversity.',
    journal: 'Harvard Business Review, 68(2), 107–117.',
    href: thomasHref,
    clip: 'thomas-title',
    excerpts: [
      { key: 'thomas-business', label: 'in business terms' },
      { key: 'thomas-fuel', label: 'new fuel' },
      { key: 'thomas-reality', label: 'our reality' },
    ],
  },
]

const thomas = 'R. Roosevelt Thomas Jr., “From Affirmative Action to Affirming Diversity,” Harvard Business Review, 1990'
const dobbin = 'Dobbin & Kalev, “Why Diversity Programs Fail,” HBR, 2016'

const quotePhotos: Record<MissionQuoteKey, InstantPhotoData> = {
  'thomas-title': {
    src: '/slides/04-thomas-title.webp',
    href: thomasHref,
    alt: 'The article’s heading on hbr.org: From Affirmative Action to Affirming Diversity, by R. Roosevelt Thomas, Jr., from the March–April 1990 issue.',
    caption: 'R. Roosevelt Thomas Jr., often called the father of diversity management, in Harvard Business Review, 1990.',
    tilt: -1.2,
    direction: 'bottom',
  },
  'thomas-business': {
    src: '/slides/04-thomas-business.webp',
    href: thomasHref,
    alt: 'A passage of the article, highlighted: “In business terms, a diverse work force is not something your company ought to have; it’s something your company does have, or soon will have.”',
    caption: thomas,
    tilt: 1.2,
    direction: 'left',
  },
  'thomas-fuel': {
    src: '/slides/04-thomas-fuel.webp',
    href: thomasHref,
    alt: 'A passage of the article, highlighted: “Affirmative action gets the new fuel into the tank, the new people through the front door. Something else will have to get them into the driver’s seat.”',
    caption: thomas,
    tilt: -1,
    direction: 'right',
  },
  'thomas-reality': {
    src: '/slides/04-thomas-reality.webp',
    href: thomasHref,
    alt: 'The article’s last line, highlighted: “It’s our reality. We need to make it our strength.” Below it: A version of this article appeared in the March–April 1990 issue of Harvard Business Review.',
    caption: thomas,
    tilt: 1,
    direction: 'bottom',
  },
  'dobbin-title': {
    src: '/slides/04-dobbin-title.webp',
    href: dobbinHref,
    alt: 'The article’s opening spread: Why Diversity Programs Fail, and what works better, by Frank Dobbin and Alexandra Kalev.',
    caption: 'Frank Dobbin and Alexandra Kalev, in Harvard Business Review, July–August 2016.',
    tilt: 1.2,
    direction: 'bottom',
  },
  'dobbin-rules': {
    src: '/slides/04-dobbin-rules.webp',
    href: dobbinHref,
    alt: 'A column of the article, highlighted: “laboratory studies show that this kind of force-feeding can activate bias rather than stamp it out,” and “people often rebel against rules to assert their autonomy.”',
    caption: dobbin,
    tilt: -1.5,
    direction: 'left',
  },
  'dobbin-champions': {
    src: '/slides/04-dobbin-champions.webp',
    href: dobbinHref,
    alt: 'A column of the article, highlighted: “When managers actively help boost diversity in their companies, something similar happens: They begin to think of themselves as diversity champions.”',
    caption: dobbin,
    tilt: 1.5,
    direction: 'right',
  },
}

export const missionPhotos: Record<MissionPhotoKey, InstantPhotoData> = {
  ...quotePhotos,
  motivation: {
    src: '/slides/04a.jpg',
    alt: 'A circle of empty black chairs in a sunlit room, a framed portrait of Ambedkar resting on one of them.',
    caption: 'the workshop works toward a more just workplace, rehearsed here in a social lab.',
    tilt: -3,
    direction: 'left',
  },
  gathers: {
    src: '/slides/04b.jpg',
    alt: 'Participants holding microphones act out a scene in front of two screens showing the Workshop app, its Pause Skit and Add Intervention controls visible.',
    caption: 'the workshop gathers how people name caste discrimination, and every way they try to mitigate it.',
    tilt: 2.5,
    direction: 'right',
  },
  result: {
    src: '/slides/04c.jpg',
    alt: 'A varied group sits along benches in a shaded courtyard, watching and smiling at someone speaking at the front.',
    caption: 'together, they map a room’s shared understanding of caste as a systemic issue, and of its mitigation as a systemic approach.',
    tilt: -1.5,
    direction: 'bottom',
  },
}
