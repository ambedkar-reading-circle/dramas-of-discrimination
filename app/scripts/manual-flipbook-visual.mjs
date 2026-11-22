import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

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
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  // Use one timeline for installation and pausing. Host wall time can lag the
  // browser's advancing clock during startup, making pauseAt target the past.
  const clockStart = new Date('2026-01-01T00:00:00Z')
  await page.clock.install({ time: clockStart })
  await page.goto(server.resolvedUrls.local[0])
  await page.locator('.manual-title-page').waitFor({ state: 'visible' })
  await page.evaluate(() => document.fonts.ready)
  await page.clock.pauseAt(new Date(clockStart.getTime() + 60_000))

  async function scroll(progress) {
    await page.evaluate((value) => {
      const section = document.querySelector('#manual-preview')
      window.scrollTo(
        0,
        section.getBoundingClientRect().top +
          scrollY +
          value * (section.clientHeight - innerHeight),
      )
    }, progress)
  }
  async function capture(name) {
    await page
      .locator('.manual-book-frame')
      .screenshot({ path: resolve(output, `${name}.png`), animations: 'allow' })
  }
  async function startTurn(target) {
    await scroll(target)
    for (let attempt = 0; attempt < 30; attempt++) {
      await page.clock.runFor(16)
      if (
        (await page
          .locator('.manual-reader')
          .getAttribute('data-manual-busy')) === 'true'
      )
        return
    }
    assert.fail(`Turn to ${target} starts`)
  }
  await scroll(0.06)
  await page.clock.runFor(1000)
  await startTurn(0.2)
  for (const [phase, delta] of [
    ['early', 150],
    ['middle', 200],
    ['late', 200],
  ]) {
    await page.clock.runFor(delta)
    await capture(`cover-${phase}`)
  }
  await page.clock.runFor(1000)
  await scroll(0.2)
  await page.clock.runFor(1200)
  await capture('settled')
  for (const [name, target] of [
    ['forward', 0.36],
    ['reverse', 0.2],
  ]) {
    await startTurn(target)
    let lastTransform
    for (const [phase, delta] of [
      ['early', 150],
      ['middle', 200],
      ['late', 200],
    ]) {
      await page.clock.runFor(delta)
      const shadow = await page.locator('.stf__innerShadow').evaluate((el) => ({
        transform: el.style.transform,
        display: getComputedStyle(el).display,
        gradient: el.style.background,
      }))
      assert.equal(
        shadow.display,
        'block',
        `${name} ${phase}: curl shadow is visible`,
      )
      assert.notEqual(
        shadow.transform,
        lastTransform,
        'Shadow moves with the fold',
      )
      assert.ok(shadow.gradient.includes('linear-gradient'))
      assert.equal(
        await page
          .locator('.manual-spine')
          .evaluate((el) => getComputedStyle(el).opacity),
        '0',
        'Stationary gutter disappears while turning',
      )
      lastTransform = shadow.transform
      await capture(`${name}-${phase}`)
    }
    await page.clock.runFor(1000)
  }
  assert.deepEqual(errors, [])
  console.log(`Manual curl captures and moving-shadow checks: ${output}`)
} finally {
  await browser.close()
  await server.close()
}
