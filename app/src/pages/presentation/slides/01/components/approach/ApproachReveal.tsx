import { useId, useRef, useState } from 'react'
import type { RefObject } from 'react'
import ApproachDiagram from './ApproachDiagram'
import ApproachTrigger from './ApproachTrigger'

function focusNextFrame(target: RefObject<HTMLElement | null>) {
  requestAnimationFrame(() => target.current?.focus({ preventScroll: true }))
}

export default function ApproachReveal() {
  const [open, setOpen] = useState(false)
  const diagramId = useId()
  const diagram = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  const show = () => {
    setOpen(true)
    focusNextFrame(diagram)
  }

  const hide = () => {
    setOpen(false)
    focusNextFrame(trigger)
  }

  return (
    <div className="grid justify-items-center *:[grid-area:1/1]">
      <ApproachTrigger ref={trigger} controlsId={diagramId} open={open} onOpen={show} />
      <ApproachDiagram ref={diagram} id={diagramId} open={open} onClose={hide} />
    </div>
  )
}
