import EXERCISE_DB, { PENALTY_EXERCISES, levelToRank } from '../data/exercises.js'
import { format, parseISO, differenceInCalendarDays } from 'date-fns'

export function todayStr() {
  return format(new Date(), 'yyyy-MM-dd')
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

// Determine how many days have been missed since last workout
export function missedDays(lastWorkoutDate) {
  if (!lastWorkoutDate) return 0
  const today = new Date()
  const last = parseISO(lastWorkoutDate)
  const diff = differenceInCalendarDays(today, last)
  return Math.max(0, diff - 1) // 1 day gap = 0 missed (rest day allowed)
}

// Generate today's quest for a given goal + level + optional previous exercise IDs to avoid repeats
export function generateQuest(goal, level, recentExerciseNames = []) {
  const rank = levelToRank(level)
  const pool = EXERCISE_DB[goal]?.[rank] ?? EXERCISE_DB[goal]?.E ?? []

  // Prefer exercises not done recently
  const fresh = pool.filter((e) => !recentExerciseNames.includes(e.name))
  const source = fresh.length >= 3 ? fresh : pool

  const count = rank === 'E' ? 4 : rank === 'D' ? 5 : rank === 'C' ? 5 : rank === 'B' ? 6 : 6
  const selected = pickN(source, count)

  const exercises = selected.map((ex) => ({
    id: uid(),
    name: ex.name,
    type: ex.type,
    targetSets: ex.sets,
    targetReps: ex.reps,
    targetDuration: ex.duration,
    targetDistance: ex.distance,
    stat: ex.stat,
    xpPerSet: ex.xp,
    note: ex.note ?? null,
    tags: ex.tags,
    loggedSets: [],
    completed: false,
  }))

  const totalXp = exercises.reduce((s, e) => s + e.xpPerSet * e.targetSets, 0)

  return {
    id: uid(),
    date: todayStr(),
    goal,
    rank,
    exercises,
    completed: false,
    completedAt: null,
    xpEarned: 0,
    totalXp,
    penaltyQuest: false,
  }
}

// Generate a penalty quest for missed days
export function generatePenaltyQuest(goal) {
  const pool = PENALTY_EXERCISES[goal] ?? PENALTY_EXERCISES.strength
  const selected = pickN(pool, 2)

  const exercises = selected.map((ex) => ({
    id: uid(),
    name: ex.name,
    type: ex.type,
    targetSets: ex.sets,
    targetReps: ex.reps,
    targetDuration: ex.duration,
    targetDistance: ex.distance,
    stat: ex.stat,
    xpPerSet: ex.xp,
    note: ex.note ?? null,
    tags: ex.tags,
    loggedSets: [],
    completed: false,
  }))

  return {
    id: uid(),
    date: todayStr(),
    goal,
    rank: 'PENALTY',
    exercises,
    completed: false,
    completedAt: null,
    xpEarned: 0,
    totalXp: exercises.reduce((s, e) => s + e.xpPerSet * e.targetSets, 0),
    penaltyQuest: true,
  }
}

// Get the current (today's) quest from the quest array, or null
export function getTodayQuest(quests) {
  const today = todayStr()
  return quests.find((q) => q.date === today) ?? null
}

// Return names of exercises done in the last N days
export function recentExerciseNames(quests, days = 3) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return quests
    .filter((q) => parseISO(q.date) >= cutoff)
    .flatMap((q) => q.exercises.map((e) => e.name))
}

// Log a set for an exercise within a quest
export function logSet(quest, exerciseId, setData) {
  return {
    ...quest,
    exercises: quest.exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex
      const newSets = [...ex.loggedSets, { ...setData, completedAt: new Date().toISOString() }]
      const done = newSets.length >= ex.targetSets
      return { ...ex, loggedSets: newSets, completed: done }
    }),
  }
}

// Check if all exercises are done and mark quest complete
export function checkQuestCompletion(quest, streakMultiplier = 1) {
  const allDone = quest.exercises.every((ex) => ex.completed)
  if (!allDone) return quest

  const rawXp = quest.exercises.reduce(
    (sum, ex) => sum + ex.xpPerSet * ex.loggedSets.length,
    0
  )
  const xpEarned = Math.round(rawXp * streakMultiplier)

  return {
    ...quest,
    completed: true,
    completedAt: new Date().toISOString(),
    xpEarned,
  }
}
