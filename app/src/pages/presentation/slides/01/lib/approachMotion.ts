import type { Variants } from 'motion/react'
import { cardSpring as spring } from '#/lib/card-motion'
import type { ApproachSide } from '../types'

const entry: Record<ApproachSide, { x: number; y: number; tilt: number }> = {
  systems: { x: -32, y: 0, tilt: -1.5 },
  forum: { x: 32, y: 0, tilt: 1.5 },
  result: { x: 0, y: 20, tilt: 0 },
}

export function diagramVariants(reduce: boolean): Variants {
  return {
    closed: {
      opacity: 0,
      transition: { duration: reduce ? 0.1 : 0.2 },
      transitionEnd: { visibility: 'hidden' },
    },
    open: {
      opacity: 1,
      visibility: 'visible',
      transition: {
        duration: 0.2,
        staggerChildren: reduce ? 0 : 0.09,
        delayChildren: reduce ? 0 : 0.05,
      },
    },
  }
}

export function cellVariants(reduce: boolean): Variants {
  return {
    closed: (side: ApproachSide) =>
      reduce
        ? { opacity: 0 }
        : { opacity: 0, x: entry[side].x, y: entry[side].y, rotate: 0 },
    open: (side: ApproachSide) => ({
      opacity: 1,
      x: 0,
      y: 0,
      rotate: reduce ? 0 : entry[side].tilt,
      transition: spring,
    }),
  }
}

export const connectorVariants: Variants = {
  closed: { opacity: 0, scale: 0.6 },
  open: { opacity: 1, scale: 1, transition: spring },
}

export function triggerAnimation(open: boolean) {
  return open
    ? {
        opacity: 0,
        scale: 0.96,
        transitionEnd: { visibility: 'hidden' as const },
      }
    : { opacity: 1, scale: 1, visibility: 'visible' as const }
}
