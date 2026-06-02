import { useState } from 'react'

const ICONS = ['💧','🏃','📚','🧘','🍎','💪','✍️','😴','🥗','💊','🚶','🎯','🧹','💻','🌱']
const DAYS  = ['M','T','W','T','F','S','S']

function HabitTracker({ habits, setHabits, darkMode, accentColor, accentLight, accentBg, accentBorder, onXpGain }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName]         = useState('')
  const [icon, setIcon]         = useState('💧')
  const [color, setColor]       = useState(accentLight)
  const [freq, setFreq]         = useState('daily')

  const bg      = darkMode ? '#111118' : '#ffffff'
  const border  = darkMode ? '#2a2a3a' : '#e5e7eb'
  const inputBg = darkMode ? '#1a1a24' : '#f9fafb'
  const text    = darkMode ? '#e2e8f0' : '#111827'
  const muted   = darkMode ? '#64748b' : '#9ca3af'

  const today = new Date().toISOString().slice(0,10)

  // Get last 7 day keys
  const last7 = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-6+i); return d.toISOString().slice(0,10)
  })

  const addHabit = () => {
    if (!name.trim()) return
    setHabits(prev => [...prev, {
      id: Date.now(), name: name.trim(), icon, color, freq,
      completions: {}, streak: 0, bestStreak: 0
    }])
    setName(''); setIcon('💧'); setShowForm(false)
  }

  const toggleDay = (habitId, dateKey) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h
      const comps = { ...h.completions }
      const wasDone = !!comps[dateKey]
      if (wasDone) delete comps[dateKey]
      else { comps[dateKey] = true; if (dateKey===today) onXpGain(5) }

      // Recalculate streak
      let streak = 0
      const d = new Date()
      while (true) {
        const k = d.toISOString().slice(0,10)
        if (comps[k]) { streak++; d.setDate(d.getDate()-1) }
        else break
      }
      const bestStreak = Math.max(h.bestStreak||0, streak)
      return { ...h, completions: comps, streak, bestStreak }
    }))
  }

  const deleteHabit = (id) => setHabits(prev => prev.filter(h => h.id!==id))

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
        <span style={{ fontSize:'11px', color:muted, letterSpacing:'2px', textTransform:'uppercase' }}>🔁 Habits</span>
        <button onClick={()=>setShowForm(f=>!f)} style={{
          background:accentColor, color:'#fff', border:'none',
          borderRadius:'6px', padding:'6px 14px', fontSize:'12px', fontWeight:600, cursor:'pointer'
        }}>+ New Habit</button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:'12px', padding:'16px', marginBottom:'12px' }}>
          <input type="text" placeholder="Habit name..." value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addHabit()}
            style={{ width:'100%', background:inputBg, border:`1px solid ${border}`, borderRadius:'8px', padding:'9px 12px', color:text, fontSize:'14px', outline:'none', marginBottom:'12px', boxSizing:'border-box' }} autoFocus />

          <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>Icon</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'12px' }}>
            {ICONS.map(i=><button key={i} onClick={()=>setIcon(i)} style={{ fontSize:'16px', padding:'3px 5px', borderRadius:'6px', cursor:'pointer', border:`2px solid ${icon===i?accentColor:'transparent'}`, background:icon===i?accentBg:'transparent' }}>{i}</button>)}
          </div>

          <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>Frequency</p>
          <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
            {['daily','weekdays','weekly'].map(f=>(
              <button key={f} onClick={()=>setFreq(f)} style={{ flex:1, padding:'7px', borderRadius:'8px', cursor:'pointer', border:`1px solid ${freq===f?accentColor:border}`, background:freq===f?accentColor:inputBg, color:freq===f?'#fff':muted, fontSize:'12px', fontWeight:600, textTransform:'capitalize' }}>{f}</button>
            ))}
          </div>

          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={()=>setShowForm(false)} style={{ flex:1, padding:'9px', borderRadius:'8px', border:`1px solid ${border}`, background:inputBg, color:muted, fontSize:'13px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button onClick={addHabit} style={{ flex:1, padding:'9px', borderRadius:'8px', border:'none', background:accentColor, color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>Add Habit</button>
          </div>
        </div>
      )}

      {habits.length===0 && !showForm && (
        <p style={{ color:muted, textAlign:'center', padding:'32px 0', fontSize:'13px' }}>No habits yet. Build your first streak! 🔁</p>
      )}

      {/* Habit list */}
      {habits.map(habit => {
        const todayDone = !!habit.completions[today]
        const weekDone  = last7.filter(d=>habit.completions[d]).length
        return (
          <div key={habit.id} style={{
            background:bg, border:`1px solid ${todayDone?'#166534':border}`,
            borderLeft:`3px solid ${habit.color||accentLight}`,
            borderRadius:'10px', padding:'14px', marginBottom:'8px'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'20px' }}>{habit.icon}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:'14px', color:todayDone?(darkMode?'#4b5563':'#9ca3af'):text, textDecoration:todayDone?'line-through':'none', margin:0 }}>{habit.name}</p>
                <p style={{ fontSize:'11px', color:muted, margin:'2px 0 0' }}>
                  🔥 {habit.streak} day streak · best: {habit.bestStreak} · {habit.freq}
                </p>
              </div>

              {/* Today checkbox */}
              <button onClick={()=>toggleDay(habit.id, today)} style={{
                width:'28px', height:'28px', borderRadius:'50%', flexShrink:0,
                border:`2px solid ${todayDone?'#22c55e':'#52525b'}`,
                background:todayDone?'#22c55e':'transparent',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'
              }}>
                {todayDone && <span style={{ color:'#fff', fontWeight:700, fontSize:'12px' }}>✓</span>}
              </button>

              <button onClick={()=>deleteHabit(habit.id)} style={{ background:'none', border:'none', color:muted, cursor:'pointer', fontSize:'12px' }}
                onMouseOver={e=>e.target.style.color='#f87171'} onMouseOut={e=>e.target.style.color=muted}>✕</button>
            </div>

            {/* 7-day grid */}
            <div style={{ display:'flex', gap:'4px', marginTop:'10px', paddingLeft:'30px' }}>
              {last7.map((d,i) => {
                const done = !!habit.completions[d]
                const isToday = d===today
                return (
                  <div key={d} onClick={()=>toggleDay(habit.id,d)} style={{ flex:1, textAlign:'center', cursor:'pointer' }}>
                    <div style={{ fontSize:'9px', color:muted, marginBottom:'3px' }}>{DAYS[i]}</div>
                    <div style={{
                      width:'100%', aspectRatio:'1', borderRadius:'4px',
                      background: done?(habit.color||accentLight):(darkMode?'#1a1a24':'#f1f5f9'),
                      border: isToday?`1px solid ${habit.color||accentLight}`:'1px solid transparent',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'10px', transition:'background 0.2s',
                    }}>
                      {done && <span style={{ color:'#fff', fontWeight:700 }}>✓</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Week progress */}
            <div style={{ marginTop:'8px', paddingLeft:'30px' }}>
              <div style={{ height:'3px', background:darkMode?'#1a1a24':'#f1f5f9', borderRadius:'99px', overflow:'hidden' }}>
                <div style={{ height:'100%', background:habit.color||accentLight, borderRadius:'99px', width:`${(weekDone/7)*100}%`, transition:'width 0.3s' }} />
              </div>
              <p style={{ fontSize:'10px', color:muted, marginTop:'3px' }}>{weekDone}/7 this week · +5 XP per check-in</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default HabitTracker