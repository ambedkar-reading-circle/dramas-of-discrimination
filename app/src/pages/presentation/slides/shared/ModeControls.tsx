import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import { members } from './content/actorMap'
import './modes.css'

export type Mode = 'local' | 'cloud'

/** The mode switch's thumb snaps across quickly. */
const thumbSpring: Transition = { type: 'spring', stiffness: 380, damping: 32 }

const status: Record<Mode, string> = {
  local: 'Data stays on this device',
  cloud: 'Shared with the platform · live',
}

/** Local or Cloud, in the guide's top bar. */
function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const options: ReadonlyArray<{ value: Mode; label: string; icon: string }> = [
    { value: 'local', label: 'Local', icon: 'M3 5h18v11H3zM8 20h8M12 16v4' },
    { value: 'cloud', label: 'Cloud', icon: 'M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z' },
  ]
  return (
    <span className="modes-switch" role="group" aria-label="Mode">
      {options.map((option) => (
        <button key={option.value} type="button" aria-pressed={mode === option.value} onClick={() => onChange(option.value)}>
          {mode === option.value && <motion.span layoutId="modes-switch-thumb" className="modes-switch-thumb" transition={thumbSpring} />}
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d={option.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span>{option.label}</span>
        </button>
      ))}
    </span>
  )
}

/** Where the data lives, at the end of the top bar. */
function ModeChip({ mode }: { mode: Mode }) {
  return (
    <span className="modes-chip" data-mode={mode}>
      <span className="modes-chip-dot" aria-hidden="true" />
      {status[mode]}
    </span>
  )
}

/** Every Member in the document, by face. */
function Presence() {
  return (
    <span className="modes-presence" aria-label={`${members.length} Members editing: ${members.map((member) => member.name).join(', ')}`}>
      <span className="modes-avatars">
        {members.map((member, index) => (
          <motion.span key={member.id} className="modes-avatar" style={{ background: member.color }} title={member.name} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.08 }}>
            {member.name[0]}
          </motion.span>
        ))}
      </span>
    </span>
  )
}

/** The guide's top bar past its title: the mode switch, who is present in Cloud mode, and where the data lives. */
export function ModeBar({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <>
      <ModeSwitch mode={mode} onChange={onChange} />
      {mode === 'cloud' && <Presence />}
      <ModeChip mode={mode} />
    </>
  )
}
