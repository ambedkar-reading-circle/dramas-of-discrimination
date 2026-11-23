import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useMediaQuery } from '#/lib/use-media-query'
import { ManualReading, spreadCount, spreadIndexForPage } from '#/pages/home/manual-flipbook'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const manualDesktopQuery = '(min-width: 1001px) and (min-height: 800px)'

// The manual engine must stay a deep dynamic import, exactly as on the home page.
const ManualBook = lazy(() => import('#/pages/home/manual-flipbook/ManualBook'))

class ManualEmbedBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <ManualReading /> : this.props.children
  }
}

/** The flipbook, driven live: the presenter turns one spread at a time. */
export function ManualEmbed() {
  const reducedMotion = useMediaQuery(reducedMotionQuery)
  const desktop = useMediaQuery(manualDesktopQuery)
  const host = useRef<HTMLDivElement>(null)
  const [spread, setSpread] = useState(0)
  const count = spreadCount(desktop)

  // The book reports its leaf through data-manual-page; derive the spread from it.
  useEffect(() => {
    const element = host.current
    if (!element) return
    const observer = new MutationObserver(() => {
      const reader = element.querySelector('[data-manual-page]')
      const page = Number(reader?.getAttribute('data-manual-page') ?? '0')
      setSpread(spreadIndexForPage(page, desktop))
    })
    observer.observe(element, { subtree: true, attributeFilter: ['data-manual-page'] })
    return () => observer.disconnect()
  }, [desktop])

  const turn = (target: number) => {
    setSpread(Math.min(Math.max(target, 0), count - 1))
  }

  if (reducedMotion) {
    return (
      <div className="presentation-embed presentation-manual">
        <ManualReading />
      </div>
    )
  }
  return (
    <div className={`presentation-embed presentation-manual ${desktop ? 'manual-desktop' : ''}`}>
      <div ref={host} className="presentation-manual-book">
        <ManualEmbedBoundary>
          <Suspense
            fallback={
              <p className="slide-embed-hint" role="status">
                Opening the manual…
              </p>
            }
          >
            <ManualBook key={desktop ? 'spread' : 'page'} desktop={desktop} spread={spread} />
          </Suspense>
        </ManualEmbedBoundary>
      </div>
      <div className="presentation-manual-controls">
        <button className="slide-nav-button" type="button" onClick={() => turn(spread - 1)} disabled={spread <= 0}>
          <span className="notebook-text" aria-hidden="true">
            ←
          </span>
          <span className="notebook-text">Turn back</span>
        </button>
        <p className="slide-embed-hint">Turn the pages live during the talk.</p>
        <button className="slide-nav-button" type="button" onClick={() => turn(spread + 1)} disabled={spread >= count - 1}>
          <span className="notebook-text">Turn the page</span>
          <span className="notebook-text" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </div>
  )
}
