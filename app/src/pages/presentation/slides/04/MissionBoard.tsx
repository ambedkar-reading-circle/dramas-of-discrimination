import { Merge } from 'lucide-react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { InstantPhotoLayer } from '#/components/InstantPhoto'
import { useReveal, useRevealTrigger } from '#/components/Reveal'
import type { Reveal } from '#/components/Reveal'
import { cardSpring, hoverLift } from '#/lib/card-motion'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { useSlideStageHost } from '../../hooks/useSlideStageHost'
import { useCueTarget } from '../../playback/targets'
import { riseVariants } from '../shared/motion'
import { cards, missionLabel, missionPhotos, missionResult, missionResultFinding, missionResultNote, missionSource } from './content/mission'
import type { MissionCard, MissionPhotoKey } from './content/mission'
import './MissionBoard.css'

const arrow = { size: 18, strokeWidth: 1.5 }

// The marks settle onto the spectrum after their card lands.
function readingVariants(reduce: boolean): Variants {
  return {
    enter: reduce ? { opacity: 0 } : { opacity: 0, scale: 0 },
    center: (delay: number) => ({
      opacity: 1,
      scale: 1,
      transition: reduce ? { duration: 0.15 } : { ...cardSpring, delay },
    }),
  }
}

function MissionScale({ card, order }: { card: MissionCard; order: number }) {
  const reduce = usePrefersReducedMotion()
  return (
    <div className="mission-scale" aria-hidden="true">
      <div className="mission-track">
        {card.readings.map((reading, index) => (
          <motion.span key={reading} className="mission-reading" style={{ left: `${reading * 100}%` }} custom={0.55 + order * 0.12 + index * 0.06} variants={readingVariants(reduce)} />
        ))}
      </div>
      <div className="mission-ends">
        <span>{card.from}</span>
        <span>{card.to}</span>
      </div>
    </div>
  )
}

interface MissionCardViewProps {
  card: MissionCard
  order: number
  reveal: Reveal<MissionPhotoKey>
}

function MissionCardView({ card, order, reveal }: MissionCardViewProps) {
  const reduce = usePrefersReducedMotion()
  const trigger = useRevealTrigger(reveal, card.key)
  return (
    <motion.article className="slide-title-taped mission-card" custom={order} variants={riseVariants(reduce, order === 0 ? -1.2 : 1.2)} aria-label={`${card.name}: show the photo`} {...hoverLift(reduce)} {...trigger}>
      <h3 className="mission-card-name">{card.name}</h3>
      <p className="mission-card-lead">{card.lead}</p>
      <dl className="mission-card-rows">
        {card.rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.text}</dd>
          </div>
        ))}
      </dl>
      <MissionScale card={card} order={order} />
    </motion.article>
  )
}

declare module '../../playback/cues' {
  interface CueTargets {
    /** Slide 04: the mission card whose photo is open. */
    mission: MissionPhotoKey | null
  }
}

export function MissionBoard() {
  const reduce = usePrefersReducedMotion()
  const host = useSlideStageHost()
  const reveal = useReveal<MissionPhotoKey>()
  useCueTarget('mission', (key) => (key ? reveal.open(key) : reveal.close()), { rest: null, value: reveal.active })
  const resultTrigger = useRevealTrigger(reveal, 'result')
  return (
    <figure className="mission-board" aria-label={missionLabel}>
      <InstantPhotoLayer host={host} photo={reveal.active && missionPhotos[reveal.active]} controls={reveal} />
      <p className="mission-lede">{missionLabel}</p>
      <div className="mission-cards">
        {cards.map((card, index) => (
          <MissionCardView key={card.key} card={card} order={index} reveal={reveal} />
        ))}
      </div>
      <motion.span className="mission-merge" custom={cards.length} variants={riseVariants(reduce)} aria-hidden="true">
        <Merge {...arrow} />
      </motion.span>
      <motion.div className="slide-title-taped slide-title-taped--inverse mission-result" custom={cards.length + 1} variants={riseVariants(reduce, -0.8)} aria-label={`${missionResult}: show the photo`} {...hoverLift(reduce)} {...resultTrigger}>
        <span className="mission-result-name">{missionResult}</span>
        <span className="mission-result-note">{missionResultNote}</span>
        <span className="mission-result-finding">
          {missionResultFinding.lead} “{missionResultFinding.quote}”<sup aria-hidden="true">*</sup>
        </span>
      </motion.div>
      <motion.figcaption className="mission-source" custom={cards.length + 2} variants={riseVariants(reduce)}>
        <span aria-hidden="true">* </span>
        {missionSource.text}{' '}
        <a href={missionSource.href} target="_blank" rel="noreferrer">
          <cite>{missionSource.journal}</cite>
        </a>
      </motion.figcaption>
    </figure>
  )
}
