import { useState } from 'react'

const APP_ICONS = ['⚔️','🎮','🏆','🌟','🔥','💎','🦾','🧙','🐉','⚡','🎯','💀','🌙','🚀','🛡️']

function SettingsPage({ appName, setAppName, appIcon, setAppIcon, theme, setTheme, themes, darkMode, accentColor, accentLight, accentBg, accentBorder }) {
  const [nameInput, setNameInput] = useState(appName)

  const bg      = darkMode ? '#111118' : '#ffffff'
  const border  = darkMode ? '#2a2a3a' : '#e5e7eb'
  const inputBg = darkMode ? '#1a1a24' : '#f9fafb'
  const text    = darkMode ? '#e2e8f0' : '#111827'
  const muted   = darkMode ? '#64748b' : '#9ca3af'

  const card = { background:bg, border:`1px solid ${border}`, borderRadius:'12px', padding:'20px', marginBottom:'16px' }
  const label = { fontSize:'11px', color:muted, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'10px', display:'block' }

  const THEME_NAMES = {
    purple:'Purple', blue:'Blue', green:'Green', red:'Red',
    orange:'Orange', pink:'Pink', gold:'Gold', teal:'Teal'
  }

  return (
    <div>
      <p style={{ fontSize:'11px', color:muted, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'16px' }}>⚙️ Settings</p>

      {/* App name */}
      <div style={card}>
        <span style={label}>App Name</span>
        <div style={{ display:'flex', gap:'8px' }}>
          <input type="text" value={nameInput} onChange={e=>setNameInput(e.target.value)}
            style={{ flex:1, background:inputBg, border:`1px solid ${border}`, borderRadius:'8px', padding:'9px 12px', color:text, fontSize:'14px', outline:'none', boxSizing:'border-box' }}
            onFocus={e=>e.target.style.borderColor=accentColor} onBlur={e=>e.target.style.borderColor=border}
            placeholder="My Tracker" />
          <button onClick={()=>setAppName(nameInput)} style={{
            background:accentColor, color:'#fff', border:'none',
            borderRadius:'8px', padding:'9px 18px', fontSize:'13px', fontWeight:600, cursor:'pointer'
          }}>Save</button>
        </div>
        <p style={{ fontSize:'12px', color:muted, marginTop:'8px' }}>Current: <strong style={{ color:accentLight }}>{appIcon} {appName}</strong></p>
      </div>

      {/* App icon */}
      <div style={card}>
        <span style={label}>App Icon</span>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {APP_ICONS.map(i=>(
            <button key={i} onClick={()=>setAppIcon(i)} style={{
              fontSize:'22px', padding:'8px', borderRadius:'10px', cursor:'pointer',
              border:`2px solid ${appIcon===i?accentColor:'transparent'}`,
              background:appIcon===i?accentBg:'transparent', transition:'all 0.15s'
            }}>{i}</button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div style={card}>
        <span style={label}>Color Theme</span>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
          {Object.entries(themes).map(([key,val])=>(
            <button key={key} onClick={()=>setTheme(key)} style={{
              padding:'10px 6px', borderRadius:'10px', cursor:'pointer',
              border:`2px solid ${theme===key?val.accent:'transparent'}`,
              background:theme===key?val.accentBg:(darkMode?'#1a1a24':'#f9fafb'),
              display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
              transition:'all 0.15s'
            }}>
              <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:val.accent }} />
              <span style={{ fontSize:'11px', color:theme===key?val.accentLight:muted, fontWeight:theme===key?600:400 }}>{THEME_NAMES[key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{ ...card, border:`1px solid ${accentColor}44` }}>
        <span style={label}>Preview</span>
        <div style={{
          background: darkMode?'#0a0a0f':'#f8fafc',
          borderRadius:'10px', padding:'16px',
          border:`1px solid ${border}`
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
            <span style={{ fontSize:'20px' }}>{appIcon}</span>
            <span style={{ color:accentLight, fontWeight:700, fontSize:'16px', letterSpacing:'2px', textTransform:'uppercase' }}>{appName}</span>
          </div>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {['Today','Habits','Boss','Calendar','Stats'].map(n=>(
              <div key={n} style={{
                padding:'5px 12px', borderRadius:'6px',
                background:n==='Today'?accentBg:'transparent',
                border:`1px solid ${n==='Today'?accentBorder:'transparent'}`,
                color:n==='Today'?accentLight:muted,
                fontSize:'12px', fontWeight:500
              }}>{n}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage