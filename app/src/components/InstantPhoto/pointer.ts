export function isMousePointer(event: unknown): boolean {
  return (
    typeof event === 'object' &&
    event !== null &&
    'pointerType' in event &&
    event.pointerType === 'mouse'
  )
}
