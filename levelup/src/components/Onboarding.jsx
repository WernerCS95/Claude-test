import { useState } from 'react'

const GOALS = [
  {
    id: 'strength',
    label: 'STRENGTH',
    icon: '⚔️',
    desc: 'Build raw power. Compound lifts, progressive overload, iron discipline.',
    color: '#ef4444',
  },
  {
    id: 'endurance',
    label: 'ENDURANCE',
    icon: '🏃',
    desc: 'Outlast everyone. Runs, circuits, timed holds. Your engine never quits.',
    color: '#3b82f6',
  },
  {
    id: 'speed',
    label: 'SPEED',
    icon: '⚡',
    desc: 'Move faster than the eye can track. Plyos, sprints, explosive power.',
    color: '#f59e0b',
  },
  {
    id: 'aesthetics',
    label: 'AESTHETICS',
    icon: '🌊',
    desc: 'Sculpt every line. Swimming, core mastery, full-body circuits.',
    color: '#10b981',
  },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    goal: '',
    weight: '',
    height: '',
    age: '',
    gender: 'unset',
    unit: 'metric',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const canNext = [
    form.name.trim().length > 0,
    form.goal !== '',
    true, // body metrics optional
  ]

  function finish() {
    onComplete({
      name: form.name.trim() || 'Hunter',
      goal: form.goal || 'strength',
      weight: form.weight ? parseFloat(form.weight) : null,
      height: form.height ? parseFloat(form.height) : null,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      unit: form.unit,
    })
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'var(--bg)' }}
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-5xl mb-2">⚡</div>
        <h1 className="font-display text-3xl text-blue-400 tracking-widest">LEVELUP</h1>
        <p className="text-xs text-slate-500 mt-1 tracking-widest">HEALTH OS — SYSTEM INIT</p>
      </div>

      {/* Steps */}
      <div className="w-full max-w-sm">
        {step === 0 && (
          <div className="system-panel p-6 animate-fade-in">
            <h2 className="font-display text-xl text-slate-200 tracking-wide mb-1">HUNTER REGISTRATION</h2>
            <p className="text-xs text-slate-500 mb-6">What do we call you?</p>
            <input
              autoFocus
              placeholder="Enter your name..."
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canNext[0] && setStep(1)}
              className="mb-6"
              maxLength={24}
            />
            <button
              onClick={() => setStep(1)}
              disabled={!canNext[0]}
              className="btn-glow w-full py-3 rounded-lg font-display tracking-widest text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              CONFIRM IDENTITY →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="system-panel p-6 animate-fade-in">
            <h2 className="font-display text-xl text-slate-200 tracking-wide mb-1">SELECT PRIMARY GOAL</h2>
            <p className="text-xs text-slate-500 mb-5">This shapes every quest, macro target, and AI recommendation.</p>
            <div className="space-y-3 mb-6">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => set('goal', g.id)}
                  className="w-full text-left p-4 rounded-lg border transition-all"
                  style={{
                    background: form.goal === g.id ? `${g.color}15` : 'rgba(255,255,255,0.02)',
                    borderColor: form.goal === g.id ? `${g.color}80` : 'var(--border)',
                    boxShadow: form.goal === g.id ? `0 0 16px ${g.color}20` : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <div
                        className="font-display text-sm tracking-widest"
                        style={{ color: form.goal === g.id ? g.color : 'var(--text)' }}
                      >
                        {g.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{g.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-4 py-3 rounded-lg border border-slate-700 text-slate-400 text-sm">
                ←
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!canNext[1]}
                className="btn-glow flex-1 py-3 rounded-lg font-display tracking-widest text-white text-sm disabled:opacity-30"
              >
                LOCK IN GOAL →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="system-panel p-6 animate-fade-in">
            <h2 className="font-display text-xl text-slate-200 tracking-wide mb-1">BODY METRICS</h2>
            <p className="text-xs text-slate-500 mb-5">Optional — used to calculate macro targets. Stays on your device.</p>

            <div className="flex gap-2 mb-4">
              {['metric', 'imperial'].map((u) => (
                <button
                  key={u}
                  onClick={() => set('unit', u)}
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

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Weight ({form.unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  placeholder={form.unit === 'metric' ? '75' : '165'}
                  value={form.weight}
                  onChange={(e) => set('weight', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Height ({form.unit === 'metric' ? 'cm' : 'in'})
                </label>
                <input
                  type="number"
                  placeholder={form.unit === 'metric' ? '175' : '69'}
                  value={form.height}
                  onChange={(e) => set('height', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Age</label>
                <input
                  type="number"
                  placeholder="25"
                  value={form.age}
                  onChange={(e) => set('age', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Gender</label>
                <select value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                  <option value="unset">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="px-4 py-3 rounded-lg border border-slate-700 text-slate-400 text-sm">
                ←
              </button>
              <button
                onClick={finish}
                className="btn-glow flex-1 py-3 rounded-lg font-display tracking-widest text-white text-sm"
              >
                ENTER THE SYSTEM →
              </button>
            </div>
          </div>
        )}

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: step === i ? 20 : 6,
                height: 6,
                background: step === i ? '#3b82f6' : 'rgba(59,130,246,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
