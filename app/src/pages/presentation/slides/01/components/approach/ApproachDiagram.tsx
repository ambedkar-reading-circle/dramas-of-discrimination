import type { KeyboardEvent, Ref } from 'react'
import { Merge, Redo, Undo } from 'lucide-react'
import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { approachLabel, approachResult, forumTheatre, systemsThinking } from '../../content/approachCopy'
import { connectorVariants, diagramVariants } from '../../lib/approachMotion'
import ApproachCard from './ApproachCard'
import ApproachCell from './ApproachCell'

const arrow = { size: 18, strokeWidth: 1.5 }

interface ApproachDiagramProps {
  id: string
  open: boolean
  onClose: () => void
  ref?: Ref<HTMLElement>
}

export default function ApproachDiagram({ id, open, onClose, ref }: ApproachDiagramProps) {
  const reduce = usePrefersReducedMotion()
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return
    event.stopPropagation()
    onClose()
  }

  return (
    <motion.figure ref={ref} id={id} className="m-0 grid justify-items-center gap-[calc(var(--notebook-row)/2)] pt-[calc(var(--notebook-row)/4)] outline-none" aria-label={approachLabel} tabIndex={-1} inert={!open} initial={false} animate={open ? 'open' : 'closed'} variants={diagramVariants(reduce)} onKeyDown={closeOnEscape}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[calc(var(--notebook-row)/2)] max-md:grid-cols-[minmax(0,1fr)]">
        <ApproachCard method={systemsThinking} />
        <motion.span className="flex gap-[0.125rem] text-ink-soft max-md:justify-self-center max-md:rotate-90" variants={connectorVariants} aria-hidden="true">
          <Redo {...arrow} />
          <Undo {...arrow} />
        </motion.span>
        <ApproachCard method={forumTheatre} />
      </div>
      <motion.span className="grid text-ink-soft [&_svg]:rotate-180" variants={connectorVariants} aria-hidden="true">
        <Merge {...arrow} />
      </motion.span>
      <ApproachCell side="result" className="slide-title-taped--inverse bg-hl-bg px-[1.5rem] pt-[calc(0.35*var(--notebook-row))] pb-[calc(0.3*var(--notebook-row))] text-[1.1875rem] text-hl-text">
        {approachResult}
      </ApproachCell>
    </motion.figure>
  )
}
