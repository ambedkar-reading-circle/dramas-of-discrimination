import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const ofClasses = 'font-of text-[2.15em] font-normal leading-0 tracking-[0]'

const lineClasses = 'block relative top-[calc(0.5lh_-_var(--notebook-row)_+_var(--notebook-baseline)_-_var(--notebook-font-mono))]'

const titleWords = ['Discrimination', 'Diversity', 'Inclusivity', 'Fraternity', 'Belonging'] as const

const rollIn = { y: '0.8em', scale: 0.92, opacity: 0, filter: 'blur(0.08em)' }
const settle = { y: '0em', scale: 1, opacity: 1, filter: 'blur(0em)' }
const rollOut = { y: '-0.8em', scale: 0.92, opacity: 0, filter: 'blur(0.08em)' }

const gatherIn = { letterSpacing: '-0.2em', opacity: 0 }
const restFace = { letterSpacing: '0em', opacity: 1 }
const gatherOut = { letterSpacing: '-0.2em', opacity: 0 }

function WordSlot({ words, className = '', children }: { words: readonly string[]; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-grid justify-items-start ${className}`} aria-hidden="true">
      {words.map((candidate) => (
        <span key={candidate} className="invisible [grid-area:1/1]">
          {candidate}
        </span>
      ))}
      {children}
    </span>
  )
}

const linkWords = ['of', 'for'] as const

function LinkWord({ forAspirations }: { forAspirations: boolean }) {
  const reducedMotion = useReducedMotion()
  return (
    <WordSlot words={linkWords} className={ofClasses}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={forAspirations ? 'for' : 'of'} className="[grid-area:1/1]" initial={reducedMotion ? { opacity: 0 } : gatherIn} animate={reducedMotion ? { opacity: 1 } : restFace} exit={reducedMotion ? { opacity: 0 } : gatherOut} transition={reducedMotion ? { duration: 0.15 } : { duration: 0.2, ease: 'easeInOut' }}>
          {forAspirations ? 'for' : 'of'}
        </motion.span>
      </AnimatePresence>
    </WordSlot>
  )
}

function TitleWord({ word, printed = false }: { word: string; printed?: boolean }) {
  const reducedMotion = useReducedMotion()
  return (
    <WordSlot words={titleWords}>
      <AnimatePresence initial={false}>
        <motion.span key={word} className={`[grid-area:1/1] ${printed ? 'printed-ink' : ''}`} initial={reducedMotion ? { opacity: 0 } : rollIn} animate={reducedMotion ? { opacity: 1 } : settle} exit={reducedMotion ? { opacity: 0 } : rollOut} transition={reducedMotion ? { duration: 0.15 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          {word}
        </motion.span>
      </AnimatePresence>
    </WordSlot>
  )
}

export default function DodLogo({ variant = 'hero' }: { variant?: 'hero' | 'inline' }) {
  const [hovered, setHovered] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    if (!hovered) {
      setWordIndex(0)
      return
    }
    const advance = setInterval(() => {
      setWordIndex((index) => (index + 1) % titleWords.length)
    }, 1800)
    return () => clearInterval(advance)
  }, [hovered])

  const beginRehearsal = () => {
    setHovered(true)
    setWordIndex((index) => (index + 1) % titleWords.length)
  }
  const endRehearsal = () => setHovered(false)

  const inkClasses = `transition-[filter] duration-200 ease-out ${hovered ? '[filter:drop-shadow(0_0_max(0.02em,0.5px)_currentColor)_drop-shadow(0_0_max(0.12em,4px)_color-mix(in_srgb,currentColor_40%,transparent))]' : ''}`

  const word = titleWords[wordIndex]
  const forAspirations = wordIndex !== 0

  if (variant === 'inline') {
    return (
      <span className={`block font-logo font-normal text-[0.875rem] leading-(--notebook-row) whitespace-normal max-sm:text-[0.75rem] ${inkClasses}`} onPointerEnter={beginRehearsal} onPointerLeave={endRehearsal}>
        Dramas <LinkWord forAspirations={forAspirations} /> <TitleWord word={word} />
        <span className="sr-only"> of Discrimination</span>
      </span>
    )
  }

  return (
    <span className={`block w-fit text-start font-logo font-normal text-[min(10cqi,8rem)] tracking-[-0.055em] leading-[round(up,1.3em,var(--notebook-row))] ${inkClasses}`} onPointerEnter={beginRehearsal} onPointerLeave={endRehearsal}>
      <span className={`dod-logo-first ${lineClasses}`}>
        <span className="printed-ink">Dramas</span>
        <span className="sr-only"> of Discrimination</span> <LinkWord forAspirations={forAspirations} />
      </span>
      <span className={`dod-logo-last ${lineClasses}`}>
        <TitleWord word={word} printed />
      </span>
    </span>
  )
}
