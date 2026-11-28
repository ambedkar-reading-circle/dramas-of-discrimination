import { useEffect, useReducer } from 'react'
import { allCells, fullLength } from '../../shared/content/actorMap'
import type { Writer } from '../../shared/content/actorMap'
import { beatMs, jitter } from '../../shared/motion'
import type { CursorAt } from '../../shared/WriterCursors'

const travelBeats = 9
const restBeats = 5
const holdBeats = 90
const baseSpeed = 1.6

type Phase = 'travel' | 'type' | 'rest'

type WriterProgress = Readonly<{ index: number; phase: Phase; wait: number }>

type SheetState = Readonly<{
  beat: number
  typed: Readonly<Record<string, number>>
  writers: ReadonlyArray<WriterProgress>
  hold: number
}>

const lengthOf = new Map(allCells.map((cell) => [cell.id, fullLength(cell)]))

const valueIds = new Set(
  allCells.filter((cell) => cell.kind === 'strike').map((cell) => cell.id),
)

const textIds = allCells
  .filter((cell) => cell.kind === 'text' && fullLength(cell) > 0)
  .map((cell) => cell.id)

const mapFilled = (typed: Readonly<Record<string, number>>) =>
  textIds.every((id) => (typed[id] ?? 0) >= (lengthOf.get(id) ?? 0))

function blankSheet(writers: ReadonlyArray<Writer>): SheetState {
  return {
    beat: 0,
    typed: {},
    writers: writers.map(() => ({
      index: 0,
      phase: 'travel',
      wait: travelBeats,
    })),
    hold: 0,
  }
}

function finishedSheet(writers: ReadonlyArray<Writer>): SheetState {
  const typed = Object.fromEntries(
    writers.flatMap((writer) =>
      writer.queue.map((id) => [id, lengthOf.get(id) ?? 0]),
    ),
  )
  return {
    beat: 0,
    typed,
    writers: writers.map((writer) => ({
      index: writer.queue.length - 1,
      phase: 'rest',
      wait: Infinity,
    })),
    hold: 0,
  }
}

function advance(
  sheet: SheetState,
  writers: ReadonlyArray<Writer>,
): SheetState {
  const done = sheet.writers.every(
    (progress, i) => progress.index >= writers[i].queue.length,
  )
  if (done)
    return sheet.hold >= holdBeats
      ? blankSheet(writers)
      : { ...sheet, hold: sheet.hold + 1 }

  const typed = { ...sheet.typed }
  const progress = sheet.writers.map((current, i): WriterProgress => {
    const { queue, pace } = writers[i]
    if (current.index >= queue.length) return current
    const cell = queue[current.index]
    const length = lengthOf.get(cell) ?? 0
    if (current.phase === 'travel') {
      if (valueIds.has(cell) && !mapFilled(typed))
        return { ...current, wait: 1 }
      return current.wait > 1
        ? { ...current, wait: current.wait - 1 }
        : { ...current, phase: 'type', wait: 0 }
    }
    if (current.phase === 'type') {
      const next = Math.min(
        length,
        (typed[cell] ?? 0) + baseSpeed * pace * jitter(sheet.beat, i),
      )
      typed[cell] = next
      return next >= length
        ? { ...current, phase: 'rest', wait: restBeats }
        : current
    }
    if (current.wait > 1) return { ...current, wait: current.wait - 1 }
    return current.index + 1 >= queue.length
      ? { ...current, index: queue.length }
      : { index: current.index + 1, phase: 'travel', wait: travelBeats }
  })
  return { beat: sheet.beat + 1, typed, writers: progress, hold: 0 }
}

export type WriterAt = CursorAt<Phase> & Readonly<{ cell: string }>

export function useSheetFill(
  writers: ReadonlyArray<Writer>,
  reducedMotion: boolean,
) {
  const [sheet, tick] = useReducer(
    (current: SheetState) => advance(current, writers),
    writers,
    (initial) => (reducedMotion ? finishedSheet(initial) : blankSheet(initial)),
  )

  useEffect(() => {
    if (reducedMotion) return
    const timer = setInterval(tick, beatMs)
    return () => clearInterval(timer)
  }, [reducedMotion])

  const writersAt: ReadonlyArray<WriterAt> = sheet.writers.map(
    (progress, i) => {
      const { queue } = writers[i]
      const parked = progress.index >= queue.length
      return {
        writer: writers[i],
        cell: queue[Math.min(progress.index, queue.length - 1)],
        phase: parked ? 'idle' : progress.phase,
      }
    },
  )

  return {
    typedOf: (id: string) => Math.floor(sheet.typed[id] ?? 0),
    writers: writersAt,
  }
}
