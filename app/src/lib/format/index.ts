/** A count or position as two digits, the way the notebook numbers things: 3 → "03". */
export function twoDigit(n: number): string {
  return String(n).padStart(2, '0')
}
