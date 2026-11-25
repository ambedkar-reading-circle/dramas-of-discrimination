import type { Transition, Variants } from 'motion/react'
import { cardSpring } from '#/lib/card-motion'

export const guideSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
}

/** The given transition, or an instant one when the viewer prefers reduced motion. */
export function motionUnlessReduced(
  reducedMotion: boolean,
  transition: Transition = guideSpring,
): Transition {
  return reducedMotion ? { duration: 0 } : transition
}

/** One beat of a writing simulation. Every writer moves, types or rests once per beat. */
export const beatMs = 45

/** A steady wobble in typing speed, the same on every run. */
export function jitter(beat: number, writer: number) {
  const x = Math.sin(beat * 12.9898 + writer * 78.233) * 43758.5453
  return 0.45 + (x - Math.floor(x)) * 1.1
}

/**
 * A card that rises into place, staggered by its `custom` order and settling at `tilt` degrees.
 * The slide frame animates from "enter" to "center"; these inherit it.
 */
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
