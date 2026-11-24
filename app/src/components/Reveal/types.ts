export interface RevealControls {
  close: () => void
}

export interface Reveal<TKey> extends RevealControls {
  active: TKey | null
  open: (key: TKey) => void
  isOpen: (key: TKey) => boolean
  toggle: (key: TKey) => void
}
