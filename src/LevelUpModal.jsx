import { useEffect, useState } from 'react'

function LevelUpModal({ info, onClose, accentColor='#7c3aed', accentLight='#a78bfa' }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 50)
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [])

  const particles = Array.from({length:20},(_,i)=>({
    id:i,
    x: Math.random()*100,
    y: Math.random()*100,
    size: Math.random()*6+3,
    dur: Math.random()*1.5+1,
    delay: Math.random()*0.5,
  }))

  return (
    <div style={{
      position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:600, pointerEvents:'none',
      background: show ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
      transition:'background 0.3s',
    }}>
      <style>{`
        @keyframes float-up { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-120px) scale(0);opacity:0} }
        @keyframes pop-in { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(2);opacity:0} }
        @keyframes shimmer { 0%,100%{opacity:0.7} 50%{opacity:1} }
      `}</style>

      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
          width:`${p.size}px`, height:`${p.size}px`,
          borderRadius:'50%', background:accentLight,
          animation:`float-up ${p.dur}s ${p.delay}s ease-out infinite`,
          opacity:0.8,
        }} />
      ))}

      <div style={{
        background:'#0a0a0f', border:`2px solid ${accentColor}`,
        borderRadius:'20px', padding:'40px 48px', textAlign:'center',
        animation: show ? 'pop-in 0.5s ease-out' : 'none',
        position:'relative', overflow:'hidden',
      }}>
        {/* Pulse rings */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          {[0,0.4,0.8].map((d,i) => (
            <div key={i} style={{
              position:'absolute', width:'120px', height:'120px',
              borderRadius:'50%', border:`2px solid ${accentColor}`,
              animation:`pulse-ring 2s ${d}s ease-out infinite`,
            }} />
          ))}
        </div>

        <div style={{ fontSize:'56px', marginBottom:'8px', animation:'shimmer 1.5s infinite' }}>⚡</div>
        <p style={{ fontSize:'13px', color:'#64748b', letterSpacing:'3px', textTransform:'uppercase', marginBottom:'4px' }}>Level Up!</p>
        <p style={{ fontSize:'64px', fontWeight:900, color:accentLight, margin:'0 0 4px', lineHeight:1, fontFamily:'monospace' }}>
          {info.level}
        </p>
        <p style={{ fontSize:'28px', fontWeight:700, color:'#e2e8f0', letterSpacing:'4px', marginBottom:'8px' }}>
          RANK {info.rank}
        </p>
        <p style={{ fontSize:'12px', color:'#64748b' }}>Keep grinding, warrior</p>
      </div>
    </div>
  )
}

export default LevelUpModal