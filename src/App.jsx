import { useState, useEffect } from 'react'
import XPBar from './XPBar'
import QuestCard from './QuestCard'
import AddTaskModal from './AddTaskModal'
import StatsPage from './StatsPage'
import ADHDToggle from './ADHDToggle'
import NotesSidePanel from './NotesSidePanel'
import BossBattle from './BossBattle'
import CalendarPage from './CalendarPage'
import HabitTracker from './HabitTracker'
import FocusMode from './FocusMode'
import LevelUpModal from './LevelUpModal'
import SettingsPage from './SettingsPage'

const LEVEL_THRESHOLDS = [0,100,250,500,850,1300,1900,2700,3700,5000]

function getLevel(totalXp) {
  let lvl = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) lvl = i + 1
    else break
  }
  return Math.min(lvl, LEVEL_THRESHOLDS.length)
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [pendingRecurring, setPendingRecurring] = useState([])
  const [focusQuest, setFocusQuest] = useState(null)
  const [levelUpInfo, setLevelUpInfo] = useState(null) // { level, rank }

  const [quests, setQuests] = useState(() => JSON.parse(localStorage.getItem('qb_quests') || '[]'))
  const [xp, setXp] = useState(() => Number(localStorage.getItem('qb_xp') || 0))
  const [totalXp, setTotalXp] = useState(() => Number(localStorage.getItem('qb_totalxp') || 0))
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('qb_streak') || 0))
  const [lastDate, setLastDate] = useState(() => localStorage.getItem('qb_lastDate') || '')
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('qb_history') || '[]'))
  const [adhdMode, setAdhdMode] = useState(() => localStorage.getItem('qb_adhd') === '1')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('qb_dark') !== '0')
  const [bosses, setBosses] = useState(() => JSON.parse(localStorage.getItem('qb_bosses') || '[]'))
  const [notesQuest, setNotesQuest] = useState(null)
  const [calQuests, setCalQuests] = useState(() => JSON.parse(localStorage.getItem('qb_calquests') || '[]'))
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('qb_habits') || '[]'))
  const [filterTag, setFilterTag] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  // Settings
  const [appName, setAppName] = useState(() => localStorage.getItem('qb_appname') || 'QuestBoard')
  const [appIcon, setAppIcon] = useState(() => localStorage.getItem('qb_appicon') || '⚔️')
  const [theme, setTheme] = useState(() => localStorage.getItem('qb_theme') || 'purple')

  const THEMES = {
    purple: { accent: '#7c3aed', accentLight: '#a78bfa', accentBg: 'rgba(124,58,237,0.15)', accentBorder: '#6d28d9' },
    blue:   { accent: '#2563eb', accentLight: '#60a5fa', accentBg: 'rgba(37,99,235,0.15)',  accentBorder: '#1d4ed8' },
    green:  { accent: '#059669', accentLight: '#34d399', accentBg: 'rgba(5,150,105,0.15)',  accentBorder: '#047857' },
    red:    { accent: '#dc2626', accentLight: '#f87171', accentBg: 'rgba(220,38,38,0.15)',  accentBorder: '#b91c1c' },
    orange: { accent: '#ea580c', accentLight: '#fb923c', accentBg: 'rgba(234,88,12,0.15)',  accentBorder: '#c2410c' },
    pink:   { accent: '#db2777', accentLight: '#f472b6', accentBg: 'rgba(219,39,119,0.15)', accentBorder: '#be185d' },
    gold:   { accent: '#d97706', accentLight: '#facc15', accentBg: 'rgba(217,119,6,0.15)',  accentBorder: '#b45309' },
    teal:   { accent: '#0891b2', accentLight: '#38bdf8', accentBg: 'rgba(8,145,178,0.15)',  accentBorder: '#0e7490' },
  }
  const C = THEMES[theme] || THEMES.purple

  useEffect(() => {
    localStorage.setItem('qb_quests', JSON.stringify(quests))
    localStorage.setItem('qb_xp', xp)
    localStorage.setItem('qb_totalxp', totalXp)
    localStorage.setItem('qb_streak', streak)
    localStorage.setItem('qb_lastDate', lastDate)
    localStorage.setItem('qb_history', JSON.stringify(history))
    localStorage.setItem('qb_adhd', adhdMode ? '1' : '0')
    localStorage.setItem('qb_dark', darkMode ? '1' : '0')
    localStorage.setItem('qb_bosses', JSON.stringify(bosses))
    localStorage.setItem('qb_calquests', JSON.stringify(calQuests))
    localStorage.setItem('qb_habits', JSON.stringify(habits))
    localStorage.setItem('qb_appname', appName)
    localStorage.setItem('qb_appicon', appIcon)
    localStorage.setItem('qb_theme', theme)
  }, [quests, xp, totalXp, streak, lastDate, history, adhdMode, darkMode, bosses, calQuests, habits, appName, appIcon, theme])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
  }, [])

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours()
      const today = new Date().toISOString().slice(0,10)
      if (h >= 9 && localStorage.getItem('qb_reminded') !== today && Notification.permission === 'granted') {
        new Notification(`${appIcon} ${appName}`, { body: 'Your quests await! Time to level up today.' })
        localStorage.setItem('qb_reminded', today)
      }
    }
    check()
    const t = setInterval(check, 60000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().slice(0,10)
    if (lastDate && lastDate !== today) {
      const doneThen = quests.filter(q => q.due === 'today' && q.completed).length
      const totalThen = quests.filter(q => q.due === 'today').length
      if (doneThen > 0) setHistory(prev => [{ date: lastDate, xp, done: doneThen, total: totalThen }, ...prev].slice(0,7))
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1)
      if (lastDate === yesterday.toISOString().slice(0,10) && doneThen > 0) setStreak(s => s+1)
      else setStreak(doneThen > 0 ? 1 : 0)
      const toAsk = quests.filter(q => q.recurring && q.recurring !== 'none').filter(q => {
        if (q.recurring === 'daily') return true
        if (q.recurring === 'weekdays') { const d = new Date().getDay(); return d>=1&&d<=5 }
        if (q.recurring === 'weekly') return new Date().getDay() === 1
        return false
      })
      setQuests(prev => {
        const tmr = prev.filter(q => q.due==='tomorrow').map(q => ({...q, due:'today', completed:false}))
        const kept = prev.filter(q => q.due!=='today' && q.due!=='tomorrow')
        const fresh = toAsk.map(q => ({...q, id:Date.now()+Math.random(), due:'today', completed:false}))
        return [...tmr, ...kept, ...fresh]
      })
      if (toAsk.length > 0) { setPendingRecurring(toAsk); setShowRecurringModal(true) }
      setXp(0)
    }
    setLastDate(today)
  }, [])

  const addXpWithLevelUp = (amount) => {
    setXp(x => x + amount)
    setTotalXp(prev => {
      const oldLevel = getLevel(prev)
      const newTotal = prev + amount
      const newLevel = getLevel(newTotal)
      if (newLevel > oldLevel) {
        const RANKS = ['F','E','D','C','B','A','S','SS','SSS','LEGEND']
        setTimeout(() => setLevelUpInfo({ level: newLevel, rank: RANKS[newLevel-1] || 'LEGEND' }), 300)
      }
      return newTotal
    })
  }

  const handleComplete = (id) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) { addXpWithLevelUp(q.xp); return {...q, completed:true} }
      return q
    }))
  }
  const handleUncomplete = (id) => {
    const q = quests.find(q => q.id === id)
    if (!q?.completed) return
    setXp(x => Math.max(0, x-q.xp))
    setTotalXp(x => Math.max(0, x-q.xp))
    setQuests(prev => prev.map(q => q.id===id ? {...q, completed:false} : q))
  }
  const handleDelete = (id) => {
    const q = quests.find(q => q.id === id)
    if (q?.completed) { setXp(x => Math.max(0,x-q.xp)); setTotalXp(x => Math.max(0,x-q.xp)) }
    setQuests(prev => prev.filter(q => q.id !== id))
  }
  const handleAddQuest = (quest) => setQuests(prev => [...prev, quest])
  const handleTransferToToday = () => { setQuests(prev => prev.map(q => q.due==='tomorrow' ? {...q, due:'today', completed:false} : q)); setCurrentPage('dashboard') }
  const handleReorder = (index, dir, due) => {
    setQuests(prev => {
      const group = prev.filter(q => q.due===due)
      const others = prev.filter(q => q.due!==due)
      const ng = [...group]
      const t = dir==='up' ? index-1 : index+1
      if (t<0||t>=ng.length) return prev
      ;[ng[index],ng[t]]=[ng[t],ng[index]]
      return [...ng, ...others]
    })
  }
  const handleSaveNotes = (id, notes) => setQuests(prev => prev.map(q => q.id===id ? {...q, notes} : q))
  const handleUpdateSubtasks = (id, subtasks) => setQuests(prev => prev.map(q => q.id===id ? {...q, subtasks} : q))
  const handleAddBoss = (boss) => setBosses(prev => [...prev, boss])
  const handleDeleteBoss = (id) => setBosses(prev => prev.filter(b => b.id!==id))
  const handleToggleSubQuest = (bossId, subId) => setBosses(prev => prev.map(b => b.id!==bossId ? b : {...b, subs:b.subs.map(s => s.id===subId ? {...s, done:!s.done} : s)}))
  const handleAddCalQuest    = (q)  => setCalQuests(prev => [...prev, q])
  const handleDeleteCalQuest = (id) => setCalQuests(prev => prev.filter(q => q.id!==id))
  const handleToggleCalQuest = (id) => setCalQuests(prev => prev.map(q => q.id===id ? {...q, completed:!q.completed} : q))

  const todayQuests    = quests.filter(q => q.due==='today')
  const tomorrowQuests = quests.filter(q => q.due==='tomorrow')

  const allTags = [...new Set(quests.flatMap(q => q.tags || []))]

  const filterQuests = (list) => {
    let f = list
    if (filterTag !== 'all') f = f.filter(q => (q.tags||[]).includes(filterTag))
    if (filterPriority !== 'all') f = f.filter(q => q.priority === filterPriority)
    return f
  }

  const visibleTodayQuests = adhdMode
    ? [...filterQuests(todayQuests).filter(q=>!q.completed).slice(0,1), ...filterQuests(todayQuests).filter(q=>q.completed)]
    : filterQuests(todayQuests)
  const hiddenCount = adhdMode ? Math.max(0, filterQuests(todayQuests).filter(q=>!q.completed).length-1) : 0

  const T = {
    bg:     darkMode ? '#0a0a0f' : '#f8fafc',
    navBg:  darkMode ? '#111118' : '#ffffff',
    navBor: darkMode ? '#2a2a3a' : '#e5e7eb',
    text:   darkMode ? '#e2e8f0' : '#111827',
    muted:  darkMode ? '#64748b' : '#9ca3af',
    card:   darkMode ? '#111118' : '#ffffff',
    border: darkMode ? '#2a2a3a' : '#e5e7eb',
  }

  const NAV = [
    {id:'dashboard', label:'Today'},
    {id:'tomorrow',  label:'Tomorrow'},
    {id:'habits',    label:'🔁 Habits'},
    {id:'boss',      label:'🐉 Boss'},
    {id:'calendar',  label:'📅 Calendar'},
    {id:'stats',     label:'Stats'},
    {id:'settings',  label:'⚙️'},
  ]

  return (
    <div style={{ background: T.bg, minHeight:'100vh', color:T.text, fontFamily:'system-ui,sans-serif' }}>

      <nav style={{
        background: T.navBg, borderBottom:`1px solid ${T.navBor}`,
        padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px'
      }}>
        <h1 style={{ color: C.accentLight, fontWeight:700, fontSize:'18px', letterSpacing:'2px', textTransform:'uppercase' }}>
          {appIcon} {appName}
        </h1>
        <div style={{ display:'flex', gap:'4px', alignItems:'center', flexWrap:'wrap' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setCurrentPage(n.id)} style={{
              background: currentPage===n.id ? C.accentBg : 'none',
              border: currentPage===n.id ? `1px solid ${C.accentBorder}` : '1px solid transparent',
              color: currentPage===n.id ? C.accentLight : T.muted,
              borderRadius:'6px', padding:'5px 12px', cursor:'pointer', fontSize:'13px', fontWeight:500,
            }}>{n.label}</button>
          ))}
          <button onClick={() => setDarkMode(d=>!d)} style={{
            marginLeft:'8px', background:'none', border:`1px solid ${T.navBor}`,
            borderRadius:'6px', padding:'5px 10px', cursor:'pointer', color:T.muted, fontSize:'15px'
          }}>{darkMode ? '☀️' : '🌙'}</button>
        </div>
      </nav>

      <main style={{ maxWidth: currentPage==='calendar' ? '960px' : '680px', margin:'0 auto', padding:'24px 16px' }}>

        {(currentPage==='dashboard' || currentPage==='tomorrow') && (
          <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
            {/* Tag filter */}
            {allTags.length > 0 && (
              <div style={{ display:'flex', gap:'4px', flexWrap:'wrap', alignItems:'center' }}>
                <span style={{ fontSize:'11px', color:T.muted }}>Tag:</span>
                {['all', ...allTags].map(tag => (
                  <button key={tag} onClick={() => setFilterTag(tag)} style={{
                    padding:'3px 8px', borderRadius:'99px', fontSize:'11px', cursor:'pointer',
                    background: filterTag===tag ? C.accentBg : 'transparent',
                    border: `1px solid ${filterTag===tag ? C.accentBorder : T.border}`,
                    color: filterTag===tag ? C.accentLight : T.muted,
                  }}>{tag}</button>
                ))}
              </div>
            )}
            {/* Priority filter */}
            <div style={{ display:'flex', gap:'4px', flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ fontSize:'11px', color:T.muted }}>Priority:</span>
              {['all','🔴 High','🟡 Medium','🟢 Low'].map(p => (
                <button key={p} onClick={() => setFilterPriority(p==='all'?'all':p)} style={{
                  padding:'3px 8px', borderRadius:'99px', fontSize:'11px', cursor:'pointer',
                  background: filterPriority===(p==='all'?'all':p) ? C.accentBg : 'transparent',
                  border: `1px solid ${filterPriority===(p==='all'?'all':p) ? C.accentBorder : T.border}`,
                  color: filterPriority===(p==='all'?'all':p) ? C.accentLight : T.muted,
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {currentPage==='dashboard' && (
          <>
            <XPBar xp={xp} totalXp={totalXp} streak={streak} darkMode={darkMode} accentColor={C.accentLight} accentBg={C.accentBg} />
            <ADHDToggle enabled={adhdMode} onToggle={setAdhdMode} darkMode={darkMode} />
            {tomorrowQuests.length > 0 && (
              <div style={{
                background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.25)',
                borderRadius:'10px', padding:'12px 16px', marginBottom:'12px',
                display:'flex', alignItems:'center', justifyContent:'space-between'
              }}>
                <span style={{ fontSize:'12px', color:'#f59e0b' }}>📦 {tomorrowQuests.length} quest{tomorrowQuests.length>1?'s':''} scheduled for tomorrow</span>
                <button onClick={handleTransferToToday} style={{
                  background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)',
                  borderRadius:'6px', padding:'4px 12px', color:'#f59e0b', fontSize:'12px', fontWeight:600, cursor:'pointer'
                }}>Move to Today</button>
              </div>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <span style={{ fontSize:'11px', color:T.muted, letterSpacing:'2px', textTransform:'uppercase' }}>{appIcon} Today's Quests</span>
              <button onClick={() => setShowModal(true)} style={{
                background: C.accent, color:'#fff', border:'none',
                borderRadius:'6px', padding:'6px 14px', fontSize:'12px', fontWeight:600, cursor:'pointer'
              }}>+ Add Quest</button>
            </div>
            {todayQuests.length===0 && <p style={{ color:T.muted, textAlign:'center', padding:'32px 0', fontSize:'13px' }}>No quests yet. Add one to begin!</p>}
            {visibleTodayQuests.map((q,i) => (
              <QuestCard key={q.id} quest={q}
                onComplete={handleComplete} onDelete={handleDelete}
                onUncomplete={handleUncomplete}
                onReorder={(idx,dir) => handleReorder(idx,dir,'today')}
                onOpenNotes={setNotesQuest}
                onFocus={setFocusQuest}
                onUpdateSubtasks={handleUpdateSubtasks}
                darkMode={darkMode} index={i} total={visibleTodayQuests.length}
                accentColor={C.accent} accentLight={C.accentLight} accentBg={C.accentBg}
              />
            ))}
            {adhdMode && hiddenCount>0 && <p style={{ color:T.muted, fontSize:'12px', textAlign:'center', marginTop:'8px' }}>⚡ +{hiddenCount} more hidden — finish current one first</p>}
          </>
        )}

        {currentPage==='tomorrow' && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <span style={{ fontSize:'11px', color:T.muted, letterSpacing:'2px', textTransform:'uppercase' }}>🌙 Tomorrow's Quests</span>
              <button onClick={() => setShowModal(true)} style={{
                background:C.accent, color:'#fff', border:'none',
                borderRadius:'6px', padding:'6px 14px', fontSize:'12px', fontWeight:600, cursor:'pointer'
              }}>+ Add Quest</button>
            </div>
            {tomorrowQuests.length===0 && <p style={{ color:T.muted, textAlign:'center', padding:'32px 0', fontSize:'13px' }}>Plan your tomorrow here! 🌙</p>}
            {filterQuests(tomorrowQuests).map((q,i) => (
              <QuestCard key={q.id} quest={q}
                onComplete={handleComplete} onDelete={handleDelete}
                onUncomplete={handleUncomplete}
                onReorder={(idx,dir) => handleReorder(idx,dir,'tomorrow')}
                onOpenNotes={setNotesQuest}
                onFocus={setFocusQuest}
                onUpdateSubtasks={handleUpdateSubtasks}
                darkMode={darkMode} index={i} total={filterQuests(tomorrowQuests).length}
                accentColor={C.accent} accentLight={C.accentLight} accentBg={C.accentBg}
              />
            ))}
          </>
        )}

        {currentPage==='habits' && (
          <HabitTracker habits={habits} setHabits={setHabits} darkMode={darkMode}
            accentColor={C.accent} accentLight={C.accentLight} accentBg={C.accentBg} accentBorder={C.accentBorder}
            onXpGain={addXpWithLevelUp}
          />
        )}

        {currentPage==='stats' && (
          <StatsPage xp={xp} totalXp={totalXp} streak={streak} quests={quests} history={history} darkMode={darkMode} />
        )}

        {currentPage==='boss' && (
          <BossBattle bosses={bosses} onAddBoss={handleAddBoss} onDeleteBoss={handleDeleteBoss}
            onToggleSubQuest={handleToggleSubQuest} darkMode={darkMode} />
        )}

        {currentPage==='calendar' && (
          <CalendarPage calQuests={calQuests} onAddCalQuest={handleAddCalQuest}
            onDeleteCalQuest={handleDeleteCalQuest} onToggleCalQuest={handleToggleCalQuest} darkMode={darkMode} />
        )}

        {currentPage==='settings' && (
          <SettingsPage
            appName={appName} setAppName={setAppName}
            appIcon={appIcon} setAppIcon={setAppIcon}
            theme={theme} setTheme={setTheme}
            themes={THEMES} darkMode={darkMode}
            accentColor={C.accent} accentLight={C.accentLight} accentBg={C.accentBg} accentBorder={C.accentBorder}
          />
        )}
      </main>

      {notesQuest && <NotesSidePanel quest={notesQuest} onClose={() => setNotesQuest(null)} onSave={handleSaveNotes} darkMode={darkMode} />}
      {showModal && <AddTaskModal onAdd={handleAddQuest} onClose={() => setShowModal(false)} darkMode={darkMode} accentColor={C.accent} accentBorder={C.accentBorder} />}
      {focusQuest && <FocusMode quest={focusQuest} onClose={() => setFocusQuest(null)} onComplete={handleComplete} darkMode={darkMode} accentColor={C.accent} accentLight={C.accentLight} accentBg={C.accentBg} />}
      {levelUpInfo && <LevelUpModal info={levelUpInfo} onClose={() => setLevelUpInfo(null)} accentColor={C.accent} accentLight={C.accentLight} />}

      {showRecurringModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'16px' }}>
          <div style={{ background: darkMode?'#111118':'#fff', border:'1px solid #2a2a3a', borderRadius:'16px', padding:'24px', width:'100%', maxWidth:'400px' }}>
            <h2 style={{ color:C.accentLight, fontWeight:700, fontSize:'15px', marginBottom:'6px' }}>🌅 Good morning!</h2>
            <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'16px' }}>These recurring quests are ready for today.</p>
            {pendingRecurring.map(q => (
              <div key={q.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', background:`${C.accentBg}`, borderRadius:'8px', marginBottom:'8px' }}>
                <span style={{ fontSize:'18px' }}>{q.icon||'⚔️'}</span>
                <div style={{ flex:1 }}>
                  <p style={{ color: darkMode?'#e2e8f0':'#111827', fontSize:'14px', fontWeight:600, margin:0 }}>{q.title}</p>
                  <p style={{ color:'#64748b', fontSize:'11px', margin:0 }}>↻ {q.recurring} · +{q.xp} XP</p>
                </div>
              </div>
            ))}
            <div style={{ display:'flex', gap:'10px', marginTop:'16px' }}>
              <button onClick={() => { setQuests(prev => prev.filter(q => !pendingRecurring.find(r => r.title===q.title&&!q.completed))); setShowRecurringModal(false) }} style={{ flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #2a2a3a', background:'#1a1a24', color:'#64748b', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Skip today</button>
              <button onClick={() => setShowRecurringModal(false)} style={{ flex:1, padding:'10px', borderRadius:'8px', border:'none', background:C.accent, color:'#fff', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Add them ⚔️</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App