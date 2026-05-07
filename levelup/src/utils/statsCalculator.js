import { RANK_LABELS } from '../data/exercises.js'

// XP required to reach a given level
export function xpForLevel(level) {
  // L1→L2 = 100, each level ~15% more than last
  if (level <= 1) return 0
  let total = 0
  for (let l = 2; l <= level; l++) {
    total += Math.floor(100 * Math.pow(1.15, l - 2))
  }
  return total
}

// Total XP → current level + progress to next
export function xpToLevel(totalXp) {
  let level = 1
  while (xpForLevel(level + 1) <= totalXp) level++
  const currentFloor = xpForLevel(level)
  const nextFloor = xpForLevel(level + 1)
  const progress = ((totalXp - currentFloor) / (nextFloor - currentFloor)) * 100
  return { level, progress: Math.min(99, Math.max(0, progress)), xpToNext: nextFloor - totalXp }
}

export function levelToRank(level) {
  for (const [rank, data] of Object.entries(RANK_LABELS)) {
    if (level >= data.min && level <= data.max) return rank
  }
  return 'S'
}

export function rankColor(rank) {
  return RANK_LABELS[rank]?.color ?? '#94a3b8'
}

// Title based on goal + level
const TITLES = {
  strength: ['Iron Initiate', 'Iron Squire', 'Iron Knight', 'Steel Warrior', 'Titan Guard', 'S-Rank Titan'],
  endurance: ['Wanderer', 'Road Runner', 'Iron Lung', 'Marathon Soldier', 'Endurance Phantom', 'Limitless'],
  speed: ['Quick Step', 'Sprinter', 'Shadow Dash', 'Wind Hunter', 'Velocity Ghost', 'Flash'],
  aesthetics: ['Sculptor', 'Form Seeker', 'Physique Hunter', 'Aesthetic Knight', 'Shadow Monarch Body', 'Absolute Form'],
}

export function getTitle(goal, level) {
  const list = TITLES[goal] ?? TITLES.strength
  const idx = Math.min(Math.floor(level / 12), list.length - 1)
  return list[idx]
}

// Calculate stat points gained from an exercise set
export function statPointsForExercise(exercise, setsCompleted) {
  const ptsPerSet = 1
  const statMap = { [exercise.stat]: ptsPerSet * setsCompleted }
  return statMap
}

// Calculate discipline penalty for missed days
export function disciplinePenalty(missedDays) {
  return Math.min(missedDays * 5, 30)
}

// Streak multiplier for XP
export function streakMultiplier(streak) {
  return Math.min(1 + streak * 0.05, 2.0)
}

// Calculate macro targets from goal + bodyweight (kg) + bodyFat%
export function calcMacroTargets(goal, weightKg, height, age, gender = 'unset') {
  if (!weightKg) return { calories: 2200, protein: 160, carbs: 220, fats: 65 }

  // Mifflin-St Jeor BMR
  let bmr = 10 * weightKg + 6.25 * (height || 170) - 5 * (age || 25)
  bmr += gender === 'female' ? -161 : 5

  const tdee = bmr * 1.55 // moderate activity baseline

  const targets = {
    strength: { calMult: 1.1, proteinPerKg: 2.2, carbsMult: 0.45, fatMult: 0.25 },
    endurance: { calMult: 1.15, proteinPerKg: 1.8, carbsMult: 0.55, fatMult: 0.25 },
    speed: { calMult: 1.1, proteinPerKg: 2.0, carbsMult: 0.50, fatMult: 0.25 },
    aesthetics: { calMult: 0.95, proteinPerKg: 2.4, carbsMult: 0.35, fatMult: 0.30 },
  }

  const t = targets[goal] ?? targets.strength
  const calories = Math.round(tdee * t.calMult)
  const protein = Math.round(weightKg * t.proteinPerKg)
  const fats = Math.round((calories * t.fatMult) / 9)
  const carbs = Math.round((calories - protein * 4 - fats * 9) / 4)

  return { calories, protein, carbs: Math.max(carbs, 50), fats }
}

export function calorieOffset(extraCals) {
  if (extraCals <= 0) return null
  // Rough energy cost of common exercises
  if (extraCals <= 100) return '2 sets of 15 burpees'
  if (extraCals <= 200) return '3 sets of 20 burpees or 20-min run'
  if (extraCals <= 400) return '30-min run at moderate pace'
  return '45-min run or 60-min cycling session'
}

export function smartFoodReward(remainingCals) {
  if (remainingCals <= 0) return null
  if (remainingCals <= 100) return 'Greek yogurt or a handful of nuts'
  if (remainingCals <= 200) return 'Protein shake + banana'
  if (remainingCals <= 400) return 'Grilled chicken wrap or cottage cheese bowl'
  return 'Full balanced meal — you earned it'
}
