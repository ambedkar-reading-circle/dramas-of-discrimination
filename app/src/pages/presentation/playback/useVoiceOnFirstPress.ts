import { useEffect } from 'react'
import { useLatest } from '#/lib/use-latest'

export function useVoiceOnFirstPress(readingAloud: boolean, readAgain: () => void) {
  const latest = useLatest({ readingAloud, readAgain })
  useEffect(() => {
    const activation = typeof navigator !== 'undefined' ? navigator.userActivation : undefined
    if (!activation || activation.hasBeenActive) return
    const events = ['pointerup', 'keyup'] as const
    const stop = () => events.forEach((type) => document.removeEventListener(type, onPress, true))
    function onPress() {
      if (!activation?.hasBeenActive) return
      stop()
      if (latest.current.readingAloud) latest.current.readAgain()
    }
    events.forEach((type) => document.addEventListener(type, onPress, true))
    return stop
  }, [latest])
}
