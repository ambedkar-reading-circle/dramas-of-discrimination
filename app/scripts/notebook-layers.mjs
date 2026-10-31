import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'

// Real components rendered in a test-only Vite route; no copied surface CSS.
const fixture = `
import '/src/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import NotebookSurface from '/src/components/NotebookSurface.tsx'
import { NotebookProvider } from '/src/components/NotebookMargins.tsx'
const h = React.createElement
const box = (left, top, width, height, extra = {}) => ({position:'absolute', left, top, width, height, ...extra})
window.contentRenders = 0
function Ink() { window.contentRenders++; return h('div', {id:'ink', style:box(80,220,150,100,{background:'#00ffff',boxShadow:'0 20px #00ffff'})}) }
const root = createRoot(document.querySelector('#fixture'))
window.unmountFixture = () => root.unmount()
root.render(h(React.StrictMode, null, h(NotebookProvider, null,
  h(NotebookSurface, {as:'main', id:'sheet', style:box(0,0,500,350)},
    h(NotebookSurface, {id:'plain', paper:'plain', style:box(80,100,150,100)}),
    h(NotebookSurface, {id:'inverse', tone:'inverse', style:box(260,100,200,180)}), h(Ink)),
  h(NotebookSurface, {as:'section', id:'rounded', style:box(600,0,300,350,{borderRadius:80})}),
  h(NotebookSurface, {id:'elevated', paper:'plain', style:box(100,400,280,250,{zIndex:2})}),
  h(NotebookSurface, {id:'later', style:box(250,500,280,250)}),
  h('div', {style:box(700,400,300,700)}, h(NotebookSurface, {id:'sticky', style:{position:'sticky',top:20,height:200}}))
)))
document.body.style.cssText = 'min-height:1600px;margin:0;background:white'
document.documentElement.style.setProperty('--margin-red', 'rgb(255, 0, 0)')
`
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
})
const server = await createServer({
  mode: 'test',
  server: { host: '127.0.0.1', port: 0 },
  plugins: [
    {
      name: 'notebook-layer-fixture',
      resolveId(id) {
        if (id === 'virtual:notebook-layers') return '\0notebook-layers'
      },
      load(id) {
        if (id === '\0notebook-layers') return fixture
      },
      configureServer(vite) {
        vite.middlewares.use(
          '/__notebook-layers',
          async (_request, response) => {
            response.setHeader('Content-Type', 'text/html')
            response.end(
              await vite.transformIndexHtml(
                '/__notebook-layers',
                '<!doctype html><html><body><div id="fixture"></div><script type="module" src="/@id/virtual:notebook-layers"></script></body></html>',
              ),
            )
          },
        )
      },
    },
  ],
})
await server.listen()
const page = await browser.newPage({
  reducedMotion: 'reduce',
  viewport: { width: 1440, height: 900 },
})
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
const base = server.resolvedUrls.local[0]
const output = 'node_modules/.cache/notebook-layers'
await mkdir(output, { recursive: true })

async function settle() {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
}
async function navigate(path) {
  await page.goto(new URL(path, base).href)
  await page.locator('main').waitFor()
  await page.evaluate(() => document.fonts.ready)
  await settle()
}
async function point(x, y, type = 'pointermove') {
  // Synthetic pointer coordinates avoid unrelated hover colors in pixel comparisons.
  await page.evaluate(
    ({ x, y, type }) =>
      window.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y })),
    { x, y, type },
  )
  await settle()
}
async function hide(type = 'blur') {
  await page.evaluate(
    (event) =>
      (event === 'blur' ? window : document.documentElement).dispatchEvent(
        new Event(event),
      ),
    type,
  )
  await settle()
}
async function pixels(clip) {
  const png = await page.screenshot({ clip, animations: 'disabled' })
  return page.evaluate(async (data) => {
    const image = new Image()
    image.src = 'data:image/png;base64,' + data
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)
    return Array.from(
      context.getImageData(0, 0, image.width, image.height).data,
    )
  }, png.toString('base64'))
}
async function unchanged(clip, x, y, message) {
  await hide()
  const before = await pixels(clip)
  await point(x, y)
  const after = await pixels(clip)
  // Paper blend compositing can round color channels by one when a layer appears.
  const differences = after.filter(
    (value, index) => Math.abs(value - before[index]) > 2,
  ).length
  if (differences) await page.screenshot({ path: `${output}/failure.png` })
  assert.equal(differences, 0, message)
}
async function changed(clip, x, y, message) {
  await hide()
  const before = await pixels(clip)
  await point(x, y)
  const after = await pixels(clip)
  assert.ok(
    after.some((value, index) => Math.abs(value - before[index]) > 2),
    message,
  )
}
function inside(rect, padding = 8) {
  return {
    x: Math.ceil(rect.x + padding),
    y: Math.ceil(rect.y + padding),
    width: Math.floor(rect.width - 2 * padding),
    height: Math.floor(rect.height - 2 * padding),
  }
}
async function aligned(x, y) {
  const failures = await page.locator('.notebook-decoration').evaluateAll(
    (layers, { x, y }) =>
      layers.flatMap((layer) => {
        if (!layer.hasAttribute('data-margin-guides'))
          return ['Inactive decoration']
        const vertical = layer
          .querySelector('.notebook-margin-vertical')
          .getBoundingClientRect()
        const horizontal = layer
          .querySelector('.notebook-margin-horizontal')
          .getBoundingClientRect()
        return Math.abs(vertical.x + vertical.width / 2 - x) > 0.6 ||
          Math.abs(horizontal.y + horizontal.height / 2 - y) > 0.6
          ? ['Lost viewport alignment']
          : []
      }),
    { x, y },
  )
  assert.deepEqual(failures, [], 'Every surface shares viewport coordinates')
}

try {
  await navigate('/')
  const button = await page
    .locator('.hero-actions .action-link')
    .first()
    .boundingBox()
  assert.ok(button, 'Hero action is visible')
  // The old implementation paints later sheets' margins over this opaque ink.
  await unchanged(
    { ...inside(button), height: 12 },
    button.x + button.width / 2,
    button.y + 14,
    'Margin from later sheets must not paint across the opaque hero action',
  )
  assert.equal(await page.locator('main.notebook-surface').count(), 1)
  assert.equal(
    await page
      .locator('.manual-section.notebook-surface[data-tone="inverse"]')
      .count(),
    1,
    'Reduced-motion manual has one fallback paper surface',
  )
  assert.equal(
    await page.locator('.manual-section .notebook-decoration').count(),
    1,
  )
  await point(650, 350)
  await page.screenshot({ path: `${output}/hero.png` })
  const labelClip = { x: 0, y: 330, width: 160, height: 16 }
  const allLabels = await pixels(labelClip)
  await page.locator('.notebook-decoration').evaluateAll((layers) => {
    for (const layer of layers)
      if (layer.parentElement.tagName !== 'MAIN')
        layer.style.visibility = 'hidden'
  })
  const mainLabel = await pixels(labelClip)
  assert.equal(
    allLabels.filter((value, index) => Math.abs(value - mainLabel[index]) > 2)
      .length,
    0,
    'Offscreen sheets add no duplicate margin words at the viewport edge',
  )

  for (const path of ['/', '/about']) {
    await navigate(path)
    for (const dark of [false, true]) {
      await page.evaluate(
        (value) =>
          document.documentElement.setAttribute(
            'data-theme',
            value ? 'dark' : 'light',
          ),
        dark,
      )
      const header = await page.locator('header.site-foreground').boundingBox()
      await unchanged(
        inside(header),
        240,
        header.y + header.height / 2,
        'Header covers strokes and words',
      )
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight),
      )
      await settle()
      const footer = await page.locator('footer').boundingBox()
      const visible = {
        x: 0,
        y: Math.max(footer.y, 0),
        width: 1440,
        height: Math.min(footer.height, 900 - Math.max(footer.y, 0)),
      }
      await unchanged(
        inside(visible),
        240,
        visible.y + visible.height / 2,
        'Footer covers strokes and words',
      )
      if (path === '/' && !dark)
        await page.screenshot({ path: `${output}/footer.png` })
      const levels = await page
        .locator('header.site-foreground,footer')
        .evaluateAll((elements) =>
          elements.map((element) => getComputedStyle(element).zIndex),
        )
      assert.deepEqual(
        levels,
        ['50', '50'],
        'Header and footer share the foreground level',
      )
      await aligned(240, visible.y + visible.height / 2)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    for (const media of [{ media: 'print' }, { forcedColors: 'active' }]) {
      await page.emulateMedia(media)
      await point(200, 250)
      assert.ok(
        await page
          .locator('.notebook-decoration')
          .evaluateAll((layers) =>
            layers.every((layer) => getComputedStyle(layer).display === 'none'),
          ),
      )
      assert.ok(
        await page
          .locator('.notebook-surface')
          .evaluateAll((layers) =>
            layers.every(
              (layer) => getComputedStyle(layer).backgroundImage === 'none',
            ),
          ),
      )
      await page.emulateMedia({ media: 'screen', forcedColors: 'none' })
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/', '/about']) {
    await navigate(path)
    await point(120, 240, 'pointerdown')
    await aligned(120, 240)
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth),
      390,
      'No mobile overflow',
    )
    await hide('pointerleave')
    assert.equal(await page.locator('[data-margin-guides]').count(), 0)
    await point(120, 241)
    await hide()
    assert.equal(await page.locator('[data-margin-guides]').count(), 0)
  }

  await page.setViewportSize({ width: 1200, height: 900 })
  await navigate('/__notebook-layers')
  await unchanged(
    { x: 510, y: 120, width: 70, height: 100 },
    540,
    170,
    'Adjacent sheets cannot paint into the gap',
  )
  await unchanged(
    { x: 90, y: 110, width: 130, height: 80 },
    140,
    150,
    'Plain nested paper hides underlying margins',
  )
  await unchanged(
    { x: 90, y: 230, width: 130, height: 80 },
    140,
    270,
    'Ordinary ink covers its own decoration',
  )
  await unchanged(
    { x: 90, y: 322, width: 130, height: 15 },
    140,
    330,
    'Content shadow remains unclipped',
  )
  await unchanged(
    { x: 601, y: 1, width: 18, height: 18 },
    608,
    10,
    'Rounded corner clips its decoration',
  )
  await unchanged(
    { x: 270, y: 520, width: 80, height: 80 },
    300,
    560,
    'Elevated plain sibling covers later notebook paper',
  )
  await changed(
    { x: 280, y: 130, width: 150, height: 100 },
    330,
    180,
    'Inverse nested sheet paints its own margin',
  )
  await changed(
    { x: 680, y: 100, width: 120, height: 100 },
    730,
    150,
    'Adjacent sheet paints its own margin',
  )
  await point(400, 180)
  const renders = await page.evaluate(() => window.contentRenders)
  const word = await page.locator('[data-margin-word]').first().textContent()
  await point(410, 180)
  assert.equal(
    await page.locator('[data-margin-word]').first().textContent(),
    word,
    'Horizontal movement preserves the word',
  )
  assert.equal(
    new Set(await page.locator('[data-margin-word]').allTextContents()).size,
    1,
    'Every clipped label uses the same word',
  )
  await point(420, 181)
  assert.equal(
    await page.evaluate(() => window.contentRenders),
    renders,
    'Pointer movement does not rerender content',
  )
  assert.equal(
    await page.locator('#fixture > .notebook-surface').count(),
    4,
    'Provider adds no DOM wrapper',
  )
  assert.equal(
    await page
      .locator('.notebook-decoration:not([aria-hidden="true"])')
      .count(),
    0,
  )
  assert.equal(await page.locator('#plain .notebook-decoration').count(), 0)
  assert.equal(
    await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--margin-x'),
    ),
    '',
    'Pointer variables stay off the root',
  )
  await page.evaluate(() => window.scrollTo(0, 500))
  await settle()
  await aligned(420, 181)
  assert.equal(
    Math.round((await page.locator('#sticky').boundingBox()).y),
    20,
    'Fixture exercises sticky positioning',
  )
  await page.setViewportSize({ width: 1100, height: 800 })
  await aligned(420, 181)
  // Hide all other copies: the visible sticky sheet must still paint on its own.
  await page.locator('.notebook-decoration').evaluateAll((layers) =>
    layers.forEach((layer) => {
      if (layer.parentElement.id !== 'sticky') layer.style.display = 'none'
    }),
  )
  await changed(
    { x: 750, y: 50, width: 100, height: 100 },
    800,
    100,
    'Sticky decoration remains visible after scrolling',
  )
  await page.evaluate(() => {
    window.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 10, clientY: 10 }),
    )
    window.unmountFixture()
  })
  await settle()
  await point(20, 20)
  assert.equal(
    await page.locator('.notebook-decoration').count(),
    0,
    'Unmount cancels queued painting and releases layers',
  )

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await navigate('/')
  await page
    .locator('.manual-stage.notebook-surface')
    .waitFor({ state: 'attached' })
  assert.equal(
    await page.locator('.manual-section.notebook-surface').count(),
    0,
    'Animated runway is transparent',
  )
  assert.equal(
    await page.locator('.manual-section .notebook-decoration').count(),
    1,
    'Only sticky manual sheet owns decoration',
  )
  await page.locator('.manual-flip-engine').waitFor()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.locator('.manual-section.notebook-surface').waitFor()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page
    .locator('.manual-stage.notebook-surface')
    .waitFor({ state: 'attached' })
  await page.locator('.manual-flip-engine').waitFor()
  await page.evaluate(() => {
    const section = document.querySelector('#manual-preview')
    window.scrollTo(
      0,
      section.getBoundingClientRect().top +
        scrollY +
        0.25 * (section.clientHeight - innerHeight),
    )
  })
  await page.waitForFunction(
    () =>
      document.querySelector('[data-manual-page]')?.dataset.manualPage !==
        '0' &&
      document.querySelector('[data-manual-busy]')?.dataset.manualBusy ===
        'false',
  )
  await settle()
  const book = await page.locator('.manual-book-paper').boundingBox()
  assert.ok(
    book && book.y > 0 && book.y + book.height < 900,
    'Book is pinned inside the viewport',
  )
  await unchanged(
    {
      x: Math.ceil(book.x + 16),
      y: Math.ceil(book.y + 12),
      width: Math.floor(book.width - 32),
      height: 8,
    },
    book.x + book.width / 3,
    book.y + 16,
    'Active crosshair stays behind opaque booklet pages',
  )
  await point(book.x + book.width / 3, book.y + book.height / 3)
  await page.screenshot({ path: `${output}/manual.png` })
  await point(450, 400)
  await aligned(450, 400)
  await page.getByRole('link', { name: 'About', exact: true }).first().click()
  await page.waitForURL('**/about')
  await page.locator('main.notebook-surface').waitFor()
  await point(451, 401)
  await aligned(451, 401)
  assert.equal(
    await page.locator('.manual-stage').count(),
    0,
    'Route change releases manual surfaces',
  )
  const fallback = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  })
  const fallbackErrors = []
  fallback.on('pageerror', (error) => fallbackErrors.push(error.message))
  await fallback.route(/\/ManualBook\.tsx(?:\?|$)/, (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: 'export default function ManualBook() { throw new Error("Notebook test: manual unavailable") }',
    }),
  )
  await fallback.goto(base)
  await fallback
    .locator('.manual-section.notebook-surface[data-tone="inverse"]')
    .waitFor()
  assert.equal(
    await fallback.locator('.manual-section .notebook-decoration').count(),
    1,
    'Book failure leaves one inverse paper surface',
  )
  assert.equal(
    await fallback.locator('.manual-section .manual-reading').count(),
    1,
    'Book failure leaves one readable transcript',
  )
  assert.equal(
    await fallback.locator('.manual-motion').count(),
    0,
    'Book failure removes animated content',
  )
  assert.ok(
    fallbackErrors.every((message) =>
      message.includes('Notebook test: manual unavailable'),
    ),
    'Only the injected book failure may be reported',
  )
  await fallback.close()
  assert.deepEqual(errors, [], 'Browser errors')
  console.log(
    'Notebook layers: pixel overlap, clipping, rounded and plain paper, sticky alignment, routes, themes, mobile, media, and cleanup pass.',
  )
} finally {
  await browser.close()
  await server.close()
}
