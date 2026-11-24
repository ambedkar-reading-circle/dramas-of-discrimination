import { useId } from 'react'
import type { ReactNode } from 'react'

interface CircleGroupProps {
  label: string
  className: string
  children: ReactNode
}

export function CircleGroup({ label, className, children }: CircleGroupProps) {
  const labelId = useId()
  return (
    <section className="circle-group" aria-labelledby={labelId}>
      <p id={labelId} className="circle-group-label">
        {label}
      </p>
      <div className={className}>{children}</div>
    </section>
  )
}
