import { createContext, use, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Slide } from '../types'
import { beatsOf } from './beats'
import type { PlayBeat } from './beats'
import { speech } from './speech'

/** What a key press inside the slide works, rather than the deck. */
export const controlSelector = 'button, a[href], input, textarea, select, [role="button"], [role="tab"]'

/** Where a key press is typing, not working a control. */
export const typingSelector = 'input, textarea, select, [contenteditable="true"]'

/** A short breath after the voice finishes, before the next caption. */
const afterSpeechMs = 400

export type Playback = Readonly<{
  /** Self-facilitation has started (play was pressed): the slide number carries its step, and captions and voice are on offer. */
  selfMode: boolean
  playing: boolean
  /** Captions are read aloud, and the voice sets the pace. */
  voice: boolean
  /** Captions show in the player bar while self-facilitation is on. */
  captions: boolean
  /** The id of the slide the beats belong to. */
  slideId: string
  beat: number
  beats: ReadonlyArray<PlayBeat>
  current: PlayBeat
  /** The current beat's hold is running on the timer: playing, with neither the voice nor a film setting the pace. */
  holdRunning: boolean
  /** Changes each time a beat is applied: on arrival, and again on play. */
  token: number
  /**
   * The beat was brought on by playback (playing, stepping a caption, or play
   * pressed), not by someone moving the deck while paused. Slides act on a
   * beat's cue only then, so presenting by hand leaves them alone.
   */
  byPlayback: boolean
  /** The beat's cue differs from the beat played just before, or the beat was applied afresh. */
  cueChanged: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  nextBeat: () => void
  prevBeat: () => void
  setVoice: (on: boolean) => void
  setCaptions: (on: boolean) => void
  /** The slide reports the film it was waiting on has ended. */
  resolveWait: () => void
}>

export const PlaybackContext = createContext<Playback | null>(null)

/** The id of the slide a component renders in, so an exiting slide ignores the next slide's cues. */
export const SlideIdContext = createContext<string | null>(null)

export function usePlayback(): Playback | null {
  return use(PlaybackContext)
}

interface DeckPosition {
  /** The deck's slides, whose speaker notes the beats are woven from. */
  slides: ReadonlyArray<Slide>
  slide: number
  goTo: (slide: number) => void
}

/**
 * Self-facilitated playback over the deck: which beat of the current slide is
 * on screen, and the timer (or voice, or film) that moves it on. Reaching a
 * slide's last beat moves the deck to the next slide, through the same
 * `goTo` the slide strip and arrows use, so the URL stays the source of truth
 * for the slide and the beat follows it.
 */
export function usePlaybackState({ slides, slide, goTo }: DeckPosition, initialPlay: boolean): Playback {
  const total = slides.length
  // Every slide's beats, worked out once per deck: the notes do not change while it runs.
  const deckBeats = useMemo(() => slides.map(beatsOf), [slides])
  const [selfMode, setSelfMode] = useState(initialPlay)
  const [playing, setPlaying] = useState(initialPlay)
  const [voice, setVoiceState] = useState(false)
  const [captions, setCaptions] = useState(true)
  // `previousBeat` is the beat stepped from, or null when the beat was applied afresh (arrival, play).
  const [pos, setPos] = useState<{ slide: number; beat: number; token: number; byPlayback: boolean; previousBeat: number | null }>({ slide, beat: 0, token: 1, byPlayback: initialPlay, previousBeat: null })
  // How playback crosses into the next slide: stepping back from a slide's
  // first beat lands on the previous slide's last, and a step is live.
  const [entry, setEntry] = useState<{ at: 'start' | 'end'; live: boolean } | null>(null)

  const beats = deckBeats[slide - 1]
  // A new slide, from anywhere (selector, arrows, keys, swipe, playback), starts its beats over.
  if (pos.slide !== slide) {
    setPos({ slide, beat: entry?.at === 'end' ? beats.length - 1 : 0, token: pos.token + 1, byPlayback: entry?.live === true || playing, previousBeat: null })
    if (entry) setEntry(null)
  }
  const beat = Math.min(pos.beat, beats.length - 1)
  const current = beats[beat]

  const nextBeat = useCallback(() => {
    // A first step after moving the paused deck by hand applies its cue afresh: the slide may not show the cue before it.
    if (beat < beats.length - 1) setPos((p) => ({ ...p, beat: beat + 1, token: p.token + 1, byPlayback: true, previousBeat: p.byPlayback ? beat : null }))
    else if (slide < total) {
      setEntry({ at: 'start', live: true })
      goTo(slide + 1)
    } else setPlaying(false)
  }, [beat, beats.length, slide, total, goTo])

  const prevBeat = useCallback(() => {
    if (beat > 0) setPos((p) => ({ ...p, beat: beat - 1, token: p.token + 1, byPlayback: true, previousBeat: p.byPlayback ? beat : null }))
    else if (slide > 1) {
      setEntry({ at: 'end', live: true })
      goTo(slide - 1)
    }
  }, [beat, slide, goTo])

  /** Applies the current beat again, so a resume re-plays its cue and restarts its hold. */
  const replay = useCallback(() => setPos((p) => ({ ...p, token: p.token + 1, byPlayback: true, previousBeat: null })), [])

  // The film can end just after Pause. Its beat is then done: play moves on from it rather than starting the film over.
  const endedWhilePaused = useRef<number | null>(null)

  const play = useCallback(() => {
    setSelfMode(true)
    setPlaying(true)
    if (endedWhilePaused.current === pos.token) nextBeat()
    else replay()
    endedWhilePaused.current = null
  }, [replay, nextBeat, pos.token])
  const pause = useCallback(() => {
    setPlaying(false)
    speech()?.cancel()
  }, [])
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play])
  const setVoice = useCallback(
    (on: boolean) => {
      setVoiceState(on)
      if (!on) speech()?.cancel()
      else if (playing) replay()
    },
    [playing, replay],
  )

  const waiting = current.waitFor !== undefined
  const resolveWait = useCallback(() => {
    if (!waiting) return
    if (playing) nextBeat()
    else endedWhilePaused.current = pos.token
  }, [waiting, playing, nextBeat, pos.token])

  // The latest step, so the timer below restarts only when a beat is applied.
  const advance = useRef(nextBeat)
  useLayoutEffect(() => {
    advance.current = nextBeat
  })

  useEffect(() => {
    if (!playing || current.waitFor) return
    const synth = voice && current.speak !== '' ? speech() : null
    const timers: Array<ReturnType<typeof setTimeout>> = []
    const later = (ms: number) => timers.push(setTimeout(() => advance.current(), ms))
    let utterance: SpeechSynthesisUtterance | null = null
    if (synth) {
      synth.cancel()
      utterance = new SpeechSynthesisUtterance(current.speak)
      utterance.lang = 'en-IN'
      utterance.onend = () => later(afterSpeechMs)
      synth.speak(utterance)
      // A voice that never reports its end must not stall the deck.
      later(current.holdMs * 3)
    } else {
      later(current.holdMs)
    }
    return () => {
      timers.forEach(clearTimeout)
      if (utterance) {
        utterance.onend = null
        synth?.cancel()
      }
    }
  }, [playing, voice, pos.token, current])

  // Leaving the deck silences the voice.
  useEffect(() => () => speech()?.cancel(), [])

  // A cue that holds across captions fires once, where it starts. Arriving, or
  // pressing play, applies the current cue again.
  const cueChanged = pos.previousBeat === null || beats[pos.previousBeat]?.cue !== current.cue
  const holdRunning = playing && !voice && !current.waitFor
  const slideId = slides[slide - 1].id
  return useMemo(
    () => ({ selfMode, playing, voice, captions, slideId, beat, beats, current, holdRunning, token: pos.token, byPlayback: pos.byPlayback, cueChanged, play, pause, toggle, nextBeat, prevBeat, setVoice, setCaptions, resolveWait }),
    [selfMode, playing, voice, captions, slideId, beat, beats, current, holdRunning, pos.token, pos.byPlayback, cueChanged, play, pause, toggle, nextBeat, prevBeat, setVoice, setCaptions, resolveWait],
  )
}
