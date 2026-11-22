import assert from 'node:assert/strict'
import { test } from 'node:test'
import { asciiFrame, asciiVariants } from './asciiField.ts'

test('ASCII fields are deterministic for a frozen time and differ across pages', () => {
  const frame = asciiFrame(36, 44, 0, 1)
  assert.equal(asciiFrame(36, 44, 0, 1), frame)
  assert.notEqual(asciiFrame(36, 44, 0, 2), frame)
  assert.equal(frame.split('\n').length, 44)
  assert.ok(frame.split('\n').every((row) => row.length === 36))
  assert.ok(frame.includes('+'))
  assert.ok(frame.includes(' '))
})

test('time, pointer movement, and changing flow each affect the field', () => {
  const frame = asciiFrame(36, 44, 0, 1)
  assert.notEqual(asciiFrame(36, 44, 2, 1), frame)
  assert.notEqual(
    asciiFrame(36, 44, 0, 1, { x: 0.8, y: 0.2, strength: 1, phase: 0 }),
    frame,
  )
  assert.notEqual(
    asciiFrame(36, 44, 0, 1, { x: 0.5, y: 0.5, strength: 0, phase: 1 }),
    frame,
  )
})

test('each page pattern produces a distinct field at the same time and seed', () => {
  const frames = asciiVariants.map((variant) =>
    asciiFrame(36, 44, 0, 1, undefined, variant),
  )
  assert.equal(new Set(frames).size, 5)
  for (const frame of frames) {
    assert.ok(frame.includes(' '), 'The field has breathing room')
    assert.ok(/[+*#%@]/.test(frame), 'The field has visible ASCII detail')
  }
})

test('abstract textures fill most of the canvas with substantial visible detail', () => {
  for (const variant of asciiVariants) {
    for (const [time, seed] of [
      [0, 1],
      [2, 4],
      [13, 6],
    ]) {
      for (const [columns, rows] of [
        [36, 44],
        [60, 70],
      ]) {
        const frame = asciiFrame(
          columns,
          rows,
          time,
          seed,
          {
            x: 0.8,
            y: 0.2,
            strength: 1,
            phase: 0,
          },
          variant,
        ).replaceAll('\n', '')
        const occupied =
          [...frame].filter((glyph) => glyph !== ' ').length / frame.length
        const detail =
          [...frame].filter((glyph) => /[+*#%@]/.test(glyph)).length /
          frame.length
        assert.ok(
          occupied >= 0.8,
          `${variant} fills at least 80% of its cells (${occupied})`,
        )
        assert.ok(
          detail >= 0.45,
          `${variant} has strong detail across at least 45% of its cells (${detail})`,
        )
      }
    }
  }
})

for (const variant of asciiVariants) {
  test(`${variant} moves and responds to input without changing its assigned pattern`, () => {
    const frame = asciiFrame(36, 44, 0, 1, undefined, variant)
    assert.notEqual(asciiFrame(36, 44, 2, 1, undefined, variant), frame)
    assert.notEqual(
      asciiFrame(
        36,
        44,
        0,
        1,
        { x: 0.8, y: 0.2, strength: 1, phase: 0 },
        variant,
      ),
      frame,
    )
    assert.notEqual(
      asciiFrame(
        36,
        44,
        0,
        1,
        { x: 0.5, y: 0.5, strength: 0, phase: 1 },
        variant,
      ),
      frame,
    )
  })
}
