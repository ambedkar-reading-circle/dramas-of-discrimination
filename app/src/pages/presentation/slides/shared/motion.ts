import type { Transition } from 'motion/react'

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
