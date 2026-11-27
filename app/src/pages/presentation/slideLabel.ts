/** A slide's accessible name: its number, anything the place adds (such as " of 9", or its point), and its heading. */
export function slideLabel(number: number, heading: string, note = ''): string {
  return `Slide ${number}${note}: ${heading}`
}
