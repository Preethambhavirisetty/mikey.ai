import { useState } from 'react'
import { groupByDate } from '../utils/history'

export default function Sidebar({ sessions, activeId, onSelect, onNewChat, onDelete, onClose, onProfileClick }) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? sessions.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
    : sessions
  const groups = groupByDate(filtered)

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="brand-text">Mikey</span>
        {onClose && (
          <button className="brand-close" onClick={onClose} title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Primary nav rows */}
      <nav className="sidebar-nav">
        <button className="nav-item nav-item-primary" onClick={onNewChat}>
          <span className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </span>
          New chat
        </button>

        <div className="sidebar-search-row">
          <span className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search chats"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="nav-item" disabled>
          <span className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Daily brief
        </button>
      </nav>

      {/* Notebooks */}


      {/* Recents / history list */}
      <div className="sidebar-section sidebar-section-flex">
        <p className="sidebar-section-label">Recents</p>
        <div className="history-scroll">
          {groups.length === 0 && !search && (
            <p className="history-empty">No conversations yet</p>
          )}
          {groups.map(({ label, items }) => (
            <div key={label} className="history-group">
              <p className="history-label">{label}</p>
              {items.map((s) => (
                <div
                  key={s.id}
                  className={`history-item ${s.id === activeId ? 'history-active' : ''}`}
                  onClick={() => onSelect(s.id)}
                >
                  <span className="history-title">{s.title}</span>
                  <button
                    className="history-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(s.id) }}
                    title="Delete"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* User profile */}
      <div className="sidebar-profile">
        <button className="profile-main" onClick={onProfileClick} title="How Mikey addresses you">
          <div className="profile-avatar">P</div>
          <div className="profile-info">
            <p className="profile-name">Preetham</p>
            <p className="profile-email">preethambhavirisetty66@gmail.com</p>
          </div>
        </button>
        <button className="profile-settings" onClick={onProfileClick} title="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
