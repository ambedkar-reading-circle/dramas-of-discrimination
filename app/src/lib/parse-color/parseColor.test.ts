import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseColorChannels } from './parseColor.ts'

test('parses rgb() and rgba() computed colors', () => {
  assert.deepEqual(parseColorChannels('rgb(19, 24, 87)'), {
    r: 19,
    g: 24,
    b: 87,
  })
  assert.deepEqual(parseColorChannels('rgba(255, 254, 238, 0.85)'), {
    r: 255,
    g: 254,
    b: 238,
  })
})

test('parses hex colors and expands shorthand', () => {
  assert.deepEqual(parseColorChannels('#131857'), { r: 19, g: 24, b: 87 })
  assert.deepEqual(parseColorChannels('#ffffee'), { r: 255, g: 255, b: 238 })
  assert.deepEqual(parseColorChannels('#fff'), { r: 255, g: 255, b: 255 })
})

test('returns null for unsupported notations', () => {
  assert.equal(parseColorChannels('color(srgb 0.1 0.2 0.3)'), null)
  assert.equal(parseColorChannels('currentColor'), null)
})
