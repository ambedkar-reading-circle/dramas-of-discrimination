export type ApproachSide = 'systems' | 'forum' | 'result'

export interface ApproachMethod {
  side: ApproachSide
  name: string
  gain: string
  cost: string
}
