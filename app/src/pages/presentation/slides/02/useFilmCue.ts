import { useEffect, useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { videoOrigin } from '#/components/TabletVideoFrame'
import { parseCue } from '../../playback/cues'
import { usePlayback } from '../../playback/playback'
import { useSlideCue } from '../../playback/useSlideCue'

/** YouTube's player states, as its iframe API reports them. Buffering, unstarted and cued do not mean the film is playing. */
const ended = 0
const playingState = 1

/** Plays muted if the browser blocks sound this long after the play request. */
const unmuteGraceMs = 2500
/** Gives up on a film that never starts playing, so the deck is not stuck on a blank caption. */
const silentPlayerMs = 7000

function stateOf(data: unknown): number | null {
  let message: unknown = data
  if (typeof data === 'string') {
    try {
      message = JSON.parse(data)
    } catch {
      return null
    }
  }
  if (!message || typeof message !== 'object' || !('event' in message) || !('info' in message)) return null
  const { event, info } = message
  if (event === 'onStateChange' && typeof info === 'number') return info
  if (event === 'infoDelivery' && info && typeof info === 'object' && 'playerState' in info && typeof info.playerState === 'number') return info.playerState
  return null
}

/**
 * Lets playback drive the film on slide 02: `video:play` starts it through
 * the YouTube iframe API, and its end moves the deck on. Pausing the deck
 * pauses the film; any other beat stops it.
 */
export function useFilmCue(frame: RefObject<HTMLIFrameElement | null>) {
  const playback = usePlayback()
  const wanted = useRef(false)
  // The film has been seen playing since it was asked to.
  const confirmed = useRef(false)
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const resolve = useRef(playback?.resolveWait)
  useLayoutEffect(() => {
    resolve.current = playback?.resolveWait
  })

  const post = (message: object) => frame.current?.contentWindow?.postMessage(JSON.stringify({ ...message, id: 1, channel: 'widget' }), videoOrigin)
  const command = (func: string) => {
    // Asking to listen each time is harmless, and covers a player that loaded late.
    post({ event: 'listening' })
    post({ event: 'command', func, args: [] })
  }
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== videoOrigin || event.source !== frame.current?.contentWindow) return
      const state = stateOf(event.data)
      if (state === null) return
      if (state === playingState) {
        confirmed.current = true
        clearTimers()
      }
      if (state === ended && wanted.current) {
        wanted.current = false
        resolve.current?.()
      }
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      clearTimers()
    }
  }, [frame])

  useSlideCue((cue) => {
    clearTimers()
    const parsed = parseCue(cue)
    // Stepping into the film while paused leaves it waiting: play applies the cue again and starts it then.
    if (parsed?.verb === 'video' && parsed.arg === 'play' && playback?.playing === true) {
      wanted.current = true
      confirmed.current = false
      command('playVideo')
      timers.current.push(
        setTimeout(() => {
          command('mute')
          command('playVideo')
        }, unmuteGraceMs),
        setTimeout(() => {
          if (confirmed.current || !wanted.current) return
          wanted.current = false
          resolve.current?.()
        }, silentPlayerMs),
      )
    } else if (wanted.current) {
      wanted.current = false
      command('pauseVideo')
    }
  })

  // The deck paused mid-film: hold the film too. Play re-applies the cue and resumes it.
  const paused = playback?.playing === false
  useEffect(() => {
    if (!paused || !wanted.current) return
    clearTimers()
    command('pauseVideo')
    // `command` only reads refs, so `paused` is the only thing to watch.
  }, [paused])
}
