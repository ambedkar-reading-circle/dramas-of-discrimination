import { useRef } from 'react'
import { motion, useIsPresent } from 'motion/react'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { elasticDrag, fadeTransition, faded, flightTransition, lifted, offscreen, settled } from './flight'
import { isMousePointer } from './pointer'
import type { InstantPhotoProps } from './types'

export default function InstantPhoto({ src, alt, caption, direction, tilt = 0, bounds, controls }: InstantPhotoProps) {
  const reduce = usePrefersReducedMotion()
  const isPresent = useIsPresent()
  const self = useRef<HTMLElement>(null)
  const away = reduce ? faded(tilt) : offscreen(direction, tilt)

  return (
    <motion.figure
      ref={self}
      className="instant-photo"
      style={{ pointerEvents: isPresent ? 'auto' : 'none' }}
      initial={away}
      animate={settled(tilt)}
      exit={away}
      transition={reduce ? fadeTransition : flightTransition}
      drag
      dragConstraints={bounds}
      {...elasticDrag}
      whileDrag={lifted(tilt)}
      onPointerEnter={controls.keep}
      onPointerLeave={(event) => {
        if (isMousePointer(event)) controls.close()
      }}
      onTap={(event) => {
        if (!isMousePointer(event)) controls.close()
      }}
      onDragStart={controls.startDrag}
      onDragEnd={(event) => {
        controls.endDrag()
        if (isMousePointer(event) && !self.current?.matches(':hover')) controls.close()
      }}
    >
      <img src={src} alt={alt} draggable={false} />
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  )
}
