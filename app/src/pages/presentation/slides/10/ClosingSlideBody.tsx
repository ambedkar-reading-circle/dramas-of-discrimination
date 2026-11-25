import type { CSSProperties } from 'react'
import { Link } from '@tanstack/react-router'
import { AtSign, Check, Copy, CornerUpLeft, Globe, Mail } from 'lucide-react'
import { motion } from 'motion/react'
import ArcLink from '#/components/ArcLink'
import { hoverLift } from '#/lib/card-motion'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { manualEmail } from '#/pages/home/manual-flipbook'
import { contributors } from '#/pages/about-us/content/contributors'
import { firstName, teamMembers } from '#/pages/about-us/content/teamMembers'
import { riseVariants } from '../shared/motion'
import { useCopyText } from '../shared/useCopyText'
import { closingLede, invitation, plans, plansLabel, portraitTilts, teamLabel } from './content/closing'

const icon = { size: 16, strokeWidth: 1.5, 'aria-hidden': true } as const

type CardProps = { order: number; reduce: boolean }

const cardName = 'm-0 font-title text-[0.875rem] font-normal tracking-[0.13em] uppercase'

// Taped cards here are read and used, not pressed as a whole.
const usedCard = 'grid cursor-default px-5 py-row'

function CopyEmail() {
  const { copied, copy } = useCopyText(manualEmail)
  return (
    <button type="button" className="inline-flex cursor-pointer items-center gap-1 rounded-[2px] bg-transparent px-[0.45rem] py-0 text-[0.75rem] text-inherit shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--hl-text)_35%,transparent)] [font:inherit] hover:bg-[color-mix(in_srgb,var(--hl-text)_12%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--hl-text)_12%,transparent)]" onClick={copy} aria-label={copied ? 'Email copied' : 'Copy the email address'}>
      {copied ? <Check {...icon} /> : <Copy {...icon} />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

const contact = 'flex min-w-0 flex-wrap items-center gap-x-2'
const contactLink = 'min-w-0 text-inherit wrap-anywhere underline-offset-4'

// The invitation: inverse ink, like slide 04's result card.
function Invitation({ order, reduce }: CardProps) {
  return (
    <motion.section className={`slide-title-taped slide-title-taped--inverse ${usedCard} bg-hl-bg text-hl-text`} custom={order} variants={riseVariants(reduce, -1)} aria-label={invitation.name}>
      <h3 className={cardName}>{invitation.name}</h3>
      <p className="m-0 text-[1.0625rem]">{invitation.note}</p>
      <ul className="m-0 mt-row grid list-none p-0 pt-row text-[0.9375rem] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--hl-text)_25%,transparent)]">
        <li className={contact}>
          <Mail {...icon} />
          <a href={`mailto:${manualEmail}`} className={contactLink}>
            {manualEmail}
          </a>
          <CopyEmail />
        </li>
        <li className={contact}>
          <Globe {...icon} />
          <ArcLink className={contactLink}>Ambedkar Reading Circle</ArcLink>
        </li>
        <li className={contact}>
          <AtSign {...icon} />
          <a href={invitation.instagram.href} target="_blank" rel="noopener noreferrer" className={contactLink}>
            {invitation.instagram.handle}
          </a>
        </li>
      </ul>
    </motion.section>
  )
}

const planHighlight = 'hover:bg-[color-mix(in_srgb,var(--sea-ink)_6%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--sea-ink)_6%,transparent)] focus-visible:outline-none'

// The plans, each a way back to its slide for the questions.
function Plans({ order, reduce }: CardProps) {
  return (
    <motion.nav className={`slide-title-taped ${usedCard} bg-surface-warm text-ink`} custom={order} variants={riseVariants(reduce, 1)} aria-label={plansLabel}>
      <h3 className={`${cardName} text-stage-red`}>{plansLabel}</h3>
      <ol className="m-0 grid list-none p-0">
        {plans.map((plan) => (
          <li key={plan.letter} className="[&+&]:shadow-[inset_0_1px_0_var(--line)]">
            <Link to="/approach" search={{ slide: plan.slide }} replace className={`group grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-3 px-1 text-inherit no-underline transition-colors duration-160 motion-reduce:transition-none ${planHighlight}`} aria-label={`${plan.name}: back to slide ${plan.slide}`}>
              <span className="grid size-7 place-items-center rounded-full font-title text-[0.875rem] text-stage-red shadow-[inset_0_0_0_1px_var(--stage-red)]" aria-hidden="true">
                {plan.letter}
              </span>
              <span className="grid">
                <span className="text-base">{plan.name}</span>
                <span className="text-[0.8125rem] text-ink-soft italic">{plan.line}</span>
              </span>
              <CornerUpLeft {...icon} className="text-ink-soft opacity-0 transition-opacity duration-160 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
            </Link>
          </li>
        ))}
      </ol>
    </motion.nav>
  )
}

const teamNote = 'm-0 text-[0.8125rem] text-ink-soft'

// The team, pinned as a strip of instant portraits. The top padding and photo
// together fill two rows, and the name tag a third.
const portrait = 'block size-[calc(2*var(--notebook-row)-0.3rem)] object-cover bg-line'

function Team({ order, reduce }: CardProps) {
  return (
    <motion.figure className="m-0 grid justify-items-center gap-row" custom={order} variants={riseVariants(reduce)}>
      <figcaption className={teamNote}>{teamLabel}</figcaption>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-x-4 gap-y-row p-0">
        {teamMembers.map((member, index) => (
          <motion.li key={member.id} className="grid justify-items-center bg-surface-warm px-[0.3rem] pt-[0.3rem] shadow-[inset_0_0_0_1px_var(--sheet-edge),var(--sheet-shadow)] rotate-(--tilt)" style={{ '--tilt': `${portraitTilts[index % portraitTilts.length]}deg` } as CSSProperties} {...hoverLift(reduce)}>
            {member.photo ? <img src={member.photo} alt="" width={72} height={72} loading="lazy" decoding="async" className={portrait} /> : <span className={portrait} aria-hidden="true" />}
            <span className="text-[0.75rem] text-ink-soft" aria-hidden="true">
              {firstName(member)}
            </span>
            <span className="sr-only">{member.name}</span>
          </motion.li>
        ))}
      </ul>
      <p className={teamNote}>with {contributors.length} contributors in design and facilitation</p>
    </motion.figure>
  )
}

export function ClosingSlideBody() {
  const reduce = usePrefersReducedMotion()
  return (
    <div className="mx-auto grid w-full max-w-[60rem] justify-items-center gap-row">
      <motion.p className="m-0 max-w-[40ch] text-[1.375rem]" custom={0} variants={riseVariants(reduce)}>
        {closingLede}
      </motion.p>
      <div className="grid w-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-gutter text-start max-md:grid-cols-1">
        <Invitation order={1} reduce={reduce} />
        <Plans order={2} reduce={reduce} />
      </div>
      <Team order={3} reduce={reduce} />
    </div>
  )
}
