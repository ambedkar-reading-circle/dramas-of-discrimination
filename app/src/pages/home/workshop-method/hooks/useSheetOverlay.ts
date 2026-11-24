import { useRef, useState } from 'react'
import type { RefCallback } from 'react'
import { targetKey } from '../content/sheetOverlay'
import type { OverlayKind, OverlayTarget } from '../content/sheetOverlay'

/** What every sticker needs to open the overlay and say that it controls it. */
export interface OverlayTriggerProps {
  ref: RefCallback<HTMLButtonElement>
  open: boolean
  controlsId: string
  onToggle: () => void
}

/** Hands a sticker its trigger props, by kind and position. */
export type TriggerFor = (
  kind: OverlayKind,
  index: number,
) => OverlayTriggerProps

/**
 * Which sticker on the open sheet has laid something over it. The choice
 * belongs to one act: moving to another act shows nothing until a sticker
 * there is tapped. Closing returns focus to the sticker that opened it.
 */
export function useSheetOverlay(active: number | null, overlayId: string) {
  const [overlay, setOverlay] = useState<
    (OverlayTarget & { act: number }) | null
  >(null)
  const triggers = useRef(new Map<string, HTMLButtonElement>())
  // One ref callback per sticker, kept across renders, so React does not
  // detach and reattach every sticker's ref on each render.
  const refCallbacks = useRef(new Map<string, RefCallback<HTMLButtonElement>>())
  const shown: OverlayTarget | null =
    active !== null && overlay?.act === active ? overlay : null

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
    setOverlay(null)
    requestAnimationFrame(() => trigger?.focus({ preventScroll: true }))
  }

  const triggerFor: TriggerFor = (kind, index) => {
    const key = targetKey({ kind, index })
    const open = shown !== null && targetKey(shown) === key
    return {
      ref: refFor(key),
      open,
      controlsId: overlayId,
      onToggle: () => {
        if (active === null) return
        setOverlay(open ? null : { act: active, kind, index })
      },
    }
  }

  return { shown, close, triggerFor }
}
