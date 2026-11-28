import { useEffect, useState } from 'react'

const copiedMs = 2000

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
