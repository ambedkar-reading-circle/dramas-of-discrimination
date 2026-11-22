import { createContext, useContext, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useMediaQuery } from '#/lib/useMediaQuery'
import { createInkResolver } from './ink.ts'
import { createPencilRenderer } from './createPencilRenderer.ts'
import { usePointerTrace } from './usePointerTrace.ts'
import type { PointerTrace, TrailRenderer } from './types.ts'
import './PencilTrail.css'

const PencilTraceContext = createContext<PointerTrace | null>(null)

export function PencilTraceProvider({ children }: { children: ReactNode }) {
  const trace = usePointerTrace()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  return <PencilTraceContext.Provider value={reducedMotion ? null : trace}>{children}</PencilTraceContext.Provider>
}

export function PencilSheet() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<TrailRenderer | null>(null)
  const trace = useContext(PencilTraceContext)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const surface = canvas?.closest('[data-pencil-surface]')
    if (!trace || !canvas || !(surface instanceof HTMLElement)) return
    const renderer = createPencilRenderer({
      canvas,
      surface,
      resolveInk: createInkResolver(),
    })
    rendererRef.current = renderer
    const unsubscribe = trace.subscribe(renderer)
    return () => {
      unsubscribe()
      renderer.dispose()
      rendererRef.current = null
    }
  }, [trace])

  useEffect(() => {
    rendererRef.current?.clear()
  }, [pathname])

  if (!trace) return null
  return <canvas ref={canvasRef} className="pencil-sheet" aria-hidden="true" />
}
