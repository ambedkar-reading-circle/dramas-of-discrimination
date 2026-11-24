import TabletFrame from './TabletFrame'

export default function TabletVideoFrame({ className }: { className?: string }) {
  return (
    <TabletFrame className={className}>
      <iframe src="https://www.youtube-nocookie.com/embed/_H9tByQyBv8" title="Dramas of Discrimination video" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
    </TabletFrame>
  )
}
