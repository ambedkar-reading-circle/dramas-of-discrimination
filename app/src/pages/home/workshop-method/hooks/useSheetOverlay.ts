import { useRef } from 'react'
import type { RefCallback } from 'react'
import { targetKey } from '../content/sheetOverlay'
import type { OverlayKind, OverlayTarget } from '../content/sheetOverlay'

export interface OverlayTriggerProps {
  ref: RefCallback<HTMLButtonElement>
  open: boolean
  controlsId: string
  onToggle: () => void
}

export type TriggerFor = (
  kind: OverlayKind,
  index: number,
) => OverlayTriggerProps

export function useSheetOverlay(
  shown: OverlayTarget | null,
  setShown: (target: OverlayTarget | null) => void,
  overlayId: string,
) {
  const triggers = useRef(new Map<string, HTMLButtonElement>())
  const refCallbacks = useRef(new Map<string, RefCallback<HTMLButtonElement>>())

  const refFor = (key: string) => {
    let callback = refCallbacks.current.get(key)
    if (!callback) {
      callback = (element) => {
        if (element) triggers.current.set(key, element)
        else triggers.current.delete(key)
      }
      refCallbacks.current.set(key, callback)
    }
    return callback
  }

  const close = () => {
    const trigger =
      shown === null ? undefined : triggers.current.get(targetKey(shown))
    setShown(null)
    requestAnimationFrame(() => trigger?.focus({ preventScroll: true }))
  }

  const triggerFor: TriggerFor = (kind, index) => {
    const key = targetKey({ kind, index })
    const open = shown !== null && targetKey(shown) === key
    return {
      ref: refFor(key),
      open,
      controlsId: overlayId,
      onToggle: () => setShown(open ? null : { kind, index }),
    }
  }

  return { close, triggerFor }
}
