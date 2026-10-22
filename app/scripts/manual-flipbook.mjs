import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import {
  manual,
  manualPages,
  manualBackCover,
} from '../src/components/manual-flipbook/content/manualContent.ts'
import { planFor } from '../src/components/manual-flipbook/engine/spreadPlan.ts'

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
})
const server = await createServer({
  mode: 'test',
  server: { host: '127.0.0.1', port: 0 },
})
await server.listen()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
const url = server.resolvedUrls.local[0]

async function scrollToProgress(progress) {
  const target = await page
    .locator('#manual-preview')
    .evaluate(
      (el, value) =>
        el.getBoundingClientRect().top +
        window.scrollY +
        value * (el.clientHeight - window.innerHeight),
      progress,
    )
  // Wheel input exercises ordinary scrolling rather than calling app internals.
  const current = await page.evaluate(() => window.scrollY)
  await page.mouse.move(20, 400)
  await page.mouse.wheel(0, target - current)
  await page.waitForFunction((y) => Math.abs(window.scrollY - y) < 3, target)
  // Let the last fraction of Lenis inertia finish before measuring transforms
  // or computing the next wheel delta from the current browser position.
  await page.waitForFunction(
    () => !document.documentElement.classList.contains('lenis-smooth'),
  )
}

async function expectPage(number) {
  await page.waitForFunction(
    (expected) =>
      document
        .querySelector('[data-manual-page]')
        ?.getAttribute('data-manual-page') === String(expected) &&
      document.querySelector('[data-manual-busy]')?.dataset.manualBusy ===
        'false',
    number,
  )
  // Page/state events fire before the engine paints the final flat leaf.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
}

async function expectMirroredTravel() {
  const viewport = page.viewportSize()
  const runway = await page
    .locator('#manual-preview')
    .evaluate((el) => el.clientHeight - innerHeight)
  const arrivals = []
  for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
    await scrollToProgress(((fraction - 1) * viewport.height) / runway)
    // Let Motion consume the wheel event and paint its derived transforms.
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    )
    const x = await page
      .locator('.manual-motion')
      .evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
      )
    arrivals.push(x)
    if (fraction === 0) {
      await expectPage(0)
      await page.locator('.manual-title-page').waitFor({ state: 'visible' })
      const cover = await page.locator('.manual-title-page').boundingBox()
      assert.ok(
        cover.x + cover.width <= 0,
        'Entrance starts fully outside the left edge',
      )
    }
    assert.ok(
      Math.abs(x + 1.1 * viewport.width * (1 - fraction)) < 4,
      `Entrance follows scroll linearly at ${fraction}: x=${x}`,
    )
  }
  for (const [index, fraction] of [0, 0.25, 0.5, 0.75, 1].entries()) {
    await scrollToProgress(0.8 + fraction * 0.2)
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    )
    const x = await page
      .locator('.manual-motion')
      .evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
      )
    assert.ok(
      Math.abs(x + arrivals[4 - index]) < 4,
      'Entry mirrors exit travel',
    )
    if (fraction === 1) {
      const book = await page.locator('.manual-book-frame').boundingBox()
      assert.ok(
        book.x >= viewport.width,
        'Exit finishes fully outside the right edge',
      )
    }
  }
}

try {
  await page.goto(url)
  await page.locator('#manual-preview').waitFor({ timeout: 5000 })
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.stf__parent').waitFor()
  await expectMirroredTravel()
  assert.equal(
    await page
      .locator(
        '#manual-preview a, #manual-preview button:not(.manual-ascii-art)',
      )
      .count(),
    0,
    'The preview has no reading toggle or footer link',
  )
  assert.equal(await page.locator('.manual-scroll-nudge').innerText(), 'Scroll')
  assert.equal(
    await page.locator('.manual-support').count(),
    0,
    'No MAP support panel',
  )
  // The stage is already mostly visible, but has not reached its pinned position.
  await scrollToProgress(-0.04)
  await expectPage(0)
  await page.waitForFunction(
    () =>
      document.querySelector('[data-manual-busy]')?.dataset.manualBusy ===
      'false',
  )
  const entrance = await page.locator('.manual-motion').evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      x: new DOMMatrixReadOnly(style.transform).m41,
      opacity: style.opacity,
    }
  })
  const enteringCover = await page.locator('.manual-title-page').boundingBox()
  assert.ok(
    enteringCover.x < 1440 &&
      enteringCover.x + enteringCover.width > 0 &&
      enteringCover.y < 1000 &&
      enteringCover.y + enteringCover.height > 0,
    'Cover is visible before the section pins',
  )
  assert.ok(
    entrance.x < -250,
    'Entrance travels inward from beyond the left edge',
  )
  assert.equal(entrance.opacity, '1', 'Book does not fade into the background')
  await scrollToProgress(0.06)
  const clearance = await page.evaluate(() => {
    const header = document.querySelector('header')
    const heading = document.querySelector('.manual-heading-row')
    const footer = document.querySelector('.manual-scroll-nudge')
    return {
      headingTop: Math.round(heading.getBoundingClientRect().top),
      headerBottom: Math.round(header.getBoundingClientRect().bottom),
      footerBottom: Math.round(footer.getBoundingClientRect().bottom),
      viewport: window.innerHeight,
    }
  })
  assert.ok(
    clearance.headingTop >= clearance.headerBottom,
    `Heading clears the navbar (${clearance.headingTop} >= ${clearance.headerBottom})`,
  )
  assert.ok(
    clearance.footerBottom <= clearance.viewport,
    'Footer stays on screen while pinned',
  )
  await expectPage(0)
  async function expectBookShape(face, spread = false) {
    await page.waitForFunction(
      () =>
        document.querySelector('[data-manual-busy]')?.dataset.manualBusy ===
        'false',
    )
    const shape = await page.evaluate(
      ({ face, spread }) => {
        const paper = document.querySelector('.manual-book-paper')
        const visible = document.querySelector(face).getBoundingClientRect()
        const shadow =
          document
            .querySelector('.manual-book-shadow')
            ?.getBoundingClientRect() ?? paper.getBoundingClientRect()
        const book = spread ? paper.getBoundingClientRect() : visible
        return {
          center: book.x + book.width / 2,
          width: book.width,
          shadowWidth: shadow.width,
          shadowLeft: shadow.x,
          left: book.x,
          spine: Number(
            getComputedStyle(document.querySelector('.manual-spine')).opacity,
          ),
        }
      },
      { face, spread },
    )
    assert.ok(Math.abs(shape.center - 720) < 3, 'Visible book is centered')
    assert.ok(
      Math.abs(shape.shadowWidth - shape.width) < 3 &&
        Math.abs(shape.shadowLeft - shape.left) < 3,
      'Shadow follows the visible paper, including closed covers',
    )
    assert.equal(
      shape.spine,
      spread ? 1 : 0,
      'Only the open spread has a central gutter',
    )
  }
  await expectBookShape('.manual-title-page')
  await scrollToProgress(0.2)
  await expectPage(1)
  await expectBookShape('.manual-letter-page', true)
  await scrollToProgress(0.36)
  await expectPage(3)
  await scrollToProgress(0.44)
  await expectPage(5)
  await scrollToProgress(0.58)
  await expectPage(7)
  await scrollToProgress(0.7)
  await expectPage(9)
  await scrollToProgress(0.79)
  await expectPage(manualBackCover)
  await expectBookShape('.manual-art-page')
  const copy = await page.locator('.manual-letter-copy p').allTextContents()
  assert.equal(
    copy.join(' ').replace(/\s+/g, ' ').trim(),
    manual.letter.join(' '),
    'Pagination preserves the entire original letter',
  )
  assert.equal(
    await page.locator('.manual-letter-page').count(),
    5,
    'Letter uses five white reading pages',
  )
  assert.equal(await page.locator('.manual-canvas-page').count(), 5)
  assert.equal(
    await page
      .locator('.manual-canvas-page .manual-letter-copy, .manual-letter-title')
      .count(),
    0,
  )
  assert.equal(
    await page.locator('[data-letter-page="9"] .manual-signature').count(),
    1,
  )
  await scrollToProgress(0.06)
  await expectPage(0)
  // Reverse while the first turn is still running. Latest position must win.
  await scrollToProgress(0.2)
  await scrollToProgress(0.06)
  await expectPage(0)
  await page.waitForTimeout(1000)
  await expectPage(0)
  // Skipping both scroll thresholds must still settle into a centered cover.
  await scrollToProgress(0.79)
  await expectPage(manualBackCover)
  await expectBookShape('.manual-art-page')
  await scrollToProgress(0.06)
  await expectPage(0)
  await expectBookShape('.manual-title-page')
  await scrollToProgress(0.94)
  const exit = await page.locator('.manual-motion').evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      x: new DOMMatrixReadOnly(style.transform).m41,
      opacity: style.opacity,
    }
  })
  assert.ok(exit.x > 100, 'Book exits to the right')
  assert.equal(exit.opacity, '1')
  for (const [width, height] of [
    [320, 568],
    [320, 900],
    [700, 900],
    [1001, 900],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto(url)
    await page.locator('[data-manual-page]').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await expectMirroredTravel()
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `overflow at ${width}`,
    )
    const desktop = width >= 1001 && height >= 800
    const plan = planFor(desktop)
    for (const [step, i] of plan.heads.entries()) {
      if (step === 0) continue
      await scrollToProgress(plan.thresholds[step - 1] + 0.005)
      await expectPage(i)
      const canvasVisible =
        i < manualBackCover &&
        (desktop || manualPages[i - 1]?.kind === 'canvas')
      assert.equal(
        await page
          .getByRole('button', { name: /Interactive ASCII art/ })
          .count(),
        canvasVisible ? 1 : 0,
        `Only settled visible canvas controls are exposed on page ${i}`,
      )
      if (manualPages[i - 1]?.kind === 'reading') {
        const layout = await page
          .locator(`[data-letter-page="${i}"]`)
          .evaluate((el) => {
            const copy = el.querySelector('.manual-letter-copy')
            const footer = el.querySelector('.manual-letter-folio')
            const signature = el.querySelector('.manual-signature')
            const content = el
              .querySelector('.manual-letter-content')
              .getBoundingClientRect()
            const area = el
              .querySelector('.manual-reading-area')
              .getBoundingClientRect()
            const number = el.querySelector('.manual-page-number')
            return {
              font: parseFloat(getComputedStyle(copy).fontSize),
              copyBottom: (signature ?? copy).getBoundingClientRect().bottom,
              footerTop: footer.getBoundingClientRect().top,
              pageHeight: el.getBoundingClientRect().height,
              topSpace: content.top - area.top,
              bottomSpace: area.bottom - content.bottom,
              folioFont: getComputedStyle(footer).fontFamily,
              folioSize: parseFloat(getComputedStyle(footer).fontSize),
              numberSize: parseFloat(getComputedStyle(number).fontSize),
              pillBackground: getComputedStyle(number).backgroundColor,
            }
          })
        assert.ok(layout.font >= 14, `Letter body is readable at ${width}px`)
        assert.ok(
          layout.copyBottom < layout.footerTop,
          `Page ${i} text does not overlap the folio at ${width}x${height}: ${JSON.stringify(layout)}`,
        )
        assert.ok(
          layout.topSpace >= 0 && layout.bottomSpace >= 0,
          `Page ${i} fits its reading area at ${width}x${height}`,
        )
        assert.ok(
          Math.abs(layout.topSpace - layout.bottomSpace) < 2,
          `Page ${i} is vertically centered at ${width}x${height}`,
        )
        assert.ok(
          layout.folioFont.includes('Cascadia Mono') &&
            layout.folioSize < layout.font,
          'Folio is smaller and uses Cascadia Mono',
        )
        assert.ok(
          layout.numberSize < layout.folioSize &&
            layout.pillBackground !== 'rgba(0, 0, 0, 0)',
          'Page numbers use a smaller highlighted pill',
        )
      }
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.locator('.manual-stage-grid > .manual-reading').waitFor()
  assert.equal(await page.locator('.stf__parent').count(), 0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.locator('.stf__parent').waitFor()
  await page.getByRole('link', { name: 'About', exact: true }).click()
  await page.getByRole('link', { name: 'Home', exact: true }).click()
  await page.locator('.stf__parent').waitFor()
  assert.equal(await page.locator('.stf__parent').count(), 1)
  // A reload restores scroll without waiting through every preceding spread.
  await page.setViewportSize({ width: 1440, height: 1000 })
  await scrollToProgress(0.44)
  await expectPage(5)
  await page.reload()
  await expectPage(5)
  // Resize within desktop while turning: the keyed engine must restore the
  // current scroll destination rather than leave a detached/busy instance.
  await scrollToProgress(0.58)
  await page.setViewportSize({ width: 1360, height: 1000 })
  await expectPage(7)
  await scrollToProgress(0.79)
  await page.setViewportSize({ width: 700, height: 900 })
  await scrollToProgress(0.36)
  await expectPage(5)
  assert.equal(await page.locator('.stf__parent').count(), 1)
  // Printed pages retain their colors in the site's dark theme. Print uses
  // the reflowing transcript, with the animated surface removed from layout.
  await page.evaluate(() =>
    document.documentElement.setAttribute('data-theme', 'dark'),
  )
  assert.equal(
    await page
      .locator('.manual-letter-inverse')
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    'rgb(43, 68, 142)',
  )
  await page.emulateMedia({ media: 'print' })
  assert.equal(
    await page
      .locator('.manual-motion')
      .evaluate((el) => getComputedStyle(el).display),
    'none',
  )
  assert.equal(
    await page
      .locator('.manual-transcript')
      .evaluate((el) => getComputedStyle(el).position),
    'static',
  )
  assert.deepEqual(errors, [])
  console.log(
    'Manual preview: five white reading pages, five blue canvases, preserved copy, cover geometry, scroll turns, reversal, mobile, reduced motion, and route lifecycle pass.',
  )
} finally {
  await browser.close()
  await server.close()
}
