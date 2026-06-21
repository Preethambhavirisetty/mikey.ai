import { useState } from 'react'

const PRESETS = ['Bro', 'Dude', 'Buddy', 'Champ']

export default function NicknameModal({ current, onSave, onClose }) {
  const [custom, setCustom] = useState(PRESETS.includes(current) ? '' : current)
  const [selected, setSelected] = useState(PRESETS.includes(current) ? current : (current ? 'Custom' : ''))

  function pickPreset(name) {
    setSelected(name)
    setCustom('')
  }

  function handleSave() {
    const value = selected === 'Custom' ? custom : selected
    onSave(value)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">What should Mikey call you?</h2>
        <p className="modal-sub">Pick a vibe, or set your own. Leave it blank to use your name.</p>

        <div className="modal-presets">
          {PRESETS.map((name) => (
            <button
              key={name}
              className={`modal-chip ${selected === name ? 'modal-chip-active' : ''}`}
              onClick={() => pickPreset(name)}
            >
              {name}
            </button>
          ))}
          <button
            className={`modal-chip ${selected === 'Custom' ? 'modal-chip-active' : ''}`}
            onClick={() => setSelected('Custom')}
          >
            Custom
          </button>
        </div>

        {selected === 'Custom' && (
          <input
            className="modal-input"
            type="text"
            placeholder="e.g. Captain, Boss, Preet..."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            maxLength={40}
            autoFocus
          />
        )}

        <div className="modal-actions">
          <button className="modal-btn modal-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="modal-btn modal-btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
