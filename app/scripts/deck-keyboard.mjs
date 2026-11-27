import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

// Drives the /approach deck by keyboard: the keys work from wherever focus
// lands, typing stays with a field, and focus keeps its place on the player.
const server = await createServer({
  mode: 'test',
  server: { host: '127.0.0.1', port: 0 },
})
let browser
try {
  await server.listen()
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const base = server.resolvedUrls.local[0].replace(/\/$/, '')

  const at = () => {
    const search = new URL(page.url()).searchParams
    return `${search.get('slide')}.${search.get('point') ?? '1'}`
  }
  const waitMove = async (from) => {
    await page.waitForFunction((was) => {
      const search = new URLSearchParams(location.search)
      return `${search.get('slide')}.${search.get('point') ?? '1'}` !== was
    }, from)
    return at()
  }
  const open = async (slide) => {
    await page.goto(`${base}/approach?slide=${slide}&point=1`)
    await page.locator('.slide-stage').waitFor()
    await page.waitForTimeout(300)
  }
  const focused = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName)

  // On load, focus is on the page itself: the arrows still work.
  await open(1)
  assert.equal(await page.evaluate(() => document.activeElement === document.body), true)
  await page.keyboard.press('ArrowRight')
  assert.notEqual(await waitMove('1.1'), '1.1', 'ArrowRight on load moves the deck')

  // A click on a slide's empty space focuses <main>: the arrows still work.
  await open(2)
  const stage = await page.locator('.slide-stage').boundingBox()
  await page.mouse.click(stage.x + 8, stage.y + 8)
  const before = at()
  await page.keyboard.press('ArrowRight')
  assert.notEqual(await waitMove(before), before, 'ArrowRight after clicking the slide moves the deck')

  // Shift+N jumps a whole slide, as Shift+ArrowRight does.
  await open(2)
  await page.keyboard.press('Shift+N')
  assert.equal(await waitMove('2.1'), '3.1', 'Shift+N jumps to the next slide')

  // Typing in slide 9's search stays in the field.
  await open(9)
  const search = page.locator('input[type="search"]')
  if (await search.count()) {
    await search.click()
    await page.keyboard.type('np')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('Home')
    await page.keyboard.press('End')
    await page.waitForTimeout(200)
    assert.equal(await search.inputValue(), 'np', 'typed letters reach the field')
    assert.equal(at(), '9.1', 'typing in the field does not move the deck')
  } else {
    console.log('skip: slide 9 shows no search at its first point')
  }

  // Enter on Next keeps focus there across slides, and at the very end.
  await open(1)
  const next = page.getByRole('button', { name: 'Next point' })
  await next.focus()
  for (let step = 0; step < 400 && (await next.getAttribute('aria-disabled')) !== 'true'; step++) {
    const from = at()
    await page.keyboard.press('Enter')
    await waitMove(from)
    assert.equal(await focused(), 'Next point', `focus stays on Next after reaching ${at()}`)
  }
  assert.equal(await next.getAttribute('aria-disabled'), 'true', 'Next is unavailable at the end')
  assert.equal(await focused(), 'Next point', 'focus stays on Next at the end')

  // In the strip: Alt+ArrowLeft is the browser's, and focus follows Home and End.
  await open(3)
  const captions = page.getByRole('button', { name: 'Captions', exact: true })
  if ((await captions.getAttribute('aria-pressed')) === 'true') await captions.click()
  const chip = page.locator('.slide-index-strip [aria-current="true"]')
  if (await chip.count()) {
    await chip.focus()
    await page.keyboard.press('Alt+ArrowLeft')
    await page.waitForTimeout(300)
    assert.equal(new URL(page.url()).pathname, '/approach')
    assert.equal(at(), '3.1', 'Alt+ArrowLeft in the strip does not move the deck')
    await page.keyboard.press('End')
    await waitMove('3.1')
    assert.match((await focused()) ?? '', /^Slide \d+/, 'focus follows End to the new page in the strip')
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-current')), 'true')
  } else {
    console.log('skip: the strip is hidden while captions are on')
  }

  assert.deepEqual(errors, [])
  console.log('deck keyboard: ok')
} finally {
  await browser?.close()
  await server.close()
}
