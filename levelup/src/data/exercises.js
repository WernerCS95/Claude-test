// Exercise database organized by goal → rank tier
// Ranks: E (beginner) → D → C → B → A → S (elite)

export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S']

export const RANK_LABELS = {
  E: { label: 'E-Rank', color: '#94a3b8', min: 1, max: 5 },
  D: { label: 'D-Rank', color: '#22c55e', min: 6, max: 15 },
  C: { label: 'C-Rank', color: '#3b82f6', min: 16, max: 30 },
  B: { label: 'B-Rank', color: '#a855f7', min: 31, max: 50 },
  A: { label: 'A-Rank', color: '#f59e0b', min: 51, max: 70 },
  S: { label: 'S-Rank', color: '#ef4444', min: 71, max: 999 },
}

export function levelToRank(level) {
  for (const [rank, data] of Object.entries(RANK_LABELS)) {
    if (level >= data.min && level <= data.max) return rank
  }
  return 'S'
}

// stat: which RPG stat this exercise grows
// type: sets-reps | timed | distance
// xp: base XP per completed set
const EXERCISE_DB = {
  strength: {
    E: [
      { name: 'Push-ups', type: 'sets-reps', sets: 3, reps: 10, stat: 'strength', xp: 12, tags: ['chest', 'triceps'] },
      { name: 'Bodyweight Squats', type: 'sets-reps', sets: 3, reps: 15, stat: 'strength', xp: 12, tags: ['quads', 'glutes'] },
      { name: 'Assisted Pull-ups', type: 'sets-reps', sets: 3, reps: 5, stat: 'strength', xp: 15, tags: ['back', 'biceps'] },
      { name: 'Glute Bridges', type: 'sets-reps', sets: 3, reps: 15, stat: 'strength', xp: 10, tags: ['glutes', 'hamstrings'] },
      { name: 'Dips (bench)', type: 'sets-reps', sets: 3, reps: 8, stat: 'strength', xp: 12, tags: ['triceps', 'chest'] },
      { name: 'Plank', type: 'timed', sets: 3, duration: 30, stat: 'strength', xp: 10, tags: ['core'] },
      { name: 'Inverted Rows', type: 'sets-reps', sets: 3, reps: 8, stat: 'strength', xp: 15, tags: ['back'] },
      { name: 'Wall Sit', type: 'timed', sets: 3, duration: 45, stat: 'endurance', xp: 10, tags: ['quads'] },
    ],
    D: [
      { name: 'Dumbbell Goblet Squat', type: 'sets-reps', sets: 4, reps: 12, stat: 'strength', xp: 18, tags: ['quads', 'glutes'], note: '20–30 kg' },
      { name: 'Dumbbell Bench Press', type: 'sets-reps', sets: 4, reps: 10, stat: 'strength', xp: 18, tags: ['chest', 'triceps'], note: '15–20 kg each' },
      { name: 'Barbell Row', type: 'sets-reps', sets: 4, reps: 10, stat: 'strength', xp: 20, tags: ['back', 'biceps'], note: '40–55 kg' },
      { name: 'Romanian Deadlift', type: 'sets-reps', sets: 3, reps: 10, stat: 'strength', xp: 22, tags: ['hamstrings', 'glutes'], note: '40–60 kg' },
      { name: 'Overhead Press', type: 'sets-reps', sets: 3, reps: 8, stat: 'strength', xp: 18, tags: ['shoulders', 'triceps'], note: '30–45 kg' },
      { name: 'Pull-ups', type: 'sets-reps', sets: 3, reps: 6, stat: 'strength', xp: 22, tags: ['back', 'biceps'] },
      { name: 'Bulgarian Split Squat', type: 'sets-reps', sets: 3, reps: 8, stat: 'strength', xp: 20, tags: ['quads', 'glutes'] },
      { name: 'Dead Hang', type: 'timed', sets: 3, duration: 30, stat: 'strength', xp: 15, tags: ['back', 'grip'] },
    ],
    C: [
      { name: 'Barbell Back Squat', type: 'sets-reps', sets: 5, reps: 5, stat: 'strength', xp: 35, tags: ['quads', 'glutes', 'hamstrings'] },
      { name: 'Conventional Deadlift', type: 'sets-reps', sets: 3, reps: 5, stat: 'strength', xp: 45, tags: ['posterior chain'] },
      { name: 'Bench Press', type: 'sets-reps', sets: 4, reps: 6, stat: 'strength', xp: 30, tags: ['chest', 'triceps', 'shoulders'] },
      { name: 'Pull-ups (weighted)', type: 'sets-reps', sets: 4, reps: 8, stat: 'strength', xp: 30, tags: ['back', 'biceps'] },
      { name: 'Barbell Row', type: 'sets-reps', sets: 4, reps: 8, stat: 'strength', xp: 28, tags: ['back'] },
      { name: 'Overhead Press', type: 'sets-reps', sets: 4, reps: 6, stat: 'strength', xp: 25, tags: ['shoulders'] },
      { name: 'Front Squat', type: 'sets-reps', sets: 4, reps: 5, stat: 'strength', xp: 35, tags: ['quads', 'core'] },
      { name: 'Scapular Pull-ups', type: 'sets-reps', sets: 3, reps: 10, stat: 'strength', xp: 20, tags: ['back', 'scapula'] },
    ],
    B: [
      { name: 'Barbell Back Squat (heavy)', type: 'sets-reps', sets: 5, reps: 3, stat: 'strength', xp: 50, tags: ['quads', 'glutes'] },
      { name: 'Deadlift (heavy)', type: 'sets-reps', sets: 4, reps: 3, stat: 'strength', xp: 60, tags: ['posterior chain'] },
      { name: 'Weighted Pull-ups', type: 'sets-reps', sets: 5, reps: 5, stat: 'strength', xp: 40, tags: ['back', 'biceps'] },
      { name: 'Close-grip Bench Press', type: 'sets-reps', sets: 4, reps: 6, stat: 'strength', xp: 35, tags: ['triceps', 'chest'] },
      { name: 'Paused Squat', type: 'sets-reps', sets: 4, reps: 4, stat: 'strength', xp: 40, tags: ['quads'] },
      { name: 'Pendlay Row', type: 'sets-reps', sets: 4, reps: 6, stat: 'strength', xp: 35, tags: ['back'] },
      { name: 'Rack Pull', type: 'sets-reps', sets: 3, reps: 5, stat: 'strength', xp: 45, tags: ['back', 'traps'] },
      { name: 'Dips (weighted)', type: 'sets-reps', sets: 4, reps: 8, stat: 'strength', xp: 30, tags: ['chest', 'triceps'] },
    ],
    A: [
      { name: 'Squat (near-max)', type: 'sets-reps', sets: 6, reps: 2, stat: 'strength', xp: 70, tags: ['quads', 'glutes'] },
      { name: 'Deadlift (near-max)', type: 'sets-reps', sets: 5, reps: 2, stat: 'strength', xp: 80, tags: ['posterior chain'] },
      { name: 'Bench (near-max)', type: 'sets-reps', sets: 5, reps: 3, stat: 'strength', xp: 60, tags: ['chest'] },
      { name: 'Weighted Pull-ups (heavy)', type: 'sets-reps', sets: 5, reps: 3, stat: 'strength', xp: 55, tags: ['back'] },
      { name: 'Sumo Deadlift', type: 'sets-reps', sets: 4, reps: 3, stat: 'strength', xp: 65, tags: ['glutes', 'quads'] },
      { name: 'Log Press / Axle Press', type: 'sets-reps', sets: 4, reps: 5, stat: 'strength', xp: 55, tags: ['shoulders', 'triceps'] },
    ],
    S: [
      { name: '1-Rep Max Attempt (Squat)', type: 'sets-reps', sets: 1, reps: 1, stat: 'strength', xp: 150, tags: ['quads', 'glutes'] },
      { name: '1-Rep Max Attempt (Deadlift)', type: 'sets-reps', sets: 1, reps: 1, stat: 'strength', xp: 200, tags: ['posterior chain'] },
      { name: '1-Rep Max Attempt (Bench)', type: 'sets-reps', sets: 1, reps: 1, stat: 'strength', xp: 150, tags: ['chest'] },
      { name: 'Max Pull-ups', type: 'sets-reps', sets: 3, reps: 0, stat: 'strength', xp: 100, tags: ['back'], note: 'Max reps per set' },
      { name: 'Max Dips', type: 'sets-reps', sets: 3, reps: 0, stat: 'strength', xp: 80, tags: ['chest', 'triceps'], note: 'Max reps' },
    ],
  },

  endurance: {
    E: [
      { name: '20-min Walk/Jog', type: 'timed', sets: 1, duration: 1200, stat: 'endurance', xp: 40, tags: ['cardio'] },
      { name: 'Jumping Jacks', type: 'sets-reps', sets: 3, reps: 30, stat: 'endurance', xp: 12, tags: ['cardio'] },
      { name: 'Mountain Climbers', type: 'timed', sets: 3, duration: 30, stat: 'endurance', xp: 18, tags: ['cardio', 'core'] },
      { name: 'Burpees', type: 'sets-reps', sets: 3, reps: 8, stat: 'endurance', xp: 25, tags: ['full body'] },
      { name: 'High Knees', type: 'timed', sets: 3, duration: 40, stat: 'speed', xp: 15, tags: ['cardio'] },
      { name: 'Step-ups', type: 'sets-reps', sets: 3, reps: 12, stat: 'endurance', xp: 12, tags: ['legs', 'cardio'] },
    ],
    D: [
      { name: '30-min Run', type: 'timed', sets: 1, duration: 1800, stat: 'endurance', xp: 60, tags: ['cardio'] },
      { name: 'Jump Rope', type: 'timed', sets: 5, duration: 60, stat: 'endurance', xp: 20, tags: ['cardio', 'coordination'] },
      { name: 'Burpee Circuit (10 min)', type: 'timed', sets: 1, duration: 600, stat: 'endurance', xp: 50, tags: ['full body'] },
      { name: 'Box Step-ups', type: 'sets-reps', sets: 4, reps: 15, stat: 'endurance', xp: 15, tags: ['legs'] },
      { name: 'Battle Ropes', type: 'timed', sets: 5, duration: 30, stat: 'endurance', xp: 25, tags: ['upper body', 'cardio'] },
    ],
    C: [
      { name: '5K Run', type: 'distance', sets: 1, distance: 5, stat: 'endurance', xp: 80, tags: ['cardio'] },
      { name: 'Rowing Machine (2000m)', type: 'distance', sets: 1, distance: 2, stat: 'endurance', xp: 70, tags: ['full body', 'cardio'] },
      { name: 'AMRAP Circuit (15 min)', type: 'timed', sets: 1, duration: 900, stat: 'endurance', xp: 65, tags: ['full body'] },
      { name: 'Cycling (30 min, zone 3)', type: 'timed', sets: 1, duration: 1800, stat: 'endurance', xp: 60, tags: ['cardio'] },
      { name: 'Wall Sit (3 min total)', type: 'timed', sets: 3, duration: 60, stat: 'endurance', xp: 20, tags: ['quads'] },
    ],
    B: [
      { name: '10K Run', type: 'distance', sets: 1, distance: 10, stat: 'endurance', xp: 120, tags: ['cardio'] },
      { name: 'Rowing (5000m)', type: 'distance', sets: 1, distance: 5, stat: 'endurance', xp: 110, tags: ['full body'] },
      { name: 'Assault Bike (20 min)', type: 'timed', sets: 1, duration: 1200, stat: 'endurance', xp: 90, tags: ['cardio'] },
      { name: 'Tabata Circuit (8 rounds)', type: 'sets-reps', sets: 8, reps: 0, stat: 'endurance', xp: 50, tags: ['full body'], note: '20s on / 10s off' },
    ],
    A: [
      { name: 'Half-marathon', type: 'distance', sets: 1, distance: 21.1, stat: 'endurance', xp: 250, tags: ['cardio'] },
      { name: '1-hour Rowing', type: 'timed', sets: 1, duration: 3600, stat: 'endurance', xp: 200, tags: ['full body'] },
      { name: '5K Time Trial', type: 'distance', sets: 1, distance: 5, stat: 'speed', xp: 120, tags: ['cardio', 'speed'] },
    ],
    S: [
      { name: 'Marathon', type: 'distance', sets: 1, distance: 42.2, stat: 'endurance', xp: 500, tags: ['cardio'] },
      { name: '2K Row Time Trial', type: 'distance', sets: 1, distance: 2, stat: 'endurance', xp: 180, tags: ['full body'] },
    ],
  },

  speed: {
    E: [
      { name: 'Jump Squats', type: 'sets-reps', sets: 3, reps: 10, stat: 'speed', xp: 18, tags: ['legs', 'explosive'] },
      { name: 'Box Jumps', type: 'sets-reps', sets: 3, reps: 6, stat: 'speed', xp: 22, tags: ['legs', 'explosive'] },
      { name: 'Lateral Bounds', type: 'sets-reps', sets: 3, reps: 10, stat: 'speed', xp: 18, tags: ['legs', 'lateral'] },
      { name: 'Ankle Hops', type: 'sets-reps', sets: 3, reps: 20, stat: 'speed', xp: 12, tags: ['ankles', 'calves'] },
      { name: '40m Dash', type: 'sets-reps', sets: 6, reps: 1, stat: 'speed', xp: 30, tags: ['sprint'] },
    ],
    D: [
      { name: 'Sprint Intervals (8×100m)', type: 'sets-reps', sets: 8, reps: 1, stat: 'speed', xp: 35, tags: ['sprint', 'cardio'] },
      { name: 'Depth Jumps', type: 'sets-reps', sets: 4, reps: 6, stat: 'speed', xp: 28, tags: ['legs', 'reactive'] },
      { name: 'Broad Jumps', type: 'sets-reps', sets: 4, reps: 6, stat: 'speed', xp: 25, tags: ['legs', 'explosive'] },
      { name: 'Weighted Jump Squats', type: 'sets-reps', sets: 4, reps: 8, stat: 'speed', xp: 25, tags: ['legs'], note: '10–20% bodyweight' },
      { name: 'Agility Ladder', type: 'timed', sets: 5, duration: 30, stat: 'speed', xp: 20, tags: ['coordination', 'agility'] },
    ],
    C: [
      { name: 'Hill Sprints (10×)', type: 'sets-reps', sets: 10, reps: 1, stat: 'speed', xp: 40, tags: ['sprint', 'power'] },
      { name: 'Treadmill Tempo Run (20 min)', type: 'timed', sets: 1, duration: 1200, stat: 'speed', xp: 55, tags: ['cardio', 'tempo'] },
      { name: 'Power Cleans', type: 'sets-reps', sets: 5, reps: 3, stat: 'speed', xp: 45, tags: ['full body', 'explosive'] },
      { name: 'Reactive Box Jumps', type: 'sets-reps', sets: 5, reps: 5, stat: 'speed', xp: 35, tags: ['reactive', 'explosive'] },
      { name: 'Sprint Pyramid (50–100–150–100–50m)', type: 'sets-reps', sets: 5, reps: 1, stat: 'speed', xp: 50, tags: ['sprint'] },
    ],
    B: [
      { name: 'Flying 40s (6×)', type: 'sets-reps', sets: 6, reps: 1, stat: 'speed', xp: 55, tags: ['sprint', 'max velocity'] },
      { name: 'Hang Power Clean', type: 'sets-reps', sets: 5, reps: 3, stat: 'speed', xp: 50, tags: ['explosive', 'full body'] },
      { name: 'Resisted Sprints (sled)', type: 'sets-reps', sets: 8, reps: 1, stat: 'speed', xp: 60, tags: ['sprint', 'power'] },
    ],
    A: [
      { name: '200m Time Trial', type: 'distance', sets: 3, distance: 0.2, stat: 'speed', xp: 80, tags: ['sprint'] },
      { name: 'Snatch', type: 'sets-reps', sets: 6, reps: 2, stat: 'speed', xp: 70, tags: ['explosive', 'full body'] },
    ],
    S: [
      { name: '100m Sprint (max effort)', type: 'distance', sets: 4, distance: 0.1, stat: 'speed', xp: 120, tags: ['sprint', 'max'] },
    ],
  },

  aesthetics: {
    E: [
      { name: 'Swimming (easy, 20 min)', type: 'timed', sets: 1, duration: 1200, stat: 'endurance', xp: 40, tags: ['full body', 'low impact'] },
      { name: 'Plank', type: 'timed', sets: 3, duration: 45, stat: 'strength', xp: 12, tags: ['core'] },
      { name: 'Crunches', type: 'sets-reps', sets: 3, reps: 20, stat: 'strength', xp: 10, tags: ['core', 'abs'] },
      { name: 'Leg Raises', type: 'sets-reps', sets: 3, reps: 12, stat: 'strength', xp: 12, tags: ['core', 'abs'] },
      { name: 'Push-ups (wide grip)', type: 'sets-reps', sets: 3, reps: 12, stat: 'strength', xp: 12, tags: ['chest'] },
      { name: 'Bicycle Crunches', type: 'sets-reps', sets: 3, reps: 20, stat: 'strength', xp: 10, tags: ['core', 'obliques'] },
    ],
    D: [
      { name: 'Swimming (moderate, 30 min)', type: 'timed', sets: 1, duration: 1800, stat: 'endurance', xp: 60, tags: ['full body'] },
      { name: 'Hollow Body Hold', type: 'timed', sets: 3, duration: 30, stat: 'strength', xp: 18, tags: ['core'] },
      { name: 'Russian Twist', type: 'sets-reps', sets: 3, reps: 20, stat: 'strength', xp: 12, tags: ['obliques'] },
      { name: 'Cable Rows', type: 'sets-reps', sets: 3, reps: 12, stat: 'strength', xp: 18, tags: ['back', 'biceps'] },
      { name: 'Lat Pulldown', type: 'sets-reps', sets: 3, reps: 12, stat: 'strength', xp: 18, tags: ['back', 'lats'] },
      { name: 'Dragon Flags (negatives)', type: 'sets-reps', sets: 3, reps: 5, stat: 'strength', xp: 25, tags: ['core'] },
    ],
    C: [
      { name: 'Swimming (intervals, 40 min)', type: 'timed', sets: 1, duration: 2400, stat: 'endurance', xp: 80, tags: ['full body'] },
      { name: 'Dragon Flags', type: 'sets-reps', sets: 3, reps: 6, stat: 'strength', xp: 30, tags: ['core'] },
      { name: 'L-sit (rings/bars)', type: 'timed', sets: 3, duration: 15, stat: 'strength', xp: 25, tags: ['core', 'shoulders'] },
      { name: 'Hanging Leg Raises', type: 'sets-reps', sets: 4, reps: 10, stat: 'strength', xp: 20, tags: ['core', 'abs'] },
      { name: 'Pull-ups (full ROM)', type: 'sets-reps', sets: 4, reps: 8, stat: 'strength', xp: 25, tags: ['back', 'biceps'] },
      { name: 'Cable Face Pulls', type: 'sets-reps', sets: 3, reps: 15, stat: 'strength', xp: 15, tags: ['rear delts', 'traps'] },
    ],
    B: [
      { name: 'Open-water Swim / 1km pool', type: 'distance', sets: 1, distance: 1, stat: 'endurance', xp: 90, tags: ['full body'] },
      { name: 'Dragon Flag (full)', type: 'sets-reps', sets: 4, reps: 8, stat: 'strength', xp: 40, tags: ['core'] },
      { name: 'Front Lever Tuck', type: 'timed', sets: 3, duration: 10, stat: 'strength', xp: 45, tags: ['back', 'core'] },
      { name: 'Human Flag Attempt', type: 'timed', sets: 3, duration: 5, stat: 'strength', xp: 50, tags: ['core', 'shoulders'] },
    ],
    A: [
      { name: '2km Open-water Swim', type: 'distance', sets: 1, distance: 2, stat: 'endurance', xp: 150, tags: ['full body'] },
      { name: 'Front Lever', type: 'timed', sets: 5, duration: 10, stat: 'strength', xp: 80, tags: ['back', 'core'] },
      { name: 'Planche Pushups', type: 'sets-reps', sets: 5, reps: 3, stat: 'strength', xp: 100, tags: ['chest', 'core', 'shoulders'] },
    ],
    S: [
      { name: 'Human Flag', type: 'timed', sets: 5, duration: 10, stat: 'strength', xp: 120, tags: ['full body', 'elite'] },
      { name: 'Planche', type: 'timed', sets: 5, duration: 8, stat: 'strength', xp: 150, tags: ['elite'] },
    ],
  },
}

export default EXERCISE_DB

// Penalty quest — assigned when user misses a day
export const PENALTY_EXERCISES = {
  strength: [
    { name: '100 Push-ups (any sets)', type: 'sets-reps', sets: 1, reps: 100, stat: 'discipline', xp: 50, tags: ['penalty'] },
    { name: '100 Bodyweight Squats', type: 'sets-reps', sets: 1, reps: 100, stat: 'discipline', xp: 50, tags: ['penalty'] },
  ],
  endurance: [
    { name: '5K Run (penalty pace)', type: 'distance', sets: 1, distance: 5, stat: 'discipline', xp: 50, tags: ['penalty'] },
    { name: '50 Burpees', type: 'sets-reps', sets: 1, reps: 50, stat: 'discipline', xp: 50, tags: ['penalty'] },
  ],
  speed: [
    { name: '20×40m Sprints', type: 'sets-reps', sets: 20, reps: 1, stat: 'discipline', xp: 50, tags: ['penalty'] },
    { name: '100 Jump Squats', type: 'sets-reps', sets: 1, reps: 100, stat: 'discipline', xp: 50, tags: ['penalty'] },
  ],
  aesthetics: [
    { name: '30-min Swimming (non-stop)', type: 'timed', sets: 1, duration: 1800, stat: 'discipline', xp: 50, tags: ['penalty'] },
    { name: '5-min Plank (accumulated)', type: 'timed', sets: 1, duration: 300, stat: 'discipline', xp: 50, tags: ['penalty'] },
  ],
}
