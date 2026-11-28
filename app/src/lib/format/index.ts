export function twoDigit(n: number): string {
  return String(n).padStart(2, '0')
}
