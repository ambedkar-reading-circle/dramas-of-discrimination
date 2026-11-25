import type { ReactNode } from 'react'
import './modes.css'

type SheetTabsProps = {
  tabs: ReadonlyArray<string>
  /** Index of the open tab. */
  active: number
  /** Actions at the far end of the row. */
  children?: ReactNode
}

/** The guide sheet's tabs, one of them open. They only show where the sheet is, so screen readers skip them. */
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
