import type { ReactNode } from 'react'
import './modes.css'

type SheetTabsProps = {
  tabs: ReadonlyArray<string>
  active: number
  children?: ReactNode
}

export function SheetTabs({ tabs, active, children }: SheetTabsProps) {
  return (
    <div className="modes-tabs">
      {tabs.map((tab, index) => (
        <span key={tab} className="modes-tab" data-active={index === active ? '' : undefined} aria-hidden="true">
          {tab}
        </span>
      ))}
      {children && <span className="modes-tab-actions">{children}</span>}
    </div>
  )
}
