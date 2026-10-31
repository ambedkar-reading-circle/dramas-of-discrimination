import ArcLink from '#/components/ArcLink'

export default function AboutHero() {
  return (
    <section className="notebook-section notebook-stack page-wrap about-hero rise-in">
      <p className="eyebrow">About the project</p>
      <h1 className="text-[3.75rem] leading-[calc(3*var(--notebook-row))] tracking-[-0.055em] text-balance max-w-[26ch] max-md:text-[2.25rem] max-md:leading-[calc(2*var(--notebook-row))]">Democracy is a mode of associated living.</h1>
      <p className="max-w-[65ch] text-[1.25rem] text-ink-soft max-md:text-[1.125rem]">
        In his closing speech to the Constituent Assembly, 25 November 1949, Dr Ambedkar called democracy 'primarily a mode of associated living, of conjoint communicated experience'. Dramas of Discrimination is the participatory, art-based workshop we run at the <ArcLink>Ambedkar Reading Circle</ArcLink>, an anti-caste collective in Bangalore. Communities analyse caste discrimination as a system, rehearse interventions, and write manifestos of inclusion. We are building an open-source web app so other communities can run it without us.
      </p>
    </section>
  )
}
