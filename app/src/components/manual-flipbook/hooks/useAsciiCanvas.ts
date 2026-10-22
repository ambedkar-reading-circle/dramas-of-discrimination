import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { AsciiInput } from '../engine/asciiField'
import { createAsciiRenderer } from '../engine/asciiRenderer'
import type { AsciiRenderer } from '../engine/asciiRenderer'
import type { AsciiVariant } from '../engine/asciiPatterns'

export function useAsciiCanvas(
  canvas: RefObject<HTMLCanvasElement | null>,
  active: boolean,
  seed: number,
  variant: AsciiVariant,
  input: RefObject<AsciiInput>,
) {
  const renderer = useRef<AsciiRenderer | null>(null)
  const elapsed = useRef(0)

  // The renderer survives page turns, preserving the printed face's last frame.
  // React lifecycle cleanup: https://react.dev/reference/react/useEffect#usage
  useEffect(
    () => () => {
      renderer.current?.dispose()
      renderer.current = null
    },
    [],
  )

  useEffect(() => {
    if (!active) return
    let cancelled = false
    let frame = 0
    let previous = 0
    let ready = false
    const colors = window.matchMedia('(forced-colors: active)')
    function recolor() {
      renderer.current?.colors()
    }
    function tick(now: number) {
      if (cancelled || document.hidden) return
      if (!previous || now - previous >= 1000 / 30) {
        elapsed.current += previous ? Math.min((now - previous) / 1000, 0.1) : 0
        previous = now
        renderer.current?.draw(elapsed.current, input.current)
      }
      frame = requestAnimationFrame(tick)
    }
    function visibility() {
      cancelAnimationFrame(frame)
      previous = 0
      if (ready && !document.hidden) frame = requestAnimationFrame(tick)
    }
    void document.fonts.ready.then(() => {
      if (cancelled || !canvas.current) return
      frame = requestAnimationFrame(() => {
        if (cancelled || !canvas.current) return
        renderer.current ??= createAsciiRenderer(canvas.current, seed, variant)
        if (!renderer.current) {
          canvas.current.dataset.asciiFailed = 'true'
          return
        }
        delete canvas.current.dataset.asciiFailed
        ready = true
        renderer.current.draw(elapsed.current, input.current)
        canvas.current.dataset.asciiRenderer = renderer.current.kind
        if (!document.hidden) frame = requestAnimationFrame(tick)
      })
    })
    document.addEventListener('visibilitychange', visibility)
    colors.addEventListener('change', recolor)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', visibility)
      colors.removeEventListener('change', recolor)
    }
  }, [active, canvas, input, seed, variant])
}
