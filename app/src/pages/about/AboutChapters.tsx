import type { ReactNode } from 'react'
import ArcLink from '#/components/ArcLink'

const chapters: { number: string; kicker: string; heading: string; body: ReactNode; reverse?: boolean }[] = [
  {
    number: '01',
    kicker: 'The workshop',
    heading: 'A division of labourers.',
    body: "Caste, Dr Ambedkar wrote in Annihilation of Caste (1936), is 'not a division of labour, it is a division of labourers'. A group chooses a real or imagined scenario and maps that division in one room: actors, ideal behaviour, failures, and the relationships between them. The scenario is then staged so participants can step in, change what happens, and test different responses.",
  },
  {
    number: '02',
    kicker: 'The web app',
    heading: 'Enough structure to hold people together.',
    body: 'This website introduces the work. The app will add a private area where a small group maps a scenario, stages it, and drafts a manifesto with AI assistance. That lifts the burden of articulation, not the authorship. The community remains the author: it edits the draft, and nothing publishes to the public portal unless the group agrees.',
    reverse: true,
  },
  {
    number: '03',
    kicker: 'Who makes it',
    heading: 'A volunteer collective, in public since 2023.',
    body: (
      <>
        The <ArcLink>Ambedkar Reading Circle</ArcLink> is a volunteer-run anti-caste collective founded in Bangalore in April 2023. We hold reading circles, talks, and film screenings in public, including regular open-air sessions in Cubbon Park. The workshop grew out of that practice.
      </>
    ),
  },
]

export default function AboutChapters() {
  return (
    <div className="page-wrap">
      {chapters.map((chapter) => (
        <section key={chapter.number} className={`notebook-section notebook-section--compact grid gap-gutter items-start shadow-[inset_0_1px_var(--ink-faint)] max-md:grid-cols-1 max-md:gap-row ${chapter.reverse ? 'grid-cols-[2fr_1fr]' : 'grid-cols-[1fr_2fr]'}`}>
          <p className={`eyebrow${chapter.reverse ? ' md:col-start-2 md:row-start-1' : ''}`}>
            <span>{chapter.number} /</span> {chapter.kicker}
          </p>
          <div className={`notebook-stack${chapter.reverse ? ' md:col-start-1 md:row-start-1' : ''}`}>
            <h2 className="max-w-[24ch]">{chapter.heading}</h2>
            <p className="max-w-[65ch] text-ink-soft">{chapter.body}</p>
          </div>
        </section>
      ))}
    </div>
  )
}
