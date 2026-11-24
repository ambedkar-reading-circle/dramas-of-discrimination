export default function WorkshopIllustration() {
  return (
    <figure className="workshop-illustration @container flex-none mt-auto pt-[calc(2*var(--notebook-row))] [@media(max-height:760px)]:pt-row">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-1 pointer-events-none w-screen h-[min(round(up,calc(100vw*1625/3590),var(--notebook-row)),calc(100svh_-_var(--site-header-height)))] bg-(--ink-faint) opacity-100 [mask:url(/bg-image.svg)_bottom_center/contain_no-repeat]" role="img" aria-label="People coming together to assemble a shared structure from different shapes." />
      <figcaption className="flex flex-wrap justify-between gap-x-row pt-row text-[0.8125rem] text-ink-soft shadow-[inset_0_1px_var(--ink-faint)]">
        <span className="notebook-text">A space to rehearse change.</span>
        <span className="notebook-text">Imagined together. Built together.</span>
      </figcaption>
    </figure>
  )
}
