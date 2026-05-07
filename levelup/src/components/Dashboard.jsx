import { Flame, Zap, Target, Dumbbell } from 'lucide-react'
import { levelToRank, rankColor, getTitle } from '../utils/statsCalculator.js'
import { todayStr } from '../utils/questGenerator.js'

const STAT_META = {
  strength: { label: 'STR', color: '#ef4444' },
  endurance: { label: 'END', color: '#3b82f6' },
  speed: { label: 'SPD', color: '#f59e0b' },
  discipline: { label: 'DIS', color: '#8b5cf6' },
}

function StatBar({ stat, value }) {
  const meta = STAT_META[stat]
  const capped = Math.min(value ?? 0, 200)
  const pct = Math.min((capped / 100) * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono w-8" style={{ color: meta.color }}>{meta.label}</span>
      <div className="stat-bar flex-1">
        <div
          className="stat-bar-fill"
          style={{ width: `${pct}%`, background: meta.color, boxShadow: `0 0 6px ${meta.color}60` }}
        />
      </div>
      <span className="text-xs font-mono w-8 text-right text-slate-400">{value ?? 0}</span>
    </div>
  )
}

function MacroBar({ label, value, target, color }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0
  const over = target > 0 && value > target
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color }}>{label}</span>
        <span className={over ? 'text-red-400' : 'text-slate-400'}>
          {Math.round(value)}/{target}
          {label === 'CAL' ? ' kcal' : 'g'}
        </span>
      </div>
      <div className="stat-bar">
        <div
          className="stat-bar-fill"
          style={{
            width: `${pct}%`,
            background: over ? '#ef4444' : color,
            boxShadow: over ? '0 0 6px #ef444460' : `0 0 6px ${color}40`,
          }}
        />
      </div>
    </div>
  )
}

export default function Dashboard({ data, onNavigate }) {
  const { profile, todayQuest, todayTotals, level, levelProgress, xpToNext, ensureTodayQuest } = data
  const rank = levelToRank(level)
  const title = getTitle(profile.goal, level)
  const rc = rankColor(rank)

  const streak = profile.streak ?? 0
  const macros = profile.macros ?? {}

  function handleEnterDungeon() {
    ensureTodayQuest()
    onNavigate('quest')
  }

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Hunter Card */}
      <div className="system-panel p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-display font-bold tracking-widest px-2 py-0.5 rounded border rank-${rank}`}
                style={{ borderColor: rc }}
              >
                {rank}-RANK
              </span>
              <span className="text-xs text-slate-500 font-display tracking-wide">{title}</span>
            </div>
            <h2 className="font-display text-2xl text-slate-100 tracking-wide">{profile.name.toUpperCase()}</h2>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl" style={{ color: rc }}>{level}</div>
            <div className="text-xs text-slate-500">LEVEL</div>
          </div>
        </div>
        {/* XP bar */}
        <div className="mb-1">
          <div className="stat-bar">
            <div className="stat-bar-fill xp-bar-fill" style={{ height: '8px', width: `${levelProgress}%` }} />
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{xpToNext} XP to next level</span>
          <span className="flex items-center gap-1">
            <Flame size={12} className="text-orange-400" />
            {streak} day streak
          </span>
        </div>
      </div>

      {/* Today's Quest */}
      <div className="system-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm tracking-widest text-slate-400">TODAY'S QUEST</h3>
          {todayQuest && (
            <span
              className={`text-xs font-display font-bold tracking-widest px-2 py-0.5 rounded border rank-${todayQuest.rank}`}
            >
              {todayQuest.rank}-RANK
            </span>
          )}
        </div>

        {todayQuest ? (
          <div>
            {todayQuest.penaltyQuest && (
              <div className="text-xs font-display text-red-400 tracking-wide mb-2 flex items-center gap-1">
                ⚠ PENALTY QUEST — Complete to restore discipline
              </div>
            )}
            <div className="font-display text-lg text-slate-100 tracking-wide mb-1">
              {todayQuest.goal.toUpperCase()} PROTOCOL
            </div>
            <div className="text-xs text-slate-500 mb-3">
              {todayQuest.exercises.length} exercises •{' '}
              {todayQuest.exercises.filter((e) => e.completed).length} completed •{' '}
              {todayQuest.totalXp} XP available
            </div>
            {/* Exercise preview */}
            <div className="space-y-1.5 mb-4">
              {todayQuest.exercises.slice(0, 3).map((ex) => (
                <div key={ex.id} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: ex.completed ? '#10b981' : 'rgba(59,130,246,0.3)' }}
                  />
                  <span className={`text-xs ${ex.completed ? 'text-green-400 line-through' : 'text-slate-300'}`}>
                    {ex.name}
                  </span>
                </div>
              ))}
              {todayQuest.exercises.length > 3 && (
                <div className="text-xs text-slate-600">+{todayQuest.exercises.length - 3} more exercises</div>
              )}
            </div>

            {todayQuest.completed ? (
              <div className="text-center py-2">
                <div className="text-green-400 font-display tracking-wide text-sm">✓ QUEST COMPLETE</div>
                <div className="text-xs text-slate-500 mt-1">+{todayQuest.xpEarned} XP earned</div>
              </div>
            ) : (
              <button
                onClick={handleEnterDungeon}
                className="btn-glow w-full py-3 rounded-lg font-display tracking-widest text-white text-sm"
              >
                ⚔ ENTER DUNGEON
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="text-slate-500 text-sm mb-4">No quest generated yet.</div>
            <button
              onClick={handleEnterDungeon}
              className="btn-glow w-full py-3 rounded-lg font-display tracking-widest text-white text-sm"
            >
              ⚡ GENERATE QUEST
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="system-panel p-4">
        <h3 className="font-display text-sm tracking-widest text-slate-400 mb-3">HUNTER STATS</h3>
        <div className="space-y-2.5">
          {Object.keys(STAT_META).map((stat) => (
            <StatBar key={stat} stat={stat} value={profile.stats?.[stat] ?? 0} />
          ))}
        </div>
      </div>

      {/* Nutrition */}
      <div className="system-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm tracking-widest text-slate-400">TODAY'S FUEL</h3>
          <button
            onClick={() => onNavigate('nutrition')}
            className="text-xs text-blue-400 font-display tracking-wide"
          >
            LOG →
          </button>
        </div>
        <div className="space-y-2.5">
          <MacroBar label="CAL" value={todayTotals.calories} target={macros.calories ?? 2200} color="#f59e0b" />
          <MacroBar label="PRO" value={todayTotals.protein} target={macros.protein ?? 160} color="#3b82f6" />
          <MacroBar label="CARBS" value={todayTotals.carbs} target={macros.carbs ?? 220} color="#8b5cf6" />
          <MacroBar label="FATS" value={todayTotals.fats} target={macros.fats ?? 65} color="#f59e0b" />
        </div>
      </div>
    </div>
  )
}
