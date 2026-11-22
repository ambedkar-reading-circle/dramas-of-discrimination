import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

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
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  })
  page.setDefaultTimeout(10000)
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(server.resolvedUrls.local[0])
  await page.waitForFunction(() =>
    document.documentElement.classList.contains('lenis'),
  )
  await page.mouse.move(20, 400)
  await page.mouse.wheel(0, 800)
  await page.waitForFunction(() =>
    document.documentElement.classList.contains('lenis-smooth'),
  )
  await page.waitForFunction(() => Math.abs(scrollY - 800) < 3)

  // A route change during inertia must cancel the old animation.
  await page.mouse.wheel(0, 1200)
  await page.getByRole('link', { name: 'About', exact: true }).click()
  await page.waitForURL('**/about')
  await page.waitForTimeout(1000)
  assert.equal(await page.evaluate(() => scrollY), 0)
  await page.goBack()
  await page.waitForURL((url) => url.pathname === '/')
  const restored = await page.evaluate(() => scrollY)
  assert.ok(restored > 0, 'Back restores the previous scroll position')
  await page.waitForTimeout(500)
  assert.ok(Math.abs((await page.evaluate(() => scrollY)) - restored) < 3)

  await page.reload()
  await page.waitForFunction(() =>
    document.documentElement.classList.contains('lenis'),
  )
  await page.evaluate(() => {
    window.addEventListener(
      'click',
      () => {
        window.anchorScrollSamples = [scrollY]
        window.recordAnchorScroll = () =>
          window.anchorScrollSamples.push(scrollY)
        window.addEventListener('scroll', window.recordAnchorScroll)
      },
      { once: true, capture: true },
    )
  })
  await page.getByRole('link', { name: 'Explore the acts' }).click()
  await page.waitForFunction(
    () => !document.documentElement.classList.contains('lenis-smooth'),
  )
  await page.waitForFunction(() => {
    const target = document.querySelector('#workshop-method')
    const heading = target?.querySelector('.section-lede')
    const header = document.querySelector('header')
    return (
      target &&
      heading &&
      header &&
      Math.abs(target.getBoundingClientRect().top) < 3 &&
      heading.getBoundingClientRect().top >
        header.getBoundingClientRect().bottom
    )
  })
  assert.equal(new URL(page.url()).hash, '#workshop-method')
  const samples = await page.evaluate(() => {
    window.removeEventListener('scroll', window.recordAnchorScroll)
    return window.anchorScrollSamples
  })
  const distance = samples.at(-1) - samples[0]
  assert.ok(
    samples.length > 5,
    'Anchor scroll moves through intermediate positions',
  )
  for (let i = 1; i < samples.length; i++) {
    const step = samples[i] - samples[i - 1]
    assert.ok(step >= -2, 'Anchor scroll never jumps backward')
    assert.ok(
      step < distance * 0.5,
      'Anchor scroll never jumps straight to the section',
    )
  }

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(
    () => !document.documentElement.classList.contains('lenis'),
  )
  await page.reload()
  await page.getByRole('link', { name: 'Explore the acts' }).waitFor()
  assert.equal(
    await page.locator('html').evaluate((el) => el.classList.contains('lenis')),
    false,
  )
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.waitForFunction(() =>
    document.documentElement.classList.contains('lenis'),
  )
  await page.keyboard.press('Tab')
  await page.getByRole('link', { name: 'Skip to content' }).focus()
  await page.keyboard.press('Enter')
  await page.waitForFunction(
    () => document.activeElement?.id === 'main-content',
  )

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(server.resolvedUrls.local[0])
  await page.getByRole('link', { name: 'Explore the acts' }).click()
  await page.waitForFunction(
    () => !document.documentElement.classList.contains('lenis-smooth'),
  )
  await page.waitForFunction(() => {
    const target = document.querySelector('#workshop-method')
    const heading = target?.querySelector('.section-lede')
    const header = document.querySelector('header')
    return (
      target &&
      heading &&
      header &&
      Math.abs(target.getBoundingClientRect().top) < 3 &&
      heading.getBoundingClientRect().top >
        header.getBoundingClientRect().bottom
    )
  })
  await page.screenshot({ path: `${process.env.TEMP}/lenis-mobile.png` })
  assert.deepEqual(errors, [])
  console.log(
    'Smooth scrolling, route restoration, anchors, skip link, and reduced motion passed.',
  )
} finally {
  await browser?.close()
  await server.close()
}
