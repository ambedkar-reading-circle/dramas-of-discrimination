import { useEffect, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { TargetAndTransition, Transition } from 'motion/react'
import { useMediaQuery } from '#/lib/use-media-query'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

const ofClasses = 'font-of text-[2.15em] font-normal leading-0 tracking-[0]'

const lineClasses = 'block relative top-[calc(0.5lh_-_var(--notebook-row)_+_var(--notebook-baseline)_-_var(--notebook-font-mono))]'

const titleWords = ['Discrimination', 'Diversity', 'Inclusivity', 'Fraternity', 'Belonging'] as const
const linkWords = ['of', 'for'] as const
const printedLinkWord = ['of'] as const

type WordSwap = { hidden: TargetAndTransition; shown: TargetAndTransition; leaving: TargetAndTransition; transition: Transition }

const roll: WordSwap = {
  hidden: { y: '0.8em', scale: 0.92, opacity: 0, filter: 'blur(0.08em)' },
  shown: { y: '0em', scale: 1, opacity: 1, filter: 'blur(0em)' },
  leaving: { y: '-0.8em', scale: 0.92, opacity: 0, filter: 'blur(0.08em)' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

const gatherHidden = { letterSpacing: '-0.2em', opacity: 0 }
const gather: WordSwap = {
  hidden: gatherHidden,
  shown: { letterSpacing: '0em', opacity: 1 },
  leaving: gatherHidden,
  transition: { duration: 0.2, ease: 'easeInOut' },
}

const fade: WordSwap = { hidden: { opacity: 0 }, shown: { opacity: 1 }, leaving: { opacity: 0 }, transition: { duration: 0.15 } }

function useSwapProps(swap: WordSwap) {
  const reducedMotion = useMediaQuery(reducedMotionQuery)
  const { hidden, shown, leaving, transition } = reducedMotion ? fade : swap
  return { initial: hidden, animate: shown, exit: leaving, transition }
}

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

function LinkWord({ cycling, showsAlternate }: { cycling: boolean; showsAlternate: boolean }) {
  const swapProps = useSwapProps(gather)
  const linkWord = showsAlternate ? 'for' : 'of'
  return (
    <WordSlot words={cycling ? linkWords : printedLinkWord} className={ofClasses}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={linkWord} className="[grid-area:1/1]" {...swapProps}>
          {linkWord}
        </motion.span>
      </AnimatePresence>
    </WordSlot>
  )
}

function TitleWord({ word, printed = false }: { word: string; printed?: boolean }) {
  const swapProps = useSwapProps(roll)
  return (
    <WordSlot words={titleWords}>
      <AnimatePresence initial={false}>
        <motion.span key={word} className={`[grid-area:1/1] ${printed ? 'printed-ink' : ''}`} {...swapProps}>
          {word}
        </motion.span>
      </AnimatePresence>
    </WordSlot>
  )
}

function useTitleCycle() {
  const [cycling, setCycling] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    if (!cycling) return
    const timer = setInterval(() => {
      setWordIndex((index) => (index + 1) % titleWords.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [cycling])

  const startCycling = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    setCycling(true)
    setWordIndex(1)
  }
  const stopCycling = () => {
    setCycling(false)
    setWordIndex(0)
  }

  return { word: titleWords[wordIndex], showsAlternate: wordIndex !== 0, cycling, startCycling, stopCycling }
}

export default function DodLogo({ variant = 'hero' }: { variant?: 'hero' | 'inline' }) {
  const { word, showsAlternate, cycling, startCycling, stopCycling } = useTitleCycle()

  const inkClasses = `transition-[filter] duration-200 ease-out ${cycling ? '[filter:drop-shadow(0_0_max(0.02em,0.5px)_currentColor)_drop-shadow(0_0_max(0.12em,4px)_color-mix(in_srgb,currentColor_40%,transparent))]' : ''}`

  if (variant === 'inline') {
    return (
      <span className={`block font-logo font-normal text-[0.875rem] leading-(--notebook-row) whitespace-normal max-sm:text-[0.75rem] ${inkClasses}`} onPointerEnter={startCycling} onPointerLeave={stopCycling}>
        Dramas <LinkWord cycling={cycling} showsAlternate={showsAlternate} /> <TitleWord word={word} />
        <span className="sr-only"> of Discrimination</span>
      </span>
    )
  }

  return (
    <span className={`block w-fit text-start font-logo font-normal text-[min(10cqi,8rem)] tracking-[-0.055em] leading-[round(up,1.3em,var(--notebook-row))] ${inkClasses}`} onPointerEnter={startCycling} onPointerLeave={stopCycling}>
      <span className={`dod-logo-first ${lineClasses}`}>
        <span className="printed-ink">Dramas</span>
        <span className="sr-only"> of Discrimination</span> <LinkWord cycling={cycling} showsAlternate={showsAlternate} />
      </span>
      <span className={`dod-logo-last ${lineClasses}`}>
        <TitleWord word={word} printed />
      </span>
    </span>
  )
}
