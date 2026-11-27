import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { manualPageSrc } from '../content/workshopActivities'
import type { OverlayContent } from '../content/sheetOverlay'
import { backdropTransition, fadeTransition, pageAway, pageLaid, pageTransition, randomTilt, tilts } from '../content/overlayChoreography'
import type { TiltRange } from '../content/overlayChoreography'

interface SheetOverlayProps {
  id: string
  content: OverlayContent | null
  onClose: () => void
}

/** The region's class for each kind of overlay. */
const regionClass: Record<OverlayContent['type'], string> = {
  pages: 'method-manual',
  prints: 'method-manual method-step-photo',
}

/**
 * Lays manual pages or photographic prints over the open sheet. Tapping
 * anywhere puts them away; each item drops in on its own, slightly askew.
 */
export function SheetOverlay({ id, content, onClose }: SheetOverlayProps) {
  const reduceMotion = usePrefersReducedMotion()
  const spread = useRef<HTMLDivElement>(null)
  const key = content?.key ?? null

  // Focus follows a sticker tapped on the sheet. Laid out from outside (the
  // deck's notes), the spread leaves focus where it is, on the player.
  useEffect(() => {
    const element = spread.current
    if (key === null || !element) return
    if (element.closest('dialog')?.contains(document.activeElement)) element.focus({ preventScroll: true })
  }, [key])

  return (
    <AnimatePresence>
      {content && (
        <motion.div key={key} id={id} className={regionClass[content.type]} role="region" aria-label={content.ariaLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduceMotion ? fadeTransition : backdropTransition} onClick={onClose}>
          {content.type === 'pages' ? (
            <div ref={spread} tabIndex={-1} className="method-manual-spread" style={{ '--page-count': content.pages.length } as CSSProperties}>
              {content.pages.map((page, order) => (
                <LaidFigure key={page} className="method-manual-page" order={order} tilt={tilts.page} reduceMotion={reduceMotion}>
                  <img src={manualPageSrc(page)} alt={`${content.name}: page ${page} of the Dramas of Discrimination manual`} draggable={false} />
                  <figcaption>{page}</figcaption>
                </LaidFigure>
              ))}
            </div>
          ) : (
            <div ref={spread} tabIndex={-1} className="method-step-photo-spread" style={{ '--print-count': content.photos.length } as CSSProperties}>
              {content.photos.map((photo, order) => (
                <LaidFigure key={photo.src} className="method-step-photo-print" order={order} tilt={tilts.print} reduceMotion={reduceMotion}>
                  <img src={photo.src} alt={photo.alt} draggable={false} />
                  <figcaption>
                    {content.mark && <span aria-hidden="true">{content.mark}</span>}
                    {photo.caption}
                  </figcaption>
                </LaidFigure>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface LaidFigureProps {
  className: string
  /** Position in the spread; later items land a beat after earlier ones. */
  order: number
  tilt: TiltRange
  reduceMotion: boolean
  children: ReactNode
}

/** One page or print, sliding in from the side and settling at its own tilt. */
function LaidFigure({ className, order, tilt, reduceMotion, children }: LaidFigureProps) {
  const [lean] = useState(() => randomTilt(tilt))
  return (
    <motion.figure className={className} initial={pageAway(lean, reduceMotion)} animate={pageLaid(lean, reduceMotion)} exit={pageAway(lean, reduceMotion)} transition={pageTransition(order, reduceMotion)}>
      {children}
    </motion.figure>
  )
}
