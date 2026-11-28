/** Whether the deck plays itself, and whether it reads its captions aloud: `?play` and `?voice` in the URL. */
export type PlaybackSwitches = Readonly<{ play: boolean; voice: boolean }>

/** The switches a URL asks for: each is on unless the URL turns it off. */
export const switchesOf = (search: Readonly<Partial<PlaybackSwitches>>): PlaybackSwitches => ({ play: search.play ?? true, voice: search.voice ?? true })
