import type { Slide } from '../../types'
import { DetailCard } from './DetailCard'

export const slide = {
  id: '03',
  kicker: 'Beyond the workshop',
  heading: 'What ARC does',
  body: <p className="section-lede-copy">The circle keeps several doors open. Each reveals a line of detail — open them as you talk.</p>,
  interactive: (
    <div className="slide-card-grid">
      <DetailCard title="Lectures & talks" detail="Speakers read caste, law, and history to a public room." />
      <DetailCard title="Film screenings" detail="Screenings that put stories next to argument." />
      <DetailCard title="Workshops" detail="Rehearsal rooms for responses to discrimination — this method among them." />
      <DetailCard title="Panel discussions" detail="Panels that bring practitioners and audiences into one argument." />
    </div>
  ),
  layout: 'grid',
} satisfies Slide
