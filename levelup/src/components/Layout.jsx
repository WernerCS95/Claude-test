import { Home, Swords, Salad, TrendingUp, Bot, BarChart2, Settings } from 'lucide-react'

const NAV = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'quest', icon: Swords, label: 'Quest' },
  { id: 'nutrition', icon: Salad, label: 'Fuel' },
  { id: 'progress', icon: TrendingUp, label: 'Progress' },
  { id: 'coach', icon: Bot, label: 'Coach' },
  { id: 'stats', icon: BarChart2, label: 'Stats' },
]

export default function Layout({ tab, setTab, children }) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-xl">⚡</span>
          <span className="font-display text-lg text-blue-400 tracking-widest">LEVELUP</span>
        </div>
        <button
          onClick={() => setTab('settings')}
          className="p-2 rounded-lg transition-colors"
          style={{ color: tab === 'settings' ? '#3b82f6' : 'var(--text-muted)' }}
        >
          <Settings size={18} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t safe-bottom"
        style={{ background: 'rgba(5,5,16,0.95)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex">
          {NAV.map(({ id, icon: Icon, label }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative"
                style={{ color: active ? '#3b82f6' : 'var(--text-muted)' }}
              >
                <Icon size={20} strokeWidth={active ? 2 : 1.5} />
                <span className="text-[10px] font-display tracking-wide">{label}</span>
                {active && (
                  <span
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                    style={{ background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
