/**
 * A corner of the charter's border: two fern fronds running out along the
 * edges from a curled fiddlehead, after the illuminated borders of the
 * Constitution of India. Drawn for the top-left corner; CSS mirrors it into
 * the others.
 */

type Point = Readonly<{ x: number; y: number }>

/** Frond length along its edge, in viewBox units. */
const length = 118
/** How far the stem bows away from the edge. */
const bow = 5
const leaves = 13

/** The stem's height above the edge at `x`; it is a quadratic curve with its control at the middle. */
const stemY = (x: number) => {
  const t = x / length
  return 2 * t * (1 - t) * -bow
}

/** A lens-shaped leaflet from `base` to `tip`. */
function leaflet(base: Point, tip: Point) {
  const mid = { x: (base.x + tip.x) / 2, y: (base.y + tip.y) / 2 }
  const dx = tip.x - base.x
  const dy = tip.y - base.y
  const width = 0.3
  const side = { x: -dy * width, y: dx * width }
  const f = (n: number) => n.toFixed(1)
  return `M${f(base.x)} ${f(base.y)}Q${f(mid.x + side.x)} ${f(mid.y + side.y)} ${f(tip.x)} ${f(tip.y)}Q${f(mid.x - side.x)} ${f(mid.y - side.y)} ${f(base.x)} ${f(base.y)}Z`
}

/** Leaflets alternate sides and shrink toward the tip, leaning forward like a frond's pinnae. */
const frondLeaves = Array.from({ length: leaves }, (_, i) => {
  const x = 10 + (i / leaves) * (length - 16)
  const size = 15 * (1 - i / (leaves + 2)) + 3
  const side = i % 2 === 0 ? -1 : 1
  const angle = (58 * Math.PI) / 180
  const base = { x, y: stemY(x) }
  return leaflet(base, { x: x + size * Math.cos(angle), y: base.y + side * size * Math.sin(angle) })
}).join('')

const stem = `M0 0Q${length / 2} ${-bow} ${length} 0`
/** The frond's tip, still curling. */
const curl = `M${length} 0c3 -1 5 -4 3 -6.5s-5.5 -1 -4.5 1.5 3 1.5 3 .5`

function Frond({ transform }: { transform?: string }) {
  return (
    <g transform={transform}>
      <path className="fern-stem" d={stem + curl} fill="none" />
      <path className="fern-leaf" d={frondLeaves} />
    </g>
  )
}

export function FernCorner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 150" aria-hidden="true">
      <g transform="translate(16 16)">
        {/* Along the top edge, and mirrored down the side. */}
        <Frond transform="translate(8 0)" />
        <Frond transform="matrix(0 1 1 0 0 8)" />
        {/* The fiddlehead where they meet. */}
        <path className="fern-stem" d="M8 0C2 0 0 2 0 8M8 0c-4 0-6 2-5 5s4 3 4.5 1-1.5-2.5-2.5-1.5" fill="none" />
        <circle className="fern-bud" cx="8" cy="8" r="3" />
      </g>
    </svg>
  )
}
