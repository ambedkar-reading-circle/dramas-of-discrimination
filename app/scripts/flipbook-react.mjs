import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
})
const server = await createServer({
  mode: 'test',
  server: { host: '127.0.0.1', port: 0 },
})
await server.listen()
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  // This fixture has no other animation or resize subscribers. Count resources
  // around a real StrictMode wrapper mount rather than only detached DOM nodes.
  await page.addInitScript(() => {
    const frames = new Set()
    const listeners = new Set()
    const request = requestAnimationFrame.bind(window)
    const cancel = cancelAnimationFrame.bind(window)
    const add = window.addEventListener.bind(window)
    const remove = window.removeEventListener.bind(window)
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        frames.delete(id)
        callback(time)
      })
      frames.add(id)
      return id
    }
    window.cancelAnimationFrame = (id) => {
      frames.delete(id)
      cancel(id)
    }
    window.addEventListener = (name, callback, options) => {
      if (name === 'resize') listeners.add(callback)
      add(name, callback, options)
    }
    window.removeEventListener = (name, callback, options) => {
      if (name === 'resize') listeners.delete(callback)
      remove(name, callback, options)
    }
    window.engineWork = () => ({
      frames: frames.size,
      listeners: listeners.size,
    })
  })
  await page.goto(
    `${server.resolvedUrls.local[0]}scripts/fixtures/flipbook.html`,
  )
  await page.getByRole('button', { name: 'Mount', exact: true }).waitFor()
  const baseline = await page.evaluate(() => window.engineWork())
  for (let cycle = 0; cycle < 10; cycle++) {
    await page.getByRole('button', { name: 'Mount', exact: true }).click()
    await page.waitForFunction(
      () => Number(document.querySelector('output').dataset.count) > 0,
    )
    assert.equal(
      await page.locator('output').getAttribute('data-count'),
      '6',
      'StrictMode does not register duplicate leaves',
    )
    await page.getByRole('button', { name: 'Turn', exact: true }).click()
    if (cycle % 2) {
      await page.getByRole('button', { name: 'Resize', exact: true }).click()
      await page.waitForFunction(
        () => document.querySelector('output').dataset.count === '6',
      )
    }
    await page.getByRole('button', { name: 'Unmount', exact: true }).click()
    await page.waitForTimeout(50)
    assert.deepEqual(
      await page.evaluate(() => window.engineWork()),
      baseline,
      'No resources survive a React unmount',
    )
    assert.equal(await page.locator('.stf__parent').count(), 0)
  }
  assert.deepEqual(errors, [])
  console.log(
    'Flipbook React: StrictMode, exact page count, mid-turn resize and ten mount/unmount cycles pass.',
  )
} finally {
  await browser.close()
  await server.close()
}
