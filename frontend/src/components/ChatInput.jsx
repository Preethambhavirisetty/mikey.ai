import { useRef, useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const ref = useRef(null)

  function resize() {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  function handleChange(e) {
    setText(e.target.value)
    resize()
  }

  function handleSend() {
    const t = text.trim()
    if (!t || disabled) return
    onSend(t)
    setText('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const canSend = text.trim().length > 0 && !disabled

  return (
    <div className="input-wrap">
      <div className="input-pill">
        <button className="pill-btn" disabled title="Attach file">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <textarea
          ref={ref}
          className="input-field"
          placeholder="Ask Mikey"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKey}
          disabled={disabled}
          rows={1}
        />
        <button
          className={`pill-btn send-btn ${canSend ? 'send-ready' : ''}`}
          onClick={handleSend}
          disabled={!canSend}
          title="Send (Enter)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p className="input-note">Mikey can make mistakes. Think before you trust me blindly.</p>
    </div>
  )
}
