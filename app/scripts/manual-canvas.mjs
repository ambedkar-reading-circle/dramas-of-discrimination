import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { asciiVariants } from '../src/components/manual-flipbook/engine/asciiPatterns.ts'

const output = resolve(
  process.env.MANUAL_CAPTURE_DIR || 'node_modules/.cache/manual-visual',
)
await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
})
const server = await createServer({
  mode: 'test',
  server: { host: '127.0.0.1', port: 0 },
})
await server.listen()
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  hasTouch: true,
})
page.setDefaultTimeout(10000)
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
async function scroll(progress, expected) {
  const y = await page
    .locator('#manual-preview')
    .evaluate(
      (el, value) =>
        el.getBoundingClientRect().top +
        scrollY +
        value * (el.clientHeight - innerHeight),
      progress,
    )
  await page.mouse.move(20, 400)
  await page.mouse.wheel(0, y - (await page.evaluate(() => scrollY)))
  await page.waitForFunction((y) => Math.abs(scrollY - y) < 3, y)
  if (expected !== undefined)
    await page.waitForFunction(
      (n) =>
        document.querySelector('.manual-reader')?.dataset.manualPage ===
          String(n) &&
        document.querySelector('.manual-reader')?.dataset.manualBusy ===
          'false',
      expected,
    )
}
const art = (number) =>
  page.getByRole('button', {
    name: `Interactive ASCII art ${number}`,
    exact: true,
  })
const pixels = (canvas) => canvas.evaluate((el) => el.toDataURL())
async function checkVariant(number, renderer, size) {
  const variant = asciiVariants[number - 1]
  const button = art(number)
  const canvas = button.locator('canvas[data-ascii-renderer]')
  await canvas.waitFor({ state: 'visible' })
  assert.equal(await button.getAttribute('data-ascii-variant'), variant)
  assert.equal(await canvas.getAttribute('data-ascii-renderer'), renderer)
  if (renderer === 'webgl') {
    const pattern = await canvas.evaluate((element) => {
      const gl = element.getContext('webgl2')
      const program = gl.getParameter(gl.CURRENT_PROGRAM)
      return gl.getUniform(program, gl.getUniformLocation(program, 'u_pattern'))
    })
    assert.equal(
      pattern,
      number - 1,
      'The GPU selects the pattern assigned to this page',
    )
  }
  const before = await pixels(canvas)
  await page.waitForTimeout(300)
  assert.notEqual(
    await pixels(canvas),
    before,
    `${variant} animates in ${renderer}`,
  )
  const coverage = await canvas.evaluate((element) => {
    const sample = document.createElement('canvas')
    sample.width = element.width
    sample.height = element.height
    const context = sample.getContext('2d')
    context.drawImage(element, 0, 0)
    const { data } = context.getImageData(0, 0, sample.width, sample.height)
    const background = getComputedStyle(element)
      .backgroundColor.match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number)
    const columns = Math.max(
      24,
      Math.min(64, Math.round(element.clientWidth / 9)),
    )
    const rows = Math.round(
      ((columns * element.clientHeight) / element.clientWidth) * 0.72,
    )
    const occupied = new Set()
    for (let y = 0; y < sample.height; y++) {
      for (let x = 0; x < sample.width; x++) {
        const pixel = (y * sample.width + x) * 4
        if (
          background.some(
            (channel, index) => Math.abs(data[pixel + index] - channel) > 30,
          )
        ) {
          occupied.add(
            Math.floor((y / sample.height) * rows) * columns +
              Math.floor((x / sample.width) * columns),
          )
        }
      }
    }
    const sheet = element.closest('[data-canvas-page]')
    const grid = occupied.size / (columns * rows)
    return {
      grid,
      page:
        (grid * element.clientWidth * element.clientHeight) /
        (sheet.clientWidth * sheet.clientHeight),
    }
  })
  assert.ok(
    coverage.grid >= 0.8,
    `${variant} visibly fills at least 80% of the grid: ${coverage.grid}`,
  )
  assert.ok(
    coverage.page > 0.5,
    `${variant} extends across more than half the blue page: ${coverage.page}`,
  )
  console.log(
    `${variant} (${renderer}): ${Math.round(coverage.grid * 100)}% grid, ${Math.round(coverage.page * 100)}% page coverage`,
  )
  await button.screenshot({
    path: resolve(output, `ascii-${variant}-${size}.png`),
  })
}
try {
  await page.goto(server.resolvedUrls.local[0])
  await page.locator('.stf__parent').waitFor()
  await page.evaluate(() => document.fonts.ready)
  await scroll(0.2, 1)
  assert.equal(
    await page
      .locator(
        '.manual-letter-kicker, .manual-canvas-caption, .manual-canvas-symbol',
      )
      .count(),
    0,
  )
  assert.equal(
    await page.getByRole('button', { name: /Interactive ASCII art/ }).count(),
    1,
  )
  const first = art(1)
  const canvas = first.locator('canvas')
  await page.waitForFunction(() =>
    Boolean(
      document.querySelector('[data-canvas-page="2"] canvas')?.dataset
        .asciiRenderer,
    ),
  )
  console.log(
    `ASCII renderer: ${await canvas.getAttribute('data-ascii-renderer')}`,
  )
  assert.deepEqual(
    await page
      .locator('.manual-ascii-art')
      .evaluateAll((elements) =>
        elements.map((element) => element.dataset.asciiVariant),
      ),
    [...asciiVariants],
  )
  await checkVariant(1, 'webgl', 'desktop')
  assert.equal(
    await page.locator('canvas[data-ascii-renderer]').count(),
    1,
    'Unvisited pages allocate no renderers',
  )
  const font = await page.locator('[data-letter-page="1"]').evaluate((el) => {
    const copy = getComputedStyle(
      el.querySelector('.manual-letter-copy'),
    ).fontFamily
    return {
      copy,
      folio: getComputedStyle(el.querySelector('.manual-letter-folio'))
        .fontFamily,
    }
  })
  assert.ok(font.copy.includes('Handlee'))
  assert.ok(font.folio.includes('Cascadia Mono'))
  assert.equal(
    await first.evaluate((el) => getComputedStyle(el).fontFamily),
    font.copy,
  )
  const initial = await pixels(canvas)
  await page.waitForTimeout(300)
  assert.notEqual(
    await pixels(canvas),
    initial,
    'The ASCII field moves over time',
  )
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      value: true,
      configurable: true,
    })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  const backgroundFrame = await pixels(canvas)
  await page.waitForTimeout(200)
  assert.equal(
    await pixels(canvas),
    backgroundFrame,
    'Background tabs stop rendering',
  )
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden')
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.waitForTimeout(200)
  assert.notEqual(
    await pixels(canvas),
    backgroundFrame,
    'Returning to the tab resumes the flow',
  )
  const target = await first.boundingBox()
  await page.mouse.move(
    target.x + target.width * 0.72,
    target.y + target.height * 0.3,
  )
  await first.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(100)
  assert.notEqual(
    await pixels(canvas),
    initial,
    'Pointer and keyboard input keep the renderer live',
  )
  assert.equal(
    await first.getAttribute('data-ascii-variant'),
    'turbulence',
    'Changing flow preserves the page pattern',
  )
  assert.equal(
    await page
      .locator('[data-letter-page="1"] .manual-letter-folio span')
      .first()
      .innerText(),
    'Dramas of Discrimination',
  )
  await scroll(0.34)
  await page.waitForTimeout(1100)
  assert.equal(
    await page.locator('.manual-reader').getAttribute('data-manual-page'),
    '1',
    'Focused art pauses page turns',
  )
  await page.keyboard.press('Escape')
  await page.waitForFunction(
    () =>
      document.querySelector('.manual-reader')?.dataset.manualPage === '3' &&
      document.querySelector('.manual-reader')?.dataset.manualBusy === 'false',
  )
  await page
    .locator('[data-letter-page="3"] .rough-annotation path')
    .first()
    .waitFor({ state: 'attached' })
  await checkVariant(2, 'webgl', 'desktop')
  const frozen = await pixels(page.locator('[data-canvas-page="2"] canvas'))
  await page.waitForTimeout(200)
  assert.equal(
    await pixels(page.locator('[data-canvas-page="2"] canvas')),
    frozen,
    'Hidden page rendering is paused',
  )
  await page
    .locator('.manual-book-frame')
    .screenshot({ path: resolve(output, 'reading-canvas-desktop.png') })
  for (const [progress, index] of [
    [0.44, 5],
    [0.58, 7],
    [0.7, 9],
  ]) {
    await scroll(progress, index)
    await page
      .locator(`[data-letter-page="${index}"] .rough-annotation path`)
      .first()
      .waitFor({ state: 'attached' })
    await checkVariant((index + 1) / 2, 'webgl', 'desktop')
    await page
      .locator('.manual-book-frame')
      .screenshot({ path: resolve(output, `annotations-page-${index}.png`) })
  }
  await art(5).focus()
  await scroll(0.94)
  await page.waitForFunction(
    () => document.activeElement?.id === 'manual-heading',
  )
  assert.equal(
    await page.getByRole('button', { name: /Interactive ASCII art/ }).count(),
    0,
  )
  await scroll(0.31, 3)
  await art(2).focus()
  await scroll(-0.1)
  await page.waitForFunction(
    () => document.activeElement?.id === 'manual-heading',
  )
  assert.equal(
    await page.getByRole('button', { name: /Interactive ASCII art/ }).count(),
    0,
  )

  await page.setViewportSize({ width: 320, height: 568 })
  await page.reload()
  await page.locator('.stf__parent').waitFor()
  await page.evaluate(() => document.fonts.ready)
  await scroll(0.49, 7)
  await page
    .locator('[data-letter-page="7"] .rough-annotation path')
    .first()
    .waitFor({ state: 'attached' })
  await page
    .locator('.manual-book-frame')
    .screenshot({ path: resolve(output, 'reading-phone.png') })
  await scroll(0.56, 8)
  const phone = art(4)
  await page.waitForFunction(() =>
    Boolean(
      document.querySelector('[data-canvas-page="8"] canvas')?.dataset
        .asciiRenderer,
    ),
  )
  await phone.tap()
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('Home')
  await page.waitForTimeout(100)
  await page
    .locator('.manual-book-frame')
    .screenshot({ path: resolve(output, 'canvas-phone.png') })
  await page.emulateMedia({ forcedColors: 'active' })
  await page.waitForTimeout(150)
  const forcedPalette = await phone.locator('canvas').evaluate((el) => {
    const sample = document.createElement('canvas')
    sample.width = el.width
    sample.height = el.height
    const context = sample.getContext('2d')
    context.drawImage(el, 0, 0)
    const actual = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3)
    const expected = getComputedStyle(el)
      .backgroundColor.match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number)
    return actual.every(
      (channel, index) => Math.abs(channel - expected[index]) < 2,
    )
  })
  assert.equal(
    forcedPalette,
    true,
    'The shader follows the forced-color background',
  )
  await page.emulateMedia({ forcedColors: 'none' })
  await page.keyboard.press('Escape')
  await scroll(0.64)
  await page.waitForFunction(
    () =>
      document.querySelectorAll('[data-canvas-page="8"] canvas').length === 2,
  )
  const cloneHasPixels = await page
    .locator('[data-canvas-page="8"] canvas')
    .nth(1)
    .evaluate((el) => {
      const context = el.getContext('2d')
      if (!context) return false
      const colors = new Set()
      const data = context.getImageData(0, 0, el.width, el.height).data
      for (let i = 0; i < data.length; i += 4)
        colors.add(`${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}`)
      return colors.size > 2
    })
  assert.equal(cloneHasPixels, true, 'Portrait curls copy the canvas bitmap')
  await page.waitForFunction(
    () =>
      document.querySelector('.manual-reader')?.dataset.manualPage === '9' &&
      document.querySelector('.manual-reader')?.dataset.manualBusy === 'false',
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.locator('.manual-stage-grid > .manual-reading').waitFor()
  assert.equal(await page.locator('.stf__parent').count(), 0)

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === 'webgl2' ? null : getContext.call(this, type, ...args)
    }
  })
  await page.reload()
  await page.locator('.stf__parent').waitFor()
  for (const [index, progress] of [0.16, 0.29, 0.43, 0.56, 0.7].entries()) {
    await scroll(progress, (index + 1) * 2)
    await checkVariant(index + 1, '2d', 'phone-fallback')
  }
  assert.deepEqual(
    await page
      .locator('.manual-ascii-art')
      .evaluateAll((elements) =>
        elements.map((element) => element.dataset.asciiVariant),
      ),
    [...asciiVariants],
    'Page assignments survive reloads and renderer changes',
  )
  assert.deepEqual(errors, [])
  console.log(
    `Manual ASCII: five distinct GPU/fallback patterns, Handlee, animation, keyboard/pointer/touch, hidden-page pause, focus exits, curl bitmap, phone, and reduced motion pass. Captures: ${output}`,
  )
} finally {
  await browser.close()
  await server.close()
}
