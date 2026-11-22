export interface ColorChannels {
  r: number
  g: number
  b: number
}

const RGB_PATTERN = /rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/
const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function parseHex(digits: string): ColorChannels {
  const expanded =
    digits.length === 3
      ? digits
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : digits
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  }
}

export function parseColorChannels(color: string): ColorChannels | null {
  const trimmed = color.trim()
  const hex = HEX_PATTERN.exec(trimmed)
  if (hex) return parseHex(hex[1])
  const rgb = RGB_PATTERN.exec(trimmed)
  if (!rgb) return null
  return {
    r: Number(rgb[1]),
    g: Number(rgb[2]),
    b: Number(rgb[3]),
  }
}
