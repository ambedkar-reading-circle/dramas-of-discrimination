/** The browser's speech engine, or null where there is none (or no window, as in SSR). */
export function speech(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null
}

/** Whether captions can be read aloud here. */
export const canSpeak = speech() !== null
