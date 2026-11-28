import { manualBackCover } from '../content/manualContent.ts'

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

export function spreadCount(desktop: boolean): number {
  return planFor(desktop).heads.length
}

export function spreadIndexForPage(page: number, desktop: boolean): number {
  const { heads } = planFor(desktop)
  return Math.max(0, heads.filter((head) => head <= page).length - 1)
}

export function progressForSpread(spread: number, desktop: boolean): number {
  const { heads, thresholds } = planFor(desktop)
  if (spread <= 0) return 0
  if (spread >= heads.length - 1) return 0.78
  const committed = thresholds[spread - 1]
  const following = thresholds[spread]
  return committed + Math.min((following - committed) / 2, 0.04)
}

export const shapeForPage = (page: number) =>
  page === 0 ? 0 : page === manualBackCover ? 2 : 1

export function nextHead(progress: number, desired: number, desktop: boolean) {
  const { heads, thresholds } = planFor(desktop)
  let spread = heads.indexOf(desired)
  if (spread < 0) spread = 0
  while (spread < thresholds.length && progress >= thresholds[spread]) spread++
  while (spread > 0 && progress < thresholds[spread - 1] - 0.04) spread--
  return heads[spread]
}

export function restoredHead(progress: number, desktop: boolean) {
  const { heads, thresholds } = planFor(desktop)
  return heads[thresholds.filter((threshold) => progress >= threshold).length]
}

export function turnTarget(current: number, desired: number, desktop: boolean) {
  const { heads } = planFor(desktop)
  const index = heads.indexOf(current)
  return heads[index + Math.sign(heads.indexOf(desired) - index)]
}
