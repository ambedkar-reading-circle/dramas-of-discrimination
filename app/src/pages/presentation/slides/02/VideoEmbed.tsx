import { useRef } from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import TabletVideoFrame from '#/components/TabletVideoFrame'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { useSlideDirection } from '../../hooks/useSlideDirection'
import { useFilmCue } from './useFilmCue'

// The tablet slides in from beyond the viewport's edge and out past the other,
// following the reader: forward it enters from the right and leaves to the
// left, back the reverse. The names match the slide frame's variants, so the
// stage's enter and exit drive the tablet.
const swing: Variants = {
  enter: (dir: number) => ({ x: `${100 * dir}vw`, rotateX: 60, rotateY: -28 * dir, rotate: 2 * dir, scale: 0.9 }),
  center: {
    x: '0vw',
    rotateX: 0,
    rotateY: 0,
    rotate: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 18, mass: 1 },
  },
  exit: (dir: number) => ({
    x: `${-100 * dir}vw`,
    rotateX: -60,
    rotateY: 28 * dir,
    rotate: -2 * dir,
    scale: 0.9,
    transition: { duration: 0.6, ease: [0.5, 0, 0.75, 0] },
  }),
}
const fade: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export function VideoEmbed() {
  const reducedMotion = usePrefersReducedMotion()
  const direction = useSlideDirection()
  const film = useRef<HTMLIFrameElement>(null)
  useFilmCue(film)
  return (
    <div className="presentation-video">
      <motion.div className="presentation-video-motion" custom={direction} variants={reducedMotion ? fade : swing}>
        <TabletVideoFrame ref={film} />
      </motion.div>
    </div>
  )
}
