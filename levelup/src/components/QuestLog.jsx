import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Check, Clock, Dumbbell } from 'lucide-react'

function formatDuration(secs) {
  if (!secs) return ''
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m}m ${s > 0 ? s + 's' : ''}`.trim() : `${s}s`
}

function SetLogger({ exercise, onLogSet }) {
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [duration, setDuration] = useState('')

  const setsLogged = exercise.loggedSets?.length ?? 0
  const setsTarget = exercise.targetSets

  function submit() {
    const data = {}
    if (exercise.type === 'sets-reps') {
      data.reps = parseInt(reps) || exercise.targetReps || 0
      if (weight) data.weight = parseFloat(weight)
    } else if (exercise.type === 'timed') {
      data.duration = parseInt(duration) || exercise.targetDuration || 0
    } else if (exercise.type === 'distance') {
      data.distance = parseFloat(duration) || exercise.targetDistance || 0
    }
    onLogSet(exercise.id, data)
    setReps('')
    setDuration('')
  }

  const isDone = exercise.completed

  return (
    <div>
      {/* Set chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {Array.from({ length: setsTarget }).map((_, i) => {
          const logged = exercise.loggedSets?.[i]
          return (
            <div
              key={i}
              className={`set-btn ${logged ? 'done' : ''}`}
              style={{ fontSize: 10 }}
            >
              {logged ? (
                <>
                  <Check size={12} />
                  <span>
                    {exercise.type === 'sets-reps' && logged.reps ? `${logged.reps}${logged.weight ? `×${logged.weight}` : ''}` : ''}
                    {exercise.type === 'timed' && logged.duration ? formatDuration(logged.duration) : ''}
                    {exercise.type === 'distance' && logged.distance ? `${logged.distance}km` : ''}
                  </span>
                </>
              ) : (
                <span className="text-slate-600">{i + 1}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Log next set */}
      {!isDone && setsLogged < setsTarget && (
        <div className="flex gap-2 items-end">
          <div className="text-xs text-slate-500 mr-1 mt-1">Set {setsLogged + 1}:</div>
          {exercise.type === 'sets-reps' && (
            <>
              <div className="flex-1">
                <div className="text-xs text-slate-600 mb-1">Reps</div>
                <input
                  type="number"
                  placeholder={String(exercise.targetReps ?? 0)}
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  style={{ padding: '6px 8px', fontSize: 13 }}
                />
              </div>
              <div className="flex-1">
                <div className="text-xs text-slate-600 mb-1">kg</div>
                <input
                  type="number"
                  placeholder="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{ padding: '6px 8px', fontSize: 13 }}
                />
              </div>
            </>
          )}
          {exercise.type === 'timed' && (
            <div className="flex-1">
              <div className="text-xs text-slate-600 mb-1">Seconds</div>
              <input
                type="number"
                placeholder={String(exercise.targetDuration ?? 0)}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ padding: '6px 8px', fontSize: 13 }}
              />
            </div>
          )}
          {exercise.type === 'distance' && (
            <div className="flex-1">
              <div className="text-xs text-slate-600 mb-1">km</div>
              <input
                type="number"
                step="0.1"
                placeholder={String(exercise.targetDistance ?? 0)}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ padding: '6px 8px', fontSize: 13 }}
              />
            </div>
          )}
          <button
            onClick={submit}
            className="px-3 py-1.5 rounded-md text-sm font-display tracking-wide"
            style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#3b82f6' }}
          >
            LOG
          </button>
        </div>
      )}

      {isDone && (
        <div className="flex items-center gap-1 text-xs text-green-400">
          <Check size={12} /> All sets complete
        </div>
      )}
    </div>
  )
}

function ExerciseCard({ exercise, onLogSet }) {
  const [expanded, setExpanded] = useState(!exercise.completed)

  const typeLabel = exercise.type === 'timed'
    ? `${exercise.targetSets}×${formatDuration(exercise.targetDuration)}`
    : exercise.type === 'distance'
    ? `${exercise.targetSets}×${exercise.targetDistance}km`
    : `${exercise.targetSets}×${exercise.targetReps}`

  return (
    <div
      className="system-panel p-4 transition-all"
      style={exercise.completed ? { borderColor: 'rgba(16,185,129,0.3)', boxShadow: '0 0 12px rgba(16,185,129,0.08)' } : {}}
    >
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: exercise.completed ? '#10b981' : 'rgba(59,130,246,0.4)', boxShadow: exercise.completed ? '0 0 6px #10b981' : 'none' }}
          />
          <div className="min-w-0">
            <div className={`text-sm font-medium truncate ${exercise.completed ? 'text-green-400' : 'text-slate-200'}`}>
              {exercise.name}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>{typeLabel}</span>
              {exercise.note && <span className="text-slate-600">• {exercise.note}</span>}
              <span className="text-blue-400/70">+{exercise.xpPerSet * exercise.targetSets} XP</span>
            </div>
          </div>
        </div>
        <div className="ml-2 text-slate-600">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <SetLogger exercise={exercise} onLogSet={onLogSet} />
        </div>
      )}
    </div>
  )
}

export default function QuestLog({ data }) {
  const { todayQuest, ensureTodayQuest, logExerciseSet, completeQuest } = data

  const quest = todayQuest ?? ensureTodayQuest()

  if (!quest) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 text-sm">Generating quest...</div>
      </div>
    )
  }

  const allDone = quest.exercises.every((e) => e.completed)
  const someProgress = quest.exercises.some((e) => e.loggedSets?.length > 0)

  function handleLogSet(exerciseId, setData) {
    logExerciseSet(quest.id, exerciseId, setData)
  }

  const completedCount = quest.exercises.filter((e) => e.completed).length

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Quest header */}
      <div className="system-panel p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            {quest.penaltyQuest && (
              <div className="text-xs font-display text-red-400 tracking-widest mb-1">⚠ PENALTY QUEST</div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-display font-bold tracking-widest px-2 py-0.5 rounded border rank-${quest.rank}`}
              >
                {quest.rank}-RANK
              </span>
              <span className="text-xs text-slate-500">{quest.goal?.toUpperCase()} PROTOCOL</span>
            </div>
            <h2 className="font-display text-xl tracking-wide text-slate-100">DAILY QUEST</h2>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl text-blue-400">{quest.totalXp}</div>
            <div className="text-xs text-slate-500">XP</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{
                width: `${(completedCount / quest.exercises.length) * 100}%`,
                background: quest.completed ? '#10b981' : '#3b82f6',
                height: '8px',
                boxShadow: `0 0 8px ${quest.completed ? '#10b98160' : '#3b82f660'}`,
              }}
            />
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {completedCount}/{quest.exercises.length} exercises complete
        </div>
      </div>

      {/* Exercises */}
      {quest.exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} onLogSet={handleLogSet} />
      ))}

      {/* Complete button */}
      {!quest.completed && (
        <div className="pb-2">
          {allDone ? (
            <button
              onClick={() => completeQuest(quest.id)}
              className="w-full py-4 rounded-lg font-display tracking-widest text-white text-sm"
              style={{
                background: 'linear-gradient(135deg, #065f46, #10b981)',
                border: '1px solid rgba(16,185,129,0.5)',
                boxShadow: '0 0 24px rgba(16,185,129,0.3)',
              }}
            >
              ✓ COMPLETE QUEST — CLAIM {quest.totalXp} XP
            </button>
          ) : someProgress ? (
            <div className="text-center text-xs text-slate-600 py-2">
              Complete all exercises to claim XP
            </div>
          ) : null}
        </div>
      )}

      {quest.completed && (
        <div
          className="text-center py-4 rounded-lg system-panel"
          style={{ borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}
        >
          <div className="text-green-400 font-display text-xl tracking-wide">✓ QUEST COMPLETE</div>
          <div className="text-slate-400 text-sm mt-1">+{quest.xpEarned} XP earned</div>
          <div className="text-xs text-slate-600 mt-1">Come back tomorrow for a new quest</div>
        </div>
      )}
    </div>
  )
}
