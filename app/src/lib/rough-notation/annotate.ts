// Adapted from rough-notation — © Preet Shihn / rough-stuff (MIT)
// https://github.com/rough-stuff/rough-notation
// Clean-room re-implementation of its annotation controller. Deviations from
// the original: hide() is an animated retract (the original clears the svg
// instantly) driven by WAAPI, with an explicit reduced-motion gate.

import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HIDE_DURATION_RATIO,
  SVG_NS,
} from './model'
import type { Rect, RoughAnnotation, RoughAnnotationConfig } from './model'
import { renderAnnotation } from './render'
import { randomSeed } from 'roughjs/bin/math'

type AnnotationState = 'unattached' | 'not-showing' | 'showing' | 'hiding'

interface RenderedPath {
  path: SVGPathElement
  length: number
}

class RoughAnnotationImpl implements RoughAnnotation {
  private _state: AnnotationState = 'unattached'
  private _config: RoughAnnotationConfig
  private _resizing = false
  private _ro?: ResizeObserver
  private _seed = randomSeed()

  private _e: HTMLElement
  private _svg?: SVGSVGElement
  private _lastSizes: Rect[] = []

  private _renderedPaths: RenderedPath[] = []
  private _animations: Animation[] = []
  private _retractAnimations: Animation[] = []
  private _hideToken = 0

  _animationDelay = 0

  constructor(e: HTMLElement, config: RoughAnnotationConfig) {
    this._e = e
    this._config = JSON.parse(JSON.stringify(config)) as RoughAnnotationConfig
    this.attach()
  }

  get animate(): boolean | undefined {
    return this._config.animate
  }
  set animate(value: boolean | undefined) {
    this._config.animate = value
  }

  get animationDuration(): number | undefined {
    return this._config.animationDuration
  }
  set animationDuration(value: number | undefined) {
    this._config.animationDuration = value
  }

  get hideDuration(): number | undefined {
    return this._config.hideDuration
  }
  set hideDuration(value: number | undefined) {
    this._config.hideDuration = value
  }

  get iterations(): number | undefined {
    return this._config.iterations
  }
  set iterations(value: number | undefined) {
    this._config.iterations = value
  }

  get color(): string | undefined {
    return this._config.color
  }
  set color(value: string | undefined) {
    if (this._config.color !== value) {
      this._config.color = value
      this.refresh()
    }
  }

  get strokeWidth(): number | undefined {
    return this._config.strokeWidth
  }
  set strokeWidth(value: number | undefined) {
    if (this._config.strokeWidth !== value) {
      this._config.strokeWidth = value
      this.refresh()
    }
  }

  get padding() {
    return this._config.padding
  }
  set padding(value) {
    if (this._config.padding !== value) {
      this._config.padding = value
      this.refresh()
    }
  }

  private _resizeListener = () => {
    if (!this._resizing) {
      this._resizing = true
      setTimeout(() => {
        this._resizing = false
        if (this._state === 'showing' && this.haveRectsChanged()) {
          this.redraw(false)
        }
      }, 400)
    }
  }

  private attach() {
    if (this._state === 'unattached' && this._e.parentElement) {
      const svg = (this._svg = document.createElementNS(SVG_NS, 'svg'))
      svg.setAttribute('class', 'rough-annotation')
      svg.setAttribute('aria-hidden', 'true')
      const style = svg.style
      style.position = 'absolute'
      style.top = '0'
      style.left = '0'
      style.overflow = 'visible'
      style.pointerEvents = 'none'
      style.width = '100px'
      style.height = '100px'
      const prepend = this._config.type === 'highlight'
      this._e.insertAdjacentElement(prepend ? 'beforebegin' : 'afterend', svg)
      this._state = 'not-showing'

      // ensure e is positioned
      if (prepend) {
        const computedPos = window.getComputedStyle(this._e).position
        const unpositioned = !computedPos || computedPos === 'static'
        if (unpositioned) {
          this._e.style.position = 'relative'
        }
      }
      this.attachListeners()
    }
  }

  private detachListeners() {
    window.removeEventListener('resize', this._resizeListener)
    this._ro?.unobserve(this._e)
  }

  private attachListeners() {
    this.detachListeners()
    window.addEventListener('resize', this._resizeListener, { passive: true })
    if (!this._ro && 'ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => this._resizeListener())
    }
    this._ro?.observe(this._e)
  }

  private haveRectsChanged(): boolean {
    if (this._lastSizes.length) {
      const newRects = this.rects()
      if (newRects.length === this._lastSizes.length) {
        for (let i = 0; i < newRects.length; i++) {
          if (!this.isSameRect(newRects[i], this._lastSizes[i])) {
            return true
          }
        }
      } else {
        return true
      }
    }
    return false
  }

  private isSameRect(rect1: Rect, rect2: Rect): boolean {
    const si = (a: number, b: number) => Math.round(a) === Math.round(b)
    return (
      si(rect1.x, rect2.x) &&
      si(rect1.y, rect2.y) &&
      si(rect1.w, rect2.w) &&
      si(rect1.h, rect2.h)
    )
  }

  isShowing(): boolean {
    return this._state === 'showing' || this._state === 'hiding'
  }

  private pendingRefresh?: Promise<void>
  private refresh() {
    if (this.isShowing() && !this.pendingRefresh) {
      this.pendingRefresh = Promise.resolve().then(() => {
        delete this.pendingRefresh
        if (this._state === 'showing') {
          this.redraw(false)
        }
      })
    }
  }

  show(): void {
    if (this._state === 'unattached') {
      return
    }
    // Cancel any in-flight draw or retract and start over from zero.
    this.redraw(this._config.animate !== false)
  }

  hide(): void {
    if (this._state !== 'showing') {
      return
    }
    const hideDuration =
      this._config.hideDuration ??
      (this._config.animationDuration || DEFAULT_ANIMATION_DURATION) *
        DEFAULT_HIDE_DURATION_RATIO
    if (!this._animations.length) {
      // Nothing was animated (instant show, or reduced motion): clear now.
      this.clear()
      return
    }
    const token = ++this._hideToken
    // Read the visual state before canceling the show animations, since
    // canceling reverts each path to its (hidden) base dash offset.
    const currents = this._renderedPaths.map(({ path }) => {
      const value = parseFloat(getComputedStyle(path).strokeDashoffset)
      return Number.isFinite(value) ? value : 0
    })
    this.cancelAllAnimations()
    this._state = 'hiding'

    let remaining = 0
    const settle = () => {
      remaining--
      if (
        remaining === 0 &&
        this._hideToken === token &&
        this._state === 'hiding'
      ) {
        this.clear()
      }
    }

    for (let i = 0; i < this._renderedPaths.length; i++) {
      const { path, length } = this._renderedPaths[i]
      let current = currents[i]
      if (current < 0) current = 0
      if (current > length) current = length
      path.style.strokeDashoffset = `${current}`
      if (current >= length) {
        continue
      }
      const progress = length ? (length - current) / length : 1
      const animation = path.animate(
        [{ strokeDashoffset: `${current}` }, { strokeDashoffset: `${length}` }],
        {
          duration: Math.max(1, hideDuration * progress),
          easing: 'ease-in',
          fill: 'forwards',
        },
      )
      animation.onfinish = settle
      animation.oncancel = settle
      this._retractAnimations.push(animation)
      remaining++
    }

    if (!remaining) {
      this.clear()
    }
  }

  remove(): void {
    this._hideToken++
    this.cancelAllAnimations()
    if (this._svg?.parentElement) {
      this._svg.parentElement.removeChild(this._svg)
    }
    this._svg = undefined
    this._renderedPaths = []
    this._animations = []
    this._retractAnimations = []
    this._state = 'unattached'
    this.detachListeners()
  }

  private redraw(animated: boolean) {
    this._hideToken++
    this.cancelAllAnimations()
    this.clearSvgChildren()
    this.render(animated)
  }

  private clear() {
    this.cancelAllAnimations()
    this.clearSvgChildren()
    this._state = 'not-showing'
  }

  private cancelAllAnimations() {
    for (const animation of this._animations) {
      animation.cancel()
    }
    for (const animation of this._retractAnimations) {
      animation.cancel()
    }
    this._animations = []
    this._retractAnimations = []
  }

  private clearSvgChildren() {
    if (this._svg) {
      while (this._svg.lastChild) {
        this._svg.removeChild(this._svg.lastChild)
      }
    }
    this._renderedPaths = []
    this._animations = []
    this._retractAnimations = []
  }

  private render(animated: boolean) {
    if (!this._svg) {
      return
    }
    const config = animated ? this._config : { ...this._config, animate: false }
    const rects = this.rects()
    let totalWidth = 0
    for (const rect of rects) {
      totalWidth += rect.w
    }
    const totalDuration = config.animationDuration || DEFAULT_ANIMATION_DURATION
    let delay = 0
    for (const rect of rects) {
      const ad = totalDuration * (rect.w / totalWidth)
      const result = renderAnnotation(
        this._svg,
        rect,
        config,
        delay + this._animationDelay,
        ad,
        this._seed,
      )
      this._renderedPaths.push(
        ...result.paths.map((path, i) => ({
          path,
          length: result.lengths[i] ?? path.getTotalLength(),
        })),
      )
      this._animations.push(...result.animations)
      delay += ad
    }
    this._lastSizes = rects
    this._state = 'showing'
  }

  private rects(): Rect[] {
    const ret: Rect[] = []
    if (this._svg) {
      if (this._config.multiline) {
        const elementRects = this._e.getClientRects()
        for (const elementRect of elementRects) {
          ret.push(this.svgRect(this._svg, elementRect))
        }
      } else {
        ret.push(this.svgRect(this._svg, this._e.getBoundingClientRect()))
      }
    }
    return ret
  }

  private svgRect(svg: SVGSVGElement, bounds: DOMRect | DOMRectReadOnly): Rect {
    const rect1 = svg.getBoundingClientRect()
    const rect2 = bounds
    return {
      x: (rect2.x || rect2.left) - (rect1.x || rect1.left),
      y: (rect2.y || rect2.top) - (rect1.y || rect1.top),
      w: rect2.width,
      h: rect2.height,
    }
  }
}

export function annotate(
  element: HTMLElement,
  config: RoughAnnotationConfig,
): RoughAnnotation {
  return new RoughAnnotationImpl(element, config)
}
