import type { TargetAndTransition, Transition } from 'motion/react'

/** Motion for what lies over an open sheet: stickers, manual pages and prints. */

/** A tilt in degrees, of a size between `min` and `max`, leaning either way. */
export type TiltRange = readonly [min: number, max: number]

export const tilts = {
  /** Small labels taped to the sheet. */
  sticker: [0.8, 2.6],
  /** A whole step, taped as one long sticker; wide, so it leans less. */
  stepSticker: [0.4, 1.2],
  /** The tape strip across a sticker's top edge. */
  tape: [1.5, 6],
  /** Manual pages, laid nearly square. */
  page: [0.3, 1.8],
  /** Photographic prints, dropped more loosely. */
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
