export type PlaybackSwitches = Readonly<{ play: boolean; voice: boolean }>

export const switchesOf = (search: Readonly<Partial<PlaybackSwitches>>): PlaybackSwitches => ({ play: search.play ?? true, voice: search.voice ?? true })
