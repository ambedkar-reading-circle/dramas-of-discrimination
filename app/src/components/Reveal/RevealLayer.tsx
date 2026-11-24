import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'motion/react'
import { joinClasses } from '#/lib/join-classes'

interface RevealLayerProps {
  host: HTMLElement | null
  className?: string
  children: ReactNode
}

export default function RevealLayer({ host, className, children }: RevealLayerProps) {
  if (!host) return null
  return createPortal(
    <div className={joinClasses('reveal-layer', className)}>
      <AnimatePresence>{children}</AnimatePresence>
    </div>,
    host,
  )
}
