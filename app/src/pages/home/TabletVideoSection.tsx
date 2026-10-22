import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import NotebookSurface from '#/components/NotebookSurface'
import './TabletVideoSection.css'

const compactQuery = '(max-width: 480px)'
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const matches = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches

export default function TabletVideoSection() {
  const section = useRef<HTMLElement>(null)
  const [compact, setCompact] = useState(() => matches(compactQuery))
  const [reducedMotion, setReducedMotion] = useState(() => matches(reducedMotionQuery))
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], ['72vh', '0vh', '0vh', '-72vh'])
  const rotateX = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [compact ? 26 : 42, 0, 0, compact ? -26 : -38])
  const rotateY = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [-60, 0, 0, 60])
  const rotate = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [compact ? 1 : 4, 0, 0, compact ? -1 : -3])
  const scale = useTransform(scrollYProgress, [0, 0.48, 0.52, 1], [0.78, 1, 1, 0.78])

  useEffect(() => {
    const compactMedia = window.matchMedia(compactQuery)
    const reducedMotionMedia = window.matchMedia(reducedMotionQuery)
    const update = () => {
      setCompact(compactMedia.matches)
      setReducedMotion(reducedMotionMedia.matches)
    }
    update()
    compactMedia.addEventListener('change', update)
    reducedMotionMedia.addEventListener('change', update)
    return () => {
      compactMedia.removeEventListener('change', update)
      reducedMotionMedia.removeEventListener('change', update)
    }
  }, [])

  return (
    <NotebookSurface as="section" tone="inverse" ref={section} className="tablet-video-section notebook-section" aria-label="Project video" data-reduced-motion={reducedMotion}>
      <div className="tablet-video-stage">
        <div className="tablet-video-perspective page-wrap">
          <motion.div className="tablet-video-motion" style={reducedMotion ? undefined : { y, rotateX, rotateY, rotate, scale }}>
            <div className="tablet-video-frame">
              <span className="tablet-video-camera" aria-hidden="true" />
              <span className="tablet-video-button tablet-video-button--volume-one" aria-hidden="true" />
              <span className="tablet-video-button tablet-video-button--volume-two" aria-hidden="true" />
              <span className="tablet-video-button tablet-video-button--power" aria-hidden="true" />
              <div className="tablet-video-screen">
                <iframe src="https://www.youtube-nocookie.com/embed/_H9tByQyBv8" title="Dramas of Discrimination video" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </NotebookSurface>
  )
}
