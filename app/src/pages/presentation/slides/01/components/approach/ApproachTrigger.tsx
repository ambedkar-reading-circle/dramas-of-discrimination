import type { Ref } from 'react'
import { motion } from 'motion/react'
import { hoverLift } from '#/lib/card-motion'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { approachTrigger } from '../../content/approachCopy'
import { triggerAnimation } from '../../lib/approachMotion'

interface ApproachTriggerProps {
  controlsId: string
  open: boolean
  onOpen: () => void
  ref?: Ref<HTMLButtonElement>
}

export default function ApproachTrigger({ controlsId, open, onOpen, ref }: ApproachTriggerProps) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.button ref={ref} type="button" className="slide-title-taped inline-flex -rotate-1 items-center gap-[0.6rem] self-center bg-surface-warm px-[1.25rem] pt-[calc(0.425*var(--notebook-row))] pb-[calc(0.375*var(--notebook-row))] text-[1.125rem] text-ink" aria-expanded={open} aria-controls={controlsId} inert={open} initial={false} animate={triggerAnimation(open)} {...hoverLift(reduce)} onClick={onOpen}>
      <span>{approachTrigger}</span>
    </motion.button>
  )
}
