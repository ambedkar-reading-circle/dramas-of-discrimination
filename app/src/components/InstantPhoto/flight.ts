import type { TargetAndTransition, Transition } from 'motion/react'
import type { Direction } from './types'

const fallbackViewport = { width: 1600, height: 1000 }

function viewport() {
  if (typeof window === 'undefined') return fallbackViewport
  return { width: window.innerWidth, height: window.innerHeight }
}

export function offscreen(
  direction: Direction,
  tilt: number,
): TargetAndTransition {
  const { width, height } = viewport()
  const base = { scale: 1.15, opacity: 1 }
  switch (direction) {
    case 'left':
      return { ...base, x: -width, y: 40, rotate: tilt - 18 }
    case 'right':
      return { ...base, x: width, y: 40, rotate: tilt + 18 }
    case 'bottom':
      return { ...base, x: 0, y: height, rotate: tilt + 10 }
  }
}

export function settled(tilt: number): TargetAndTransition {
  return { x: 0, y: 0, rotate: tilt, scale: 1, opacity: 1 }
}

export function faded(tilt: number): TargetAndTransition {
  return { opacity: 0, rotate: tilt }
}

export const flightTransition: Transition = {
  type: 'spring',
  stiffness: 140,
  damping: 20,
  mass: 0.9,
}

export const fadeTransition: Transition = { duration: 0.15 }

export const elasticDrag = {
  dragElastic: 0.35,
  dragSnapToOrigin: true,
  dragTransition: { bounceStiffness: 260, bounceDamping: 18 },
} as const

export function lifted(tilt: number): TargetAndTransition {
  return { scale: 1.04, rotate: tilt * 0.4, cursor: 'grabbing' }
}
