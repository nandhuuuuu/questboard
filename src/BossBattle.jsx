// Boss Battle — a big goal broken into sub-quests
import { useState } from 'react'

function BossBattle({ bosses, onAddBoss, onDeleteBoss, onToggleSubQuest, darkMode }) {
  const [showForm, setShowForm] = useState(false)
  const [bossTitle, setBossTitle] = useState('')
  const [bossIcon, setBossIcon] = useState('🐉')
  const [subInput, setSubInput] = useState('')
  const [subs, setSubs] = useState([])

  const bg = darkMode ? '#111118' : '#ffffff'
  const border = darkMode ? '#2a2a3a' : '#e5e7eb'
  const inputBg = darkMode ? '#1a1a24' : '#f9fafb'
  const textColor = darkMode ? '#e2e8f0' : '#111827'
  const muted = darkMode ? '#64748b' : '#9ca3af'
  const BOSS_ICONS = ['🐉','👹','💀','🧙','🦹','👾','🏰','⚡','🌋','🔮']

  const addSub = () => {
    if (!subInput.trim()) return
    setSubs(s => [...s, { id: Date.now(), title: subInput.trim(), done: false }])
    setSubInput('')
  }

  const submitBoss = () => {
    if (!bossTitle.trim() || subs.length === 0) return
    onAddBoss({ id: Date.now(), title: bossTitle.trim(), icon: bossIcon, subs })
    setBossTitle(''); setSubs([]); setShowForm(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', color: muted, letterSpacing: '2px', textTransform: 'uppercase' }}>
          🐉 Boss Battles
        </span>
        <button onClick={() => setShowForm(f => !f)} style={{
          background: '#7c3aed', color: '#fff', border: 'none',
          borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
        }}>+ New Boss</button>
      </div>

      {bosses.length === 0 && !showForm && (
        <p style={{ color: muted, textAlign: 'center', padding: '32px 0', fontSize: '13px' }}>
          No boss battles yet. Create a big goal! 🐉
        </p>
      )}

      {/* Add boss form */}
      {showForm && (
        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <p style={{ fontSize: '11px', color: muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Boss Name</p>

          {/* Icon picker */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {BOSS_ICONS.map(i => (
              <button key={i} onClick={() => setBossIcon(i)} style={{
                fontSize: '18px', padding: '4px 6px', borderRadius: '8px', cursor: 'pointer',
                border: `2px solid ${bossIcon === i ? '#7c3aed' : 'transparent'}`,
                background: bossIcon === i ? 'rgba(124,58,237,0.15)' : 'transparent'
              }}>{i}</button>
            ))}
          </div>

          <input
            type="text" placeholder="e.g. Launch my side project..."
            value={bossTitle} onChange={e => setBossTitle(e.target.value)}
            style={{
              width: '100%', background: inputBg, border: `1px solid ${border}`,
              borderRadius: '8px', padding: '9px 12px', color: textColor,
              fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box'
            }}
          />

          <p style={{ fontSize: '11px', color: muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Sub-quests</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text" placeholder="Add a sub-quest..."
              value={subInput} onChange={e => setSubInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSub()}
              style={{
                flex: 1, background: inputBg, border: `1px solid ${border}`,
                borderRadius: '8px', padding: '8px 12px', color: textColor,
                fontSize: '13px', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <button onClick={addSub} style={{
              background: 'rgba(124,58,237,0.2)', border: 'none', borderRadius: '8px',
              padding: '8px 14px', color: '#a78bfa', fontWeight: 600, cursor: 'pointer', fontSize: '13px'
            }}>+ Add</button>
          </div>

          {subs.map((s, i) => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0',
              borderBottom: `1px solid ${border}`
            }}>
              <span style={{ color: '#a78bfa', fontSize: '12px' }}>◆</span>
              <span style={{ flex: 1, fontSize: '13px', color: textColor }}>{s.title}</span>
              <button onClick={() => setSubs(prev => prev.filter((_, j) => j !== i))} style={{
                background: 'none', border: 'none', color: muted, cursor: 'pointer', fontSize: '12px'
              }}>✕</button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button onClick={() => { setShowForm(false); setBossTitle(''); setSubs([]) }} style={{
              flex: 1, padding: '9px', borderRadius: '8px', border: `1px solid ${border}`,
              background: inputBg, color: muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}>Cancel</button>
            <button onClick={submitBoss} style={{
              flex: 1, padding: '9px', borderRadius: '8px', border: 'none',
              background: '#7c3aed', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}>Create Boss ⚔️</button>
          </div>
        </div>
      )}

      {/* Boss cards */}
      {bosses.map(boss => {
        const done = boss.subs.filter(s => s.done).length
        const pct = Math.round((done / Math.max(boss.subs.length, 1)) * 100)
        const defeated = done === boss.subs.length
        return (
          <div key={boss.id} style={{
            background: bg, border: `1px solid ${defeated ? '#166534' : border}`,
            borderLeft: `3px solid ${defeated ? '#22c55e' : '#7c3aed'}`,
            borderRadius: '10px', padding: '14px', marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '22px' }}>{boss.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '15px', color: defeated ? '#34d399' : textColor, margin: 0 }}>
                  {boss.title}
                  {defeated && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#34d399' }}>DEFEATED! 🎉</span>}
                </p>
                <p style={{ fontSize: '11px', color: muted, margin: '2px 0 0' }}>{done}/{boss.subs.length} sub-quests complete</p>
              </div>
              <button onClick={() => onDeleteBoss(boss.id)} style={{
                background: 'none', border: 'none', color: muted, cursor: 'pointer', fontSize: '12px'
              }}
                onMouseOver={e => e.target.style.color = '#f87171'}
                onMouseOut={e => e.target.style.color = muted}
              >✕</button>
            </div>

            {/* HP bar */}
            <div style={{ background: darkMode ? '#1a1a24' : '#f1f5f9', borderRadius: '99px', height: '6px', marginBottom: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '99px', width: `${pct}%`,
                background: defeated ? '#22c55e' : '#7c3aed', transition: 'width 0.4s'
              }} />
            </div>

            {/* Sub-quests */}
            {boss.subs.map(sub => (
              <div key={sub.id} onClick={() => onToggleSubQuest(boss.id, sub.id)} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 4px',
                cursor: 'pointer', borderRadius: '6px',
                background: sub.done ? 'rgba(52,211,153,0.05)' : 'transparent',
              }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${sub.done ? '#22c55e' : '#52525b'}`,
                  background: sub.done ? '#22c55e' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {sub.done && <span style={{ fontSize: '9px', color: '#fff', fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{
                  fontSize: '13px', color: sub.done ? muted : textColor,
                  textDecoration: sub.done ? 'line-through' : 'none',
                }}>{sub.title}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default BossBattle