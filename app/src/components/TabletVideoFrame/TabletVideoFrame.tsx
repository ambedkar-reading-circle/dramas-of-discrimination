import type { Ref } from 'react'
import TabletFrame from './TabletFrame'

export const videoOrigin = 'https://www.youtube-nocookie.com'

export default function TabletVideoFrame({ className, ref }: { className?: string; ref?: Ref<HTMLIFrameElement> }) {
  return (
    <TabletFrame className={className}>
      <iframe ref={ref} src={`${videoOrigin}/embed/_H9tByQyBv8?enablejsapi=1`} title="Dramas of Discrimination video" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
    </TabletFrame>
  )
}
