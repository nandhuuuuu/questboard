import { useState } from 'react'

const ICONS = ['⚔️','📚','💪','💻','🎯','🧘','🍎','✍️','🎨','🔬','🏃','💡','📝','🎮','🌱']
const COLORS = ['#a78bfa','#60a5fa','#34d399','#f472b6','#fb923c','#f87171','#facc15','#38bdf8']
const XP_MAP = { Easy:10, Medium:25, Hard:50 }
const PRIORITIES = ['🔴 High','🟡 Medium','🟢 Low']

function AddTaskModal({ onAdd, onClose, darkMode, accentColor='#7c3aed', accentBorder='#6d28d9' }) {
  const [title, setTitle]       = useState('')
  const [category, setCat]      = useState('Study')
  const [difficulty, setDiff]   = useState('Easy')
  const [due, setDue]           = useState('today')
  const [notes, setNotes]       = useState('')
  const [icon, setIcon]         = useState('⚔️')
  const [color, setColor]       = useState('#a78bfa')
  const [recurring, setRec]     = useState('none')
  const [timerMins, setTimer]   = useState(25)
  const [priority, setPriority] = useState('🟡 Medium')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags]         = useState([])
  const [subtasks, setSubtasks] = useState([])
  const [subInput, setSubInput] = useState('')

  const bg      = darkMode ? '#111118' : '#fff'
  const border  = darkMode ? '#2a2a3a' : '#e5e7eb'
  const inputBg = darkMode ? '#1a1a24' : '#f9fafb'
  const text    = darkMode ? '#e2e8f0' : '#111827'
  const muted   = darkMode ? '#64748b' : '#9ca3af'

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }
  const removeTag = (t) => setTags(prev => prev.filter(x => x!==t))
  const addSub = () => {
    if (!subInput.trim()) return
    setSubtasks(prev => [...prev, { id: Date.now(), title: subInput.trim(), done: false }])
    setSubInput('')
  }

  const handleSubmit = () => {
    if (!title.trim()) return
    onAdd({
      id: Date.now(),
      title: title.trim(), category, difficulty, xp: XP_MAP[difficulty],
      due, notes, icon, color, recurring: recurring==='none'?null:recurring,
      timerMins, completed: false, priority, tags, subtasks,
    })
    onClose()
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.75)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'16px'
    }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{
        background:bg, border:`1px solid ${border}`, borderRadius:'16px',
        padding:'24px', width:'100%', maxWidth:'440px', maxHeight:'90vh', overflowY:'auto'
      }}>
        <h2 style={{ color: accentColor==='#7c3aed'?'#a78bfa':accentColor, fontWeight:700, fontSize:'16px', marginBottom:'18px', letterSpacing:'1px' }}>+ New Quest</h2>

        <input type="text" placeholder="Quest title..." value={title} onChange={e=>setTitle(e.target.value)}
          style={{ width:'100%', background:inputBg, border:`1px solid ${border}`, borderRadius:'8px', padding:'9px 12px', color:text, fontSize:'14px', outline:'none', marginBottom:'12px', boxSizing:'border-box' }}
          onFocus={e=>e.target.style.borderColor=accentColor} onBlur={e=>e.target.style.borderColor=border} />

        {/* Icon */}
        <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>Icon</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'12px' }}>
          {ICONS.map(i => <button key={i} onClick={()=>setIcon(i)} style={{ fontSize:'18px', padding:'4px 6px', borderRadius:'8px', cursor:'pointer', border:`2px solid ${icon===i?accentColor:'transparent'}`, background:icon===i?`${accentColor}22`:'transparent' }}>{i}</button>)}
        </div>

        {/* Color */}
        <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>Color</p>
        <div style={{ display:'flex', gap:'8px', marginBottom:'14px', flexWrap:'wrap' }}>
          {COLORS.map(c => <button key={c} onClick={()=>setColor(c)} style={{ width:'24px', height:'24px', borderRadius:'50%', background:c, cursor:'pointer', border:`3px solid ${color===c?'#fff':'transparent'}`, outline:color===c?`2px solid ${c}`:'none' }} />)}
        </div>

        {/* Priority */}
        <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>Priority</p>
        <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
          {PRIORITIES.map(p => (
            <button key={p} onClick={()=>setPriority(p)} style={{
              flex:1, padding:'7px', borderRadius:'8px', cursor:'pointer',
              border:`1px solid ${priority===p?accentColor:border}`,
              background:priority===p?`${accentColor}22`:inputBg,
              color:priority===p?text:muted, fontSize:'12px', fontWeight:600
            }}>{p}</button>
          ))}
        </div>

        {/* Tags */}
        <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>Tags</p>
        <div style={{ display:'flex', gap:'6px', marginBottom:'6px', flexWrap:'wrap' }}>
          {tags.map(t => (
            <span key={t} style={{ background:`${accentColor}22`, color:text, fontSize:'11px', padding:'2px 8px', borderRadius:'99px', display:'flex', alignItems:'center', gap:'4px' }}>
              #{t} <button onClick={()=>removeTag(t)} style={{ background:'none', border:'none', color:muted, cursor:'pointer', padding:0, fontSize:'10px' }}>✕</button>
            </span>
          ))}
        </div>
        <div style={{ display:'flex', gap:'6px', marginBottom:'12px' }}>
          <input type="text" placeholder="Add tag..." value={tagInput} onChange={e=>setTagInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addTag()}
            style={{ flex:1, background:inputBg, border:`1px solid ${border}`, borderRadius:'8px', padding:'7px 10px', color:text, fontSize:'12px', outline:'none', boxSizing:'border-box' }} />
          <button onClick={addTag} style={{ background:`${accentColor}22`, border:'none', borderRadius:'8px', padding:'7px 12px', color:text, cursor:'pointer', fontSize:'12px', fontWeight:600 }}>+ Add</button>
        </div>

        {/* Category */}
        <select value={category} onChange={e=>setCat(e.target.value)} style={{ width:'100%', background:inputBg, border:`1px solid ${border}`, borderRadius:'8px', padding:'9px 12px', color:text, fontSize:'14px', outline:'none', marginBottom:'12px', boxSizing:'border-box' }}>
          {['Study','Health','Coding','Personal','Work'].map(c=><option key={c}>{c}</option>)}
        </select>

        {/* Difficulty */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
          {['Easy','Medium','Hard'].map(d=>(
            <button key={d} onClick={()=>setDiff(d)} style={{ flex:1, padding:'8px', borderRadius:'8px', cursor:'pointer', border:`1px solid ${difficulty===d?accentColor:border}`, background:difficulty===d?accentColor:inputBg, color:difficulty===d?'#fff':muted, fontSize:'12px', fontWeight:600 }}>{d} · {XP_MAP[d]}XP</button>
          ))}
        </div>

        {/* Due */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
          {['today','tomorrow'].map(d=>(
            <button key={d} onClick={()=>setDue(d)} style={{ flex:1, padding:'8px', borderRadius:'8px', cursor:'pointer', border:`1px solid ${due===d?accentColor:border}`, background:due===d?accentColor:inputBg, color:due===d?'#fff':muted, fontSize:'12px', fontWeight:600, textTransform:'capitalize' }}>{d}</button>
          ))}
        </div>

        {/* Recurring */}
        <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>Repeat</p>
        <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
          {['none','daily','weekdays','weekly'].map(r=>(
            <button key={r} onClick={()=>setRec(r)} style={{ padding:'6px 12px', borderRadius:'8px', cursor:'pointer', border:`1px solid ${recurring===r?accentColor:border}`, background:recurring===r?accentColor:inputBg, color:recurring===r?'#fff':muted, fontSize:'12px', fontWeight:600, textTransform:'capitalize' }}>{r==='none'?'One-time':r}</button>
          ))}
        </div>

        {/* Timer */}
        <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>⏱️ Timer</p>
        <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
          {[15,25,50,90].map(m=>(
            <button key={m} onClick={()=>setTimer(m)} style={{ padding:'6px 12px', borderRadius:'8px', cursor:'pointer', border:`1px solid ${timerMins===m?accentColor:border}`, background:timerMins===m?accentColor:inputBg, color:timerMins===m?'#fff':muted, fontSize:'12px', fontWeight:600 }}>{m} min</button>
          ))}
          <input type="number" min="1" max="180" placeholder="Custom"
            value={[15,25,50,90].includes(timerMins)?'':timerMins}
            onChange={e=>{const v=Number(e.target.value);if(v>0&&v<=180)setTimer(v)}}
            style={{ width:'70px', background:inputBg, border:`1px solid ${border}`, borderRadius:'8px', padding:'6px 8px', color:text, fontSize:'12px', outline:'none', boxSizing:'border-box' }} />
        </div>

        {/* Subtasks */}
        <p style={{ fontSize:'11px', color:muted, marginBottom:'6px', letterSpacing:'1px', textTransform:'uppercase' }}>Subtasks</p>
        {subtasks.map((s,i) => (
          <div key={s.id} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 0', borderBottom:`1px solid ${border}` }}>
            <span style={{ color:accentColor, fontSize:'11px' }}>◆</span>
            <span style={{ flex:1, fontSize:'13px', color:text }}>{s.title}</span>
            <button onClick={()=>setSubtasks(prev=>prev.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:muted, cursor:'pointer', fontSize:'11px' }}>✕</button>
          </div>
        ))}
        <div style={{ display:'flex', gap:'6px', marginBottom:'14px', marginTop:'6px' }}>
          <input type="text" placeholder="Add subtask..." value={subInput} onChange={e=>setSubInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addSub()}
            style={{ flex:1, background:inputBg, border:`1px solid ${border}`, borderRadius:'8px', padding:'7px 10px', color:text, fontSize:'12px', outline:'none', boxSizing:'border-box' }} />
          <button onClick={addSub} style={{ background:`${accentColor}22`, border:'none', borderRadius:'8px', padding:'7px 12px', color:text, cursor:'pointer', fontSize:'12px', fontWeight:600 }}>+ Add</button>
        </div>

        {/* Notes */}
        <textarea placeholder="Optional notes..." value={notes} onChange={e=>setNotes(e.target.value)}
          style={{ width:'100%', background:inputBg, border:`1px solid ${border}`, borderRadius:'8px', padding:'9px 12px', color:text, fontSize:'14px', outline:'none', marginBottom:'16px', resize:'none', height:'60px', boxSizing:'border-box' }} />

        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:'8px', border:`1px solid ${border}`, background:inputBg, color:muted, fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex:1, padding:'10px', borderRadius:'8px', border:'none', background:accentColor, color:'#fff', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Add Quest</button>
        </div>
      </div>
    </div>
  )
}

export default AddTaskModal