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
  playing: boolean
  narrating: boolean
  voice: boolean
  captions: boolean
  current: Point
  captionIndex: number
  caption: Caption
  pace: Pace
  runningMs: number | null
  captionsApplied: number
  slideCues: SlideCues
  play: () => void
  pause: () => void
  toggle: () => void
  setVoice: (on: boolean) => void
  setCaptions: (on: boolean) => void
  resolveWait: () => void
}>

export const PlaybackContext = createContext<Playback | null>(null)

export function usePlayback(): Playback | null {
  return use(PlaybackContext)
}

type PlaybackInput = Readonly<{
  slide: number
  point: number
  slideId: SlideId
  points: ReadonlyArray<Point>
  atEnd: boolean
  next: () => void
  goTo: (slide: number, point?: number) => void
}>

export function usePlaybackState({ slide, point, slideId, points, atEnd, next, goTo }: PlaybackInput, initialSwitches: PlaybackSwitches): Playback {
  const [playing, setPlaying] = useState(initialSwitches.play)
  const [narrating, setNarrating] = useState(!initialSwitches.play)
  const [voice, setVoiceState] = useState(initialSwitches.voice)
  const [captions, setCaptions] = useState(true)
  const [pointRun, setPointRun] = useState({ slide, point, caption: 0, captionsApplied: 1, cuesApplied: 1 })
  if (pointRun.slide !== slide || pointRun.point !== point) {
    setPointRun({ slide, point, caption: 0, captionsApplied: pointRun.captionsApplied + 1, cuesApplied: pointRun.cuesApplied + 1 })
    if (!playing) setNarrating(true)
  }

  const current = points[point - 1]
  const captionIndex = Math.min(pointRun.caption, current.captions.length - 1)
  const caption = current.captions[captionIndex]

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

  const readAgain = useCallback(() => setPointRun((p) => ({ ...p, captionsApplied: p.captionsApplied + 1 })), [])
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
        setNarrating(true)
        readAgain()
      }
    },
    [playing, replay, readAgain],
  )

  const pace = useMemo(() => paceOf(caption, current, voice), [caption, current, voice])
  const running = playing || narrating

  const latestAdvance = useLatest(advance)

  useEffect(() => {
    if (!running) return
    return runPace(pace, () => latestAdvance.current())
  }, [running, pace, pointRun.captionsApplied])

  useVoiceOnFirstPress(voice && running, readAgain)

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
