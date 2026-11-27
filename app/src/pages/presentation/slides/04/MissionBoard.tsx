import { Merge } from 'lucide-react'
import { motion } from 'motion/react'
import { InstantPhotoLayer } from '#/components/InstantPhoto'
import { useReveal, useRevealTrigger } from '#/components/Reveal'
import type { Reveal } from '#/components/Reveal'
import { hoverLift } from '#/lib/card-motion'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { useSlideStageHost } from '../../hooks/useSlideStageHost'
import { useRevealCue } from '../../playback/targets'
import { riseVariants } from '../shared/motion'
import { cards, missionLabel, missionPhotos, missionResult, missionResultFinding, missionResultNote, missionSources } from './content/mission'
import type { MissionCard, MissionExcerpt, MissionPhotoKey, MissionSource } from './content/mission'
import './MissionBoard.css'

const arrow = { size: 18, strokeWidth: 1.5 }

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
    </motion.article>
  )
}

function MissionExcerptView({ excerpt, number, reveal }: { excerpt: MissionExcerpt; number: number; reveal: Reveal<MissionPhotoKey> }) {
  const trigger = useRevealTrigger(reveal, excerpt.key)
  return (
    <span className="mission-source-excerpt" aria-label={`Show passage ${number}: ${excerpt.label}`} {...trigger}>
      <span className="mission-source-excerpt-number">{number}</span> {excerpt.label}
    </span>
  )
}

function MissionSourceView({ source, reveal }: { source: MissionSource; reveal: Reveal<MissionPhotoKey> }) {
  const trigger = useRevealTrigger(reveal, source.clip)
  return (
    <span className="mission-source-entry">
      {source.mark && <span aria-hidden="true">{source.mark} </span>}
      <span className="mission-source-clip" aria-label={`${source.text} Show the article`} {...trigger}>
        {source.text}
      </span>{' '}
      <a href={source.href} target="_blank" rel="noreferrer">
        <cite>{source.journal}</cite>
      </a>{' '}
      <span className="mission-source-excerpts">
        {source.excerpts.map((excerpt, index) => (
          <MissionExcerptView key={excerpt.key} excerpt={excerpt} number={index + 1} reveal={reveal} />
        ))}
      </span>
    </span>
  )
}

declare module '../../playback/cues' {
  interface CueTargets {
    /** Slide 04: the mission card whose photo is open, or the source clipping. */
    mission: MissionPhotoKey | null
  }
}

export function MissionBoard() {
  const reduce = usePrefersReducedMotion()
  const host = useSlideStageHost()
  const reveal = useReveal<MissionPhotoKey>()
  useRevealCue('mission', reveal)
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
        {missionSources.map((source) => (
          <MissionSourceView key={source.clip} source={source} reveal={reveal} />
        ))}
      </motion.figcaption>
    </figure>
  )
}
