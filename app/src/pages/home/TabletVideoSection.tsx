import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import NotebookSurface from '#/components/NotebookSurface'
import TabletVideoFrame from '#/components/TabletVideoFrame'
import { useMediaQuery } from '#/lib/use-media-query'
import './TabletVideoSection.css'

const compactQuery = '(max-width: 480px)'
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export default function TabletVideoSection() {
  const section = useRef<HTMLElement>(null)
  const compact = useMediaQuery(compactQuery)
  const reducedMotion = useMediaQuery(reducedMotionQuery)
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], ['72vh', '0vh', '0vh', '-72vh'])
  const rotateX = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [compact ? 26 : 42, 0, 0, compact ? -26 : -38])
  const rotateY = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [-60, 0, 0, 60])
  const rotate = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [compact ? 1 : 4, 0, 0, compact ? -1 : -3])
  const scale = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [0.78, 1, 1, 0.78])

  return (
    <NotebookSurface as="section" tone="inverse" ref={section} className="tablet-video-section notebook-section" aria-label="Project video" data-reduced-motion={reducedMotion}>
      <div className="tablet-video-stage">
        <div className="tablet-video-perspective page-wrap">
          <motion.div className="tablet-video-motion" style={reducedMotion ? undefined : { y, rotateX, rotateY, rotate, scale }}>
            <TabletVideoFrame />
          </motion.div>
        </div>
      </div>
    </NotebookSurface>
  )
}
