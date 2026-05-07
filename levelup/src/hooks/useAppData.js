import { useState, useEffect, useCallback } from 'react'
import {
  getProfile, saveProfile,
  getQuests, saveQuests,
  getMeals, saveMeals,
  getWeightLog, saveWeightLog,
  getSettings, saveSettings,
} from '../utils/storage.js'
import {
  getTodayQuest, generateQuest, generatePenaltyQuest,
  recentExerciseNames, logSet, checkQuestCompletion, missedDays, todayStr,
} from '../utils/questGenerator.js'
import {
  xpToLevel, disciplinePenalty, streakMultiplier, calcMacroTargets,
} from '../utils/statsCalculator.js'

function defaultProfile(partial = {}) {
  return {
    name: 'Hunter',
    goal: 'strength',
    totalXp: 0,
    stats: { strength: 0, endurance: 0, speed: 0, discipline: 0 },
    streak: 0,
    longestStreak: 0,
    lastWorkoutDate: null,
    joinDate: todayStr(),
    weight: null,
    height: null,
    age: null,
    gender: 'unset',
    targetWeight: null,
    unit: 'metric',
    macros: { calories: 2200, protein: 160, carbs: 220, fats: 65 },
    ...partial,
  }
}

export default function useAppData() {
  const [profile, setProfileState] = useState(null)
  const [quests, setQuestsState] = useState([])
  const [meals, setMealsState] = useState([])
  const [weightLog, setWeightLogState] = useState([])
  const [settings, setSettingsState] = useState({ apiKey: '', unit: 'metric' })
  const [initialized, setInitialized] = useState(false)
  const [notification, setNotification] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    const p = getProfile()
    const q = getQuests()
    const m = getMeals()
    const w = getWeightLog()
    const s = getSettings()

    if (p) setProfileState(p)
    setQuestsState(q)
    setMealsState(m)
    setWeightLogState(w)
    setSettingsState(s)
    setInitialized(true)
  }, [])

  // Check for missed days and apply penalties when profile loads
  useEffect(() => {
    if (!profile) return
    const missed = missedDays(profile.lastWorkoutDate)
    if (missed > 0) {
      const penalty = disciplinePenalty(missed)
      const updatedStats = {
        ...profile.stats,
        discipline: Math.max(0, (profile.stats.discipline ?? 0) - penalty),
      }
      const updatedProfile = { ...profile, stats: updatedStats, streak: 0 }
      setProfileState(updatedProfile)
      saveProfile(updatedProfile)

      // Add penalty quest if not already present today
      const todayQ = getTodayQuest(quests)
      if (!todayQ) {
        const penaltyQ = generatePenaltyQuest(profile.goal)
        const updated = [penaltyQ, ...quests]
        setQuestsState(updated)
        saveQuests(updated)
        showNotification({
          type: 'penalty',
          message: `PENALTY APPLIED — ${missed} day${missed > 1 ? 's' : ''} missed. Discipline -${penalty}pts. Complete the penalty quest to recover.`,
        })
      }
    }
  }, [profile?.name]) // only run once on load

  const showNotification = useCallback((notif) => {
    setNotification(notif)
    setTimeout(() => setNotification(null), 5000)
  }, [])

  // ── Profile ──────────────────────────────────────────────

  const setupProfile = useCallback((data) => {
    const macros = calcMacroTargets(data.goal, data.weight, data.height, data.age, data.gender)
    const p = defaultProfile({ ...data, macros })
    setProfileState(p)
    saveProfile(p)
  }, [])

  const updateProfile = useCallback((patch) => {
    setProfileState((prev) => {
      const updated = { ...prev, ...patch }
      if (patch.weight || patch.goal) {
        updated.macros = calcMacroTargets(
          updated.goal, updated.weight, updated.height, updated.age, updated.gender
        )
      }
      saveProfile(updated)
      return updated
    })
  }, [])

  // ── Quests ───────────────────────────────────────────────

  const ensureTodayQuest = useCallback(() => {
    const existing = getTodayQuest(quests)
    if (existing) return existing

    const recent = recentExerciseNames(quests)
    const q = generateQuest(profile.goal, xpToLevel(profile.totalXp).level, recent)
    const updated = [q, ...quests]
    setQuestsState(updated)
    saveQuests(updated)
    return q
  }, [quests, profile])

  const logExerciseSet = useCallback((questId, exerciseId, setData) => {
    setQuestsState((prev) => {
      const updated = prev.map((q) => {
        if (q.id !== questId) return q
        const afterLog = logSet(q, exerciseId, setData)

        // Update stat points in profile
        const ex = q.exercises.find((e) => e.id === exerciseId)
        if (ex) {
          setProfileState((p) => {
            if (!p) return p
            const newStats = { ...p.stats }
            newStats[ex.stat] = (newStats[ex.stat] ?? 0) + 1
            const updated = { ...p, stats: newStats }
            saveProfile(updated)
            return updated
          })
        }

        return afterLog
      })
      saveQuests(updated)
      return updated
    })
  }, [])

  const completeQuest = useCallback((questId) => {
    setQuestsState((prev) => {
      const mult = streakMultiplier(profile?.streak ?? 0)
      const updated = prev.map((q) => {
        if (q.id !== questId) return q
        return checkQuestCompletion(q, mult)
      })

      const quest = updated.find((q) => q.id === questId)
      if (quest?.completed) {
        // Award XP + update streak
        setProfileState((p) => {
          if (!p) return p
          const today = todayStr()
          const last = p.lastWorkoutDate
          const newStreak = last === yesterday() ? p.streak + 1 : 1
          const newLongest = Math.max(p.longestStreak ?? 0, newStreak)
          const newTotalXp = p.totalXp + quest.xpEarned
          const newStats = {
            ...p.stats,
            discipline: (p.stats.discipline ?? 0) + 3,
          }

          const oldLevel = xpToLevel(p.totalXp).level
          const newLevel = xpToLevel(newTotalXp).level

          const updatedP = {
            ...p,
            totalXp: newTotalXp,
            stats: newStats,
            streak: newStreak,
            longestStreak: newLongest,
            lastWorkoutDate: today,
          }
          saveProfile(updatedP)

          if (newLevel > oldLevel) {
            showNotification({ type: 'levelup', message: `LEVEL UP! You are now Level ${newLevel}!` })
          } else {
            showNotification({ type: 'complete', message: `Quest complete! +${quest.xpEarned} XP earned.` })
          }

          return updatedP
        })
      }

      saveQuests(updated)
      return updated
    })
  }, [profile, showNotification])

  // ── Nutrition ────────────────────────────────────────────

  const addMeal = useCallback((meal) => {
    const entry = { ...meal, id: Math.random().toString(36).slice(2), date: todayStr(), time: new Date().toISOString() }
    setMealsState((prev) => {
      const updated = [entry, ...prev]
      saveMeals(updated)
      return updated
    })
    return entry
  }, [])

  const deleteMeal = useCallback((id) => {
    setMealsState((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      saveMeals(updated)
      return updated
    })
  }, [])

  const todayMeals = meals.filter((m) => m.date === todayStr())
  const todayTotals = todayMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fats: acc.fats + (m.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )

  // ── Weight ───────────────────────────────────────────────

  const logWeight = useCallback((weight) => {
    const entry = { date: todayStr(), weight, loggedAt: new Date().toISOString() }
    setWeightLogState((prev) => {
      const filtered = prev.filter((w) => w.date !== todayStr())
      const updated = [entry, ...filtered].sort((a, b) => b.date.localeCompare(a.date))
      saveWeightLog(updated)
      return updated
    })
    updateProfile({ weight })
  }, [updateProfile])

  // ── Settings ─────────────────────────────────────────────

  const updateSettings = useCallback((patch) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...patch }
      saveSettings(updated)
      return updated
    })
  }, [])

  const { level, progress: levelProgress, xpToNext } = xpToLevel(profile?.totalXp ?? 0)

  return {
    profile,
    quests,
    meals,
    weightLog,
    settings,
    initialized,
    notification,
    // computed
    todayQuest: getTodayQuest(quests),
    todayMeals,
    todayTotals,
    level,
    levelProgress,
    xpToNext,
    // actions
    setupProfile,
    updateProfile,
    ensureTodayQuest,
    logExerciseSet,
    completeQuest,
    addMeal,
    deleteMeal,
    logWeight,
    updateSettings,
    showNotification,
  }
}

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}
