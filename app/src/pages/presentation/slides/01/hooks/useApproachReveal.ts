import { createContext, use } from 'react'
import type { Reveal } from '#/components/Reveal'
import type { ApproachSide } from '../types'

export const ApproachRevealContext =
  createContext<Reveal<ApproachSide> | null>(null)

export function useApproachReveal(): Reveal<ApproachSide> {
  const reveal = use(ApproachRevealContext)
  if (!reveal)
    throw new Error(
      'useApproachReveal must be used inside ApproachRevealContext',
    )
  return reveal
}
