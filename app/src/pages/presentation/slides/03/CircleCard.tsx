import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { useRevealTrigger } from '#/components/Reveal'
import type { Reveal } from '#/components/Reveal'
import { cardSpring, hoverLift } from '#/lib/card-motion'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import type { BoardItem, BoardKey } from './content/circles'

interface CircleCardProps {
  item: BoardItem
  label: string
  order: number
  reveal: Reveal<BoardKey>
}

function cardVariants(reduce: boolean): Variants {
  return {
    enter: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
    center: (order: number) => ({
      opacity: 1,
      y: 0,
      transition: reduce ? { duration: 0.15 } : { ...cardSpring, delay: 0.15 + order * 0.07 },
    }),
  }
}

export function CircleCard({ item, label, order, reveal }: CircleCardProps) {
  const reduce = usePrefersReducedMotion()
  const trigger = useRevealTrigger(reveal, item.key)
  return (
    <motion.div className="slide-title-taped circle-card" custom={order} variants={cardVariants(reduce)} aria-label={label} {...hoverLift(reduce)} {...trigger}>
      <span className="circle-card-name">{item.name}</span>
      {item.handle && (
        <span className="circle-card-handle" title={`@${item.handle}`}>
          @{item.handle}
        </span>
      )}
    </motion.div>
  )
}
