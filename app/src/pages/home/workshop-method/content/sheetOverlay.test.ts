import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  excerptLabels,
  worksheetLabels,
  pageRange,
  resolveOverlay,
  stepLabel,
} from './sheetOverlay.ts'
import type { WorkshopActivity } from './workshopActivities.ts'

const photo = (src: string) => ({
  src,
  alt: `alt ${src}`,
  caption: `caption ${src}`,
})

const activity: WorkshopActivity = {
  name: 'PartTime',
  title: 'Group formation',
  duration: 30,
  preview: '',
  summary: '',
  steps: [
    { text: 'Pair up.', photos: [photo('a.jpg')] },
    { text: 'Pool examples.' },
    { text: 'Map actors.', photos: [photo('b.jpg'), photo('c.jpg')] },
  ],
  prompt: '',
  manual: [
    { part: 'A', pages: [8, 9] },
    { part: 'B', pages: [10, 11] },
  ],
  worksheets: [
    { kind: 'manual', label: 'Blank sheet', pages: [18, 19] },
    { kind: 'photo', label: 'Filled sheet', photo: photo('sheet.jpg') },
  ],
}

test('pageRange names one page or a span', () => {
  assert.equal(pageRange([]), '')
  assert.equal(pageRange([7]), 'p. 7')
  assert.equal(pageRange([8, 9]), 'pp. 8–9')
})

test('nothing open resolves to no overlay', () => {
  assert.equal(resolveOverlay(activity, null), null)
})

test('a manual sticker lays out its excerpt, named with its part', () => {
  assert.deepEqual(resolveOverlay(activity, { kind: 'manual', index: 1 }), {
    type: 'pages',
    key: 'pages:10-11',
    ariaLabel: 'PartTime B, pp. 10–11 of the manual. Tap to put them away.',
    name: 'PartTime B',
    pages: [10, 11],
  })
})

test('a step lays out its own photographs, marked with its number', () => {
  assert.deepEqual(resolveOverlay(activity, { kind: 'photo', index: 2 }), {
    type: 'prints',
    key: 'prints:b.jpg|c.jpg',
    ariaLabel: 'Step 03, photographs from a workshop. Tap to put them away.',
    name: 'Step 03, photographs from a workshop',
    mark: '03',
    photos: [photo('b.jpg'), photo('c.jpg')],
  })
})

test('a step without photographs resolves to no overlay', () => {
  assert.equal(resolveOverlay(activity, { kind: 'photo', index: 1 }), null)
})

test('the blank worksheet opens as manual pages, the filled one as a print', () => {
  assert.deepEqual(resolveOverlay(activity, { kind: 'worksheet', index: 0 }), {
    type: 'pages',
    key: 'pages:18-19',
    ariaLabel:
      'PartTime worksheet, pp. 18–19 of the manual. Tap to put them away.',
    name: 'PartTime worksheet',
    pages: [18, 19],
  })
  assert.deepEqual(resolveOverlay(activity, { kind: 'worksheet', index: 1 }), {
    type: 'prints',
    key: 'prints:sheet.jpg',
    ariaLabel:
      'PartTime worksheet, filled in at a workshop. Tap to put them away.',
    name: 'PartTime worksheet, filled in at a workshop',
    photos: [photo('sheet.jpg')],
  })
})

test('an index past the end resolves to no overlay', () => {
  assert.equal(resolveOverlay(activity, { kind: 'manual', index: 5 }), null)
  assert.equal(resolveOverlay(activity, { kind: 'worksheet', index: 5 }), null)
})

test('sticker labels', () => {
  assert.deepEqual(excerptLabels('IntroTime', { pages: [6, 7] }), {
    label: 'Pages from the manual',
    detail: 'pp. 6–7 ↗',
    ariaLabel: 'IntroTime: pages from the manual, pp. 6–7',
  })
  assert.equal(
    excerptLabels('PartTime', { part: 'A', pages: [8, 9] }).label,
    'Manual · Part A',
  )
  assert.equal(
    worksheetLabels('PartTime', activity.worksheets![0]).ariaLabel,
    'PartTime worksheet, blank: pages from the manual, pp. 18–19',
  )
  assert.equal(
    worksheetLabels('PartTime', activity.worksheets![1]).detail,
    'From a workshop ↗',
  )
  assert.equal(
    stepLabel(0, activity.steps[0]),
    '01. Pair up. (photograph from a workshop)',
  )
  assert.equal(
    stepLabel(2, activity.steps[2]),
    '03. Map actors. (2 photographs from a workshop)',
  )
})

test('switching between overlays changes the key', () => {
  const pages = resolveOverlay(activity, { kind: 'manual', index: 0 })!
  const prints = resolveOverlay(activity, { kind: 'photo', index: 0 })!
  assert.notEqual(pages.key, prints.key)
  assert.equal(pages.key, 'pages:8-9')
  assert.equal(prints.key, 'prints:a.jpg')
})
