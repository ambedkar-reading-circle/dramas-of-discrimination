import { useEffect, useLayoutEffect, useReducer, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import type { Writer } from './content/actorMap'
import { motionUnlessReduced } from './motion'
import './modes.css'

const cursorSpring: Transition = { type: 'spring', stiffness: 150, damping: 20, mass: 0.6, opacity: { duration: 0.3 } }

export type CursorAt<TPhase extends string> = Readonly<{
  writer: Writer
  phase: TPhase | 'idle'
}>

type Point = Readonly<{ x: number; y: number }>

type WriterCursorsProps<TPhase extends string> = {
  container: RefObject<HTMLElement | null>
  writers: ReadonlyArray<CursorAt<TPhase>>
  named: boolean
}

export function WriterCursors<TPhase extends string>({ container, writers, named }: WriterCursorsProps<TPhase>) {
  const reducedMotion = usePrefersReducedMotion()
  const [points, setPoints] = useState<Readonly<Partial<Record<string, Point>>>>({})
  const [, rescrolled] = useReducer((count: number) => count + 1, 0)

  useEffect(() => {
    const element = container.current
    if (!element) return
    element.addEventListener('scroll', rescrolled, { capture: true, passive: true })
    return () => element.removeEventListener('scroll', rescrolled, { capture: true })
  }, [container])

  useLayoutEffect(() => {
    const element = container.current
    if (!element) return
    const box = element.getBoundingClientRect()
    const scale = box.width / element.offsetWidth || 1
    const next: Record<string, Point> = {}
    for (const { writer } of writers) {
      const caret = element.querySelector(`[data-caret="${writer.id}"]`)
      if (!caret) continue
      const rect = caret.getBoundingClientRect()
      next[writer.id] = { x: (rect.left - box.left) / scale + element.scrollLeft, y: (rect.top - box.top) / scale + element.scrollTop }
    }
    setPoints((current) =>
      Object.keys(next).length === Object.keys(current).length &&
      Object.entries(next).every(([id, point]) => {
        const was = current[id]
        return was && Math.abs(was.x - point.x) < 0.5 && Math.abs(was.y - point.y) < 0.5
      })
        ? current
        : next,
    )
  })

  return (
    <div className="modes-cursors" aria-hidden="true">
      {writers.map(({ writer, phase }) => {
        const caret = points[writer.id]
        if (!caret) return null
        const point = phase === 'idle' ? { x: caret.x + 14, y: caret.y + 6 } : caret
        return (
          <motion.span key={writer.id} className="modes-cursor" style={{ '--who': writer.color } as CSSProperties} initial={{ ...point, opacity: 0 }} animate={{ ...point, opacity: phase === 'idle' ? 0.5 : 1 }} transition={motionUnlessReduced(reducedMotion, cursorSpring)}>
            <svg viewBox="0 0 20 22" width="18" height="20">
              <path d="M2 1.5v16.2l4.6-4.3 3 6.6 2.9-1.3-3-6.5h6.3z" fill="var(--who)" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            {named && phase !== 'idle' && <span className="modes-flag">{writer.name}</span>}
          </motion.span>
        )
      })}
    </div>
  )
}

export function WriterCaret<TPhase extends string>({ at }: { at: CursorAt<TPhase> }) {
  return <span className="modes-caret" data-caret={at.writer.id} data-phase={at.phase} style={{ '--who': at.writer.color } as CSSProperties} />
}
