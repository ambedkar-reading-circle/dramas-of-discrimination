import { useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { asciiFrame, initialAsciiInput } from '../engine/asciiField'
import { useAsciiCanvas } from '../hooks/useAsciiCanvas'
import type { AsciiVariant } from '../engine/asciiPatterns'

export function ManualAsciiCanvas({ number, id, active, variant }: { number: number; id: string; active: boolean; variant: AsciiVariant }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const input = useRef({ ...initialAsciiInput })
  const [seed] = useState(() => Math.random() * Math.PI * 2 + number)
  const fallback = useMemo(() => asciiFrame(36, 44, 0, seed, undefined, variant), [seed, variant])
  useAsciiCanvas(canvas, active, seed, variant, input)

  function navigate(event: KeyboardEvent<HTMLButtonElement>) {
    const steps: Partial<Record<string, [number, number]>> = { ArrowLeft: [-0.08, 0], ArrowRight: [0.08, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] }
    const step = steps[event.key]
    if (step) {
      event.preventDefault()
      input.current.x = Math.max(0, Math.min(1, input.current.x + step[0]))
      input.current.y = Math.max(0, Math.min(1, input.current.y + step[1]))
      input.current.strength = 1
    } else if (event.key === 'Home') {
      event.preventDefault()
      input.current = { ...initialAsciiInput }
    }
  }

  return (
    <button
      type="button"
      className="manual-ascii-art"
      data-ascii-variant={variant}
      aria-label={`Interactive ASCII art ${number}`}
      aria-describedby={`${id}-instructions`}
      onClick={() => {
        input.current.phase = input.current.phase === 0 ? 1 : 0
      }}
      onKeyDown={navigate}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        input.current.x = (event.clientX - bounds.left) / bounds.width
        input.current.y = (event.clientY - bounds.top) / bounds.height
        input.current.strength = 1
      }}
      onPointerLeave={() => {
        input.current.strength = 0
      }}
    >
      <span className="sr-only" id={`${id}-instructions`}>
        Move the pointer or use arrow keys to bend the ASCII flow. Press Enter or Space to change the flow. Press Escape to return to reading.
      </span>
      <pre className="manual-ascii-fallback" aria-hidden="true">
        {fallback}
      </pre>
      <canvas ref={canvas} className="manual-ascii-canvas" aria-hidden="true" />
    </button>
  )
}
