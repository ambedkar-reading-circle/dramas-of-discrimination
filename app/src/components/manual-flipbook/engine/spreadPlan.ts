import { manualBackCover } from '../content/manualContent.ts'

/** Spread plan per layout: the leaf heading each spread (hard covers make the
 *  desktop steps uneven: 0 → 1 → 3 → … → back cover) and the progress that commits
 *  each forward turn. */
function makePlan(desktop: boolean) {
  const heads = desktop
    ? [
        0,
        ...Array.from(
          { length: (manualBackCover - 1) / 2 },
          (_, i) => 1 + i * 2,
        ),
        manualBackCover,
      ]
    : Array.from({ length: manualBackCover + 1 }, (_, i) => i)
  const first = desktop ? 0.12 : 0.08
  return {
    heads,
    thresholds: Array.from(
      { length: heads.length - 1 },
      (_, i) => first + (i * (0.76 - first)) / (heads.length - 2),
    ),
  }
}

const desktopPlan = makePlan(true)
const portraitPlan = makePlan(false)
export const planFor = (desktop: boolean) =>
  desktop ? desktopPlan : portraitPlan

export const shapeForPage = (page: number) =>
  page === 0 ? 0 : page === manualBackCover ? 2 : 1

/** The spread a scroll position should show, keeping the last choice until
 *  progress falls 0.04 below the threshold that committed it. */
export function nextHead(progress: number, desired: number, desktop: boolean) {
  const { heads, thresholds } = planFor(desktop)
  let spread = heads.indexOf(desired)
  if (spread < 0) spread = 0
  while (spread < thresholds.length && progress >= thresholds[spread]) spread++
  while (spread > 0 && progress < thresholds[spread - 1] - 0.04) spread--
  return heads[spread]
}

/** The spread a restored scroll position should open, with no hysteresis. */
export function restoredHead(progress: number, desktop: boolean) {
  const { heads, thresholds } = planFor(desktop)
  return heads[thresholds.filter((threshold) => progress >= threshold).length]
}

/** The neighboring spread toward `desired`, so one turn never skips a leaf. */
export function turnTarget(current: number, desired: number, desktop: boolean) {
  const { heads } = planFor(desktop)
  const index = heads.indexOf(current)
  return heads[index + Math.sign(heads.indexOf(desired) - index)]
}
