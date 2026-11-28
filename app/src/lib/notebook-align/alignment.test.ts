import assert from 'node:assert/strict'
import { test } from 'node:test'
import { offsetToNextRule, snapBaselineToRule } from './alignment.ts'

test('baselines snap to the nearest half-row rule', () => {
  const row = 28
  assert.equal(snapBaselineToRule(14, row), 14)
  assert.equal(snapBaselineToRule(42, row), 42)
  assert.equal(snapBaselineToRule(15, row), 14)
  assert.equal(snapBaselineToRule(41, row), 42)
})

test('fractional baselines keep the exact px offset the marker measured', () => {
  const row = 28
  assert.equal(snapBaselineToRule(1811.09375, row), 1806)
  assert.equal(snapBaselineToRule(1811.09375, row) - 1811.09375, -5.09375)
  assert.equal(snapBaselineToRule(1811.5, row), 1806)
})

test('halfway baselines round to the nearer rule, ties going up', () => {
  const row = 28
  assert.equal(snapBaselineToRule(28, row), 42)
})

test('padding reaches the next whole-row rule from any start', () => {
  const row = 28
  assert.equal(offsetToNextRule(0, row), 0)
  assert.equal(offsetToNextRule(28, row), 0)
  assert.equal(offsetToNextRule(1, row), 27)
  assert.equal(offsetToNextRule(27.5, row), 0.5)
  assert.equal(offsetToNextRule(13.25, row), 14.75)
})

test('padding handles starts above the origin', () => {
  const row = 28
  assert.equal(offsetToNextRule(-1, row), 1)
  assert.equal(offsetToNextRule(-28, row), 0)
  assert.equal(offsetToNextRule(-13.5, row), 13.5)
})
