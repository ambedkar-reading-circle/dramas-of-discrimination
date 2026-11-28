import type { Transition, Variants } from 'motion/react'
import { cardSpring } from '#/lib/card-motion'

export const guideSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
}

export function motionUnlessReduced(
  reducedMotion: boolean,
  transition: Transition = guideSpring,
): Transition {
  return reducedMotion ? { duration: 0 } : transition
}

export const beatMs = 45

export function jitter(beat: number, writer: number) {
  const x = Math.sin(beat * 12.9898 + writer * 78.233) * 43758.5453
  return 0.45 + (x - Math.floor(x)) * 1.1
}

export function riseVariants(reduce: boolean, tilt = 0): Variants {
  return {
    enter: reduce ? { opacity: 0 } : { opacity: 0, y: 14, rotate: 0 },
    center: (order: number) => ({
      opacity: 1,
      y: 0,
      rotate: reduce ? 0 : tilt,
      transition: reduce ? { duration: 0.15 } : { ...cardSpring, delay: 0.15 + order * 0.12 },
    }),
  }
}
