// StatsPage — XP bar chart + line chart, category bars, history log, PDF export

const CAT_COLORS_HEX = {
  Study: '#60a5fa', Health: '#34d399', Coding: '#a78bfa',
  Personal: '#f472b6', Work: '#fb923c',
}

function getRank(xp) {
  if (xp >= 200) return { rank: 'S', color: '#f59e0b' }
  if (xp >= 150) return { rank: 'A', color: '#a78bfa' }
  if (xp >= 100) return { rank: 'B', color: '#60a5fa' }
  if (xp >= 50)  return { rank: 'C', color: '#34d399' }
  return { rank: 'D', color: '#64748b' }
}

// ── Bar Chart ──────────────────────────────────────────────────────────────
function BarChart({ history, darkMode }) {
  const maxXP = Math.max(...history.map(h => h.xp), 1)
  const barColor = '#7c3aed'
  const bg = darkMode ? '#1a1a24' : '#f1f5f9'
  const text = darkMode ? '#64748b' : '#9ca3af'
  const data = [...history].reverse() // oldest first

  return (
    <div style={{ padding: '16px 0 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
        {data.length === 0
          ? <p style={{ color: text, fontSize: '12px', margin: 'auto' }}>No data yet</p>
          : data.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 600 }}>{h.xp}</span>
              <div style={{
                width: '100%', borderRadius: '4px 4px 0 0',
                background: barColor, opacity: 0.85,
                height: `${Math.max((h.xp / maxXP) * 60, 4)}px`,
                transition: 'height 0.4s'
              }} />
              <span style={{ fontSize: '9px', color: text }}>{h.date.slice(5)}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

// ── Line Chart ─────────────────────────────────────────────────────────────
function LineChart({ history, darkMode }) {
  const data = [...history].reverse()
  const maxXP = Math.max(...data.map(h => h.xp), 1)
  const W = 320, H = 80, PAD = 16
  const pts = data.map((h, i) => ({
    x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
    y: H - PAD - ((h.xp / maxXP) * (H - PAD * 2)),
    xp: h.xp,
    date: h.date.slice(5),
  }))
  const path = pts.length < 2 ? '' : pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const fill = pts.length < 2 ? '' : `${path} L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`
  const stroke = darkMode ? '#7c3aed' : '#6d28d9'
  const gridColor = darkMode ? '#2a2a3a' : '#e5e7eb'

  if (data.length === 0) return (
    <p style={{ color: darkMode ? '#64748b' : '#9ca3af', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>No data yet</p>
  )

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '80px' }}>
      {[0.25,0.5,0.75,1].map(t => (
        <line key={t} x1={PAD} y1={H - PAD - t*(H-PAD*2)} x2={W-PAD} y2={H - PAD - t*(H-PAD*2)}
          stroke={gridColor} strokeWidth="0.5" />
      ))}
      {fill && <path d={fill} fill={stroke} fillOpacity="0.1" />}
      {path && <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={stroke} />
          <text x={p.x} y={H - 2} textAnchor="middle" fontSize="8" fill={darkMode ? '#64748b' : '#9ca3af'}>{p.date}</text>
        </g>
      ))}
    </svg>
  )
}

// ── PDF Export ─────────────────────────────────────────────────────────────
function exportPDF(quests, history, xp, streak) {
  const lines = []
  lines.push('QUESTBOARD — EXPORT')
  lines.push(`Date: ${new Date().toLocaleDateString()}`)
  lines.push(`Today's XP: ${xp}   Streak: ${streak} days`)
  lines.push('')
  lines.push('── TODAY\'S QUESTS ──')
  quests.filter(q => q.due === 'today').forEach(q => {
    lines.push(`[${q.completed ? 'X' : ' '}] ${q.title} (${q.difficulty} · +${q.xp} XP · ${q.category})`)
    if (q.notes) lines.push(`    Notes: ${q.notes}`)
  })
  lines.push('')
  lines.push('── TOMORROW\'S QUESTS ──')
  quests.filter(q => q.due === 'tomorrow').forEach(q => {
    lines.push(`[ ] ${q.title} (${q.difficulty} · +${q.xp} XP · ${q.category})`)
  })
  lines.push('')
  lines.push('── HISTORY ──')
  history.forEach(h => {
    lines.push(`${h.date}: ${h.done}/${h.total} quests · ${h.xp} XP`)
  })

  // Build a printable HTML page and open in new tab
  const html = `<!DOCTYPE html>
<html><head><title>QuestBoard Export</title>
<style>
  body { font-family: monospace; padding: 40px; background: #fff; color: #111; }
  h1 { color: #7c3aed; letter-spacing: 2px; }
  pre { font-size: 13px; line-height: 1.8; white-space: pre-wrap; }
  @media print { button { display: none; } }
</style></head><body>
<h1>⚔️ QuestBoard</h1>
<button onclick="window.print()" style="margin-bottom:20px;padding:8px 16px;background:#7c3aed;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px">🖨️ Print / Save as PDF</button>
<pre>${lines.join('\n')}</pre>
</body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

// ── Main StatsPage ──────────────────────────────────────────────────────────
function StatsPage({ xp, streak, quests, history, darkMode }) {
  const completed = quests.filter(q => q.completed)
  const total = quests.length
  const { rank, color } = getRank(xp)

  const catCounts = {}
  completed.forEach(q => { catCounts[q.category] = (catCounts[q.category] || 0) + 1 })
  const maxCat = Math.max(...Object.values(catCounts), 1)

  const card = {
    background: darkMode ? '#111118' : '#fff',
    border: `1px solid ${darkMode ? '#2a2a3a' : '#e5e7eb'}`,
    borderRadius: '12px', padding: '16px', marginBottom: '12px',
  }
  const label = { fontSize: '10px', color: darkMode ? '#64748b' : '#9ca3af', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }
  const muted = darkMode ? '#64748b' : '#9ca3af'

  return (
    <div>
      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        {[
          { label: "Today's XP", val: xp, color: '#f59e0b', sub: 'XP earned' },
          { label: 'Rank', val: rank, color, sub: `${completed.length}/${total} done` },
          { label: 'Streak', val: `🔥 ${streak}`, color: '#f87171', sub: 'days in a row' },
          { label: 'Completed', val: completed.length, color: darkMode ? '#e2e8f0' : '#111827', sub: 'quests today' },
        ].map(s => (
          <div key={s.label} style={card}>
            <p style={label}>{s.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: '11px', color: muted, marginTop: '2px' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* XP Charts */}
      {history.length > 0 && (
        <div style={card}>
          <p style={label}>📊 Weekly XP — Bar</p>
          <BarChart history={history} darkMode={darkMode} />
          <p style={{ ...label, marginTop: '20px' }}>📈 Weekly XP — Trend</p>
          <LineChart history={history} darkMode={darkMode} />
        </div>
      )}

      {/* Category breakdown */}
      {Object.keys(catCounts).length > 0 && (
        <div style={card}>
          <p style={label}>Quests by Category</p>
          {Object.entries(catCounts).map(([cat, count]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: muted, width: '64px', flexShrink: 0 }}>{cat}</span>
              <div style={{ flex: 1, background: darkMode ? '#1a1a24' : '#f1f5f9', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '99px', background: CAT_COLORS_HEX[cat] || '#a78bfa', width: `${(count / maxCat) * 100}%` }} />
              </div>
              <span style={{ fontSize: '11px', color: muted, width: '16px', textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {history.length > 0 ? (
        <div style={card}>
          <p style={label}>Recent Days</p>
          {history.map((h, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < history.length - 1 ? `1px solid ${darkMode ? '#1a1a24' : '#f1f5f9'}` : 'none'
            }}>
              <span style={{ fontSize: '12px', color: muted }}>{h.date}</span>
              <span style={{ fontSize: '11px', color: muted }}>{h.done}/{h.total} quests</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b' }}>+{h.xp} XP</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: muted, textAlign: 'center', padding: '24px 0', fontSize: '13px' }}>
          Complete quests over multiple days to see history!
        </p>
      )}

      {/* Export PDF */}
      <button
        onClick={() => exportPDF(quests, history, xp, streak)}
        style={{
          width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
          background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px',
          letterSpacing: '0.5px'
        }}
      >
        📤 Export as PDF
      </button>
    </div>
  )
}

export default StatsPage