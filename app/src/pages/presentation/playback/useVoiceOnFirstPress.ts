import { useEffect } from 'react'
import { useLatest } from '#/lib/use-latest'

/**
 * A browser lets a page speak only once its visitor has pressed something on it, so a deck opened
 * straight from a link starts with its voice refused, and its captions run on reading time. At the
 * first press, `readAgain` is called while the deck is `readingAloud`, so the caption on screen is
 * read again, aloud now, and the voice carries on from there.
 */
export function useVoiceOnFirstPress(readingAloud: boolean, readAgain: () => void) {
  const latest = useLatest({ readingAloud, readAgain })
  useEffect(() => {
    const activation = typeof navigator !== 'undefined' ? navigator.userActivation : undefined
    if (!activation || activation.hasBeenActive) return
    const events = ['pointerup', 'keyup'] as const
    const stop = () => events.forEach((type) => document.removeEventListener(type, onPress, true))
    function onPress() {
      // Not every key counts as a press (Escape does not): wait for one that does.
      if (!activation?.hasBeenActive) return
      stop()
      if (latest.current.readingAloud) latest.current.readAgain()
    }
    events.forEach((type) => document.addEventListener(type, onPress, true))
    return stop
  }, [latest])
}
