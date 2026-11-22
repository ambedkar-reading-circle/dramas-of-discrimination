import ArcLink from '#/components/ArcLink'

export default function TeamHero() {
  return (
    <section className="notebook-section notebook-stack page-wrap team-hero rise-in">
      <p className="eyebrow">Who we are</p>
      <h1 className="text-[2.5rem] leading-[calc(2*var(--notebook-row))] tracking-[-0.055em] text-balance max-w-[26ch] max-md:text-[2rem] max-md:leading-[calc(2*var(--notebook-row))]">The people holding the room.</h1>
      <p className="max-w-[65ch] text-[1.25rem] text-ink-soft max-md:text-[1.125rem]">
        Dramas of Discrimination is made by the <ArcLink>Ambedkar Reading Circle</ArcLink>, a volunteer anti-caste collective in Bangalore. Facilitators, theatre makers, researchers, psychologists, and engineers make it together, in public, since 2023.
      </p>
    </section>
  )
}
