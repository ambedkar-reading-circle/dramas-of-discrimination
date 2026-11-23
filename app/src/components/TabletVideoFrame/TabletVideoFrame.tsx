import './TabletVideoFrame.css'

/** The project video inside the tablet mockup. The single source of the clip
 * id and embed privacy settings for every surface that shows it. */
export default function TabletVideoFrame({ className }: { className?: string }) {
  return (
    <div className={`tablet-video-frame${className ? ` ${className}` : ''}`}>
      <span className="tablet-video-camera" aria-hidden="true" />
      <span className="tablet-video-button tablet-video-button--volume-one" aria-hidden="true" />
      <span className="tablet-video-button tablet-video-button--volume-two" aria-hidden="true" />
      <span className="tablet-video-button tablet-video-button--power" aria-hidden="true" />
      <div className="tablet-video-screen">
        <iframe src="https://www.youtube-nocookie.com/embed/_H9tByQyBv8" title="Dramas of Discrimination video" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      </div>
    </div>
  )
}