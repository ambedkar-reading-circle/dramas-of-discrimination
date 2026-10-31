import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
})
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setContent(
    '<style>.stf__wrapper { position: relative; height: 100%; }</style><body></body>',
  )
  await page.evaluate(() => {
    const frames = new Set()
    let ticks = 0
    const listeners = new Set()
    const request = window.requestAnimationFrame.bind(window)
    const cancel = window.cancelAnimationFrame.bind(window)
    const add = window.addEventListener.bind(window)
    const remove = window.removeEventListener.bind(window)
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        frames.delete(id)
        ticks++
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
      ticks,
    })
  })
  await page.addScriptTag({
    path: 'node_modules/page-flip/dist/js/page-flip.browser.js',
  })
  for (let cycle = 0; cycle < 10; cycle++) {
    const result = await page.evaluate(async (cycle) => {
      const host = document.createElement('div')
      host.style.cssText = 'width:600px;height:420px'
      document.body.append(host)
      const leaves = Array.from({ length: 6 }, (_, index) => {
        const leaf = document.createElement('div')
        leaf.textContent = `Page ${index}`
        leaf.style.background = index % 2 ? '#fffefa' : '#2b448e'
        host.append(leaf)
        return leaf
      })
      const engine = new window.St.PageFlip(host, {
        width: 300,
        height: 420,
        showCover: true,
        useMouseEvents: false,
        flippingTime: 900,
        autoSize: false,
      })
      const progress = []
      let callbacksAfterDestroy = 0
      let destroyed = false
      for (const event of ['init', 'flip', 'changeState', 'turnProgress']) {
        engine.on(event, ({ data }) => {
          if (destroyed) callbacksAfterDestroy++
          if (event === 'turnProgress') progress.push(data.progress)
        })
      }
      engine.loadFromHTML(leaves)
      if (cycle !== 0) {
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        )
        engine.flip(1)
        await new Promise((resolve) => setTimeout(resolve, 220))
      }
      const stateBeforeDestroy = engine.getState()
      destroyed = true
      engine.destroy(true)
      await new Promise((resolve) => setTimeout(resolve, 50))
      const result = {
        ...window.engineWork(),
        callbacksAfterDestroy,
        hostPreserved: host.isConnected,
        leavesRestored: leaves.every((leaf) => leaf.parentElement === host),
        progress,
        stateBeforeDestroy,
      }
      host.remove()
      return result
    }, cycle)
    assert.equal(
      result.frames,
      0,
      `No render loop survives teardown (cycle ${cycle})`,
    )
    assert.equal(result.listeners, 0, 'No resize listeners survive teardown')
    assert.equal(
      result.callbacksAfterDestroy,
      0,
      'No delayed callbacks after teardown',
    )
    assert.ok(
      result.hostPreserved && result.leavesRestored,
      'React retains its host and page nodes',
    )
    if (cycle > 0) {
      assert.equal(
        result.stateBeforeDestroy,
        'flipping',
        'Teardown interrupts an active turn',
      )
      assert.ok(
        result.progress.length > 1,
        `Real turns report progress: ${JSON.stringify(result)}`,
      )
      assert.ok(result.progress.every((value) => value >= 0 && value <= 1))
      assert.ok(
        result.progress.at(-1) > result.progress[0],
        'Progress follows the moving fold',
      )
    }
  }
  assert.deepEqual(errors, [])
  console.log(
    'Flipbook engine: ten teardown cycles, early teardown, in-flight teardown, progress, and DOM ownership pass.',
  )
} finally {
  await browser.close()
}
