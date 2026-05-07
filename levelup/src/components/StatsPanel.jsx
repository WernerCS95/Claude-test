import { format, parseISO } from 'date-fns'
import { levelToRank, rankColor, getTitle, xpToLevel } from '../utils/statsCalculator.js'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

const STAT_META = {
  strength: { label: 'STR', color: '#ef4444', icon: '⚔️', desc: 'Raw power & muscle force' },
  endurance: { label: 'END', color: '#3b82f6', icon: '🏃', desc: 'Stamina & cardiovascular capacity' },
  speed: { label: 'SPD', color: '#f59e0b', icon: '⚡', desc: 'Explosive power & agility' },
  discipline: { label: 'DIS', color: '#8b5cf6', icon: '🔥', desc: 'Consistency & mental fortitude' },
}

const RANK_ORDER = ['E', 'D', 'C', 'B', 'A', 'S']

function StatRow({ stat, value }) {
  const meta = STAT_META[stat]
  const cap = 200
  const pct = Math.min((value / cap) * 100, 100)
  return (
    <div className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
      <span className="text-lg w-7 flex-shrink-0">{meta.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-display tracking-widest" style={{ color: meta.color }}>{meta.label}</span>
          <span className="font-mono text-slate-400">{value}</span>
        </div>
        <div className="stat-bar">
          <div
            className="stat-bar-fill"
            style={{ width: `${pct}%`, background: meta.color, boxShadow: `0 0 8px ${meta.color}50` }}
          />
        </div>
        <div className="text-[10px] text-slate-600 mt-1">{meta.desc}</div>
      </div>
    </div>
  )
}

function RankRoadmap({ currentRank }) {
  const idx = RANK_ORDER.indexOf(currentRank)
  return (
    <div className="flex items-center gap-1">
      {RANK_ORDER.map((r, i) => {
        const done = i < idx
        const current = i === idx
        const rc = rankColor(r)
        return (
          <div key={r} className="flex items-center gap-1">
            <div
              className="flex items-center justify-center font-display text-[10px] tracking-wide transition-all"
              style={{
                width: current ? 32 : 24,
                height: current ? 32 : 24,
                borderRadius: 4,
                border: `1px solid ${done || current ? rc : 'rgba(255,255,255,0.06)'}`,
                background: current ? `${rc}20` : done ? `${rc}10` : 'transparent',
                color: done || current ? rc : '#475569',
                boxShadow: current ? `0 0 10px ${rc}40` : 'none',
              }}
            >
              {r}
            </div>
            {i < RANK_ORDER.length - 1 && (
              <div
                className="h-px flex-1"
                style={{ background: i < idx ? rankColor(RANK_ORDER[i + 1]) + '40' : 'rgba(255,255,255,0.05)', width: 12 }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function StatsPanel({ data }) {
  const { profile, quests } = data
  const { level, progress: levelProgress, xpToNext } = xpToLevel(profile.totalXp ?? 0)
  const rank = levelToRank(level)
  const title = getTitle(profile.goal, level)
  const rc = rankColor(rank)
  const stats = profile.stats ?? {}

  const radarData = [
    { stat: 'STR', value: Math.min(stats.strength ?? 0, 100) },
    { stat: 'END', value: Math.min(stats.endurance ?? 0, 100) },
    { stat: 'SPD', value: Math.min(stats.speed ?? 0, 100) },
    { stat: 'DIS', value: Math.min(stats.discipline ?? 0, 100) },
  ]

  const totalWorkouts = quests.filter((q) => q.completed).length
  const totalXp = profile.totalXp ?? 0
  const longestStreak = profile.longestStreak ?? 0
  const joinDate = profile.joinDate ? format(parseISO(profile.joinDate), 'MMM d, yyyy') : '—'

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Status Window */}
      <div className="system-panel p-4">
        <div className="text-xs font-display tracking-widest text-slate-500 mb-3">STATUS WINDOW</div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-display text-2xl text-slate-100 tracking-wide mb-1">
              {profile.name.toUpperCase()}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-display font-bold tracking-widest px-2 py-0.5 rounded border rank-${rank}`}
                style={{ borderColor: rc }}
              >
                {rank}-RANK
              </span>
              <span className="text-xs text-slate-500 font-display tracking-wide">{title}</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 font-display tracking-wide">
              {profile.goal?.toUpperCase()} HUNTER
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl" style={{ color: rc, textShadow: `0 0 20px ${rc}60` }}>
              {level}
            </div>
            <div className="text-xs text-slate-500">LEVEL</div>
          </div>
        </div>

        {/* XP progress */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>XP Progress</span>
            <span>{xpToNext} to next level</span>
          </div>
          <div className="stat-bar" style={{ height: 8 }}>
            <div
              className="stat-bar-fill xp-bar-fill"
              style={{ height: 8, width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Rank roadmap */}
        <div className="mt-4">
          <div className="text-xs text-slate-600 mb-2">Rank Progress</div>
          <RankRoadmap currentRank={rank} />
        </div>
      </div>

      {/* Radar chart */}
      <div className="system-panel p-4">
        <h3 className="font-display text-sm tracking-widest text-slate-400 mb-2">HUNTER PROFILE</h3>
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Rajdhani' }} />
            <Radar
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.15}
              strokeWidth={2}
              style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.6))' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats detail */}
      <div className="system-panel p-4">
        <h3 className="font-display text-sm tracking-widest text-slate-400 mb-1">STAT BREAKDOWN</h3>
        {Object.keys(STAT_META).map((stat) => (
          <StatRow key={stat} stat={stat} value={stats[stat] ?? 0} />
        ))}
      </div>

      {/* Summary */}
      <div className="system-panel p-4">
        <h3 className="font-display text-sm tracking-widest text-slate-400 mb-3">RECORDS</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total XP', value: totalXp.toLocaleString(), color: '#f59e0b' },
            { label: 'Quests Done', value: totalWorkouts, color: '#10b981' },
            { label: 'Best Streak', value: `${longestStreak}d`, color: '#3b82f6' },
            { label: 'Current Streak', value: `${profile.streak ?? 0}d`, color: '#8b5cf6' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="p-3 rounded-lg border"
              style={{ background: `${color}08`, borderColor: `${color}20` }}
            >
              <div className="font-display text-xl" style={{ color }}>{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-600 mt-3 text-center">Hunter since {joinDate}</div>
      </div>
    </div>
  )
}
