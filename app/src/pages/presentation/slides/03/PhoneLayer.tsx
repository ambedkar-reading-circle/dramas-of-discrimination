import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { RevealLayer, revealSurface } from '#/components/Reveal'
import { TabletFrame } from '#/components/TabletVideoFrame'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { embedUrl } from './content/circles'
import type { ReadingCircle } from './content/circles'

interface PhoneLayerProps {
  host: HTMLElement | null
  circle: ReadingCircle | null
}

const rise: Variants = {
  away: { y: '110vh', rotateX: 35, rotate: 4, scale: 0.92 },
  shown: { y: 0, rotateX: 0, rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 110, damping: 18 } },
  gone: { y: '110vh', rotateX: -25, rotate: -3, scale: 0.92, transition: { duration: 0.45, ease: [0.5, 0, 0.75, 0] } },
}

const fade: Variants = {
  away: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.15 } },
  gone: { opacity: 0, transition: { duration: 0.15 } },
}

export function PhoneLayer({ host, circle }: PhoneLayerProps) {
  return (
    <RevealLayer host={host} className="circle-phone-layer">
      {circle && <Phone key={circle.key} circle={circle} />}
    </RevealLayer>
  )
}

function Phone({ circle }: { circle: ReadingCircle }) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.div {...revealSurface} className="circle-phone" variants={reduce ? fade : rise} initial="away" animate="shown" exit="gone">
      <TabletFrame orientation="portrait">
        <iframe src={embedUrl(circle.post)} title={`${circle.name} on Instagram`} loading="lazy" />
      </TabletFrame>
    </motion.div>
  )
}
