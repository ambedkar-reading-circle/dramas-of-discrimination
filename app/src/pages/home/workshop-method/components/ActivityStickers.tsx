import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { joinClasses } from '#/lib/join-classes'
import type { WorkshopActivity } from '../content/workshopActivities'
import { excerptLabels, worksheetLabels } from '../content/sheetOverlay'
import type { StickerLabels } from '../content/sheetOverlay'
import { randomTilt, tilts } from '../content/overlayChoreography'
import type { TiltRange } from '../content/overlayChoreography'
import type { OverlayTriggerProps, TriggerFor } from '../hooks/useSheetOverlay'

interface TapedButtonProps extends OverlayTriggerProps {
  className: string
  ariaLabel: string
  tilt: TiltRange
  children: ReactNode
}

export function TapedButton({ className, ariaLabel, tilt, open, controlsId, onToggle, ref, children }: TapedButtonProps) {
  const [lean] = useState(() => ({ sticker: randomTilt(tilt), tape: randomTilt(tilts.tape) }))
  return (
    <button ref={ref} type="button" className={joinClasses('method-taped', className)} style={{ '--sticker-tilt': `${lean.sticker}deg`, '--tape-tilt': `${lean.tape}deg` } as CSSProperties} aria-expanded={open} aria-controls={controlsId} aria-label={ariaLabel} onClick={onToggle}>
      {children}
    </button>
  )
}

function PaperSticker({ labels, ...trigger }: OverlayTriggerProps & { labels: StickerLabels }) {
  return (
    <TapedButton className="method-manual-sticker" ariaLabel={labels.ariaLabel} tilt={tilts.sticker} {...trigger}>
      <span className="method-manual-sticker-label">{labels.label}</span>
      <span className="method-manual-sticker-range">{labels.detail}</span>
    </TapedButton>
  )
}

export function ManualStickers({ activity, triggerFor }: { activity: WorkshopActivity; triggerFor: TriggerFor }) {
  return (
    <div className="method-manual-stickers">
      {activity.manual.map((excerpt, n) => (
        <PaperSticker key={excerpt.pages.join('-')} labels={excerptLabels(activity.name, excerpt)} {...triggerFor('manual', n)} />
      ))}
    </div>
  )
}

export function WorksheetStickers({ activity, triggerFor }: { activity: WorkshopActivity; triggerFor: TriggerFor }) {
  if (!activity.worksheets) return null
  return (
    <div className="method-worksheets">
      <h4>THE WORKSHEET</h4>
      <div className="method-worksheet-stickers">
        {activity.worksheets.map((worksheet, n) => (
          <PaperSticker key={worksheet.label} labels={worksheetLabels(activity.name, worksheet)} {...triggerFor('worksheet', n)} />
        ))}
      </div>
    </div>
  )
}
