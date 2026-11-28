import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { useLatest } from '#/lib/use-latest'
import type { SlideId } from '../types'
import { knownMs, paceOf, runPace } from './pace'
import type { Pace } from './pace'
import type { Caption, Point, SlideCues, SlidePoints } from './points'
import { speech } from './speech'
import type { PlaybackSwitches } from './switches'
import { useFilmWait } from './useFilmWait'
import { useVoiceOnFirstPress } from './useVoiceOnFirstPress'

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
  /** The current slide's cues, for its targets: a slice of its own, so a new caption leaves them be. */
  slideCues: SlideCues
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
type PlaybackInput = Readonly<{
  slide: number
  point: number
  slideId: SlideId
  points: ReadonlyArray<Point>
  atEnd: boolean
  next: () => void
  goTo: (slide: number, point?: number) => void
}>

/**
 * Self-facilitated playback over the deck. The deck owns the position (slide
 * and point, in the URL); playback owns the captions within a point and the
 * pace (see `pace.ts`) that moves it on, through the same `next` the arrows
 * use.
 */
export function usePlaybackState({ slide, point, slideId, points, atEnd, next, goTo }: PlaybackInput, initialSwitches: PlaybackSwitches): Playback {
  const [playing, setPlaying] = useState(initialSwitches.play)
  const [narrating, setNarrating] = useState(!initialSwitches.play)
  const [voice, setVoiceState] = useState(initialSwitches.voice)
  const [captions, setCaptions] = useState(true)
  // The run through the current point: which point it is, the caption of it on screen, and how many times captions and cues have been applied.
  const [pointRun, setPointRun] = useState({ slide, point, caption: 0, captionsApplied: 1, cuesApplied: 1 })
  // A new point, from anywhere (arrows, keys, swipe, strip, playback), starts at its first caption and shows its cues.
  // Stepped onto by hand, it narrates its own captions.
  if (pointRun.slide !== slide || pointRun.point !== point) {
    setPointRun({ slide, point, caption: 0, captionsApplied: pointRun.captionsApplied + 1, cuesApplied: pointRun.cuesApplied + 1 })
    if (!playing) setNarrating(true)
  }

  const current = points[point - 1]
  const captionIndex = Math.min(pointRun.caption, current.captions.length - 1)
  const caption = current.captions[captionIndex]

  /**
   * Moves playback on: the point's next caption, else (narrating) a stop, else the next point, else the end of the deck.
   * Takes whether the deck plays, since play moves on before its own render sees `playing`.
   */
  const moveOn = useCallback(
    (asPlaying: boolean) => {
      if (captionIndex < current.captions.length - 1) setPointRun((p) => ({ ...p, caption: captionIndex + 1, captionsApplied: p.captionsApplied + 1 }))
      else if (!asPlaying) setNarrating(false)
      else if (atEnd) setPlaying(false)
      else next()
    },
    [captionIndex, current.captions.length, atEnd, next],
  )
  const advance = useCallback(() => moveOn(playing), [moveOn, playing])

  /** Applies the caption on screen again, so its pace runs afresh. */
  const readAgain = useCallback(() => setPointRun((p) => ({ ...p, captionsApplied: p.captionsApplied + 1 })), [])
  /** Applies the current point again, so a resume re-plays its cues and restarts its hold. */
  const replay = useCallback(() => setPointRun((p) => ({ ...p, captionsApplied: p.captionsApplied + 1, cuesApplied: p.cuesApplied + 1 })), [])

  const { resolveWait, endedWhilePaused } = useFilmWait({ waiting: current.wait !== undefined, playing, cuesApplied: pointRun.cuesApplied, advance })

  const play = useCallback(() => {
    setPlaying(true)
    setNarrating(false)
    if (endedWhilePaused()) moveOn(true)
    else replay()
  }, [replay, moveOn, endedWhilePaused])
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
        readAgain()
      }
    },
    [playing, replay, readAgain],
  )

  const pace = useMemo(() => paceOf(caption, current, voice), [caption, current, voice])
  const running = playing || narrating

  // The latest advance, so the pace below restarts only when a caption is applied.
  const latestAdvance = useLatest(advance)

  useEffect(() => {
    if (!running) return
    return runPace(pace, () => latestAdvance.current())
    // A caption applied again (on play, or the voice turned on) runs its pace afresh.
  }, [running, pace, pointRun.captionsApplied])

  useVoiceOnFirstPress(voice && running, readAgain)

  // Leaving the deck silences the voice.
  useEffect(() => () => speech()?.cancel(), [])

  const goToPoint = useCallback((target: number) => goTo(slide, target), [goTo, slide])

  const cues = current.cues
  const slideCues = useMemo(() => ({ slideId, points, point, goToPoint, cues, cuesApplied: pointRun.cuesApplied }), [slideId, points, point, goToPoint, cues, pointRun.cuesApplied])

  const runningMs = running ? knownMs(pace) : null
  return useMemo(
    () => ({ playing, narrating, voice, captions, points, point, current, goToPoint, captionIndex, caption, pace, runningMs, captionsApplied: pointRun.captionsApplied, slideCues, play, pause, toggle, setVoice, setCaptions, resolveWait }),
    [playing, narrating, voice, captions, points, point, current, goToPoint, captionIndex, caption, pace, runningMs, pointRun.captionsApplied, slideCues, play, pause, toggle, setVoice, setCaptions, resolveWait],
  )
}
