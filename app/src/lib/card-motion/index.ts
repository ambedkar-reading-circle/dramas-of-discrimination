export const cardSpring = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
} as const

const lift = { y: -3, rotate: 0, transition: cardSpring }

export function hoverLift(reduce: boolean) {
  return reduce ? {} : { whileHover: lift, whileFocus: lift }
}
