// Adapted from rough-notation — © Preet Shihn / rough-stuff (MIT)
// https://github.com/rough-stuff/rough-notation
// Clean-room re-implementation of its renderer. Deviations from the original:
//  - The stroke-draw animation uses WAAPI instead of an injected CSS
//    @keyframes rule, so playback is not disabled by global reduced-motion
//    `animation: none` rules and can be reversed for retractable hide().
//  - An explicit prefers-reduced-motion gate makes drawing instant.

import { SVG_NS } from './model'
import type {
  BracketType,
  FullPadding,
  Rect,
  RoughAnnotationConfig,
} from './model'
import type { OpSet, ResolvedOptions } from 'roughjs/bin/core'
import type { Point } from 'roughjs/bin/geometry'
import { ellipse, line, linearPath, rectangle } from 'roughjs/bin/renderer'

export interface RenderResult {
  paths: SVGPathElement[]
  lengths: number[]
  animations: Animation[]
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type RoughOptionsType = 'highlight' | 'single' | 'double'

function getOptions(type: RoughOptionsType, seed: number): ResolvedOptions {
  return {
    maxRandomnessOffset: 2,
    roughness: type === 'highlight' ? 3 : 1.5,
    bowing: 1,
    stroke: '#000',
    strokeWidth: 1.5,
    curveTightness: 0,
    curveFitting: 0.95,
    curveStepCount: 9,
    fillStyle: 'hachure',
    fillWeight: -1,
    hachureAngle: -41,
    hachureGap: -1,
    dashOffset: -1,
    dashGap: -1,
    zigzagOffset: -1,
    disableMultiStroke: type !== 'double',
    disableMultiStrokeFill: false,
    preserveVertices: false,
    fillShapeRoughnessGain: 0.8,
    seed,
  }
}

function parsePadding(config: RoughAnnotationConfig): FullPadding {
  const p = config.padding
  if (p || p === 0) {
    if (typeof p === 'number') {
      return [p, p, p, p]
    }
    if (Array.isArray(p)) {
      const pa = p as number[]
      if (pa.length) {
        switch (pa.length) {
          case 4:
            return [...pa] as FullPadding
          case 1:
            return [pa[0], pa[0], pa[0], pa[0]]
          case 2:
            return [...pa, ...pa] as FullPadding
          case 3:
            return [...pa, pa[1]] as FullPadding
          default:
            return [pa[0], pa[1], pa[2], pa[3]]
        }
      }
    }
  }
  return [5, 5, 5, 5]
}

export function renderAnnotation(
  svg: SVGSVGElement,
  rect: Rect,
  config: RoughAnnotationConfig,
  animationGroupDelay: number,
  animationDuration: number,
  seed: number,
): RenderResult {
  const opList: OpSet[] = []
  let strokeWidth = config.strokeWidth || 2
  const padding = parsePadding(config)
  const animate = config.animate === undefined ? true : !!config.animate
  const iterations = config.iterations || 2
  const rtl = config.rtl ? 1 : 0
  const o = getOptions('single', seed)

  switch (config.type) {
    case 'underline': {
      const y = rect.y + rect.h + padding[2]
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          opList.push(line(rect.x + rect.w, y, rect.x, y, o))
        } else {
          opList.push(line(rect.x, y, rect.x + rect.w, y, o))
        }
      }
      break
    }
    case 'strike-through': {
      const y = rect.y + rect.h / 2
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          opList.push(line(rect.x + rect.w, y, rect.x, y, o))
        } else {
          opList.push(line(rect.x, y, rect.x + rect.w, y, o))
        }
      }
      break
    }
    case 'box': {
      const x = rect.x - padding[3]
      const y = rect.y - padding[0]
      const width = rect.w + (padding[1] + padding[3])
      const height = rect.h + (padding[0] + padding[2])
      for (let i = 0; i < iterations; i++) {
        opList.push(rectangle(x, y, width, height, o))
      }
      break
    }
    case 'bracket': {
      const brackets: BracketType[] = Array.isArray(config.brackets)
        ? config.brackets
        : config.brackets
          ? [config.brackets]
          : ['right']
      const lx = rect.x - padding[3] * 2
      const rx = rect.x + rect.w + padding[1] * 2
      const ty = rect.y - padding[0] * 2
      const by = rect.y + rect.h + padding[2] * 2
      for (const br of brackets) {
        let points: Point[]
        switch (br) {
          case 'bottom':
            points = [
              [lx, rect.y + rect.h],
              [lx, by],
              [rx, by],
              [rx, rect.y + rect.h],
            ]
            break
          case 'top':
            points = [
              [lx, rect.y],
              [lx, ty],
              [rx, ty],
              [rx, rect.y],
            ]
            break
          case 'left':
            points = [
              [rect.x, ty],
              [lx, ty],
              [lx, by],
              [rect.x, by],
            ]
            break
          case 'right':
            points = [
              [rect.x + rect.w, ty],
              [rx, ty],
              [rx, by],
              [rect.x + rect.w, by],
            ]
            break
        }
        opList.push(linearPath(points, false, o))
      }
      break
    }
    case 'crossed-off': {
      const x = rect.x
      const y = rect.y
      const x2 = x + rect.w
      const y2 = y + rect.h
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          opList.push(line(x2, y2, x, y, o))
        } else {
          opList.push(line(x, y, x2, y2, o))
        }
      }
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          opList.push(line(x, y2, x2, y, o))
        } else {
          opList.push(line(x2, y, x, y2, o))
        }
      }
      break
    }
    case 'circle': {
      const doubleO = getOptions('double', seed)
      const width = rect.w + (padding[1] + padding[3])
      const height = rect.h + (padding[0] + padding[2])
      const x = rect.x - padding[3] + width / 2
      const y = rect.y - padding[0] + height / 2
      const fullItr = Math.floor(iterations / 2)
      const singleItr = iterations - fullItr * 2
      for (let i = 0; i < fullItr; i++) {
        opList.push(ellipse(x, y, width, height, doubleO))
      }
      for (let i = 0; i < singleItr; i++) {
        opList.push(ellipse(x, y, width, height, o))
      }
      break
    }
    case 'highlight': {
      const highlightOptions = getOptions('highlight', seed)
      strokeWidth = rect.h * 0.95
      const y = rect.y + rect.h / 2
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          opList.push(line(rect.x + rect.w, y, rect.x, y, highlightOptions))
        } else {
          opList.push(line(rect.x, y, rect.x + rect.w, y, highlightOptions))
        }
      }
      break
    }
  }

  const result: RenderResult = { paths: [], lengths: [], animations: [] }
  if (!opList.length) {
    return result
  }

  const pathStrings = opsToPath(opList)
  const pathElements: SVGPathElement[] = []
  const shouldAnimate = animate && !prefersReducedMotion()

  for (const d of pathStrings) {
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', d)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', config.color || 'currentColor')
    path.setAttribute('stroke-width', `${strokeWidth}`)
    svg.appendChild(path)
    pathElements.push(path)
  }

  if (shouldAnimate) {
    const lengths = pathElements.map((p) => p.getTotalLength())
    const totalLength = lengths.reduce((sum, n) => sum + n, 0)
    let durationOffset = 0
    for (let i = 0; i < pathElements.length; i++) {
      const path = pathElements[i]
      const length = lengths[i]
      const duration = totalLength
        ? animationDuration * (length / totalLength)
        : 0
      const delay = animationGroupDelay + durationOffset
      const style = path.style
      // Hide the stroke during the delay phase; the animation replaces this.
      style.strokeDasharray = `${length}`
      style.strokeDashoffset = `${length}`
      const animation = path.animate(
        [{ strokeDashoffset: `${length}` }, { strokeDashoffset: '0' }],
        {
          duration,
          delay,
          easing: 'ease-out',
          fill: 'forwards',
        },
      )
      result.animations.push(animation)
      result.lengths.push(length)
      durationOffset += duration
    }
  }

  result.paths = pathElements
  return result
}

function opsToPath(opList: OpSet[]): string[] {
  const paths: string[] = []
  for (const drawing of opList) {
    let path = ''
    for (const item of drawing.ops) {
      const data = item.data
      switch (item.op) {
        case 'move':
          if (path.trim()) {
            paths.push(path.trim())
          }
          path = `M${data[0]} ${data[1]} `
          break
        case 'bcurveTo':
          path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `
          break
        case 'lineTo':
          path += `L${data[0]} ${data[1]} `
          break
      }
    }
    if (path.trim()) {
      paths.push(path.trim())
    }
  }
  return paths
}
