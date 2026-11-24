import { useRef } from 'react'
import DodLogo from '#/components/DodLogo'
import { useWordmarkBracket } from '../hooks/useWordmarkBracket'

export default function TitleWordmark() {
  const wordmark = useRef<HTMLSpanElement>(null)
  const { show, hide } = useWordmarkBracket(wordmark)
  return (
    <h1
      className="slide-title-heading relative text-balance"
      tabIndex={-1}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) show()
      }}
      onBlur={hide}
    >
      <DodLogo ref={wordmark} />
    </h1>
  )
}
