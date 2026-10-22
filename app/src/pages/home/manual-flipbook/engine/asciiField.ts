import { patternDensity } from './asciiPatterns.ts'
import type { AsciiVariant } from './asciiPatterns.ts'

export { asciiVariants } from './asciiPatterns.ts'

export const asciiGlyphs = ' .:+*#%@'
export type AsciiInput = {
  x: number
  y: number
  strength: number
  phase: number
}
export const initialAsciiInput: AsciiInput = {
  x: 0.5,
  y: 0.5,
  strength: 0,
  phase: 0,
}

// Original procedural field, shared by the static/fallback presentation.
// The WebGL shader evaluates the same five fields on the GPU.
export function asciiDensity(
  x: number,
  y: number,
  aspect: number,
  time: number,
  seed: number,
  input: AsciiInput,
  variant: AsciiVariant = 'turbulence',
) {
  const t = time * 0.35 + seed + input.phase * 2.3
  let px = (x - 0.5) * aspect * 3
  let py = (y - 0.5) * 3
  px += Math.sin(py * 2 + t) * 0.18
  py += Math.cos(px * 1.7 - t * 0.7) * 0.18
  const pointerDistance = Math.hypot(
    (x - input.x) * aspect * 3,
    (y - input.y) * 3,
  )
  const ripple =
    Math.exp(-(pointerDistance ** 2) * 2) *
    Math.cos(pointerDistance * 15 - t * 3) *
    input.strength *
    0.35
  return Math.max(
    0,
    Math.min(0.999, patternDensity(px, py, t, variant) + ripple),
  )
}

export function asciiFrame(
  columns: number,
  rows: number,
  time: number,
  seed: number,
  input = initialAsciiInput,
  variant: AsciiVariant = 'turbulence',
) {
  const aspect = (columns / rows) * 0.72
  return Array.from({ length: rows }, (_row, row) =>
    Array.from(
      { length: columns },
      (_column, column) =>
        asciiGlyphs[
          Math.floor(
            asciiDensity(
              (column + 0.5) / columns,
              (row + 0.5) / rows,
              aspect,
              time,
              seed,
              input,
              variant,
            ) * asciiGlyphs.length,
          )
        ],
    ).join(''),
  ).join('\n')
}
