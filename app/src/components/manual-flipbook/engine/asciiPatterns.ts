export const asciiVariants = [
  'turbulence',
  'marbling',
  'crossgrain',
  'strata',
  'diffusion',
] as const
export type AsciiVariant = (typeof asciiVariants)[number]

// Keep these fields in sync with asciiShader.ts so fallback and GPU renderers
// preserve the same page identity, including when WebGL is unavailable.
export function patternDensity(
  x: number,
  y: number,
  time: number,
  variant: AsciiVariant,
): number {
  let wave: number
  switch (variant) {
    case 'turbulence':
      wave = Math.sin(
        x * 9 +
          2 * Math.sin(y * 4 + time) +
          Math.sin(x * 4 - y * 3 - time * 0.6),
      )
      break
    case 'marbling':
      wave = Math.sin(
        x * 5 +
          y * 3 +
          3 * Math.sin(y * 3 + Math.sin(x * 3 + time * 0.4)) +
          time * 0.7,
      )
      break
    case 'crossgrain':
      wave =
        Math.sin(x * 16 + Math.sin(y * 7 + time)) *
        Math.cos(y * 13 + Math.sin(x * 5 - time * 0.8))
      break
    case 'strata':
      wave = Math.sin(
        y * 13 +
          Math.sin(x * 5 + time) +
          0.7 * Math.sin(x * 11 - y * 3 - time * 0.6),
      )
      break
    case 'diffusion':
      wave =
        Math.sin(
          x * 10 +
            y * 8 +
            time * 0.5 +
            2 * Math.sin(x * 4 - y * 5 - time * 0.7),
        ) * Math.cos(x * 7 - y * 9 + Math.sin(y * 4 + time))
      break
  }
  // A full-field bias keeps most cells legible without losing pockets of blue.
  // No radial envelope: texture continues through the edges of every page.
  return 0.58 + 0.5 * wave
}
