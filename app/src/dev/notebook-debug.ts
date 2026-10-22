import './notebook-debug.css'

// Loaded only in development, and only when ?notebook-grid is present.
const selector =
  'section, .notebook-stack, .notebook-frame, .action-link, .hero-copy, .workshop-illustration'
const panel = document.createElement('output')
panel.className = 'notebook-debug-panel'
panel.setAttribute('aria-label', 'Notebook layout check')
document.body.append(panel)
document.documentElement.dataset.notebookDebug = ''

let frame = 0
let observedMain: HTMLElement | null = null
let observedBlocks = new WeakSet<Element>()
const resize = new ResizeObserver(schedule)
const mutations = new MutationObserver(schedule)

function audit() {
  const main = document.querySelector('main')
  if (!main) return
  if (main !== observedMain) {
    resize.disconnect()
    resize.observe(main)
    observedMain = main
    observedBlocks = new WeakSet()
  }
  const origin = main.getBoundingClientRect().top
  const row = parseFloat(getComputedStyle(document.body).lineHeight)
  const error = (value: number) =>
    Math.abs(value - Math.round(value / row) * row)
  const failures: string[] = []
  const blocks = main.querySelectorAll<HTMLElement>(selector)
  for (const block of blocks) {
    if (
      !block.getClientRects().length ||
      block.closest('[data-notebook-independent]')
    )
      continue
    if (!observedBlocks.has(block)) {
      resize.observe(block)
      observedBlocks.add(block)
    }
    const rect = block.getBoundingClientRect()
    const drift = Math.max(error(rect.top - origin), error(rect.height))
    block.dataset.notebookDrift = drift > 1 ? 'true' : 'false'
    if (drift > 1)
      failures.push(
        `${block.className || block.tagName}: ${drift.toFixed(1)}px`,
      )
  }
  panel.textContent = failures.length
    ? `Row ${row}px · ${failures.length} off-grid blocks\nFirst: ${failures[0]}`
    : `Row ${row}px · ${blocks.length} aligned blocks`
}

function schedule() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(audit)
}

const app = document.getElementById('app')
if (app)
  mutations.observe(app, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  })
window.addEventListener('resize', schedule)
document.fonts.addEventListener('loadingdone', schedule)
void document.fonts.ready.then(schedule)
schedule()

import.meta.hot?.dispose(() => {
  cancelAnimationFrame(frame)
  resize.disconnect()
  mutations.disconnect()
  window.removeEventListener('resize', schedule)
  document.fonts.removeEventListener('loadingdone', schedule)
  document
    .querySelectorAll<HTMLElement>('[data-notebook-drift]')
    .forEach((block) => delete block.dataset.notebookDrift)
  delete document.documentElement.dataset.notebookDebug
  panel.remove()
})
