export function slideLabel(number: number, heading: string, note = ''): string {
  return `Slide ${number}${note}: ${heading}`
}
