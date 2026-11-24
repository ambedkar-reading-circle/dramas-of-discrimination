import type { ReactNode } from 'react'
import { joinClasses } from '#/lib/join-classes'
import './TabletFrame.css'

interface TabletFrameProps {
  orientation?: 'landscape' | 'portrait'
  className?: string
  children: ReactNode
}

export default function TabletFrame({ orientation = 'landscape', className, children }: TabletFrameProps) {
  return (
    <div className={joinClasses('tablet-frame', `tablet-frame--${orientation}`, className)}>
      <span className="tablet-frame-camera" aria-hidden="true" />
      <span className="tablet-frame-button tablet-frame-button--volume-one" aria-hidden="true" />
      <span className="tablet-frame-button tablet-frame-button--volume-two" aria-hidden="true" />
      <span className="tablet-frame-button tablet-frame-button--power" aria-hidden="true" />
      <div className="tablet-frame-screen">{children}</div>
    </div>
  )
}
