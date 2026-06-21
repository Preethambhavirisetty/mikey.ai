export default function ChatHeader({ onMenuClick }) {
  return (
    <header className="chat-header">
      <div className="header-left">
        {onMenuClick && (
          <button className="header-menu-btn" onClick={onMenuClick} title="Menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        <div className="model-badge">
          Ollama
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="header-right">
        <button className="header-avatar">P</button>
      </div>
    </header>
  )
}
