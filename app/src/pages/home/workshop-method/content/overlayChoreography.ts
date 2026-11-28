import type { TargetAndTransition, Transition } from 'motion/react'

export type TiltRange = readonly [min: number, max: number]

export const tilts = {
  sticker: [0.8, 2.6],
  stepSticker: [0.4, 1.2],
  tape: [1.5, 6],
  page: [0.3, 1.8],
  print: [0.8, 2.4],
} satisfies Record<string, TiltRange>

export function randomTilt([min, max]: TiltRange) {
  const size = min + Math.random() * (max - min)
  return Math.random() < 0.5 ? -size : size
}

export function pageAway(
  tilt: number,
  reduceMotion: boolean,
): TargetAndTransition {
  return reduceMotion
    ? { opacity: 0 }
    : { opacity: 1, x: '120vw', rotate: tilt + 8 }
}

export function pageLaid(
  tilt: number,
  reduceMotion: boolean,
): TargetAndTransition {
  return { opacity: 1, x: 0, rotate: reduceMotion ? 0 : tilt }
}

export function pageTransition(
  order: number,
  reduceMotion: boolean,
): Transition {
  return reduceMotion
    ? fadeTransition
    : {
        type: 'spring',
        stiffness: 150,
        damping: 21,
        mass: 0.9,
        delay: order * 0.07,
      }
}

export const fadeTransition: Transition = { duration: 0.15 }
export const backdropTransition: Transition = { duration: 0.25 }
