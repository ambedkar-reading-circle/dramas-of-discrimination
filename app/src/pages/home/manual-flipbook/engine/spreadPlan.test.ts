import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  manual,
  manualPages,
  readingPages,
  manualBackCover,
} from '../content/manualContent.ts'
import {
  nextHead,
  restoredHead,
  shapeForPage,
  turnTarget,
  planFor,
} from './spreadPlan.ts'

test('the letter moves forward onto five white pages without losing or repeating text', () => {
  assert.equal(readingPages.length, 5)
  assert.equal(manualPages.length, 10)
  assert.equal(manualBackCover, 11)
  assert.equal(
    readingPages
      .flatMap((page) => page.blocks.map((block) => block.text))
      .join(' '),
    manual.letter.join(' '),
  )
  assert.deepEqual(
    readingPages[1].blocks.map((block) => block.text),
    [manual.letter[0].split(/(?<=[.!?])\s+/)[2], manual.letter[1]],
  )
  assert.equal(readingPages[2].blocks[0].text, manual.letter[2])
  assert.equal(readingPages[0].salutation, true)
  assert.equal(readingPages.at(-1)?.signature, true)
  assert.equal(readingPages.filter((page) => page.salutation).length, 1)
  assert.equal(readingPages.filter((page) => page.signature).length, 1)
})

test('each reading page has a following blue canvas, including the closing page', () => {
  assert.deepEqual(
    manualPages.map((page) => page.kind),
    Array.from({ length: 5 }, () => ['reading', 'canvas']).flat(),
  )
  assert.equal(
    new Set(manualPages.map((page) => page.id)).size,
    manualPages.length,
  )
  for (const page of manualPages) assert.equal('title' in page, false)
  for (const page of readingPages) {
    for (const block of page.blocks) {
      let previous = -1
      for (const phrase of block.emphasis ?? []) {
        const index = block.text.indexOf(phrase.text)
        assert.ok(
          index > previous,
          `Emphasized phrase exists in reading order: ${phrase.text}`,
        )
        previous = index
      }
    }
  }
})

for (const desktop of [true, false]) {
  const layout = desktop ? 'desktop' : 'portrait'
  test(`${layout} reaches every page and the back cover before exit`, () => {
    const { heads, thresholds } = planFor(desktop)
    assert.equal(heads.at(-1), manualBackCover)
    assert.equal(thresholds.length, heads.length - 1)
    assert.ok(thresholds.at(-1)! < 0.8)
    assert.ok(
      heads.includes(desktop ? 9 : 10),
      'The final added pair is reachable',
    )
    let desired = 0
    for (const [i, threshold] of thresholds.entries()) {
      assert.equal(nextHead(threshold - 0.001, desired, desktop), desired)
      desired = nextHead(threshold, desired, desktop)
      assert.equal(desired, heads[i + 1])
      assert.equal(restoredHead(threshold, desktop), desired)
      assert.equal(nextHead(threshold - 0.039, desired, desktop), desired)
      assert.equal(nextHead(threshold - 0.041, desired, desktop), heads[i])
    }
    assert.equal(nextHead(1, 0, desktop), manualBackCover)
    assert.equal(nextHead(0, manualBackCover, desktop), 0)
    assert.equal(restoredHead(0, desktop), 0)
    assert.equal(restoredHead(0.79, desktop), manualBackCover)
  })
}

test('turns only advance to neighboring spreads, even across the new final pair', () => {
  assert.equal(turnTarget(0, manualBackCover, true), 1)
  assert.equal(turnTarget(1, manualBackCover, true), 3)
  assert.equal(turnTarget(7, manualBackCover, true), 9)
  assert.equal(turnTarget(9, 0, true), 7)
  assert.equal(turnTarget(10, manualBackCover, false), 11)
  assert.equal(turnTarget(4, 4, false), 4)
})

test('shape follows the cover that is showing', () => {
  assert.equal(shapeForPage(0), 0)
  assert.equal(shapeForPage(1), 1)
  assert.equal(shapeForPage(9), 1)
  assert.equal(shapeForPage(manualBackCover), 2)
})

test('the letter uses every supported annotation style on explicit phrases', () => {
  const types = new Set(
    readingPages.flatMap((page) =>
      page.blocks.flatMap(
        (block) => block.emphasis?.map((phrase) => phrase.type) ?? [],
      ),
    ),
  )
  assert.deepEqual(
    [...types].sort(),
    [
      'underline',
      'highlight',
      'circle',
      'box',
      'bracket',
      'strike-through',
      'crossed-off',
    ].sort(),
  )
})

test('blue pages have stable distinct ASCII patterns in reading order', () => {
  assert.deepEqual(
    manualPages
      .filter((page) => page.kind === 'canvas')
      .map((page) => page.variant),
    ['turbulence', 'marbling', 'crossgrain', 'strata', 'diffusion'],
  )
})
