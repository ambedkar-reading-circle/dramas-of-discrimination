export default function WorkshopIllustration() {
  return (
    <figure className="workshop-illustration @container flex-none mt-auto pt-[calc(2*var(--notebook-row))]">
      <div className="absolute inset-[auto_0_0] -z-1 pointer-events-none w-full h-[round(up,calc(100cqi*1625/3590),var(--notebook-row))] bg-(--ink-faint) opacity-100 [mask:url(/bg-image.svg)_bottom_center/100%_auto_no-repeat]" role="img" aria-label="People coming together to assemble a shared structure from different shapes." />
      <figcaption className="flex flex-wrap justify-between gap-x-row pt-row text-[0.8125rem] text-ink-soft shadow-[inset_0_1px_var(--ink-faint)]">
        <span className="notebook-text">A space to rehearse change.</span>
        <span className="notebook-text">Imagined together. Built together.</span>
      </figcaption>
    </figure>
  )
}
