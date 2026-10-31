import { createElement } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { NotebookDecoration } from './NotebookMargins'
import './NotebookSurface.css'

export type NotebookSurfaceProps = {
  tone?: 'default' | 'inverse'
  paper?: 'notebook' | 'plain'
} & (({ as?: 'div' } & ComponentPropsWithRef<'div'>) | ({ as: 'main' } & ComponentPropsWithRef<'main'>) | ({ as: 'section' } & ComponentPropsWithRef<'section'>))

/** Keep surface hosts untransformed; animate their content instead. */
export default function NotebookSurface({ as = 'div', tone = 'default', paper = 'notebook', className = '', children, ...attributes }: NotebookSurfaceProps) {
  return createElement(as, { ...attributes, className: `notebook-surface ${className}`.trim(), 'data-tone': tone, 'data-paper': paper }, paper === 'notebook' ? <NotebookDecoration /> : null, children)
}
