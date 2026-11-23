import type { Slide } from '../../types'

export const slide = {
  id: '02',
  kicker: 'The collective',
  heading: 'The Ambedkar Reading Circle',
  body: (
    <>
      <p className="section-lede-copy">An anti-caste collective in Bangalore. The Workshop first ran with circles gathered in Cubbon Park in 2023 — one group among the sibling circles that read, screen films, and argue together.</p>
      <p className="text-ink-soft">A Community of roughly twenty to twenty-five people organises itself into four or five Groups; each Group takes one Scenario and works it through both tables.</p>
    </>
  ),
  assets: [{ role: 'image', note: 'The circle in Cubbon Park' }],
  layout: 'split',
} satisfies Slide
