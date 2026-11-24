import type { Slide } from '../../types'
import { PairCard } from './PairCard'

export const slide = {
  id: '10',
  kicker: 'Where it runs',
  heading: 'Scenarios & interventions',
  body: <p className="section-lede-copy">The method travels: each pair is a Scenario and the intervention a Group rehearsed for it.</p>,
  interactive: (
    <div className="slide-card-grid slide-pairs">
      <PairCard context="Peer groups" scenario="Banter mimics a friend’s dialect for laughs." intervention="A peer names it in the moment and holds the line." />
      <PairCard context="Schools & villages" scenario="Children seated apart at the midday meal." intervention="A teacher seats everyone together — and answers for it." />
      <PairCard context="Workplaces" scenario="“Not a culture fit,” said of a Bahujan candidate." intervention="A colleague asks the panel to show its rubric." />
      <PairCard context="Neighbours" scenario="A flat is “already taken” when the surname shows." intervention="Another resident vouches and stays with the application." />
      <PairCard context="Media" scenario="Coverage hides the caste pattern in a story." intervention="Readers write in; the desk corrects the frame." />
    </div>
  ),
  layout: 'grid',
} satisfies Slide
