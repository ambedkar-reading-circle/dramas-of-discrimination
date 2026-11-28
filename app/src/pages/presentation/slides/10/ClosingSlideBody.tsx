import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, AtSign, Check, Copy, Globe, Mail, Users } from 'lucide-react'
import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import ArcLink from '#/components/ArcLink'
import { hoverLift } from '#/lib/card-motion'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { contributors } from '#/pages/about-us/content/contributors'
import { firstName, teamMembers } from '#/pages/about-us/content/teamMembers'
import { riseVariants } from '../shared/motion'
import { useCopyText } from '../shared/useCopyText'
import { aboutLabel, arcSiteLabel, cardTilts, closingLede, floorLine, instagram, portraitTilts, teamLabel, ways } from './content/closing'
import type { ClosingAction, ClosingWay } from './content/closing'

const icon = { size: 16, strokeWidth: 1.5, 'aria-hidden': true } as const
const smallIcon = { ...icon, size: 11 } as const

const linkText = 'min-w-0 text-inherit wrap-anywhere underline underline-offset-4 decoration-1'
const actionRow = 'flex min-w-0 flex-wrap items-center gap-x-2 text-[0.9375rem] leading-(--notebook-row)'

function CopyEmail({ address }: { address: string }) {
  const { copied, copy } = useCopyText(address)
  return (
    <button type="button" className="inline-grid size-[1.125rem] flex-none cursor-pointer place-items-center rounded-[2px] bg-transparent p-0 text-inherit hover:bg-[color-mix(in_srgb,currentColor_14%,transparent)] focus-visible:bg-[color-mix(in_srgb,currentColor_14%,transparent)]" onClick={copy} aria-label="Copy the email address" title={copied ? 'Copied' : 'Copy'}>
      {copied ? <Check {...smallIcon} /> : <Copy {...smallIcon} />}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email copied' : ''}
      </span>
    </button>
  )
}

function Action({ action }: { action: ClosingAction }) {
  switch (action.kind) {
    case 'method':
      return (
        <Link to="/" hash={action.hash} className={`${actionRow} ${linkText}`}>
          {action.label}
          <ArrowRight {...icon} />
        </Link>
      )
    case 'email':
      return (
        <span className="grid">
          <a href={`mailto:${action.address}`} className={`${actionRow} ${linkText}`}>
            <Mail {...icon} />
            {action.label}
          </a>
          <span className="flex min-w-0 items-center gap-1 text-[0.75rem] leading-(--notebook-row)">
            <span className="min-w-0 wrap-anywhere opacity-75">{action.address}</span>
            <CopyEmail address={action.address} />
          </span>
        </span>
      )
    case 'external':
      return (
        <a href={action.href} target="_blank" rel="noopener noreferrer" className={`${actionRow} ${linkText}`}>
          {action.label}
          <ArrowUpRight {...icon} />
        </a>
      )
  }
}

// The way we ask for most is set in inverse ink.
function Way({ way, order, reduce, tilt }: { way: ClosingWay; order: number; reduce: boolean; tilt: number }) {
  const lead = way.lead === true
  const tone = lead ? 'bg-hl-bg text-hl-text' : 'bg-surface-warm text-ink shadow-[inset_0_0_0_1px_var(--sheet-edge)]'
  return (
    <motion.li className={`grid grid-rows-[auto_auto_1fr_auto] rounded-[3px] px-5 py-row text-start shadow-(--sheet-shadow) ${tone}`} custom={order} variants={riseVariants(reduce, tilt)}>
      <span className={`font-title text-[1.75rem] leading-(--notebook-row) ${lead ? '' : 'text-stage-red'}`} aria-hidden="true">
        {way.numeral}
      </span>
      <h3 className="m-0 font-title text-[1rem] leading-(--notebook-row) font-normal tracking-[0.12em] uppercase">{way.verb}</h3>
      <p className="m-0 text-[1rem] leading-(--notebook-row)">{way.line}</p>
      <div className="mt-[calc(var(--notebook-row)/2)] pt-[calc(var(--notebook-row)/2)] shadow-[inset_0_1px_0_color-mix(in_srgb,currentColor_25%,transparent)]">
        <Action action={way.action} />
      </div>
    </motion.li>
  )
}

// The top padding and photo together fill two rows, and the name tag a third.
const portrait = 'block size-[calc(2*var(--notebook-row)-0.3rem)] object-cover bg-line'
const footLink = 'inline-flex items-center gap-1.5 text-ink no-underline hover:underline focus-visible:underline underline-offset-4'

// Who made it: a centred row of instant portraits, each pinned at its own
// tilt, then the credit and where to find us.
function Makers({ order, reduce }: { order: number; reduce: boolean }) {
  return (
    <motion.footer className="grid w-full justify-items-center gap-row pt-row text-center shadow-[inset_0_1px_0_var(--ink-faint)]" custom={order} variants={riseVariants(reduce)}>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-x-4 gap-y-row p-0">
        {teamMembers.map((member, index) => (
          <motion.li key={member.id} className="grid justify-items-center bg-surface-warm px-[0.3rem] pt-[0.3rem] shadow-[inset_0_0_0_1px_var(--sheet-edge),var(--sheet-shadow)] rotate-(--tilt)" style={{ '--tilt': `${portraitTilts[index % portraitTilts.length]}deg` } as CSSProperties} {...hoverLift(reduce)}>
            {member.photo ? <img src={member.photo} alt="" width={56} height={56} loading="lazy" decoding="async" className={portrait} /> : <span className={portrait} aria-hidden="true" />}
            <span className="text-[0.75rem] leading-(--notebook-row) text-ink-soft" aria-hidden="true">
              {firstName(member)}
            </span>
            <span className="sr-only">{member.name}</span>
          </motion.li>
        ))}
      </ul>
      <div className="grid justify-items-center">
        <p className="m-0 text-[0.9375rem] leading-(--notebook-row)">
          {teamLabel}, with {contributors.length} contributors in design and facilitation.
        </p>
        <p className="m-0 flex flex-wrap justify-center gap-x-4 text-[0.875rem] leading-(--notebook-row)">
          <Link to="/about-us" className={footLink}>
            <Users {...icon} />
            {aboutLabel}
          </Link>
          <ArcLink className={footLink}>
            <Globe {...icon} />
            {arcSiteLabel}
          </ArcLink>
          <a href={instagram.href} target="_blank" rel="noopener noreferrer" className={footLink}>
            <AtSign {...icon} />
            {instagram.handle}
          </a>
          <span className="text-ink-soft italic">{floorLine}</span>
        </p>
      </div>
    </motion.footer>
  )
}

export function ClosingSlideBody() {
  const reduce = usePrefersReducedMotion()
  return (
    <div className="mx-auto grid w-full max-w-[62rem] justify-items-center gap-row">
      <motion.p className="m-0 max-w-[52ch] text-[1.125rem] text-ink-soft" custom={0} variants={riseVariants(reduce)}>
        {closingLede}
      </motion.p>
      <ol className="m-0 grid w-full list-none grid-cols-3 gap-gutter p-0 max-md:grid-cols-1">
        {ways.map((way, index) => (
          <Way key={way.verb} way={way} order={index + 1} reduce={reduce} tilt={cardTilts[index % cardTilts.length]} />
        ))}
      </ol>
      <Makers order={ways.length + 1} reduce={reduce} />
    </div>
  )
}
