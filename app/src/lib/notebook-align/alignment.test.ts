import assert from 'node:assert/strict'
import { test } from 'node:test'
import { offsetToNextRule, snapBaselineToRule } from './alignment.ts'

test('baselines snap to the nearest half-row rule', () => {
  const row = 28
  // Baseline exactly on a rule stays put.
  assert.equal(snapBaselineToRule(14, row), 14)
  assert.equal(snapBaselineToRule(42, row), 42)
  // A baseline 1px past a rule is still nearest to that rule.
  assert.equal(snapBaselineToRule(15, row), 14)
  // A baseline 1px before the next rule rounds forward to it.
  assert.equal(snapBaselineToRule(41, row), 42)
})

test('fractional baselines keep the exact px offset the marker measured', () => {
  const row = 28
  // 1811.09375 is a real measured baseline: rules sit at 1806 and 1834.
  assert.equal(snapBaselineToRule(1811.09375, row), 1806)
  // Offsets computed by consumers are rule - baseline.
  assert.equal(snapBaselineToRule(1811.09375, row) - 1811.09375, -5.09375)
  // Still nearer the lower rule at .5px past it.
  assert.equal(snapBaselineToRule(1811.5, row), 1806)
})

test('halfway baselines round to the nearer rule, ties going up', () => {
  const row = 28
  // 28 is exactly between rules 14 and 42; Math.round goes up.
  assert.equal(snapBaselineToRule(28, row), 42)
})

test('padding reaches the next whole-row rule from any start', () => {
  const row = 28
  assert.equal(offsetToNextRule(0, row), 0)
  assert.equal(offsetToNextRule(28, row), 0)
  assert.equal(offsetToNextRule(1, row), 27)
  assert.equal(offsetToNextRule(27.5, row), 0.5)
  // Fractional starts keep fractional padding.
  assert.equal(offsetToNextRule(13.25, row), 14.75)
})

test('padding handles starts above the origin', () => {
  const row = 28
  // -1 is one row-above-origin plus 27: needs 1px to reach the next rule.
  assert.equal(offsetToNextRule(-1, row), 1)
  assert.equal(offsetToNextRule(-28, row), 0)
  assert.equal(offsetToNextRule(-13.5, row), 13.5)
})
