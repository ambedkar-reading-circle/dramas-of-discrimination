import { useLayoutEffect, useReducer, useRef, useState } from 'react'

const followMargin = 24

const edgeSlack = 2

const streamSelector = '.mani-stream'

export type CharterOverflow = Readonly<{ above: boolean; below: boolean }>

export function useCharterScroll(follow: boolean) {
  const page = useRef<HTMLDivElement>(null)
  const [, onScroll] = useReducer((count: number) => count + 1, 0)
  const [overflow, setOverflow] = useState<CharterOverflow>({ above: false, below: false })

  useLayoutEffect(() => {
    const element = page.current
    if (!element) return
    const above = element.scrollTop > edgeSlack
    const below = element.scrollTop + element.clientHeight < element.scrollHeight - edgeSlack
    setOverflow((current) => (current.above === above && current.below === below ? current : { above, below }))
  })

  useLayoutEffect(() => {
    const element = page.current
    const stream = element?.querySelector(streamSelector)
    if (!follow || !element || !stream) return
    const box = element.getBoundingClientRect()
    const scale = box.height / element.offsetHeight || 1
    const at = stream.getBoundingClientRect()
    const below = (at.bottom - box.bottom) / scale + followMargin
    const above = (at.top - box.top) / scale - followMargin
    if (below > 0) element.scrollTop += below
    else if (above < 0) element.scrollTop += above
  })

  const scrollOn = () => page.current?.scrollBy({ top: page.current.clientHeight * 0.7, behavior: 'smooth' })

  return { page, overflow, onScroll, scrollOn }
}
