/**
 * Pure notebook-rule arithmetic. A "rule" is a printed line of the notebook
 * grid; every row is one `row` of vertical space. No DOM access here so the
 * math stays unit-testable like the flipbook engine.
 */

/**
 * The nearest rule position for a measured text baseline. Rules sit at
 * half-row offsets (`k * row + row / 2`) so a baseline lands mid-row, which
 * keeps the ink of controls evenly padded between the printed lines.
 */
export function snapBaselineToRule(baseline: number, row: number): number {
  return Math.round((baseline - row / 2) / row) * row + row / 2
}

/**
 * The padding that moves an element top from `start` onto the next whole-row
 * rule. Returns 0 when the top already sits on a rule. Handles fractional and
 * negative starts (elements above the measurement origin).
 */
export function offsetToNextRule(start: number, row: number): number {
  return (row - (((start % row) + row) % row)) % row
}
