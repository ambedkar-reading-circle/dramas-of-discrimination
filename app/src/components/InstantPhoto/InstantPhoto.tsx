import { motion, useIsPresent } from 'motion/react'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { fadeTransition, faded, flightTransition, offscreen, settled } from './flight'
import type { InstantPhotoProps } from './types'

export default function InstantPhoto({ src, alt, caption, direction, tilt = 0, controls }: InstantPhotoProps) {
  const reduce = usePrefersReducedMotion()
  const isPresent = useIsPresent()
  const away = reduce ? faded(tilt) : offscreen(direction, tilt)

  return (
    <motion.figure
      className="instant-photo"
      style={{ pointerEvents: isPresent ? 'auto' : 'none' }}
      initial={away}
      animate={settled(tilt)}
      exit={away}
      transition={reduce ? fadeTransition : flightTransition}
      onTap={controls.close}
    >
      <img src={src} alt={alt} draggable={false} />
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  )
}
