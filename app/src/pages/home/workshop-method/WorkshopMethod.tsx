import { useRef } from 'react'
import './WorkshopMethod.css'
import NotebookSurface from '#/components/NotebookSurface'
import { MethodCollection } from './components/MethodCollection'
import { viewportSection } from '../FitSectionButton'

export default function WorkshopMethod() {
  const surface = useRef<HTMLElement>(null)
  const content = useRef<HTMLDivElement>(null)

  return (
    <NotebookSurface as="section" {...viewportSection} ref={surface} tone="inverse" id="workshop-method" className="notebook-section workshop-method-surface">
      <div ref={content} className="page-wrap workshop-method">
        <div className="section-lede">
          <p className="eyebrow">The workshop, in five acts</p>
        </div>
        <MethodCollection fitTo={{ surface, content }} />
      </div>
    </NotebookSurface>
  )
}
