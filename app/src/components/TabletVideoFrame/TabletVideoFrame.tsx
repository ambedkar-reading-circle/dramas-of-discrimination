import type { Ref } from 'react'
import TabletFrame from './TabletFrame'

/** The embed's origin, for messages to and from its player. */
export const videoOrigin = 'https://www.youtube-nocookie.com'

export default function TabletVideoFrame({ className, ref }: { className?: string; ref?: Ref<HTMLIFrameElement> }) {
  return (
    <TabletFrame className={className}>
      {/* enablejsapi lets the /approach deck play the film, and hear when it ends, by postMessage. */}
      <iframe ref={ref} src={`${videoOrigin}/embed/_H9tByQyBv8?enablejsapi=1`} title="Dramas of Discrimination video" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
    </TabletFrame>
  )
}
