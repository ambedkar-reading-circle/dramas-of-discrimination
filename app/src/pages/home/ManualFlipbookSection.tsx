import { Component, createRef, lazy, Suspense, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ManualReading } from '#/components/manual-flipbook'
import NotebookSurface from '#/components/NotebookSurface'
import { useMediaQuery } from '#/lib/useMediaQuery'

const ManualBook = lazy(() => import('#/components/manual-flipbook/ManualBook'))
const desktopQuery = '(min-width: 1001px) and (min-height: 800px)'
const reducedQuery = '(prefers-reduced-motion: reduce)'

class BookFallback extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFailure()
  }
  render() {
    return this.state.failed ? <ManualReading /> : this.props.children
  }
}

export default function ManualFlipbookSection() {
  const reducedMotion = useMediaQuery(reducedQuery)
  const desktop = useMediaQuery(desktopQuery)
  const [failed, setFailed] = useState(false)
  const textMode = reducedMotion || failed
  // Switching between the runway and a reading surface replaces the host.
  // A new ref makes Motion detach from the old host and track the new one.
  const section = useMemo(() => createRef<HTMLElement>(), [textMode])
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  // Arrive with the section; page turns still use only the pinned runway.
  const { scrollYProgress: entrance } = useScroll({ target: section, offset: ['start end', 'start start'] })
  const exit = useTransform(scrollYProgress, [0.8, 1], [0, 1])
  // Mirror the exit's full offscreen travel on arrival, including its tilt.
  const travel = useTransform(() => entrance.get() - 1 + exit.get())
  const x = useTransform(() => `${110 * travel.get()}vw`)
  const rotate = useTransform(() => 6 * travel.get())
  const rotateY = useTransform(() => 60 * travel.get())
  const animated = !textMode
  const Stage = animated ? NotebookSurface : 'div'
  const stage = (
    <Stage {...(animated ? { tone: 'default' as const } : {})} className="manual-stage">
      <div className="manual-stage-grid page-wrap">
        {!textMode && (
          <div className="manual-transcript" data-notebook-independent>
            <ManualReading />
          </div>
        )}
        {textMode ? (
          <ManualReading />
        ) : (
          <BookFallback onFailure={() => setFailed(true)}>
            <motion.div className="manual-motion" style={{ x, rotate, rotateY }}>
              <Suspense
                fallback={
                  <div className="manual-reader">
                    <div className="manual-book-frame">
                      <div className="manual-loading" role="status">
                        Opening the manual…
                      </div>
                    </div>
                  </div>
                }
              >
                <ManualBook key={desktop ? 'spread' : 'page'} desktop={desktop} progress={scrollYProgress} />
              </Suspense>
            </motion.div>
          </BookFallback>
        )}
        {animated && (
          <div className="manual-scroll-nudge">
            <span>Scroll</span>
            <span className="manual-scroll-line" aria-hidden="true" />
          </div>
        )}
      </div>
    </Stage>
  )
  const sectionProps = {
    ref: section,
    id: 'manual-preview',
    className: `manual-section notebook-section ${desktop ? 'manual-desktop' : ''} ${animated ? 'manual-animated' : ''}`,
    'aria-label': 'Manual preview',
    tabIndex: -1,
  }
  return animated ? (
    <section {...sectionProps}>{stage}</section>
  ) : (
    <NotebookSurface as="section" tone="default" {...sectionProps}>
      {stage}
    </NotebookSurface>
  )
}
