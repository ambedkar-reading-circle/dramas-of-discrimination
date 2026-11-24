import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useRevealTrigger } from '#/components/Reveal'
import { hoverLift } from '#/lib/card-motion'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { useApproachReveal } from '../../hooks/useApproachReveal'
import { cellVariants } from '../../lib/approachMotion'
import type { ApproachSide } from '../../types'

interface ApproachCellProps {
  side: ApproachSide
  className: string
  children: ReactNode
}

export default function ApproachCell({ side, className, children }: ApproachCellProps) {
  const reduce = usePrefersReducedMotion()
  const trigger = useRevealTrigger(useApproachReveal(), side)
  return (
    <motion.div className={`slide-title-taped ${className}`} custom={side} variants={cellVariants(reduce)} {...hoverLift(reduce)} {...trigger}>
      {children}
    </motion.div>
  )
}
