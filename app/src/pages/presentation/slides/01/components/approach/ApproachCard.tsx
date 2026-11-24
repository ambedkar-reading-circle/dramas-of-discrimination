import type { ApproachMethod } from '../../types'
import ApproachCell from './ApproachCell'

export default function ApproachCard({ method }: { method: ApproachMethod }) {
  return (
    <ApproachCell side={method.side} className="grid min-w-[12rem] gap-[calc(var(--notebook-row)/16)] bg-surface-warm px-[1.1rem] pt-[calc(0.425*var(--notebook-row))] pb-[calc(0.375*var(--notebook-row))] text-start">
      <p className="font-title text-[0.8125rem] tracking-[0.13em] text-stage-red uppercase">{method.name}</p>
      <p className="text-[1.125rem]">{method.gain}</p>
      <p className="text-[0.9375rem] text-ink-soft italic">{method.cost}</p>
    </ApproachCell>
  )
}
