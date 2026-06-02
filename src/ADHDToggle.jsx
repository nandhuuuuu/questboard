function ADHDToggle({ enabled, onToggle }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '16px',
        border: `1px solid ${enabled ? '#6d28d9' : '#27272a'}`,
        background: enabled ? 'rgba(88,28,220,0.1)' : '#18181b',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#d4d4d8', letterSpacing: '0.5px', margin: 0 }}>
          ⚡ ADHD Mode
        </p>
        <p style={{ fontSize: '11px', color: '#71717a', marginTop: '2px', margin: 0 }}>
          {enabled ? 'Showing one quest at a time' : 'Focus on one quest at a time'}
        </p>
      </div>

      {/* Toggle — using inline styles so Tailwind purging can't hide it */}
      <div
        onClick={() => onToggle(!enabled)}
        style={{
          position: 'relative',
          width: '40px',
          height: '22px',
          borderRadius: '99px',
          background: enabled ? '#7c3aed' : '#3f3f46',
          cursor: 'pointer',
          transition: 'background 0.3s',
          flexShrink: 0,
        }}
        aria-label="Toggle ADHD mode"
        role="button"
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: enabled ? '21px' : '3px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.3s',
          }}
        />
      </div>
    </div>
  )
}

export default ADHDToggle