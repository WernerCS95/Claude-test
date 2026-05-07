const KEYS = {
  PROFILE: 'lu_profile',
  QUESTS: 'lu_quests',
  MEALS: 'lu_meals',
  WEIGHT_LOG: 'lu_weight',
  SETTINGS: 'lu_settings',
  CHAT: 'lu_chat',
}

function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('localStorage write failed', key)
  }
}

function remove(key) {
  localStorage.removeItem(key)
}

// Profile
export function getProfile() {
  return get(KEYS.PROFILE)
}
export function saveProfile(profile) {
  set(KEYS.PROFILE, profile)
}

// Quests
export function getQuests() {
  return get(KEYS.QUESTS, [])
}
export function saveQuests(quests) {
  set(KEYS.QUESTS, quests)
}

// Meals
export function getMeals() {
  return get(KEYS.MEALS, [])
}
export function saveMeals(meals) {
  set(KEYS.MEALS, meals)
}

// Weight Log
export function getWeightLog() {
  return get(KEYS.WEIGHT_LOG, [])
}
export function saveWeightLog(log) {
  set(KEYS.WEIGHT_LOG, log)
}

// Settings
export function getSettings() {
  return get(KEYS.SETTINGS, { apiKey: '', unit: 'metric' })
}
export function saveSettings(settings) {
  set(KEYS.SETTINGS, settings)
}

// Chat history (last 50 messages)
export function getChatHistory() {
  return get(KEYS.CHAT, [])
}
export function saveChatHistory(messages) {
  const trimmed = messages.slice(-50)
  set(KEYS.CHAT, trimmed)
}

export function clearAllData() {
  Object.values(KEYS).forEach(remove)
}
