// The decorative Italianno "of" is one shared sub-logo: both variants must
// stay in lockstep or the header and hero wordmarks diverge.
const ofClasses = 'font-of text-[2.15em] font-normal leading-0 tracking-[0]'

const lineClasses = 'block relative top-[calc(0.5lh_-_var(--notebook-row)_+_var(--notebook-baseline)_-_var(--notebook-font-mono))]'

export default function DodLogo({ variant = 'hero' }: { variant?: 'hero' | 'inline' }) {
  if (variant === 'inline') {
    return (
      <span className="block font-logo font-normal text-[0.875rem] leading-(--notebook-row) whitespace-normal max-sm:text-[0.75rem]">
        Dramas<span className={ofClasses}> of </span>Discrimination
      </span>
    )
  }

  return (
    <span className="block font-logo font-normal text-[min(10cqi,8rem)] tracking-[-0.055em] leading-[round(up,1.3em,var(--notebook-row))]">
      <span className={`dod-logo-first ${lineClasses}`}>
        <span className="printed-ink">Dramas</span>
        <span className={ofClasses}> of </span>
      </span>
      <span className={`dod-logo-last ${lineClasses}`}>
        <span className="printed-ink">Discrimination</span>
      </span>
    </span>
  )
}
