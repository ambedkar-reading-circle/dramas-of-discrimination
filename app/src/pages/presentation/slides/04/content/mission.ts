import type { InstantPhotoData } from '#/components/InstantPhoto'

export type MissionKey = 'motivation' | 'gathers'

/** Each card, and the result card, opens a photo of the Workshop. */
export type MissionPhotoKey = MissionKey | 'result'

export interface MissionRow {
  label: string
  text: string
}

export interface MissionCard {
  key: MissionKey
  name: string
  lead: string
  rows: ReadonlyArray<MissionRow>
  /** The two ends of the card's spectrum. */
  from: string
  to: string
  /** Where each mark sits on the spectrum, 0 to 1. Illustrative only. */
  readings: ReadonlyArray<number>
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
    from: 'spectator',
    to: 'spect-actor',
    readings: [0.14, 0.38, 0.57, 0.72, 0.88],
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
    from: 'direct',
    to: 'subversive',
    readings: [0.1, 0.32, 0.47, 0.63, 0.86],
  },
]

export const missionResult = 'Collective caste consciousness'

export const missionResultNote = 'gauged and gathered from a diverse community'

/** A short, verbatim-quoting form of the finding the speaker notes give in full. */
export const missionResultFinding = {
  lead: 'Rules can provoke resistance. Those who help build inclusion',
  quote: 'begin to think of themselves as diversity champions.',
}

export const missionSource = {
  text: 'Dobbin, F., & Kalev, A. (2016). Why diversity programs fail.',
  journal: 'Harvard Business Review, 94(7), 52–60.',
  href: 'https://hbr.org/2016/07/why-diversity-programs-fail',
}

export const missionPhotos: Record<MissionPhotoKey, InstantPhotoData> = {
  motivation: {
    src: '/slides/04a.jpg',
    alt: 'A circle of empty black chairs in a sunlit room, a framed portrait of Ambedkar resting on one of them.',
    caption: 'what the workshop works toward',
    tilt: -3,
    direction: 'left',
  },
  gathers: {
    src: '/slides/04b.jpg',
    alt: 'Participants holding microphones act out a scene in front of two screens showing the Workshop app, its Pause Skit and Add Intervention controls visible.',
    caption: 'what the workshop gathers',
    tilt: 2.5,
    direction: 'right',
  },
  result: {
    src: '/slides/04c.jpg',
    alt: 'A varied group sits along benches in a shaded courtyard, watching and smiling at someone speaking at the front.',
    caption: 'a community’s collective caste consciousness',
    tilt: -1.5,
    direction: 'bottom',
  },
}
