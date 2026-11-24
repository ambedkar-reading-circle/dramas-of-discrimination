import { twoDigit } from '#/lib/format/index.ts'
import type {
  ActivityStep,
  ManualExcerpt,
  Photo,
  WorksheetSticker,
  WorkshopActivity,
} from './workshopActivities.ts'

/**
 * What lies over an open facilitation sheet, and the words its stickers carry.
 * Kept free of React so the naming and the overlay choice can be tested alone.
 */

/** The three kinds of sticker that lay something over the sheet. */
export type OverlayKind = 'manual' | 'photo' | 'worksheet'

/** Which sticker is open: its kind and its position among its own kind. */
export interface OverlayTarget {
  kind: OverlayKind
  index: number
}

/** Identifies one sticker among all the stickers on a sheet. */
export function targetKey({ kind, index }: OverlayTarget) {
  return `${kind}:${index}`
}

/**
 * What the overlay lays out: manual pages, or photographs as prints. `key`
 * tells two overlays apart, so switching between them replays the motion;
 * `ariaLabel` names the laid-out region for a screen reader.
 */
export type OverlayContent =
  | {
      type: 'pages'
      key: string
      ariaLabel: string
      name: string
      pages: number[]
    }
  | {
      type: 'prints'
      key: string
      ariaLabel: string
      name: string
      mark?: string
      photos: Photo[]
    }

/** The text a sticker shows, and the name it carries for a screen reader. */
export interface StickerLabels {
  label: string
  detail: string
  ariaLabel: string
}

export function pageRange(pages: number[]) {
  if (pages.length === 0) return ''
  const first = pages[0]
  const last = pages[pages.length - 1]
  return first === last ? `p. ${first}` : `pp. ${first}–${last}`
}

function pagesOverlay(name: string, pages: number[]): OverlayContent {
  return {
    type: 'pages',
    key: `pages:${pages.join('-')}`,
    ariaLabel: `${name}, ${pageRange(pages)} of the manual. Tap to put them away.`,
    name,
    pages,
  }
}

function printsOverlay(
  name: string,
  photos: Photo[],
  mark?: string,
): OverlayContent {
  return {
    type: 'prints',
    key: `prints:${photos.map((photo) => photo.src).join('|')}`,
    ariaLabel: `${name}. Tap to put them away.`,
    name,
    ...(mark === undefined ? {} : { mark }),
    photos,
  }
}

function excerptName(activityName: string, excerpt: ManualExcerpt) {
  return excerpt.part ? `${activityName} ${excerpt.part}` : activityName
}

export function excerptLabels(
  activityName: string,
  excerpt: ManualExcerpt,
): StickerLabels {
  return {
    label: excerpt.part
      ? `Manual · Part ${excerpt.part}`
      : 'Pages from the manual',
    detail: `${pageRange(excerpt.pages)} ↗`,
    ariaLabel: `${excerptName(activityName, excerpt)}: pages from the manual, ${pageRange(excerpt.pages)}`,
  }
}

/** A worksheet sticker's labels and the overlay it opens, decided together. */
function worksheetView(activityName: string, worksheet: WorksheetSticker) {
  const name = `${activityName} worksheet`
  if (worksheet.kind === 'manual') {
    const range = pageRange(worksheet.pages)
    return {
      labels: {
        label: worksheet.label,
        detail: `${range} ↗`,
        ariaLabel: `${name}, blank: pages from the manual, ${range}`,
      },
      overlay: pagesOverlay(name, worksheet.pages),
    }
  }
  return {
    labels: {
      label: worksheet.label,
      detail: 'From a workshop ↗',
      ariaLabel: `${name}, as one group filled it in at a workshop`,
    },
    overlay: printsOverlay(`${name}, filled in at a workshop`, [
      worksheet.photo,
    ]),
  }
}

export function worksheetLabels(
  activityName: string,
  worksheet: WorksheetSticker,
): StickerLabels {
  return worksheetView(activityName, worksheet).labels
}

export function stepLabel(index: number, step: ActivityStep) {
  const count = step.photos?.length ?? 0
  return `${twoDigit(index + 1)}. ${step.text} (${count === 1 ? 'photograph' : `${count} photographs`} from a workshop)`
}

/** Resolves the open sticker to what the overlay should show, or null. */
export function resolveOverlay(
  activity: WorkshopActivity,
  target: OverlayTarget | null,
): OverlayContent | null {
  if (target === null) return null
  const { kind, index } = target

  if (kind === 'manual') {
    const excerpt = activity.manual.at(index)
    return excerpt
      ? pagesOverlay(excerptName(activity.name, excerpt), excerpt.pages)
      : null
  }

  if (kind === 'photo') {
    const photos = activity.steps.at(index)?.photos
    if (!photos?.length) return null
    const mark = twoDigit(index + 1)
    return printsOverlay(
      `Step ${mark}, photographs from a workshop`,
      photos,
      mark,
    )
  }

  const worksheet = activity.worksheets?.at(index)
  return worksheet ? worksheetView(activity.name, worksheet).overlay : null
}
