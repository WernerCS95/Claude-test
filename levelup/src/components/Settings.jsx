import { useState } from 'react'
import { Eye, EyeOff, AlertTriangle, Trash2 } from 'lucide-react'
import { clearAllData } from '../utils/storage.js'
import { calcMacroTargets } from '../utils/statsCalculator.js'

const GOAL_LABELS = {
  strength: '⚔️ Strength',
  endurance: '🏃 Endurance',
  speed: '⚡ Speed',
  aesthetics: '🌊 Aesthetics',
}

export default function Settings({ data }) {
  const { profile, settings, updateProfile, updateSettings } = data
  const [showKey, setShowKey] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: profile.name ?? '',
    goal: profile.goal ?? 'strength',
    weight: profile.weight ?? '',
    targetWeight: profile.targetWeight ?? '',
    height: profile.height ?? '',
    age: profile.age ?? '',
    gender: profile.gender ?? 'unset',
    unit: profile.unit ?? 'metric',
  })
  const [apiKey, setApiKey] = useState(settings.apiKey ?? '')

  function setF(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  function saveProfile() {
    updateProfile({
      name: form.name.trim() || profile.name,
      goal: form.goal,
      weight: form.weight ? parseFloat(form.weight) : null,
      targetWeight: form.targetWeight ? parseFloat(form.targetWeight) : null,
      height: form.height ? parseFloat(form.height) : null,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      unit: form.unit,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function saveApiKey() {
    updateSettings({ apiKey })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    if (confirmReset) {
      clearAllData()
      window.location.reload()
    } else {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 4000)
    }
  }

  const macroPreview = calcMacroTargets(
    form.goal,
    form.weight ? parseFloat(form.weight) : null,
    form.height ? parseFloat(form.height) : null,
    form.age ? parseInt(form.age) : null,
    form.gender
  )

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* AI API Key */}
      <div className="system-panel p-4">
        <h3 className="font-display text-sm tracking-widest text-slate-400 mb-1">AI COACH</h3>
        <p className="text-xs text-slate-600 mb-4">
          Enter your Anthropic API key to enable AI coaching. Stored locally — never sent anywhere except the Anthropic API.
        </p>
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ paddingRight: 40 }}
            />
            <button
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button
            onClick={saveApiKey}
            className="btn-glow px-4 py-2 rounded-lg font-display tracking-wide text-white text-sm whitespace-nowrap"
          >
            SAVE
          </button>
        </div>
        <a
          href="https://console.anthropic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline"
        >
          Get an API key →
        </a>
      </div>

      {/* Profile settings */}
      <div className="system-panel p-4">
        <h3 className="font-display text-sm tracking-widest text-slate-400 mb-4">HUNTER PROFILE</h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Hunter Name</label>
            <input value={form.name} onChange={(e) => setF('name', e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Primary Goal</label>
            <select value={form.goal} onChange={(e) => setF('goal', e.target.value)}>
              {Object.entries(GOAL_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            {['metric', 'imperial'].map((u) => (
              <button
                key={u}
                onClick={() => setF('unit', u)}
                className="flex-1 py-2 rounded-md text-xs font-display tracking-wide border transition-all"
                style={{
                  background: form.unit === u ? 'rgba(59,130,246,0.15)' : 'transparent',
                  borderColor: form.unit === u ? 'rgba(59,130,246,0.5)' : 'var(--border)',
                  color: form.unit === u ? '#3b82f6' : 'var(--text-dim)',
                }}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Weight ({form.unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input type="number" step="0.1" value={form.weight} onChange={(e) => setF('weight', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target Weight</label>
              <input type="number" step="0.1" value={form.targetWeight} onChange={(e) => setF('targetWeight', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Height ({form.unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input type="number" value={form.height} onChange={(e) => setF('height', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Age</label>
              <input type="number" value={form.age} onChange={(e) => setF('age', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Gender</label>
            <select value={form.gender} onChange={(e) => setF('gender', e.target.value)}>
              <option value="unset">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Macro preview */}
        <div
          className="mt-4 p-3 rounded-lg text-xs"
          style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <div className="font-display tracking-wide text-blue-400 mb-2">CALCULATED MACRO TARGETS</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'CAL', value: macroPreview.calories, unit: 'kcal' },
              { label: 'PRO', value: macroPreview.protein, unit: 'g' },
              { label: 'CARB', value: macroPreview.carbs, unit: 'g' },
              { label: 'FAT', value: macroPreview.fats, unit: 'g' },
            ].map(({ label, value, unit }) => (
              <div key={label}>
                <div className="text-slate-200 font-mono">{value}</div>
                <div className="text-slate-600">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={saveProfile}
          className="btn-glow w-full py-3 mt-4 rounded-lg font-display tracking-widest text-white text-sm"
        >
          {saved ? '✓ SAVED' : 'SAVE CHANGES'}
        </button>
      </div>

      {/* Danger zone */}
      <div
        className="system-panel p-4"
        style={{ borderColor: 'rgba(239,68,68,0.2)' }}
      >
        <h3 className="font-display text-sm tracking-widest text-red-400 mb-3">DANGER ZONE</h3>
        <div className="flex items-start gap-2 mb-3 text-xs text-slate-500">
          <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <span>Resetting will permanently erase all your progress, workouts, and data.</span>
        </div>
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-lg font-display tracking-widest text-sm transition-all"
          style={
            confirmReset
              ? { background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444' }
              : { background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }
          }
        >
          {confirmReset ? '⚠ TAP AGAIN TO CONFIRM RESET' : 'RESET ALL DATA'}
        </button>
      </div>

      <div className="text-center text-xs text-slate-700 py-2">
        LEVELUP v1.0 — All data stored locally in your browser
      </div>
    </div>
  )
}
