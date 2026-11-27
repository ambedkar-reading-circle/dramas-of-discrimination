/** The parts of a key press the deck reads: a DOM event and a React one both have them. */
type KeyPress = Pick<KeyboardEvent, 'key' | 'defaultPrevented' | 'metaKey' | 'ctrlKey' | 'altKey' | 'target'>

/** A key press the deck may act on: not already handled, and not a shortcut (Shift is allowed). */
export function plainKey(event: KeyPress): boolean {
  return !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.altKey
}

/** The key, with letters lowercased, so Caps Lock and Shift still reach `n` and `p`. */
export function keyName(event: KeyPress): string {
  return event.key.length === 1 ? event.key.toLowerCase() : event.key
}

/** What a key press inside the slide works, rather than the deck. */
export const controlSelector =
  'button, a[href], input, textarea, select, [role="button"], [role="tab"]'

/** Where a key press is typing, not working a control. */
export const typingSelector =
  'input, textarea, select, [contenteditable="true"]'

/** Whether the key press lands on a control of this selector. */
export function pressedOn(event: KeyPress, selector: string): boolean {
  return event.target instanceof Element && event.target.closest(selector) !== null
}
