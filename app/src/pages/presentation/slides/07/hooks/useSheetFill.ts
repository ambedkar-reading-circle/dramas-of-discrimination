import { useEffect, useReducer } from 'react'
import { allCells, fullLength } from '../content/actorMap'
import type { Writer } from '../content/actorMap'

/** One beat of the simulation. Every writer moves, types or rests once per beat. */
const beatMs = 45
/** Beats a cursor takes to travel to its next cell before it starts typing. */
const travelBeats = 9
/** Beats a writer lingers on a finished cell. */
const restBeats = 5
/** Beats the finished sheet stays on screen before it clears and starts over. */
const holdBeats = 90
/** Keystrokes per beat at a pace of 1. */
const baseSpeed = 1.6

type Phase = 'travel' | 'type' | 'rest'

/** Where one writer is in their queue, and what they are doing there. */
type WriterProgress = Readonly<{ index: number; phase: Phase; wait: number }>

type SheetState = Readonly<{
  /** Beats played so far this run. */
  beat: number
  /** Keystrokes into each cell so far; fractional, so slow typists still get there. */
  typed: Readonly<Record<string, number>>
  writers: ReadonlyArray<WriterProgress>
  hold: number
}>

const lengthOf = new Map(allCells.map((cell) => [cell.id, fullLength(cell)]))

/** The empty sheet, every writer setting off for their first cell. */
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

/** The sheet as it stands once everyone is done: every cell full, every writer resting on their last. */
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

/** A steady wobble in typing speed, the same on every run. */
function jitter(beat: number, writer: number) {
  const x = Math.sin(beat * 12.9898 + writer * 78.233) * 43758.5453
  return 0.45 + (x - Math.floor(x)) * 1.1
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
    if (current.phase === 'travel')
      return current.wait > 1
        ? { ...current, wait: current.wait - 1 }
        : { ...current, phase: 'type', wait: 0 }
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
    // The last cell keeps its writer, so the cursor parks there instead of vanishing.
    return current.index + 1 >= queue.length
      ? { ...current, index: queue.length }
      : { index: current.index + 1, phase: 'travel', wait: travelBeats }
  })
  return { beat: sheet.beat + 1, typed, writers: progress, hold: 0 }
}

export type WriterAt = Readonly<{
  writer: Writer
  cell: string
  phase: Phase | 'idle'
}>

/**
 * Plays the writers filling in the sheet, each down their own queue of cells,
 * all at once, and loops when the sheet is full. With `reducedMotion`, it holds
 * the finished sheet. Mount it afresh (a new key) to play a different set of writers.
 */
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
    /** How many characters of a cell are in, or 1 when a category is ticked. */
    typedOf: (id: string) => Math.floor(sheet.typed[id] ?? 0),
    writers: writersAt,
  }
}
