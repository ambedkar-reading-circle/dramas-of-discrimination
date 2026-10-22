import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { motion, useMotionValueEvent, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import type { BookDriver } from './types/flipbook-types'
import { ManualPage } from './components/ManualPages'
import { useManualFlipbook } from './hooks/useManualFlipbook'
import { manualBackCover } from './content/manualContent'
import { ManualPageState } from './context/ManualPageState'

// page-flip 2.0.7 ships TS source but no declarations. Keep the small surface we
// use typed without pulling its non-strict source into the application's build.
interface FlipBookHandle {
  pageFlip: () =>
    | {
        getFlipController: () => object | undefined
        getState: () => string
        flip: (page: number) => void
        turnToPage: (page: number) => void
      }
    | undefined
}

export default function ManualBook({ desktop, progress }: { desktop: boolean; progress: MotionValue<number> }) {
  const host = useRef<HTMLDivElement>(null)
  const book = useRef<FlipBookHandle>(null)
  const driver = useMemo<BookDriver>(
    () => ({
      canTurn() {
        const engine = book.current?.pageFlip()
        return Boolean(engine?.getFlipController() && engine.getState() === 'read')
      },
      turnTo(page) {
        book.current?.pageFlip()?.flip(page)
      },
      jumpTo(page) {
        book.current?.pageFlip()?.turnToPage(page)
      },
    }),
    [],
  )
  const { page, busy, shape, sync, loaded, changeState, turnProgress, setPaused } = useManualFlipbook(progress, desktop, driver)
  const canvasRoots = useRef(new WeakSet<HTMLElement>())
  const returnToReading = useCallback(() => {
    if (host.current?.contains(document.activeElement)) {
      document.getElementById('manual-preview')?.focus({ preventScroll: true })
    }
    setPaused(false)
  }, [setPaused])
  const x = useTransform(shape, [0, 1, 2], ['-25%', '0%', '25%'])
  const shadowLeft = useTransform(shape, [0, 1, 2], ['50%', '0%', '0%'])
  const shadowWidth = useTransform(shape, [0, 1, 2], ['50%', '100%', '50%'])
  const spineOpacity = useTransform(shape, [0, 1, 2], [0, 1, 0])
  const [width, setWidth] = useState(0)
  const [inStage, setInStage] = useState(() => progress.get() > 0 && progress.get() < 0.8)
  useMotionValueEvent(progress, 'change', (value) => setInStage(value > 0 && value < 0.8))
  useEffect(() => {
    if (!inStage) returnToReading()
  }, [inStage, returnToReading])
  const pages = useMemo(
    () =>
      Array.from({ length: manualBackCover + 1 }, (_, index) => (
        <div key={index}>
          <ManualPage index={index} />
        </div>
      )),
    [],
  )

  useEffect(() => {
    const element = host.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry.contentRect.width / (desktop ? 2 : 1))
      returnToReading()
      setWidth(nextWidth)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [desktop, returnToReading])

  useEffect(() => {
    const element = host.current
    if (!element) return
    // Portrait curls clone a leaf's DOM. Those copies must remain decorative,
    // even if copied just before React disables the outgoing canvas.
    const observer = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          const canvas = node.matches('[data-canvas-page]') ? node : node.querySelector<HTMLElement>('[data-canvas-page]')
          if (canvas && !canvasRoots.current.has(canvas)) {
            node.inert = true
            node.setAttribute('aria-hidden', 'true')
            node.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'))
            const original = [...element.querySelectorAll<HTMLElement>('[data-canvas-page]')].find((candidate) => canvasRoots.current.has(candidate) && candidate.dataset.pageId === canvas.dataset.pageId)
            const source = original?.querySelector('canvas')
            const copy = canvas.querySelector('canvas')
            if (source && copy && source.dataset.asciiRenderer) {
              // cloneNode doesn't copy canvas pixels. Preserve the last shader
              // frame on the temporary portrait curl without another renderer.
              copy.getContext('2d')?.drawImage(source, 0, 0)
            }
          }
        }
    })
    observer.observe(element, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="manual-reader" data-manual-page={page} data-manual-busy={busy}>
      <div
        className="manual-book-frame"
        ref={host}
        data-notebook-independent
        onFocusCapture={() => {
          setPaused(true)
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused(false)
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            returnToReading()
          }
        }}
      >
        <motion.div className="manual-book-paper" style={{ x: desktop ? x : 0 }}>
          <motion.div className="manual-book-shadow" style={{ left: desktop ? shadowLeft : 0, width: desktop ? shadowWidth : '100%' }} />
          {width > 0 && (
            <ManualPageState.Provider value={{ page, desktop, busy, inStage, canvasRoots: canvasRoots.current }}>
              <HTMLFlipBook key={`${desktop}-${width}`} ref={book} width={width} height={Math.round((width * 10) / 7)} size="fixed" minWidth={width} maxWidth={width} minHeight={Math.round((width * 10) / 7)} maxHeight={Math.round((width * 10) / 7)} className="manual-flip-engine" style={{ height: Math.round((width * 10) / 7) }} startPage={0} startZIndex={0} usePortrait={!desktop} autoSize={false} showCover useMouseEvents={false} showPageCorners={false} disableFlipByClick={false} clickEventForward={false} mobileScrollSupport={false} swipeDistance={30} drawShadow flippingTime={900} maxShadowOpacity={0.65} onInit={loaded} onFlip={sync} onChangeState={({ data: state }) => changeState(state === 'read')} onTurnProgress={turnProgress}>
                {pages}
              </HTMLFlipBook>
            </ManualPageState.Provider>
          )}
          {desktop && <motion.div className="manual-spine" style={{ opacity: busy ? 0 : spineOpacity }} />}
        </motion.div>
      </div>
    </div>
  )
}
