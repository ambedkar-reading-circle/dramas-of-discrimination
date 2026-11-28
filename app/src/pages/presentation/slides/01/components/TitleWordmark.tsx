import { useEffect, useRef, useState } from 'react'
import DodLogo from '#/components/DodLogo'
import { useCueTarget } from '../../../playback/targets'
import { useWordmarkBracket } from '../hooks/useWordmarkBracket'

declare module '../../../playback/cues' {
  interface CueTargets {
    wordmark: boolean
  }
}

export default function TitleWordmark() {
  const wordmark = useRef<HTMLSpanElement>(null)
  const { show, hide } = useWordmarkBracket(wordmark)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [cued, setCued] = useState(false)
  useCueTarget('wordmark', setCued, { rest: false })

  const cycling = hovered || cued
  const bracketed = cycling || focused
  useEffect(() => (bracketed ? show() : hide()), [bracketed, show, hide])

  return (
    <h1
      className="slide-title-heading relative text-balance"
      tabIndex={-1}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'touch') setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) setFocused(true)
      }}
      onBlur={() => setFocused(false)}
    >
      <DodLogo ref={wordmark} held={cycling} />
    </h1>
  )
}
