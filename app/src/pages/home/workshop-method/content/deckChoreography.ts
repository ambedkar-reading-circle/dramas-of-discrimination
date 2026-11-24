/** The deck fan's resting angles, offsets and spring, decoupled from the rendering. */
export const rotations = [-13, -6, 2, 9, 15]
export const offsets = [65, 22, 0, 30, 78]
export const spring = { type: 'spring' as const, stiffness: 220, damping: 28 }
