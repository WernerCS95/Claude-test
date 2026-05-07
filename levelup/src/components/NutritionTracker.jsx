import { useState } from 'react'
import { Trash2, Plus, AlertTriangle, Gift } from 'lucide-react'
import { calorieOffset, smartFoodReward } from '../utils/statsCalculator.js'
import { todayStr } from '../utils/questGenerator.js'

const QUICK_FOODS = [
  { name: 'Chicken breast (150g)', calories: 248, protein: 46, carbs: 0, fats: 5 },
  { name: 'White rice (200g cooked)', calories: 260, protein: 5, carbs: 56, fats: 0 },
  { name: 'Eggs (3 whole)', calories: 210, protein: 18, carbs: 2, fats: 14 },
  { name: 'Greek yogurt (200g)', calories: 120, protein: 20, carbs: 9, fats: 0 },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0 },
  { name: 'Protein shake', calories: 130, protein: 25, carbs: 5, fats: 2 },
  { name: 'Oats (80g dry)', calories: 300, protein: 10, carbs: 54, fats: 6 },
  { name: 'Salmon (150g)', calories: 280, protein: 38, carbs: 0, fats: 14 },
]

function MacroRing({ label, value, target, color }) {
  const pct = target > 0 ? Math.min(value / target, 1) : 0
  const over = target > 0 && value > target
  const r = 24
  const circ = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="5" stroke="rgba(255,255,255,0.05)" />
        <circle
          cx="32" cy="32" r={r}
          fill="none" strokeWidth="5"
          stroke={over ? '#ef4444' : color}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease', filter: `drop-shadow(0 0 4px ${over ? '#ef4444' : color})` }}
        />
      </svg>
      <div className="text-center -mt-1">
        <div className="text-xs font-mono font-bold" style={{ color: over ? '#ef4444' : color }}>
          {Math.round(value)}
        </div>
        <div className="text-[10px] text-slate-500">/{target}</div>
        <div className="text-[10px] text-slate-500 font-display tracking-wide">{label}</div>
      </div>
    </div>
  )
}

function MealRow({ meal, onDelete }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-slate-200 truncate">{meal.name}</div>
        <div className="text-xs text-slate-500 mt-0.5">
          {meal.calories} kcal • P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g
        </div>
      </div>
      <button
        onClick={() => onDelete(meal.id)}
        className="ml-3 p-1.5 rounded text-slate-600 hover:text-red-400 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default function NutritionTracker({ data }) {
  const { profile, todayMeals, todayTotals, addMeal, deleteMeal } = data
  const macros = profile.macros ?? { calories: 2200, protein: 160, carbs: 220, fats: 65 }

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '' })
  const [quickMode, setQuickMode] = useState(true)

  const calDiff = todayTotals.calories - macros.calories
  const offset = calDiff > 50 ? calorieOffset(calDiff) : null
  const reward = calDiff < -100 ? smartFoodReward(-calDiff) : null

  function setF(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  function submitMeal() {
    if (!form.name.trim()) return
    addMeal({
      name: form.name.trim(),
      calories: parseFloat(form.calories) || 0,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fats: parseFloat(form.fats) || 0,
    })
    setForm({ name: '', calories: '', protein: '', carbs: '', fats: '' })
    setShowForm(false)
  }

  function logQuick(food) {
    addMeal({ ...food })
  }

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Macro overview */}
      <div className="system-panel p-4">
        <h3 className="font-display text-sm tracking-widest text-slate-400 mb-4">TODAY'S FUEL</h3>
        <div className="flex justify-around mb-4">
          <MacroRing label="KCAL" value={todayTotals.calories} target={macros.calories} color="#f59e0b" />
          <MacroRing label="PRO" value={todayTotals.protein} target={macros.protein} color="#3b82f6" />
          <MacroRing label="CARB" value={todayTotals.carbs} target={macros.carbs} color="#8b5cf6" />
          <MacroRing label="FAT" value={todayTotals.fats} target={macros.fats} color="#f97316" />
        </div>

        {/* Advice strip */}
        {offset && (
          <div
            className="flex items-start gap-2 p-3 rounded-lg text-xs"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-red-300">
              {calDiff > 0 ? `+${calDiff}` : calDiff} kcal over target.{' '}
              Offset with: <strong>{offset}</strong>
            </span>
          </div>
        )}
        {reward && (
          <div
            className="flex items-start gap-2 p-3 rounded-lg text-xs"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <Gift size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-green-300">
              {Math.abs(calDiff)} kcal remaining.{' '}
              Fuel up with: <strong>{reward}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Log Meal */}
      <div className="system-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm tracking-widest text-slate-400">LOG MEAL</h3>
          <div className="flex gap-1">
            {['quick', 'manual'].map((m) => (
              <button
                key={m}
                onClick={() => { setQuickMode(m === 'quick'); setShowForm(m === 'manual') }}
                className="text-xs px-2 py-1 rounded font-display tracking-wide border transition-all"
                style={{
                  background: (m === 'quick' ? quickMode : !quickMode) ? 'rgba(59,130,246,0.15)' : 'transparent',
                  borderColor: (m === 'quick' ? quickMode : !quickMode) ? 'rgba(59,130,246,0.4)' : 'var(--border)',
                  color: (m === 'quick' ? quickMode : !quickMode) ? '#3b82f6' : 'var(--text-muted)',
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {quickMode && (
          <div className="grid grid-cols-2 gap-2">
            {QUICK_FOODS.map((food) => (
              <button
                key={food.name}
                onClick={() => logQuick(food)}
                className="text-left p-2.5 rounded-lg border border-slate-800 hover:border-blue-500/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="text-xs text-slate-300 leading-tight mb-1">{food.name}</div>
                <div className="text-[10px] text-slate-500">{food.calories} kcal</div>
              </button>
            ))}
          </div>
        )}

        {!quickMode && (
          <div className="space-y-3">
            <input placeholder="Meal name" value={form.name} onChange={(e) => setF('name', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Calories</label>
                <input type="number" placeholder="0" value={form.calories} onChange={(e) => setF('calories', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Protein (g)</label>
                <input type="number" placeholder="0" value={form.protein} onChange={(e) => setF('protein', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Carbs (g)</label>
                <input type="number" placeholder="0" value={form.carbs} onChange={(e) => setF('carbs', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Fats (g)</label>
                <input type="number" placeholder="0" value={form.fats} onChange={(e) => setF('fats', e.target.value)} />
              </div>
            </div>
            <button onClick={submitMeal} className="btn-glow w-full py-2.5 rounded-lg font-display tracking-widest text-white text-sm">
              + LOG MEAL
            </button>
          </div>
        )}
      </div>

      {/* Meal list */}
      {todayMeals.length > 0 && (
        <div className="system-panel p-4">
          <h3 className="font-display text-sm tracking-widest text-slate-400 mb-2">TODAY'S LOG</h3>
          {todayMeals.map((m) => (
            <MealRow key={m.id} meal={m} onDelete={deleteMeal} />
          ))}
        </div>
      )}
    </div>
  )
}
