import { useEffect, useState } from 'react'

/** How long the "copied" confirmation stays before the button resets. */
const copiedMs = 2000

/** Copies `text` to the clipboard and reports `copied` until the confirmation lapses. */
export function useCopyText(text: string) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), copiedMs)
    return () => clearTimeout(timer)
  }, [copied])

  function copy() {
    navigator.clipboard.writeText(text).then(
      () => setCopied(true),
      () => setCopied(false),
    )
  }

  return { copied, copy }
}
