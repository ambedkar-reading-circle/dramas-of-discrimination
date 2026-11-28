export function snapBaselineToRule(baseline: number, row: number): number {
  return Math.round((baseline - row / 2) / row) * row + row / 2
}

export function offsetToNextRule(start: number, row: number): number {
  return (row - (((start % row) + row) % row)) % row
}
