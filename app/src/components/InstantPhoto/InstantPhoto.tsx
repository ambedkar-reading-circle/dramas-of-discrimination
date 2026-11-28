import { motion, useIsPresent } from 'motion/react'
import { revealSurface } from '#/components/Reveal'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { fadeTransition, faded, flightTransition, offscreen, settled } from './flight'
import type { InstantPhotoProps } from './types'

const onLink = (event: Event) => event.target instanceof Element && event.target.closest('a') !== null

export default function InstantPhoto({ src, alt, caption, href, direction, tilt = 0, controls }: InstantPhotoProps) {
  const reduce = usePrefersReducedMotion()
  const isPresent = useIsPresent()
  const away = reduce ? faded(tilt) : offscreen(direction, tilt)

  return (
    <motion.figure {...revealSurface} className="instant-photo" style={{ pointerEvents: isPresent ? 'auto' : 'none' }} initial={away} animate={settled(tilt)} exit={away} transition={reduce ? fadeTransition : flightTransition} onTap={(event) => onLink(event) || controls.close()}>
      <img src={src} alt={alt} draggable={false} />
      {caption && (
        <figcaption>
          {href ? (
            <a href={href} target="_blank" rel="noreferrer">
              {caption}
            </a>
          ) : (
            caption
          )}
        </figcaption>
      )}
    </motion.figure>
  )
}
