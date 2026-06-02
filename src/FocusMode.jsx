import { useState, useEffect, useRef } from 'react'

function FocusMode({ quest, onClose, onComplete, darkMode, accentColor='#7c3aed', accentLight='#a78bfa', accentBg='rgba(124,58,237,0.15)' }) {
  const WORK  = (quest.timerMins||25)*60
  const BREAK = Math.max(5, Math.round((quest.timerMins||25)/5))*60
  const [seconds, setSeconds] = useState(WORK)
  const [running, setRunning] = useState(false)
  const [phase, setPhase]     = useState('work')
  const [sessions, setSessions] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSeconds(s => {
          if (s<=1) {
            clearInterval(ref.current); setRunning(false)
            if (phase==='work') {
              setSessions(n=>n+1)
              setPhase('break'); setSeconds(BREAK)
              if(Notification.permission==='granted') new Notification('🎉 Session done!',{body:'Take a break.'})
            } else {
              setPhase('work'); setSeconds(WORK)
              if(Notification.permission==='granted') new Notification('⚔️ Break over!',{body:'Back to it.'})
            }
            return 0
          }
          return s-1
        })
      },1000)
    } else clearInterval(ref.current)
    return () => clearInterval(ref.current)
  },[running,phase])

  const toggle = () => setRunning(r=>!r)
  const reset  = () => { setRunning(false); setPhase('work'); setSeconds(WORK) }
  const fmt    = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const pct = phase==='work' ? ((WORK-seconds)/WORK)*100 : ((BREAK-seconds)/BREAK)*100
  const r = 70, circ = 2*Math.PI*r
  const dash = circ - (pct/100)*circ

  const bg   = darkMode ? '#0a0a0f' : '#f8fafc'
  const card = darkMode ? '#111118' : '#ffffff'
  const text = darkMode ? '#e2e8f0' : '#111827'
  const muted= darkMode ? '#64748b' : '#9ca3af'
  const bor  = darkMode ? '#2a2a3a' : '#e5e7eb'

  return (
    <div style={{
      position:'fixed', inset:0, background:bg,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      zIndex:500, padding:'24px'
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position:'absolute', top:'20px', right:'20px',
        background:'none', border:`1px solid ${bor}`, borderRadius:'8px',
        padding:'6px 12px', color:muted, cursor:'pointer', fontSize:'13px'
      }}>✕ Exit Focus</button>

      {/* Quest info */}
      <div style={{ textAlign:'center', marginBottom:'32px' }}>
        <div style={{ fontSize:'40px', marginBottom:'8px' }}>{quest.icon||'⚔️'}</div>
        <h2 style={{ color:text, fontWeight:700, fontSize:'20px', margin:0 }}>{quest.title}</h2>
        <p style={{ color:muted, fontSize:'13px', marginTop:'4px' }}>{quest.category} · {quest.difficulty} · +{quest.xp} XP</p>
        {quest.priority && <p style={{ color:muted, fontSize:'12px', margin:0 }}>{quest.priority}</p>}
      </div>

      {/* Circular timer */}
      <div style={{ position:'relative', width:'180px', height:'180px', marginBottom:'32px' }}>
        <svg width="180" height="180" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="90" cy="90" r={r} fill="none" stroke={darkMode?'#1a1a24':'#f1f5f9'} strokeWidth="8" />
          <circle cx="90" cy="90" r={r} fill="none"
            stroke={phase==='work'?accentColor:'#22c55e'}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={dash}
            style={{ transition:'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div style={{
          position:'absolute', inset:0, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center'
        }}>
          <span style={{ fontSize:'36px', fontWeight:700, color:text, fontFamily:'monospace', letterSpacing:'2px' }}>{fmt(seconds)}</span>
          <span style={{ fontSize:'12px', color:phase==='work'?accentLight:'#34d399', fontWeight:600, textTransform:'uppercase', letterSpacing:'2px', marginTop:'4px' }}>
            {phase==='work'?'Focus':'Break'}
          </span>
        </div>
      </div>

      {/* Sessions */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'28px' }}>
        {Array.from({length:4},(_,i)=>(
          <div key={i} style={{ width:'12px', height:'12px', borderRadius:'50%', background:i<sessions?accentColor:(darkMode?'#1a1a24':'#e5e7eb') }} />
        ))}
        <span style={{ fontSize:'12px', color:muted, marginLeft:'4px' }}>{sessions} session{sessions!==1?'s':''} done</span>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'24px' }}>
        <button onClick={toggle} style={{
          padding:'14px 36px', borderRadius:'12px', border:'none',
          background: running ? 'rgba(248,113,113,0.15)' : accentColor,
          color: running ? '#f87171' : '#fff',
          fontSize:'16px', fontWeight:700, cursor:'pointer', letterSpacing:'1px'
        }}>{running ? '⏸  Pause' : '▶  Start'}</button>
        <button onClick={reset} style={{
          padding:'14px 20px', borderRadius:'12px',
          border:`1px solid ${bor}`, background:'transparent',
          color:muted, fontSize:'16px', cursor:'pointer'
        }}>↺</button>
      </div>

      {/* Subtasks */}
      {(quest.subtasks||[]).length > 0 && (
        <div style={{ background:card, border:`1px solid ${bor}`, borderRadius:'12px', padding:'16px', width:'100%', maxWidth:'380px', marginBottom:'16px' }}>
          <p style={{ fontSize:'11px', color:muted, letterSpacing:'1px', textTransform:'uppercase', marginBottom:'10px' }}>📋 Subtasks</p>
          {quest.subtasks.map(s => (
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 0' }}>
              <div style={{ width:'14px', height:'14px', borderRadius:'50%', border:`2px solid ${s.done?'#22c55e':'#52525b'}`, background:s.done?'#22c55e':'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {s.done && <span style={{ fontSize:'8px', color:'#fff', fontWeight:700 }}>✓</span>}
              </div>
              <span style={{ fontSize:'13px', color:s.done?muted:text, textDecoration:s.done?'line-through':'none' }}>{s.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Complete button */}
      {!quest.completed && (
        <button onClick={() => { onComplete(quest.id); onClose() }} style={{
          padding:'12px 32px', borderRadius:'10px', border:'none',
          background:'rgba(52,211,153,0.15)', color:'#34d399',
          fontSize:'14px', fontWeight:700, cursor:'pointer', letterSpacing:'1px'
        }}>✓ Mark Complete & Exit</button>
      )}
    </div>
  )
}

export default FocusMode