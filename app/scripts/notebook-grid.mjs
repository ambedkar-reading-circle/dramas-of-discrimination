import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

// Fail before starting a server if the requested browser is not installed.
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
})
const server = await createServer({
  mode: 'test',
  server: { host: '127.0.0.1', port: 0 },
})
await server.listen()
const page = await browser.newPage({ reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))

async function checkGrid(label, baselines = true, target = page) {
  const failures = await target.evaluate((checkBaselines) => {
    const main = document.querySelector('main')
    const origin = main.getBoundingClientRect().top
    const row = parseFloat(getComputedStyle(document.body).lineHeight)
    const distance = (value) => Math.abs(value - Math.round(value / row) * row)
    const failures = []
    for (const el of main.querySelectorAll(
      'section, .notebook-stack, .notebook-frame, .action-link, .workshop-illustration',
    )) {
      if (
        !el.getClientRects().length ||
        el.closest('[data-notebook-independent]')
      )
        continue
      const rect = el.getBoundingClientRect()
      if (distance(rect.top - origin) > 1 || distance(rect.height) > 1) {
        failures.push(
          `${el.className}: top ${rect.top - origin}, height ${rect.height}, row ${row}`,
        )
      }
    }
    if (checkBaselines) {
      for (const el of main.querySelectorAll(
        'p, h1:not(.hero-wordmark), h2, h3, h4, .notebook-text, .eyebrow, .step-number, .dod-logo-first, .dod-logo-last',
      )) {
        if (
          !el.getClientRects().length ||
          el.closest('[data-notebook-independent]')
        )
          continue
        const marker = document.createElement('span')
        marker.style.cssText =
          'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline'
        el.prepend(marker)
        const baseline = marker.getBoundingClientRect().top - origin
        marker.remove()
        if (distance(baseline - row / 2) > 1)
          failures.push(
            `${el.className || el.tagName}: baseline ${baseline}, row ${row}, font ${getComputedStyle(el).fontSize} ${getComputedStyle(el).fontFamily}`,
          )
        if (distance(parseFloat(getComputedStyle(el).lineHeight)) > 1)
          failures.push(
            `${el.className || el.tagName}: line-height is off-grid`,
          )
      }
    }
    if (document.documentElement.scrollWidth > window.innerWidth)
      failures.push('Horizontal overflow')
    const hero = main.querySelector('.hero-section')
    if (hero) {
      const end = hero.getBoundingClientRect().bottom
      for (const el of hero.querySelectorAll(
        '.hero-copy, .workshop-illustration',
      )) {
        if (el.getBoundingClientRect().bottom > end + 1)
          failures.push('Hero content clipped')
      }
    }
    for (const frame of main.querySelectorAll('.notebook-frame')) {
      const image = frame.querySelector('img')
      if (
        image &&
        image.getBoundingClientRect().bottom >
          frame.getBoundingClientRect().bottom + 1
      )
        failures.push('Image escapes frame')
    }
    return failures
  }, baselines)
  assert.deepEqual(failures, [], label)
}

try {
  for (const path of ['/', '/about']) {
    for (const width of [320, 480, 700, 701, 768, 913, 1000, 1024, 1440]) {
      await page.setViewportSize({ width, height: 901 })
      await page.goto(new URL(path, server.resolvedUrls.local[0]).href)
      await page.locator('main').waitFor()
      await page.evaluate(() => document.fonts.ready)
      await checkGrid(`${path} at ${width}px`)
    }
    // Exercise the failure mode: longer content and larger media must move later
    // sections by whole rows, without clipping or compensating sibling offsets.
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 733 })
      await page.goto(new URL(path, server.resolvedUrls.local[0]).href)
      await page.locator('main').waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.evaluate(() => {
        const heading = document.querySelector('main h2')
        heading.textContent +=
          ' Rehearsing change together across communities and workplaces.'
        const paragraph = document.querySelector(
          '.hero-thesis, .about-hero > p:last-child',
        )
        paragraph.textContent +=
          ' More context helps a community work through difficult scenarios.'.repeat(
            8,
          )
        const button = document.querySelector('.hero-actions .notebook-text')
        if (button)
          button.textContent =
            'Explore the workshop method with your community and colleagues'
        document
          .querySelectorAll('.worksheet')
          .forEach((el) => el.style.setProperty('--worksheet-height', '4200'))
      })
      await checkGrid(`${path} with growing content at ${width}px`)
      await page.evaluate(
        () => (document.documentElement.style.fontSize = '200%'),
      )
      await page.evaluate(() => document.fonts.ready)
      await checkGrid(`${path} with enlarged text at ${width}px`)
    }
  }
  for (const path of ['/', '/about']) {
    await page.setViewportSize({ width: 1440, height: 901 })
    await page.goto(new URL(path, server.resolvedUrls.local[0]).href)
    await page.locator('main').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.getByRole('button', { name: /Switch to dark mode/i }).click()
    await checkGrid(`${path} in dark mode`)
    await page.getByRole('button', { name: /Switch to light mode/i }).click()
    await page.emulateMedia({ forcedColors: 'active' })
    await checkGrid(`${path} in forced colors`)
    await page.emulateMedia({ forcedColors: 'none' })
    await page.emulateMedia({ media: 'print' })
    assert.equal(
      await page
        .locator('main')
        .evaluate((el) => getComputedStyle(el).backgroundImage),
      'none',
      'Print removes ruling',
    )
    await page.emulateMedia({ media: 'screen' })
    if (path === '/') {
      await page.locator('.worksheet img').evaluateAll(async (images) => {
        for (const image of images) image.loading = 'eager'
        await Promise.all(images.map((image) => image.decode()))
      })
      await checkGrid('Home after lazy images load')
    }
  }

  const fallback = await browser.newPage({
    viewport: { width: 320, height: 733 },
  })
  await fallback.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
    route.abort(),
  )
  for (const path of ['/', '/about']) {
    await fallback.goto(new URL(path, server.resolvedUrls.local[0]).href)
    await fallback.locator('main').waitFor()
    await fallback.evaluate(() => document.fonts.ready)
    await checkGrid(`${path} with unavailable web fonts`, false, fallback)
  }
  await fallback.close()

  await page.goto(new URL('/?notebook-grid', server.resolvedUrls.local[0]).href)
  const panel = page.getByLabel('Notebook layout check')
  await panel.filter({ hasText: 'aligned blocks' }).waitFor()
  await page
    .locator('.hero-section')
    .evaluate((el) => (el.style.marginBottom = '7px'))
  await panel.filter({ hasText: 'off-grid blocks' }).waitFor()
  await page
    .locator('.hero-section')
    .evaluate((el) => (el.style.marginBottom = ''))
  await panel.filter({ hasText: 'aligned blocks' }).waitFor()

  assert.deepEqual(errors, [], 'Browser errors')
  console.log(
    'Notebook grid: both routes pass 9 widths, content growth, 200% text, themes, forced colors, font fallback, and debug drift detection.',
  )
} finally {
  await browser.close()
  await server.close()
}
