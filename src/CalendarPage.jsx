import { useState } from 'react'

const XP_MAP = { Easy: 10, Medium: 25, Hard: 50 }
const ICONS = ['⚔️','📚','💪','💻','🎯','🧘','🍎','✍️','🎨','🔬','🏃','💡','📝','🎮','🌱']
const COLORS = ['#a78bfa','#60a5fa','#34d399','#f472b6','#fb923c','#f87171','#facc15','#38bdf8']
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const DAYS_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function toKey(date) {
  return date.toISOString().slice(0, 10)
}

function today() {
  return new Date()
}

// ── Mini Add Quest Modal ──────────────────────────────────────────────────
function QuickAddModal({ date, darkMode, onAdd, onClose }) {
  const [title, setTitle]       = useState('')
  const [difficulty, setDiff]   = useState('Easy')
  const [icon, setIcon]         = useState('⚔️')
  const [color, setColor]       = useState('#a78bfa')
  const [category, setCat]      = useState('Personal')
  const [hour, setHour]         = useState(9)
  const [notes, setNotes]       = useState('')

  const bg       = darkMode ? '#111118' : '#fff'
  const border   = darkMode ? '#2a2a3a' : '#e5e7eb'
  const inputBg  = darkMode ? '#1a1a24' : '#f9fafb'
  const text     = darkMode ? '#e2e8f0' : '#111827'
  const muted    = darkMode ? '#64748b' : '#9ca3af'

  const submit = () => {
    if (!title.trim()) return
    onAdd({
      id: Date.now() + Math.random(),
      title: title.trim(),
      category,
      difficulty,
      xp: XP_MAP[difficulty],
      icon,
      color,
      notes,
      hour,
      date: toKey(date),
      completed: false,
    })
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 300, padding: '16px'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: bg, border: `1px solid ${border}`, borderRadius: '16px',
        padding: '24px', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h2 style={{ color: '#a78bfa', fontWeight: 700, fontSize: '14px', marginBottom: '4px', letterSpacing: '1px' }}>
          + Quest for {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </h2>

        {/* Title */}
        <input type="text" placeholder="Quest title..." value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          style={{
            width: '100%', background: inputBg, border: `1px solid ${border}`,
            borderRadius: '8px', padding: '9px 12px', color: text,
            fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box'
          }} autoFocus />

        {/* Icon */}
        <p style={{ fontSize: '11px', color: muted, marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Icon</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
          {ICONS.map(i => (
            <button key={i} onClick={() => setIcon(i)} style={{
              fontSize: '16px', padding: '3px 5px', borderRadius: '6px', cursor: 'pointer',
              border: `2px solid ${icon === i ? '#7c3aed' : 'transparent'}`,
              background: icon === i ? 'rgba(124,58,237,0.15)' : 'transparent'
            }}>{i}</button>
          ))}
        </div>

        {/* Color */}
        <p style={{ fontSize: '11px', color: muted, marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Color</p>
        <div style={{ display: 'flex', gap: '7px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{
              width: '22px', height: '22px', borderRadius: '50%', background: c, cursor: 'pointer',
              border: `3px solid ${color === c ? '#fff' : 'transparent'}`,
              outline: color === c ? `2px solid ${c}` : 'none'
            }} />
          ))}
        </div>

        {/* Category */}
        <select value={category} onChange={e => setCat(e.target.value)} style={{
          width: '100%', background: inputBg, border: `1px solid ${border}`,
          borderRadius: '8px', padding: '9px 12px', color: text,
          fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box'
        }}>
          {['Study','Health','Coding','Personal','Work'].map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Difficulty */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {['Easy','Medium','Hard'].map(d => (
            <button key={d} onClick={() => setDiff(d)} style={{
              flex: 1, padding: '7px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${difficulty === d ? '#7c3aed' : border}`,
              background: difficulty === d ? '#7c3aed' : inputBg,
              color: difficulty === d ? '#fff' : muted, fontSize: '12px', fontWeight: 600
            }}>{d} · {XP_MAP[d]}XP</button>
          ))}
        </div>

        {/* Hour */}
        <p style={{ fontSize: '11px', color: muted, marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>⏰ Time</p>
        <select value={hour} onChange={e => setHour(Number(e.target.value))} style={{
          width: '100%', background: inputBg, border: `1px solid ${border}`,
          borderRadius: '8px', padding: '9px 12px', color: text,
          fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box'
        }}>
          {HOURS.map(h => (
            <option key={h} value={h}>
              {h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h-12}:00 PM`}
            </option>
          ))}
        </select>

        {/* Notes */}
        <textarea placeholder="Optional notes..." value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{
            width: '100%', background: inputBg, border: `1px solid ${border}`,
            borderRadius: '8px', padding: '9px 12px', color: text,
            fontSize: '13px', outline: 'none', marginBottom: '16px',
            resize: 'none', height: '52px', boxSizing: 'border-box'
          }} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', borderRadius: '8px',
            border: `1px solid ${border}`, background: inputBg,
            color: muted, fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}>Cancel</button>
          <button onClick={submit} style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
            background: '#7c3aed', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}>Add Quest ⚔️</button>
        </div>
      </div>
    </div>
  )
}

// ── Quest pill used in month/week cells ──────────────────────────────────
function QuestPill({ quest, onDelete, onToggle, darkMode }) {
  const muted = darkMode ? '#64748b' : '#9ca3af'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '4px',
      background: quest.completed ? 'rgba(52,211,153,0.08)' : `${quest.color}18`,
      borderLeft: `2px solid ${quest.completed ? '#34d399' : quest.color}`,
      borderRadius: '4px', padding: '2px 5px', marginBottom: '2px',
      cursor: 'pointer', transition: 'opacity 0.15s',
    }} onClick={() => onToggle(quest.id)}>
      <span style={{ fontSize: '10px' }}>{quest.icon}</span>
      <span style={{
        fontSize: '11px', color: quest.completed ? muted : (darkMode ? '#e2e8f0' : '#111827'),
        textDecoration: quest.completed ? 'line-through' : 'none',
        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        maxWidth: '80px'
      }}>{quest.title}</span>
      <button onClick={e => { e.stopPropagation(); onDelete(quest.id) }} style={{
        background: 'none', border: 'none', color: muted,
        cursor: 'pointer', fontSize: '9px', padding: '0 1px', lineHeight: 1, flexShrink: 0
      }}>✕</button>
    </div>
  )
}

// ── MONTH VIEW ────────────────────────────────────────────────────────────
function MonthView({ year, month, calQuests, darkMode, onAddClick, onDeleteQuest, onToggleQuest }) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayKey = toKey(today())

  const border = darkMode ? '#2a2a3a' : '#e5e7eb'
  const bg     = darkMode ? '#111118' : '#ffffff'
  const muted  = darkMode ? '#64748b' : '#9ca3af'
  const text   = darkMode ? '#e2e8f0' : '#111827'

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: muted,
            letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 0' }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e${idx}`} style={{ minHeight: '90px' }} />
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayQuests = calQuests.filter(q => q.date === key)
          const isToday = key === todayKey
          return (
            <div key={key} style={{
              minHeight: '90px', background: bg,
              border: `1px solid ${isToday ? '#7c3aed' : border}`,
              borderRadius: '6px', padding: '5px',
              boxShadow: isToday ? '0 0 0 1px #7c3aed22' : 'none',
              transition: 'border-color 0.15s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '12px', fontWeight: isToday ? 700 : 400,
                  color: isToday ? '#a78bfa' : text,
                  background: isToday ? 'rgba(124,58,237,0.15)' : 'transparent',
                  borderRadius: '50%', width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{day}</span>
                <button onClick={() => onAddClick(new Date(year, month, day))} style={{
                  background: 'none', border: 'none', color: muted, cursor: 'pointer',
                  fontSize: '14px', lineHeight: 1, padding: '0 1px',
                  opacity: 0.5,
                }}>+</button>
              </div>
              <div style={{ overflow: 'hidden' }}>
                {dayQuests.slice(0, 3).map(q => (
                  <QuestPill key={q.id} quest={q} darkMode={darkMode}
                    onDelete={onDeleteQuest} onToggle={onToggleQuest} />
                ))}
                {dayQuests.length > 3 && (
                  <div style={{ fontSize: '10px', color: muted }}>+{dayQuests.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── WEEK VIEW ─────────────────────────────────────────────────────────────
function WeekView({ weekStart, calQuests, darkMode, onAddClick, onDeleteQuest, onToggleQuest }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })
  const todayKey = toKey(today())
  const border = darkMode ? '#2a2a3a' : '#e5e7eb'
  const bg     = darkMode ? '#111118' : '#ffffff'
  const muted  = darkMode ? '#64748b' : '#9ca3af'
  const text   = darkMode ? '#e2e8f0' : '#111827'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
      {days.map(day => {
        const key = toKey(day)
        const dayQuests = calQuests.filter(q => q.date === key)
          .sort((a, b) => a.hour - b.hour)
        const isToday = key === todayKey
        return (
          <div key={key} style={{
            background: bg,
            border: `1px solid ${isToday ? '#7c3aed' : border}`,
            borderRadius: '8px', padding: '8px',
            minHeight: '220px',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '10px', color: muted, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                {DAYS_SHORT[day.getDay()]}
              </p>
              <p style={{
                fontSize: '18px', fontWeight: 700, margin: '2px 0 0',
                color: isToday ? '#a78bfa' : text,
              }}>{day.getDate()}</p>
            </div>
            <div>
              {dayQuests.map(q => (
                <div key={q.id} style={{
                  background: q.completed ? 'rgba(52,211,153,0.06)' : `${q.color}15`,
                  borderLeft: `2px solid ${q.completed ? '#34d399' : q.color}`,
                  borderRadius: '4px', padding: '4px 6px', marginBottom: '4px',
                  cursor: 'pointer',
                }} onClick={() => onToggleQuest(q.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '13px' }}>{q.icon}</span>
                    <button onClick={e => { e.stopPropagation(); onDeleteQuest(q.id) }} style={{
                      background: 'none', border: 'none', color: muted,
                      cursor: 'pointer', fontSize: '9px', padding: 0
                    }}>✕</button>
                  </div>
                  <p style={{
                    fontSize: '11px', color: q.completed ? muted : (darkMode ? '#e2e8f0' : '#111827'),
                    textDecoration: q.completed ? 'line-through' : 'none',
                    margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{q.title}</p>
                  <p style={{ fontSize: '10px', color: muted, margin: '1px 0 0' }}>
                    {q.hour === 0 ? '12am' : q.hour < 12 ? `${q.hour}am` : q.hour === 12 ? '12pm' : `${q.hour-12}pm`}
                  </p>
                </div>
              ))}
              <button onClick={() => onAddClick(day)} style={{
                width: '100%', background: 'none',
                border: `1px dashed ${border}`,
                borderRadius: '4px', padding: '4px',
                color: muted, fontSize: '11px', cursor: 'pointer', marginTop: '4px'
              }}>+ Add</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── DAY VIEW ──────────────────────────────────────────────────────────────
function DayView({ date, calQuests, darkMode, onAddClick, onDeleteQuest, onToggleQuest }) {
  const key = toKey(date)
  const dayQuests = calQuests.filter(q => q.date === key)
  const border = darkMode ? '#2a2a3a' : '#e5e7eb'
  const bg     = darkMode ? '#111118' : '#ffffff'
  const muted  = darkMode ? '#64748b' : '#9ca3af'
  const text   = darkMode ? '#e2e8f0' : '#111827'
  const lineBg = darkMode ? '#1a1a24' : '#f8fafc'

  const questsByHour = {}
  dayQuests.forEach(q => {
    if (!questsByHour[q.hour]) questsByHour[q.hour] = []
    questsByHour[q.hour].push(q)
  })

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px', borderBottom: `1px solid ${border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: text, margin: 0 }}>
            {DAYS_FULL[date.getDay()]}
          </p>
          <p style={{ fontSize: '12px', color: muted, margin: '2px 0 0' }}>
            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button onClick={() => onAddClick(date)} style={{
          background: '#7c3aed', color: '#fff', border: 'none',
          borderRadius: '6px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
        }}>+ Quest</button>
      </div>

      {/* Hour rows */}
      <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
        {HOURS.map(h => {
          const hQuests = questsByHour[h] || []
          const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h-12} PM`
          const isCurrentHour = new Date().getHours() === h && toKey(date) === toKey(today())
          return (
            <div key={h} style={{
              display: 'flex', gap: '12px',
              borderBottom: `1px solid ${border}`,
              background: isCurrentHour ? 'rgba(124,58,237,0.05)' : (h % 2 === 0 ? lineBg : bg),
              minHeight: hQuests.length > 0 ? 'auto' : '44px',
            }}>
              <div style={{
                width: '52px', flexShrink: 0, padding: '10px 8px',
                fontSize: '11px', color: isCurrentHour ? '#a78bfa' : muted,
                fontWeight: isCurrentHour ? 700 : 400, textAlign: 'right',
                borderRight: `1px solid ${border}`
              }}>{label}</div>
              <div style={{ flex: 1, padding: '6px 8px 6px 0', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'flex-start' }}>
                {hQuests.map(q => (
                  <div key={q.id} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: q.completed ? 'rgba(52,211,153,0.08)' : `${q.color}18`,
                    border: `1px solid ${q.completed ? '#34d399' : q.color}40`,
                    borderLeft: `3px solid ${q.completed ? '#34d399' : q.color}`,
                    borderRadius: '6px', padding: '6px 10px', cursor: 'pointer',
                    minWidth: '140px', flex: '0 0 auto',
                  }} onClick={() => onToggleQuest(q.id)}>
                    <span style={{ fontSize: '14px' }}>{q.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '13px', fontWeight: 600,
                        color: q.completed ? muted : text,
                        textDecoration: q.completed ? 'line-through' : 'none',
                        margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>{q.title}</p>
                      <p style={{ fontSize: '10px', color: muted, margin: '1px 0 0' }}>
                        {q.category} · +{q.xp} XP
                      </p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); onDeleteQuest(q.id) }} style={{
                      background: 'none', border: 'none', color: muted,
                      cursor: 'pointer', fontSize: '12px', padding: '0 2px'
                    }}>✕</button>
                  </div>
                ))}
                {hQuests.length === 0 && (
                  <div onClick={() => onAddClick(new Date(date.getFullYear(), date.getMonth(), date.getDate()))}
                    style={{ width: '100%', height: '100%', cursor: 'pointer', minHeight: '28px' }} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── MAIN CalendarPage ─────────────────────────────────────────────────────
function CalendarPage({ calQuests, onAddCalQuest, onDeleteCalQuest, onToggleCalQuest, darkMode }) {
  const [view, setView] = useState('month')
  const [cursor, setCursor] = useState(new Date())
  const [addModal, setAddModal] = useState(null) // date to add quest to

  const T = {
    bg:    darkMode ? '#0a0a0f' : '#f8fafc',
    navBg: darkMode ? '#111118' : '#ffffff',
    border:darkMode ? '#2a2a3a' : '#e5e7eb',
    text:  darkMode ? '#e2e8f0' : '#111827',
    muted: darkMode ? '#64748b' : '#9ca3af',
  }

  // Navigation labels & prev/next
  const getLabel = () => {
    if (view === 'month') return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
    if (view === 'week') {
      const ws = getWeekStart(cursor)
      const we = new Date(ws); we.setDate(ws.getDate() + 6)
      return `${ws.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${we.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`
    }
    return cursor.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const getWeekStart = (d) => {
    const ws = new Date(d)
    const day = ws.getDay()
    ws.setDate(ws.getDate() - day)
    ws.setHours(0,0,0,0)
    return ws
  }

  const navigate = (dir) => {
    const d = new Date(cursor)
    if (view === 'month') d.setMonth(d.getMonth() + dir)
    else if (view === 'week') d.setDate(d.getDate() + dir * 7)
    else d.setDate(d.getDate() + dir)
    setCursor(d)
  }

  const goToday = () => setCursor(new Date())

  const totalCalQuests = calQuests.length
  const doneCalQuests  = calQuests.filter(q => q.completed).length

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '16px', flexWrap: 'wrap'
      }}>
        {/* View switcher */}
        <div style={{
          display: 'flex', background: T.navBg,
          border: `1px solid ${T.border}`, borderRadius: '8px', overflow: 'hidden'
        }}>
          {['month','week','day'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 14px', border: 'none', cursor: 'pointer',
              background: view === v ? '#7c3aed' : 'transparent',
              color: view === v ? '#fff' : T.muted,
              fontSize: '12px', fontWeight: 600, textTransform: 'capitalize'
            }}>{v}</button>
          ))}
        </div>

        {/* Nav arrows + label */}
        <button onClick={() => navigate(-1)} style={{
          background: T.navBg, border: `1px solid ${T.border}`, borderRadius: '6px',
          padding: '6px 10px', color: T.muted, cursor: 'pointer', fontSize: '14px'
        }}>◀</button>
        <span style={{ fontSize: '14px', fontWeight: 600, color: T.text, minWidth: '180px', textAlign: 'center' }}>
          {getLabel()}
        </span>
        <button onClick={() => navigate(1)} style={{
          background: T.navBg, border: `1px solid ${T.border}`, borderRadius: '6px',
          padding: '6px 10px', color: T.muted, cursor: 'pointer', fontSize: '14px'
        }}>▶</button>

        <button onClick={goToday} style={{
          background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '6px', padding: '6px 12px', color: '#a78bfa',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer'
        }}>Today</button>

        {/* Stats pill */}
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: T.muted }}>
          {doneCalQuests}/{totalCalQuests} calendar quests done
        </div>
      </div>

      {/* Views */}
      {view === 'month' && (
        <MonthView
          year={cursor.getFullYear()} month={cursor.getMonth()}
          calQuests={calQuests} darkMode={darkMode}
          onAddClick={d => setAddModal(d)}
          onDeleteQuest={onDeleteCalQuest}
          onToggleQuest={onToggleCalQuest}
        />
      )}
      {view === 'week' && (
        <WeekView
          weekStart={getWeekStart(cursor)}
          calQuests={calQuests} darkMode={darkMode}
          onAddClick={d => setAddModal(d)}
          onDeleteQuest={onDeleteCalQuest}
          onToggleQuest={onToggleCalQuest}
        />
      )}
      {view === 'day' && (
        <DayView
          date={cursor}
          calQuests={calQuests} darkMode={darkMode}
          onAddClick={d => setAddModal(d)}
          onDeleteQuest={onDeleteCalQuest}
          onToggleQuest={onToggleCalQuest}
        />
      )}

      {/* Quick add modal */}
      {addModal && (
        <QuickAddModal
          date={addModal}
          darkMode={darkMode}
          onAdd={onAddCalQuest}
          onClose={() => setAddModal(null)}
        />
      )}
    </div>
  )
}

export default CalendarPage