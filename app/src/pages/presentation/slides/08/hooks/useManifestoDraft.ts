import { useEffect, useReducer } from 'react'
import type { Writer } from '../../shared/content/actorMap'
import { beatMs, jitter } from '../../shared/motion'
import type { CursorAt } from '../../shared/WriterCursors'
import { draft, editors } from '../content/manifesto'
import type { BlockId, DraftEdit } from '../content/manifesto'

/** Characters of the draft the platform writes per beat while it generates. */
const streamSpeed = 7
/** Beats a cursor takes to reach the words it will change. */
const travelBeats = 14
/** Characters a selection grows by per beat. */
const selectSpeed = 2.4
/** Beats a Member holds their selection before typing over it. */
const pauseBeats = 8
/** Keystrokes per beat. */
const typeSpeed = 1.1
/** Beats a Member lingers on a finished edit. */
const restBeats = 10

/**
 * Waiting for the Facilitator to press Generate; generating; generated,
 * waiting for Edit; Members editing; edited.
 */
type Stage = 'idle' | 'generate' | 'generated' | 'edit' | 'done'
type EditPhase = 'travel' | 'select' | 'pause' | 'type' | 'rest'

type EditorProgress = Readonly<{
  index: number
  phase: EditPhase
  wait: number
  selected: number
  typed: number
}>

/** An edit already made: the words that went in, and who wrote them. */
type Mark = Readonly<{ start: number; length: number; writer: Writer }>

type DraftState = Readonly<{
  beat: number
  stage: Stage
  /** Characters of the draft generated so far. */
  streamed: number
  texts: Readonly<Record<string, string>>
  marks: Readonly<Partial<Record<string, Mark>>>
  editors: ReadonlyArray<EditorProgress>
}>

/** The draft's words and who wrote which: what each committed edit changes. */
type Edited = Pick<DraftState, 'texts' | 'marks'>

const draftLength = draft.reduce((sum, block) => sum + block.text.length, 0)
const generatedTexts = Object.fromEntries(
  draft.map((block) => [block.id, block.text]),
)

/** Where an edit begins in its paragraph. */
function startOf(edit: DraftEdit, texts: Readonly<Record<string, string>>) {
  const text = texts[edit.block] ?? ''
  if (!edit.find) return text.length
  const at = text.indexOf(edit.find)
  if (at < 0) throw new Error(`"${edit.find}" is not in ${edit.block}`)
  return at
}

/** Puts an edit into the text, and marks it as its writer's. */
function commit(state: Edited, edit: DraftEdit, writer: Writer): Edited {
  const text = state.texts[edit.block]
  const start = startOf(edit, state.texts)
  return {
    texts: {
      ...state.texts,
      [edit.block]:
        text.slice(0, start) +
        edit.replace +
        text.slice(start + edit.find.length),
    },
    marks: {
      ...state.marks,
      [edit.block]: { start, length: edit.replace.length, writer },
    },
  }
}

/** Every Member waits at the door; they come in one after another once the draft is out. */
const arriving = (): ReadonlyArray<EditorProgress> =>
  editors.map((_, i) => ({
    index: 0,
    phase: 'travel',
    wait: travelBeats + i * 9,
    selected: 0,
    typed: 0,
  }))

/** Nothing generated yet. */
function blankDraft(stage: Stage = 'idle'): DraftState {
  return {
    beat: 0,
    stage,
    streamed: 0,
    texts: generatedTexts,
    marks: {},
    editors: arriving(),
  }
}

/** The draft once every Member has had their say. */
function finishedDraft(): DraftState {
  let edited: Edited = { texts: generatedTexts, marks: {} }
  for (const { writer, edits } of editors)
    for (const edit of edits) edited = commit(edited, edit, writer)
  return {
    ...blankDraft(),
    ...edited,
    stage: 'done',
    streamed: draftLength,
    editors: editors.map(({ edits }) => ({
      index: edits.length,
      phase: 'rest',
      wait: 0,
      selected: 0,
      typed: 0,
    })),
  }
}

/** Generating or editing: a run is on screen and the beat is ticking. */
const isPlaying = (stage: Stage) => stage === 'generate' || stage === 'edit'

function advance(state: DraftState): DraftState {
  if (!isPlaying(state.stage)) return state
  if (state.stage === 'generate') {
    const streamed = Math.min(draftLength, state.streamed + streamSpeed)
    return {
      ...state,
      beat: state.beat + 1,
      streamed,
      stage: streamed >= draftLength ? 'generated' : 'generate',
    }
  }
  let edited: Edited = state
  const progress = state.editors.map((current, i): EditorProgress => {
    const { writer, edits } = editors[i]
    const edit = edits[current.index] as DraftEdit | undefined
    if (!edit) return current
    if (current.wait > 1) return { ...current, wait: current.wait - 1 }
    switch (current.phase) {
      case 'travel':
        return edit.find
          ? { ...current, phase: 'select', wait: 0 }
          : { ...current, phase: 'type', wait: pauseBeats }
      case 'select': {
        const selected = Math.min(
          edit.find.length,
          current.selected + selectSpeed,
        )
        return selected >= edit.find.length
          ? { ...current, selected, phase: 'pause', wait: pauseBeats }
          : { ...current, selected }
      }
      case 'pause':
        return { ...current, phase: 'type', wait: 0 }
      case 'type': {
        const typed = Math.min(
          edit.replace.length,
          current.typed + typeSpeed * jitter(state.beat, i),
        )
        if (typed < edit.replace.length) return { ...current, typed }
        edited = commit(edited, edit, writer)
        return { ...current, typed, phase: 'rest', wait: restBeats }
      }
      case 'rest':
        return {
          index: current.index + 1,
          phase: 'travel',
          wait: travelBeats,
          selected: 0,
          typed: 0,
        }
    }
  })
  const done = progress.every(
    (current, i) => current.index >= editors[i].edits.length,
  )
  return {
    ...state,
    ...edited,
    beat: state.beat + 1,
    editors: progress,
    stage: done ? 'done' : 'edit',
  }
}

/** A run of a paragraph as it renders: plain, someone's earlier edit, a live selection or insertion, or a caret. */
export type Segment = Readonly<
  | { kind: 'text'; text: string }
  | { kind: 'mark' | 'select' | 'typing'; text: string; writer: Writer }
  | ({ kind: 'caret' } & CursorAt<EditPhase>)
  | { kind: 'stream' }
>

type Action = 'tick' | 'generate' | 'edit'

/** The draft as the platform wrote it, untouched. */
const generatedDraft = (stage: Stage): DraftState => ({
  ...blankDraft(stage),
  streamed: draftLength,
})

/**
 * Waits for Generate, then plays the platform writing the Manifesto draft.
 * Edit then plays every Member reworking it at once, from the draft as
 * generated. Either can be pressed again to replay. With `reducedMotion`,
 * each goes straight to its end.
 */
export function useManifestoDraft(reducedMotion: boolean) {
  const [state, dispatch] = useReducer(
    (current: DraftState, action: Action) => {
      if (action === 'tick') return advance(current)
      if (action === 'generate')
        return reducedMotion
          ? generatedDraft('generated')
          : blankDraft('generate')
      return reducedMotion ? finishedDraft() : generatedDraft('edit')
    },
    undefined,
    () => blankDraft(),
  )
  const playing = isPlaying(state.stage)

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => dispatch('tick'), beatMs)
    return () => clearInterval(timer)
  }, [playing])

  /** Each Member, where their caret sits now: on the edit they are making, or on their last one. */
  const carets = state.editors.map((progress, i) => {
    const { writer, edits } = editors[i]
    const working = progress.index < edits.length
    const edit = edits[Math.min(progress.index, edits.length - 1)]
    const phase: EditPhase | 'idle' =
      state.stage === 'done' || !working ? 'idle' : progress.phase
    return { writer, progress, edit, phase, working }
  })

  function segmentsOf(id: BlockId): ReadonlyArray<Segment> {
    if (state.stage === 'idle') return []
    if (state.stage === 'generate') {
      let before = 0
      for (const block of draft) {
        if (block.id === id) break
        before += block.text.length
      }
      const text = generatedTexts[id] ?? ''
      const shown = Math.max(0, Math.min(text.length, state.streamed - before))
      const streaming = shown > 0 && shown < text.length
      return streaming
        ? [{ kind: 'text', text: text.slice(0, shown) }, { kind: 'stream' }]
        : [{ kind: 'text', text: text.slice(0, shown) }]
    }

    const text = state.texts[id] ?? ''
    if (state.stage === 'generated') return [{ kind: 'text', text }]
    // Waiting at the door: a Member's caret appears only once the draft is out.
    const caretHere = carets.find(
      (at) =>
        at.edit.block === id &&
        (state.stage === 'done' ||
          at.progress.index > 0 ||
          at.progress.phase !== 'travel' ||
          at.progress.wait <= travelBeats),
    )
    const mark = state.marks[id]
    const editing =
      caretHere && caretHere.working && caretHere.progress.phase !== 'rest'
        ? caretHere
        : undefined

    if (editing) {
      const { writer, progress, edit } = editing
      const start = startOf(edit, state.texts)
      const caret: Segment = { kind: 'caret', writer, phase: progress.phase }
      const before: Segment = { kind: 'text', text: text.slice(0, start) }
      if (progress.phase === 'type' && progress.typed >= 1)
        return [
          before,
          {
            kind: 'typing',
            text: edit.replace.slice(0, Math.floor(progress.typed)),
            writer,
          },
          caret,
          { kind: 'text', text: text.slice(start + edit.find.length) },
        ]
      const selected =
        progress.phase === 'travel'
          ? 0
          : progress.phase === 'select'
            ? Math.floor(progress.selected)
            : edit.find.length
      return [
        before,
        { kind: 'select', text: text.slice(start, start + selected), writer },
        caret,
        { kind: 'text', text: text.slice(start + selected) },
      ]
    }

    if (!mark) return [{ kind: 'text', text }]
    const end = mark.start + mark.length
    return [
      { kind: 'text', text: text.slice(0, mark.start) },
      { kind: 'mark', text: text.slice(mark.start, end), writer: mark.writer },
      ...(caretHere
        ? [
            {
              kind: 'caret',
              writer: caretHere.writer,
              phase: caretHere.phase,
            } as const,
          ]
        : []),
      { kind: 'text', text: text.slice(end) },
    ]
  }

  return {
    stage: state.stage,
    /** A run is on screen: the Facilitator's or the Members'. */
    playing,
    segmentsOf,
    /** Members with a cursor in the draft; none until it is out. */
    editors:
      state.stage === 'edit' || state.stage === 'done'
        ? carets.map(({ writer, phase }): CursorAt<EditPhase> => ({
            writer,
            phase,
          }))
        : [],
    /** The Facilitator's trigger: generate the draft, afresh if there is one. */
    generate: () => dispatch('generate'),
    /** Play the Members editing the generated draft. */
    edit: () => dispatch('edit'),
  }
}
