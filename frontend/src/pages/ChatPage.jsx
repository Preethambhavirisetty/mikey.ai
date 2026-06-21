import { useEffect, useRef, useState } from 'react'
import { clearHistory, fetchHistory, streamMessage } from '../api/chatApi'
import ChatHeader from '../components/ChatHeader'
import ChatInput from '../components/ChatInput'
import MessageCard from '../components/MessageCard'
import NicknameModal from '../components/NicknameModal'
import Sidebar from '../components/Sidebar'
import TypingIndicator from '../components/TypingIndicator'
import { addSession, getSessions, getGreeting, removeSession } from '../utils/history'
import { getAddressAs, setAddressAs } from '../utils/preferences'
import { getSessionId, resetSessionId } from '../utils/session'
import '../styles/chat.css'

export default function ChatPage() {
  const [sessions, setSessions] = useState(getSessions)
  const [activeId, setActiveId] = useState(null)           // null = home/greeting
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [addressAs, setAddressAsState] = useState(getAddressAs)
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const bottomRef = useRef(null)

  function handleSaveNickname(value) {
    setAddressAs(value)
    setAddressAsState(value)
  }

  // current working session id (separate from "activeId" which drives the sidebar selection)
  const sessionIdRef = useRef(getSessionId())

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText, isLoading])

  async function loadSession(id) {
    setActiveId(id)
    sessionIdRef.current = id
    try {
      const data = await fetchHistory(id)
      setMessages(data.messages.map((m) => ({ ...m, timestamp: Date.now() })))
    } catch {
      setMessages([])
    }
  }

  async function handleNewChat() {
    const newId = resetSessionId()
    sessionIdRef.current = newId
    setActiveId(null)
    setMessages([])
    setStreamText('')
  }

  async function handleDelete(id) {
    await clearHistory(id).catch(() => {})
    removeSession(id)
    setSessions(getSessions())
    if (activeId === id) { handleNewChat() }
  }

  async function handleSend(text) {
    const sid = sessionIdRef.current

    // Register in history on first message
    if (!sessions.find((s) => s.id === sid)) {
      addSession(sid, text)
      setSessions(getSessions())
      setActiveId(sid)
    }

    setMessages((prev) => [...prev, { role: 'user', content: text, timestamp: Date.now() }])
    setIsLoading(true)
    setStreamText('')

    let full = ''
    try {
      for await (const token of streamMessage(sid, text, addressAs)) {
        full += token
        setStreamText(full)
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: full, timestamp: Date.now() }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Something went wrong on my end. Give it another shot?",
        timestamp: Date.now(),
      }])
    } finally {
      setStreamText('')
      setIsLoading(false)
    }
  }

  const greeting = getGreeting()
  const showGreeting = messages.length === 0 && !isLoading
  const displayName = addressAs || 'Preetham'

  return (
    <div className="app">
      {sidebarOpen && (
        <Sidebar
          sessions={sessions}
          activeId={activeId}
          onSelect={loadSession}
          onNewChat={handleNewChat}
          onDelete={handleDelete}
          onClose={() => setSidebarOpen(false)}
          onProfileClick={() => setShowNicknameModal(true)}
        />
      )}

      {showNicknameModal && (
        <NicknameModal
          current={addressAs}
          onSave={handleSaveNickname}
          onClose={() => setShowNicknameModal(false)}
        />
      )}

      <div className="main">
        <ChatHeader onMenuClick={() => setSidebarOpen((o) => !o)} />

        <div className="content">
          {showGreeting ? (
            <div className="greeting">
              <div className="sparkle">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" fill="url(#sparkleGrad)"/>
                  <defs>
                    <linearGradient id="sparkleGrad" x1="3" y1="2" x2="21" y2="20">
                      <stop offset="0%" stopColor="#FF9152"/>
                      <stop offset="100%" stopColor="#FF6B2C"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="greet-headline">Where should we start?</h1>
              <p className="greet-sub">{greeting}, {displayName}</p>
            </div>
          ) : (
            <div className="messages">
              {messages.map((m, i) => (
                <MessageCard key={i} role={m.role} content={m.content} timestamp={m.timestamp} />
              ))}
              {isLoading && <TypingIndicator text={streamText} />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  )
}
