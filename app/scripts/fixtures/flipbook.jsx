import { StrictMode, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import HTMLFlipBook from 'react-pageflip'

function Fixture() {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [width, setWidth] = useState(300)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const children = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => (
        <div key={index} style={{ background: index % 2 ? '#fffefa' : '#2b448e' }}>
          {index}
        </div>
      )),
    [],
  )
  return (
    <>
      <style>{'.stf__wrapper { position: relative; height: 100%; }'}</style>
      <button
        onClick={() => {
          setCount(0)
          setMounted(!mounted)
        }}
      >
        {mounted ? 'Unmount' : 'Mount'}
      </button>
      <button onClick={() => ref.current.pageFlip().flip(1)}>Turn</button>
      <button
        onClick={() => {
          setCount(0)
          setWidth(width === 300 ? 320 : 300)
        }}
      >
        Resize
      </button>
      <output data-count={count} data-page={page}>
        {count}
      </output>
      {mounted && (
        <HTMLFlipBook key={width} ref={ref} width={width} height={420} style={{ width: width * 2, height: 420 }} autoSize={false} showCover useMouseEvents={false} onInit={({ object }) => setCount(object.getPageCount())} onFlip={({ data }) => setPage(data)}>
          {children}
        </HTMLFlipBook>
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Fixture />
  </StrictMode>,
)
