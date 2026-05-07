export default function Notification({ notif }) {
  const styles = {
    levelup: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.5)', icon: '⚡', color: '#f59e0b' },
    complete: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)', icon: '✓', color: '#10b981' },
    penalty: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)', icon: '⚠', color: '#ef4444' },
    info: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', icon: '◈', color: '#3b82f6' },
  }
  const s = styles[notif.type] ?? styles.info

  return (
    <div
      className="notification-banner fixed top-0 left-0 right-0 z-50 mx-auto max-w-md px-4 pt-3"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm tracking-wide"
        style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
      >
        <span className="text-lg">{s.icon}</span>
        <span>{notif.message}</span>
      </div>
    </div>
  )
}
