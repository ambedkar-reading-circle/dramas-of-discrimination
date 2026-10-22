import ActionButton from '#/components/ActionButton'
import ArcLink from '#/components/ArcLink'
import ArcLogo from '#/components/ARCLogo'
import DodLogo from '#/components/DodLogo'
import WorkshopIllustration from '#/components/WorkshopIllustration'

export default function HomeHero() {
  return (
    <section className="hero-section page-wrap rise-in flex flex-col relative isolate overflow-clip pt-[calc(2*var(--notebook-row))] min-h-[round(up,max(0px,calc(100svh_-_2*var(--notebook-row))),var(--notebook-row))] max-md:min-h-[round(up,max(0px,calc(100svh_-_4*var(--notebook-row))),var(--notebook-row))]">
      <div className="hero-copy @container flex-none relative z-1">
        <div className="flex items-start gap-row">
          <ArcLogo />
          <p className="min-w-0 max-w-[24ch] font-logo text-[clamp(0.875rem,1.5vw,1rem)] font-normal [--font-baseline:var(--notebook-font-mono)]">
            <ArcLink>Ambedkar Reading Circle</ArcLink> presents
          </p>
        </div>
        <h1 className="hero-wordmark top-0 my-[calc(2*var(--notebook-row))_var(--notebook-row)]">
          <DodLogo />
        </h1>
        <div className="flex items-start justify-between gap-gutter max-lg:grid max-lg:gap-row">
          <p className="hero-thesis max-w-[48ch] text-[1.25rem] max-md:text-[1.125rem]">A workshop and web application for communities to rehearse ethical responses to workplace caste discrimination and author their own manifestos of inclusion.</p>
          <div className="hero-actions flex max-w-full min-w-0 flex-none flex-wrap gap-row max-sm:grid max-sm:w-full max-sm:justify-items-stretch">
            <ActionButton href="#workshop-method" variant="primary" icon="↓">
              Explore the acts
            </ActionButton>
            <ActionButton to="/about" variant="quiet" icon="↗">
              About the project
            </ActionButton>
          </div>
        </div>
      </div>
      <WorkshopIllustration />
    </section>
  )
}
