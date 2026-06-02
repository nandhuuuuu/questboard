import { useState, useEffect, useRef } from 'react'

function usePomodoro(questId, timerMins) {
  const WORK  = (timerMins||25)*60
  const BREAK = Math.max(5, Math.round((timerMins||25)/5))*60
  const [seconds, setSeconds] = useState(WORK)
  const [running, setRunning] = useState(false)
  const [phase, setPhase]     = useState('work')
  const ref = useRef(null)

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSeconds(s => {
          if (s<=1) {
            clearInterval(ref.current); setRunning(false)
            if (phase==='work') { setPhase('break'); setSeconds(BREAK); if(Notification.permission==='granted') new Notification('🎉 Done!',{body:'Take a break.'}) }
            else { setPhase('work'); setSeconds(WORK); if(Notification.permission==='granted') new Notification('⚔️ Break over!',{body:'Back to quest.'}) }
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
  return { time:fmt(seconds), running, phase, toggle, reset }
}

function QuestCard({ quest, onComplete, onDelete, onUncomplete, onReorder, darkMode,
  onOpenNotes, onFocus, onUpdateSubtasks, index, total,
  accentColor='#7c3aed', accentLight='#a78bfa', accentBg='rgba(124,58,237,0.15)' }) {

  const [showTimer, setShowTimer]   = useState(false)
  const [showSubs,  setShowSubs]    = useState(false)
  const { time, running, phase, toggle, reset } = usePomodoro(quest.id, quest.timerMins)
  const iconColor = quest.color||accentLight

  const cardBg   = darkMode ? (quest.completed?'#0d1f0d':'#111118') : (quest.completed?'#f0fdf4':'#ffffff')
  const cardBor  = quest.completed ? (darkMode?'#166534':'#86efac') : (darkMode?'#2a2a3a':'#e5e7eb')
  const titleCol = quest.completed ? (darkMode?'#4b5563':'#9ca3af') : (darkMode?'#e2e8f0':'#111827')
  const muted    = darkMode ? '#64748b' : '#9ca3af'

  const subtasks = quest.subtasks || []
  const subDone  = subtasks.filter(s=>s.done).length

  const toggleSub = (id) => {
    const updated = subtasks.map(s => s.id===id ? {...s, done:!s.done} : s)
    onUpdateSubtasks(quest.id, updated)
  }

  const PRIORITY_COLOR = { '🔴 High':'#f87171', '🟡 Medium':'#facc15', '🟢 Low':'#34d399' }

  return (
    <div style={{
      border:`1px solid ${cardBor}`, borderLeft:`3px solid ${iconColor}`,
      borderRadius:'10px', padding:'14px', marginBottom:'8px',
      background:cardBg, transition:'all 0.2s',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        {/* Reorder */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1px', flexShrink:0 }}>
          <button onClick={()=>onReorder(index,'up')} disabled={index===0} style={{ background:'none', border:'none', cursor:index===0?'default':'pointer', color:index===0?'#2a2a3a':muted, fontSize:'10px', padding:'0 2px', lineHeight:1 }}>▲</button>
          <button onClick={()=>onReorder(index,'down')} disabled={index===total-1} style={{ background:'none', border:'none', cursor:index===total-1?'default':'pointer', color:index===total-1?'#2a2a3a':muted, fontSize:'10px', padding:'0 2px', lineHeight:1 }}>▼</button>
        </div>

        <div style={{ fontSize:'17px', flexShrink:0 }}>{quest.icon||'⚔️'}</div>

        <button onClick={()=>quest.completed?onUncomplete(quest.id):onComplete(quest.id)} style={{
          width:'20px', height:'20px', borderRadius:'50%', flexShrink:0,
          border:`2px solid ${quest.completed?'#22c55e':'#52525b'}`,
          background:quest.completed?'#22c55e':'transparent',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {quest.completed && <span style={{ color:'#fff', fontSize:'10px', fontWeight:700 }}>✓</span>}
        </button>

        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontWeight:600, fontSize:'14px', color:titleCol, margin:0,
            textDecoration:quest.completed?'line-through':'none',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'
          }}>{quest.title}</p>
          <div style={{ display:'flex', gap:'6px', alignItems:'center', marginTop:'2px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'11px', color:muted }}>{quest.category}</span>
            {quest.recurring && <span style={{ fontSize:'11px', color:iconColor }}>↻ {quest.recurring}</span>}
            {quest.priority && <span style={{ fontSize:'10px', color: PRIORITY_COLOR[quest.priority]||muted }}>{quest.priority}</span>}
            {(quest.tags||[]).map(t => <span key={t} style={{ fontSize:'10px', background:`${iconColor}22`, color:iconColor, padding:'1px 6px', borderRadius:'99px' }}>#{t}</span>)}
            {subtasks.length>0 && <span style={{ fontSize:'10px', color:muted, cursor:'pointer' }} onClick={()=>setShowSubs(s=>!s)}>📋 {subDone}/{subtasks.length}</span>}
          </div>
        </div>

        <div style={{ fontSize:'11px', fontWeight:700, padding:'3px 7px', borderRadius:'6px', flexShrink:0,
          background:quest.completed?'rgba(52,211,153,0.1)':'rgba(245,158,11,0.1)',
          color:quest.completed?'#34d399':'#f59e0b'
        }}>+{quest.xp} XP</div>

        <button onClick={()=>onOpenNotes(quest)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:quest.notes?1:0.3, flexShrink:0 }} title="Notes">💬</button>
        {!quest.completed && <button onClick={()=>onFocus(quest)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:0.5, flexShrink:0 }} title="Focus mode">🎯</button>}
        {!quest.completed && <button onClick={()=>setShowTimer(t=>!t)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:showTimer?1:0.35, flexShrink:0 }} title="Timer">⏱️</button>}
        <button onClick={()=>onDelete(quest.id)} style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontSize:'12px', flexShrink:0 }}
          onMouseOver={e=>e.target.style.color='#f87171'} onMouseOut={e=>e.target.style.color=muted}>✕</button>
      </div>

      {/* Difficulty */}
      <div style={{ paddingLeft:'60px', marginTop:'8px' }}>
        <span style={{
          fontSize:'10px', padding:'2px 7px', borderRadius:'99px',
          background: quest.difficulty==='Easy'?'rgba(96,165,250,0.1)':quest.difficulty==='Medium'?`${accentBg}`:'rgba(248,113,113,0.1)',
          color: quest.difficulty==='Easy'?'#60a5fa':quest.difficulty==='Medium'?accentLight:'#f87171',
        }}>{quest.difficulty}</span>
      </div>

      {/* Subtasks */}
      {showSubs && subtasks.length>0 && (
        <div style={{ marginTop:'10px', marginLeft:'60px' }}>
          {subtasks.map(s => (
            <div key={s.id} onClick={()=>toggleSub(s.id)} style={{
              display:'flex', alignItems:'center', gap:'8px', padding:'5px 4px',
              cursor:'pointer', borderRadius:'6px',
              background:s.done?'rgba(52,211,153,0.05)':'transparent',
            }}>
              <div style={{
                width:'14px', height:'14px', borderRadius:'50%', flexShrink:0,
                border:`2px solid ${s.done?'#22c55e':'#52525b'}`,
                background:s.done?'#22c55e':'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {s.done && <span style={{ fontSize:'8px', color:'#fff', fontWeight:700 }}>✓</span>}
              </div>
              <span style={{ fontSize:'12px', color:s.done?muted:titleCol, textDecoration:s.done?'line-through':'none' }}>{s.title}</span>
            </div>
          ))}
          {/* Subtask progress bar */}
          <div style={{ height:'3px', background:darkMode?'#1a1a24':'#f1f5f9', borderRadius:'99px', marginTop:'6px', overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:'99px', background:'#22c55e', width:`${subtasks.length?subDone/subtasks.length*100:0}%`, transition:'width 0.3s' }} />
          </div>
        </div>
      )}

      {/* Pomodoro */}
      {showTimer && !quest.completed && (
        <div style={{
          marginTop:'10px', marginLeft:'60px', padding:'10px 14px',
          background:phase==='work'?accentBg:'rgba(52,211,153,0.1)',
          border:`1px solid ${phase==='work'?`${accentColor}44`:'rgba(52,211,153,0.3)'}`,
          borderRadius:'10px', display:'flex', alignItems:'center', gap:'12px'
        }}>
          <span style={{ fontSize:'11px', color:phase==='work'?accentLight:'#34d399', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase' }}>
            {phase==='work'?`⚔️ ${quest.timerMins||25}min`:'☕ Break'}
          </span>
          <span style={{ fontSize:'22px', fontWeight:700, color:darkMode?'#e2e8f0':'#111827', fontFamily:'monospace', flex:1 }}>{time}</span>
          <button onClick={toggle} style={{ background:running?'rgba(248,113,113,0.2)':accentBg, border:'none', borderRadius:'6px', padding:'4px 10px', color:running?'#f87171':accentLight, cursor:'pointer', fontSize:'12px', fontWeight:600 }}>{running?'⏸ Pause':'▶ Start'}</button>
          <button onClick={reset} style={{ background:'none', border:'none', color:'#52525b', cursor:'pointer', fontSize:'13px' }}>↺</button>
        </div>
      )}
    </div>
  )
}

export default QuestCard