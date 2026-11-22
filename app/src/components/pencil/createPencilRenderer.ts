import type {
  Ink,
  InkResolver,
  PencilOptions,
  Point,
  TrailRenderer,
} from './types.ts'
import { toViewport } from './viewport.ts'

const DEFAULT_PENCIL_OPTIONS: PencilOptions = {
  minWidth: 0.5,
  maxWidth: 5,
  alpha: 0.75,
  fastSpeed: 2,
  fadeMs: 500,
  inkIntervalMs: 50,
}

interface RendererConfig {
  canvas: HTMLCanvasElement
  surface: HTMLElement
  resolveInk: InkResolver
}

interface StrokeCursor {
  previous: Point
  previousMid: Point
  width: number
}

interface StrokeMark {
  from: Point
  control: Point
  to: Point
  width: number
  ink: Ink
  born: number
  dot: boolean
}

const GRAIN_TILE_SIZE = 64
const GRAIN_DENSITY = 0.45
const GRAIN_MAX_ALPHA = 0.55
const GRAIN_ERASE = 0.28
const GRAIN_CACHE_LIMIT = 32
const INK_LERP_FACTOR = 0.1
const WIDTH_LERP_FACTOR = 0.1
const VIEW_MARGIN = 32

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, time: b.time }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpInk(from: Ink, to: Ink, t: number): Ink {
  return {
    r: lerp(from.r, to.r, t),
    g: lerp(from.g, to.g, t),
    b: lerp(from.b, to.b, t),
  }
}

function copyInk(ink: Ink): Ink {
  return { r: ink.r, g: ink.g, b: ink.b }
}

function quantizeInk(ink: Ink): string {
  return `${Math.round(ink.r / 24)}-${Math.round(ink.g / 24)}-${Math.round(ink.b / 24)}`
}

function createGrainTile(ink: Ink): HTMLCanvasElement {
  const tile = document.createElement('canvas')
  tile.width = GRAIN_TILE_SIZE
  tile.height = GRAIN_TILE_SIZE
  const context = tile.getContext('2d')
  if (!context) return tile
  const dotCount = GRAIN_TILE_SIZE * GRAIN_TILE_SIZE * GRAIN_DENSITY
  for (let i = 0; i < dotCount; i += 1) {
    context.fillStyle = `rgba(${ink.r}, ${ink.g}, ${ink.b}, ${Math.random() * GRAIN_MAX_ALPHA})`
    context.fillRect(
      Math.floor(Math.random() * GRAIN_TILE_SIZE),
      Math.floor(Math.random() * GRAIN_TILE_SIZE),
      1,
      1,
    )
  }
  return tile
}

function createNoopRenderer(): TrailRenderer {
  return {
    begin: () => {},
    extend: () => {},
    end: () => {},
    clear: () => {},
    dispose: () => {},
  }
}

export function createPencilRenderer(config: RendererConfig): TrailRenderer {
  const settings = DEFAULT_PENCIL_OPTIONS
  const canvasContext = config.canvas.getContext('2d')
  if (!canvasContext) return createNoopRenderer()
  const context: CanvasRenderingContext2D = canvasContext

  let cursor: StrokeCursor | null = null
  let currentInk: Ink | null = null
  let targetInk: Ink | null = null
  let lastInkSampleAt = 0
  let grainKey = ''
  let grain: CanvasPattern | null = null
  const grainCache = new Map<string, CanvasPattern | null>()
  const marks: StrokeMark[] = []
  let frame = 0
  let placedLeft = -1
  let placedTop = -1
  let placedWidth = -1
  let placedHeight = -1
  let activated = false

  function pixelRatio(): number {
    return Math.max(window.devicePixelRatio || 1, 1)
  }

  // The sheet can be as tall as the document. Keep the bitmap to the part
  // currently on screen and store strokes in sheet coordinates.
  function placeWindow() {
    const surface = config.surface.getBoundingClientRect()
    const viewLeft = Math.max(surface.left, 0)
    const viewTop = Math.max(surface.top, 0)
    const viewRight = Math.min(surface.right, window.innerWidth)
    const viewBottom = Math.min(surface.bottom, window.innerHeight)
    const left = viewLeft - surface.left
    const top = viewTop - surface.top
    const width = Math.max(0, viewRight - viewLeft)
    const height = Math.max(0, viewBottom - viewTop)
    const style = config.canvas.style
    if (left !== placedLeft || top !== placedTop) {
      placedLeft = left
      placedTop = top
      style.transform = `translate3d(${left}px, ${top}px, 0)`
    }
    if (width !== placedWidth || height !== placedHeight) {
      placedWidth = width
      placedHeight = height
      style.width = `${width}px`
      style.height = `${height}px`
      applyBitmap()
    }
  }

  function applyBitmap() {
    const ratio = pixelRatio()
    const nextWidth = Math.max(
      Math.round((activated ? placedWidth : 0) * ratio),
      1,
    )
    const nextHeight = Math.max(
      Math.round((activated ? placedHeight : 0) * ratio),
      1,
    )
    if (
      config.canvas.width !== nextWidth ||
      config.canvas.height !== nextHeight
    ) {
      config.canvas.width = nextWidth
      config.canvas.height = nextHeight
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    schedule()
  }

  function refreshGrain(ink: Ink) {
    const key = quantizeInk(ink)
    if (key === grainKey) return
    grainKey = key
    if (grainCache.has(key)) {
      const cached = grainCache.get(key) ?? null
      grainCache.delete(key)
      grainCache.set(key, cached)
      grain = cached
      return
    }
    grain = context.createPattern(createGrainTile(ink), 'repeat')
    grainCache.set(key, grain)
    if (grainCache.size > GRAIN_CACHE_LIMIT) {
      const oldest = grainCache.keys().next().value
      if (oldest !== undefined) grainCache.delete(oldest)
    }
  }

  function sampleInk(point: Point) {
    if (targetInk && point.time - lastInkSampleAt < settings.inkIntervalMs)
      return
    lastInkSampleAt = point.time
    targetInk = config.resolveInk(point)
    if (!currentInk) currentInk = targetInk
  }

  function advanceInk() {
    if (!targetInk || !currentInk) return
    currentInk = lerpInk(currentInk, targetInk, INK_LERP_FACTOR)
  }

  function strokeWidth(from: Point, to: Point): number {
    const distance = Math.hypot(to.x - from.x, to.y - from.y)
    const elapsed = Math.max(to.time - from.time, 1)
    const speed = distance / elapsed
    const taper = Math.min(speed / settings.fastSpeed, 1)
    return lerp(settings.maxWidth, settings.minWidth, taper)
  }

  function owns(point: Point): boolean {
    const { x, y } = toViewport(point)
    const hit = document.elementFromPoint(x, y)
    return hit?.closest('[data-pencil-surface]') === config.surface
  }

  function toSurface(point: Point): Point {
    const rect = config.surface.getBoundingClientRect()
    const { x, y } = toViewport(point)
    return {
      x: x - rect.left,
      y: y - rect.top,
      time: point.time,
    }
  }

  function onScreen(
    from: Point,
    to: Point,
    originX: number,
    originY: number,
  ): boolean {
    const width = config.canvas.clientWidth
    const height = config.canvas.clientHeight
    const minX = Math.min(from.x, to.x)
    const maxX = Math.max(from.x, to.x)
    const minY = Math.min(from.y, to.y)
    const maxY = Math.max(from.y, to.y)
    return (
      maxX >= originX - VIEW_MARGIN &&
      minX <= originX + width + VIEW_MARGIN &&
      maxY >= originY - VIEW_MARGIN &&
      minY <= originY + height + VIEW_MARGIN
    )
  }

  function paintMark(width: number, alpha: number, ink: Ink, draw: () => void) {
    refreshGrain(ink)
    const color = `rgb(${Math.round(ink.r)}, ${Math.round(ink.g)}, ${Math.round(ink.b)})`
    context.save()
    context.globalAlpha = alpha
    context.lineWidth = width
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = color
    context.fillStyle = color
    draw()
    if (grain) {
      context.globalCompositeOperation = 'destination-out'
      context.globalAlpha = GRAIN_ERASE
      context.strokeStyle = grain
      context.fillStyle = grain
      draw()
    }
    context.restore()
  }

  function fadeAlpha(born: number, now: number): number {
    const life = (now - born) / settings.fadeMs
    if (life >= 1) return 0
    return settings.alpha * (1 - life)
  }

  function paint(now: number) {
    const ratio = pixelRatio()
    const surface = config.surface.getBoundingClientRect()
    const rect = config.canvas.getBoundingClientRect()
    const originX = rect.left - surface.left
    const originY = rect.top - surface.top
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, config.canvas.width, config.canvas.height)
    context.setTransform(ratio, 0, 0, ratio, -originX * ratio, -originY * ratio)
    for (const mark of marks) {
      const alpha = fadeAlpha(mark.born, now)
      if (alpha <= 0) continue
      const from = mark.from
      const to = mark.to
      if (!onScreen(from, to, originX, originY)) continue
      if (mark.dot) {
        paintMark(mark.width, alpha, mark.ink, () => {
          context.beginPath()
          context.arc(from.x, from.y, mark.width / 2, 0, Math.PI * 2)
          context.fill()
        })
        continue
      }
      const control = mark.control
      paintMark(mark.width, alpha, mark.ink, () => {
        context.beginPath()
        context.moveTo(from.x, from.y)
        context.quadraticCurveTo(control.x, control.y, to.x, to.y)
        context.stroke()
      })
    }
  }

  function tick(now: number) {
    frame = 0
    const live: StrokeMark[] = []
    for (const mark of marks) {
      if (now - mark.born < settings.fadeMs) live.push(mark)
    }
    marks.length = 0
    marks.push(...live)
    paint(now)
    if (marks.length > 0) schedule()
  }

  function schedule() {
    if (frame !== 0 || marks.length === 0) return
    frame = window.requestAnimationFrame(tick)
  }

  function remember(mark: StrokeMark) {
    marks.push(mark)
    schedule()
  }

  function begin(point: Point) {
    if (!owns(point)) return
    if (!activated) {
      activated = true
      applyBitmap()
    }
    sampleInk(point)
    const ink = currentInk
    if (ink === null) return
    const local = toSurface(point)
    cursor = {
      previous: local,
      previousMid: local,
      width: settings.maxWidth,
    }
    remember({
      from: local,
      control: local,
      to: local,
      width: settings.maxWidth,
      ink: copyInk(ink),
      born: performance.now(),
      dot: true,
    })
  }

  function extend(points: Point[]) {
    if (points.length === 0) return
    const last = points[points.length - 1]
    if (!owns(last)) {
      cursor = null
      return
    }
    if (!cursor) {
      const start = points.find((point) => owns(point)) ?? last
      begin(start)
    }
    const active = cursor
    if (!active) return
    sampleInk(last)
    advanceInk()
    const ink = currentInk
    if (ink === null) return
    for (const point of points) {
      if (!owns(point)) continue
      const local = toSurface(point)
      const mid = midpoint(active.previous, local)
      remember({
        from: active.previousMid,
        control: active.previous,
        to: mid,
        width: active.width,
        ink: copyInk(ink),
        born: performance.now(),
        dot: false,
      })
      active.width = lerp(
        active.width,
        strokeWidth(active.previous, local),
        WIDTH_LERP_FACTOR,
      )
      active.previousMid = mid
      active.previous = local
    }
  }

  function end() {
    cursor = null
  }

  function clearCanvas() {
    context.save()
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, config.canvas.width, config.canvas.height)
    context.restore()
  }

  function clear() {
    marks.length = 0
    cursor = null
    if (frame !== 0) window.cancelAnimationFrame(frame)
    frame = 0
    clearCanvas()
    activated = false
    applyBitmap()
  }

  function dispose() {
    if (frame !== 0) window.cancelAnimationFrame(frame)
    frame = 0
    observer.disconnect()
    window.removeEventListener('resize', placeWindow)
    window.removeEventListener('scroll', placeWindow)
  }

  const observer = new ResizeObserver(() => placeWindow())
  observer.observe(config.surface)
  window.addEventListener('resize', placeWindow)
  window.addEventListener('scroll', placeWindow, { passive: true })
  placeWindow()

  return { begin, extend, end, clear, dispose }
}
