// Side panel for viewing & editing quest notes
import { useState, useEffect } from 'react'

function NotesSidePanel({ quest, onClose, onSave, darkMode }) {
  const [text, setText] = useState(quest?.notes || '')

  useEffect(() => {
    setText(quest?.notes || '')
  }, [quest])

  if (!quest) return null

  const bg = darkMode ? '#111118' : '#ffffff'
  const border = darkMode ? '#2a2a3a' : '#e5e7eb'
  const textColor = darkMode ? '#e2e8f0' : '#111827'
  const muted = darkMode ? '#64748b' : '#9ca3af'
  const inputBg = darkMode ? '#1a1a24' : '#f9fafb'

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 150
      }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '360px',
        background: bg, borderLeft: `1px solid ${border}`,
        zIndex: 200, display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.2s ease',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span style={{ fontSize: '18px' }}>{quest.icon || '⚔️'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: '14px', color: textColor, margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>{quest.title}</p>
            <p style={{ fontSize: '11px', color: muted, margin: 0 }}>{quest.category} · {quest.difficulty}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: muted, cursor: 'pointer', fontSize: '18px'
          }}>×</button>
        </div>

        {/* Notes area */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '11px', color: muted, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
            💬 Notes & Journal
          </p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write anything — thoughts, subtasks, links, progress notes..."
            style={{
              flex: 1, background: inputBg, border: `1px solid ${border}`,
              borderRadius: '10px', padding: '12px', color: textColor,
              fontSize: '14px', lineHeight: '1.6', resize: 'none', outline: 'none',
              fontFamily: 'system-ui, sans-serif',
            }}
            onFocus={e => e.target.style.borderColor = '#7c3aed'}
            onBlur={e => e.target.style.borderColor = border}
            autoFocus
          />
          <p style={{ fontSize: '11px', color: muted, textAlign: 'right', margin: 0 }}>
            {text.length} chars
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${border}`, display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', borderRadius: '8px',
            border: `1px solid ${border}`, background: inputBg,
            color: muted, fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}>Cancel</button>
          <button onClick={() => { onSave(quest.id, text); onClose() }} style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
            background: '#7c3aed', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}>Save Notes</button>
        </div>
      </div>
    </>
  )
}

export default NotesSidePanel