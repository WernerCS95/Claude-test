import { useState } from 'react'
import { format, parseISO, subDays } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs"
      style={{ background: '#0d1020', border: '1px solid rgba(59,130,246,0.3)' }}
    >
      <div className="text-slate-400">{label}</div>
      <div className="text-blue-400 font-bold">{payload[0].value} kg</div>
    </div>
  )
}

function Trend({ entries }) {
  if (entries.length < 2) return null
  const first = entries[entries.length - 1]?.weight
  const last = entries[0]?.weight
  const diff = (last - first).toFixed(1)
  const up = diff > 0
  return (
    <span
      className="text-xs font-mono"
      style={{ color: up ? '#ef4444' : '#10b981' }}
    >
      {up ? '▲' : '▼'} {Math.abs(diff)} kg
    </span>
  )
}

export default function WeightTracker({ data }) {
  const { weightLog, logWeight, profile } = data
  const [inputWeight, setInputWeight] = useState('')
  const unit = profile?.unit ?? 'metric'

  const sorted = [...weightLog].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
  const chartData = [...sorted].reverse().map((e) => ({
    date: format(parseISO(e.date), 'MMM d'),
    weight: e.weight,
  }))

  const todayLogged = sorted[0]?.date === format(new Date(), 'yyyy-MM-dd')
  const latestWeight = sorted[0]?.weight

  function handleLog() {
    const val = parseFloat(inputWeight)
    if (!val || val < 20 || val > 400) return
    logWeight(val)
    setInputWeight('')
  }

  const yMin = chartData.length > 0
    ? Math.floor(Math.min(...chartData.map((d) => d.weight)) - 2)
    : 60
  const yMax = chartData.length > 0
    ? Math.ceil(Math.max(...chartData.map((d) => d.weight)) + 2)
    : 90

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Current weight card */}
      <div className="system-panel p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-sm tracking-widest text-slate-400">WEIGHT LOG</h3>
          {sorted.length >= 2 && <Trend entries={sorted} />}
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display text-4xl text-slate-100">
            {latestWeight ?? '—'}
          </span>
          <span className="text-slate-500 text-sm">{unit === 'metric' ? 'kg' : 'lbs'}</span>
          {profile?.targetWeight && (
            <span className="text-xs text-slate-600 ml-2">
              Target: {profile.targetWeight} {unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder={unit === 'metric' ? 'e.g. 75.4' : 'e.g. 166'}
            value={inputWeight}
            onChange={(e) => setInputWeight(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLog()}
            step="0.1"
            style={{ flex: 1 }}
          />
          <button
            onClick={handleLog}
            className="btn-glow px-4 py-2 rounded-lg font-display tracking-wide text-white text-sm whitespace-nowrap"
          >
            {todayLogged ? 'UPDATE' : '+ LOG'}
          </button>
        </div>
        {todayLogged && (
          <div className="text-xs text-green-400 mt-2">✓ Logged today</div>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="system-panel p-4">
          <h3 className="font-display text-sm tracking-widest text-slate-400 mb-4">30-DAY TREND</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: '#475569', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fill: '#475569', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {profile?.targetWeight && (
                <ReferenceLine
                  y={profile.targetWeight}
                  stroke="rgba(16,185,129,0.4)"
                  strokeDasharray="4 3"
                  label={{ value: 'Target', fill: '#10b981', fontSize: 10 }}
                />
              )}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.6))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History */}
      {sorted.length > 0 && (
        <div className="system-panel p-4">
          <h3 className="font-display text-sm tracking-widest text-slate-400 mb-3">HISTORY</h3>
          <div className="space-y-0">
            {sorted.slice(0, 14).map((entry, i) => {
              const prev = sorted[i + 1]?.weight
              const diff = prev ? (entry.weight - prev).toFixed(1) : null
              return (
                <div key={entry.date} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs text-slate-400">
                    {format(parseISO(entry.date), 'EEE, MMM d')}
                  </span>
                  <div className="flex items-center gap-3">
                    {diff !== null && (
                      <span className="text-xs font-mono" style={{ color: diff > 0 ? '#ef4444' : diff < 0 ? '#10b981' : '#475569' }}>
                        {diff > 0 ? '+' : ''}{diff}
                      </span>
                    )}
                    <span className="font-mono text-sm text-slate-200">{entry.weight}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {sorted.length === 0 && (
        <div
          className="text-center py-12 system-panel"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="text-3xl mb-3">📊</div>
          <div className="text-sm font-display tracking-wide">No weight data yet</div>
          <div className="text-xs mt-1">Log your first weigh-in above</div>
        </div>
      )}
    </div>
  )
}
