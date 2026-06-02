const LEVEL_THRESHOLDS = [0,100,250,500,850,1300,1900,2700,3700,5000]
const RANKS = ['F','E','D','C','B','A','S','SS','SSS','LEGEND']

function getLevel(totalXp) {
  let lvl = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) lvl = i+1
    else break
  }
  return Math.min(lvl, LEVEL_THRESHOLDS.length)
}

function getRankColor(rank) {
  const map = { F:'#64748b', E:'#94a3b8', D:'#34d399', C:'#60a5fa', B:'#a78bfa', A:'#f472b6', S:'#f59e0b', SS:'#fb923c', SSS:'#f87171', LEGEND:'#facc15' }
  return map[rank] || '#64748b'
}

function XPBar({ xp, totalXp=0, streak, darkMode, accentColor='#a78bfa', accentBg='rgba(124,58,237,0.15)' }) {
  const maxXP    = 200
  const progress = Math.min((xp/maxXP)*100, 100)
  const level    = getLevel(totalXp)
  const rank     = RANKS[level-1] || 'LEGEND'
  const rankColor= getRankColor(rank)

  const nextThresh = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length-1]
  const prevThresh = LEVEL_THRESHOLDS[level-1] || 0
  const levelPct   = nextThresh > prevThresh ? Math.min(((totalXp-prevThresh)/(nextThresh-prevThresh))*100,100) : 100

  const card  = darkMode ? '#111118' : '#ffffff'
  const bor   = darkMode ? '#2a2a3a' : '#e5e7eb'
  const text  = darkMode ? '#e2e8f0' : '#111827'
  const muted = darkMode ? '#64748b' : '#9ca3af'

  return (
    <div style={{ background:card, border:`1px solid ${bor}`, borderRadius:'14px', padding:'18px', marginBottom:'16px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div>
          <p style={{ fontSize:'10px', color:muted, textTransform:'uppercase', letterSpacing:'1.5px', margin:0 }}>Daily XP</p>
          <p style={{ fontSize:'26px', fontWeight:700, color:text, margin:'2px 0 0' }}>{xp} <span style={{ fontSize:'13px', color:muted }}>XP</span></p>
        </div>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontSize:'10px', color:muted, textTransform:'uppercase', letterSpacing:'1.5px', margin:0 }}>Level</p>
          <p style={{ fontSize:'26px', fontWeight:700, color:accentColor, margin:'2px 0 0', fontFamily:'monospace' }}>{level}</p>
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ fontSize:'10px', color:muted, textTransform:'uppercase', letterSpacing:'1.5px', margin:0 }}>Rank</p>
          <p style={{ fontSize:'26px', fontWeight:700, color:rankColor, margin:'2px 0 0' }}>{rank}</p>
        </div>
      </div>

      {/* Daily XP bar */}
      <p style={{ fontSize:'10px', color:muted, marginBottom:'4px' }}>Today: {xp}/{maxXP} XP</p>
      <div style={{ background:darkMode?'#1a1a24':'#f1f5f9', borderRadius:'99px', height:'6px', marginBottom:'10px', overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:'99px', background:accentColor, width:`${progress}%`, transition:'width 0.5s' }} />
      </div>

      {/* Total XP / level progress */}
      <p style={{ fontSize:'10px', color:muted, marginBottom:'4px' }}>Level progress: {totalXp} total XP</p>
      <div style={{ background:darkMode?'#1a1a24':'#f1f5f9', borderRadius:'99px', height:'4px', marginBottom:'12px', overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:'99px', background:rankColor, width:`${levelPct}%`, transition:'width 0.5s' }} />
      </div>

      {/* Streak */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
        <span style={{ fontSize:'13px' }}>🔥</span>
        <span style={{ fontSize:'12px', fontWeight:600, color:'#f59e0b' }}>{streak} day streak</span>
        <div style={{ display:'flex', gap:'3px', marginLeft:'auto' }}>
          {Array.from({length:7},(_,i)=>(
            <div key={i} style={{ width:'10px', height:'10px', borderRadius:'50%', background:i<streak?'#f59e0b':(darkMode?'#1a1a24':'#f1f5f9') }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default XPBar