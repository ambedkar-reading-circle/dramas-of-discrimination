import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLatest } from '#/lib/use-latest'
import { knownMs, paceOf, runPace } from './pace'
import type { Pace } from './pace'
import type { Caption, Point, SlidePoints } from './points'
import { speech } from './speech'

export type Playback = SlidePoints &
  Readonly<{
  /** The deck plays itself, point after point. */
  playing: boolean
  /**
   * The deck is not playing, but the current point's captions run through
   * once (read aloud if the voice is on) and stop at its end. It starts on
   * arrival at each point, so a visitor stepping by hand still reads and
   * hears every caption.
   */
  narrating: boolean
  /** Captions are read aloud, and the voice sets the pace. */
  voice: boolean
  /** Captions show in the player bar, from arrival, whether or not the deck plays. */
  captions: boolean
  /** The id of the slide the points belong to. */
  slideId: string
  /** The point the deck is on. */
  current: Point
  /** Which of the current point's captions is on screen, and that caption. */
  captionIndex: number
  caption: Caption
  /** What sets the current caption's length, and plays it. */
  pace: Pace
  /** How long the current caption runs, while playing or narrating and when its pace knows its length ahead; null otherwise. */
  runningMs: number | null
  /** Counts each time a caption is applied: on arrival, on each caption, and again on play. */
  captionsApplied: number
  /**
   * Counts each time the cues are applied: when the deck moves to a point, or play is pressed. The
   * slide then shows that point's cues again, so a change made by hand inside
   * it lasts only until the deck moves.
   */
  cuesApplied: number
  play: () => void
  pause: () => void
  toggle: () => void
  setVoice: (on: boolean) => void
  setCaptions: (on: boolean) => void
  /** The slide reports the film it was waiting on has ended. */
  resolveWait: () => void
}>

export const PlaybackContext = createContext<Playback | null>(null)

export function usePlayback(): Playback | null {
  return use(PlaybackContext)
}

/** Where the deck stands, and how it moves: what playback reads and drives. */
interface DeckPosition {
  slide: number
  point: number
  slideId: string
  points: ReadonlyArray<Point>
  atEnd: boolean
  /** Steps the deck one point on, into the next slide after the last. */
  next: () => void
  goTo: (slide: number, point: number) => void
}

/**
 * Self-facilitated playback over the deck. The deck owns the position (slide
 * and point, in the URL); playback owns the captions within a point and the
 * pace (see `pace.ts`) that moves it on, through the same `next` the arrows
 * use.
 */
export function usePlaybackState({ slide, point, slideId, points, atEnd, next, goTo }: DeckPosition, initialPlay: boolean): Playback {
  const [playing, setPlaying] = useState(initialPlay)
  const [narrating, setNarrating] = useState(!initialPlay)
  const [voice, setVoiceState] = useState(false)
  const [captions, setCaptions] = useState(true)
  const [progress, setProgress] = useState({ slide, point, caption: 0, captionsApplied: 1, cuesApplied: 1 })
  // A new point, from anywhere (arrows, keys, swipe, strip, playback), starts at its first caption and shows its cues.
  // Stepped onto by hand, it narrates its own captions.
  if (progress.slide !== slide || progress.point !== point) {
    setProgress({ slide, point, caption: 0, captionsApplied: progress.captionsApplied + 1, cuesApplied: progress.cuesApplied + 1 })
    if (!playing) setNarrating(true)
  }

  const current = points[point - 1]
  const captionIndex = Math.min(progress.caption, current.captions.length - 1)
  const caption = current.captions[captionIndex]

  /**
   * Moves playback on: the point's next caption, else (narrating) a stop, else the next point, else the end of the deck.
   * Takes whether the deck plays, since play moves on before its own render sees `playing`.
   */
  const stepOn = useCallback(
    (asPlaying: boolean) => {
      if (captionIndex < current.captions.length - 1) setProgress((p) => ({ ...p, caption: captionIndex + 1, captionsApplied: p.captionsApplied + 1 }))
      else if (!asPlaying) setNarrating(false)
      else if (atEnd) setPlaying(false)
      else next()
    },
    [captionIndex, current.captions.length, atEnd, next],
  )
  const advance = useCallback(() => stepOn(playing), [stepOn, playing])

  /** Applies the current point again, so a resume re-plays its cues and restarts its hold. */
  const replay = useCallback(() => setProgress((p) => ({ ...p, captionsApplied: p.captionsApplied + 1, cuesApplied: p.cuesApplied + 1 })), [])

  // The film can end just after Pause. Its point is then done: play moves on from it rather than starting the film over.
  const endedWhilePaused = useRef<number | null>(null)

  const play = useCallback(() => {
    setPlaying(true)
    setNarrating(false)
    if (endedWhilePaused.current === progress.captionsApplied) stepOn(true)
    else replay()
    endedWhilePaused.current = null
  }, [replay, stepOn, progress.captionsApplied])
  const pause = useCallback(() => {
    setPlaying(false)
    setNarrating(false)
    speech()?.cancel()
  }, [])
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play])
  const setVoice = useCallback(
    (on: boolean) => {
      setVoiceState(on)
      if (!on) speech()?.cancel()
      else if (playing) replay()
      else {
        // Not playing: read the caption on screen, and the rest of its point, without moving the deck.
        setNarrating(true)
        setProgress((p) => ({ ...p, captionsApplied: p.captionsApplied + 1 }))
      }
    },
    [playing, replay],
  )

  const waiting = current.wait !== undefined
  const resolveWait = useCallback(() => {
    if (!waiting) return
    if (playing) advance()
    else endedWhilePaused.current = progress.captionsApplied
  }, [waiting, playing, advance, progress.captionsApplied])

  const pace = useMemo(() => paceOf(caption, current, voice), [caption, current, voice])
  const running = playing || narrating

  // The latest advance, so the pace below restarts only when a caption is applied.
  const latestAdvance = useLatest(advance)

  useEffect(() => {
    if (!running) return
    return runPace(pace, () => latestAdvance.current())
    // A caption applied again (on play, or the voice turned on) runs its pace afresh.
  }, [running, pace, progress.captionsApplied])

  // Leaving the deck silences the voice.
  useEffect(() => () => speech()?.cancel(), [])

  const goToPoint = useCallback((target: number) => goTo(slide, target), [goTo, slide])

  const runningMs = running ? knownMs(pace) : null
  return useMemo(
    () => ({ playing, narrating, voice, captions, slideId, points, point, current, goToPoint, captionIndex, caption, pace, runningMs, captionsApplied: progress.captionsApplied, cuesApplied: progress.cuesApplied, play, pause, toggle, setVoice, setCaptions, resolveWait }),
    [playing, narrating, voice, captions, slideId, points, point, current, goToPoint, captionIndex, caption, pace, runningMs, progress.captionsApplied, progress.cuesApplied, play, pause, toggle, setVoice, setCaptions, resolveWait],
  )
}
