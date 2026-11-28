type KeyPress = Pick<KeyboardEvent, 'key' | 'defaultPrevented' | 'metaKey' | 'ctrlKey' | 'altKey' | 'target'>

export function plainKey(event: KeyPress): boolean {
  return !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.altKey
}

export function keyName(event: KeyPress): string {
  return event.key.length === 1 ? event.key.toLowerCase() : event.key
}

export const controlSelector =
  'button, a[href], input, textarea, select, [role="button"], [role="tab"]'

export const typingSelector =
  'input, textarea, select, [contenteditable="true"]'

export function pressedOn(event: KeyPress, selector: string): boolean {
  return event.target instanceof Element && event.target.closest(selector) !== null
}
