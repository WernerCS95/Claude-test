import { useState, useRef, useEffect } from 'react'
import { Send, Bot, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { levelToRank, getTitle, xpToLevel } from '../utils/statsCalculator.js'
import { getChatHistory, saveChatHistory } from '../utils/storage.js'

function buildSystemPrompt(profile, todayQuest, todayTotals, weightLog, quests) {
  const { level } = xpToLevel(profile.totalXp ?? 0)
  const rank = levelToRank(level)
  const recentQuests = quests.slice(0, 7)
  const recentWeight = weightLog.slice(0, 7)

  return `You are the SYSTEM — an elite AI coach embedded in a hunter's personal health OS called LEVELUP.

HUNTER PROFILE:
- Name: ${profile.name}
- Primary Goal: ${profile.goal}
- Level: ${level} (${rank}-Rank) — ${getTitle(profile.goal, level)}
- Total XP: ${profile.totalXp ?? 0}
- Streak: ${profile.streak ?? 0} days
- Stats: STR ${profile.stats?.strength ?? 0} | END ${profile.stats?.endurance ?? 0} | SPD ${profile.stats?.speed ?? 0} | DIS ${profile.stats?.discipline ?? 0}
${profile.weight ? `- Current Weight: ${profile.weight} kg` : ''}
${profile.targetWeight ? `- Target Weight: ${profile.targetWeight} kg` : ''}

MACRO TARGETS: ${profile.macros?.calories ?? 2200} kcal | P:${profile.macros?.protein ?? 160}g C:${profile.macros?.carbs ?? 220}g F:${profile.macros?.fats ?? 65}g

TODAY'S NUTRITION:
- Consumed: ${todayTotals.calories} kcal | P:${todayTotals.protein}g C:${todayTotals.carbs}g F:${todayTotals.fats}g

TODAY'S QUEST: ${todayQuest
    ? `${todayQuest.rank}-Rank ${todayQuest.goal} — ${todayQuest.exercises.filter((e) => e.completed).length}/${todayQuest.exercises.length} exercises done`
    : 'Not started'
  }

RECENT WORKOUTS (last 7):
${recentQuests.map((q) =>
  `  [${q.date}] ${q.rank}-Rank ${q.goal} — ${q.completed ? `Complete (+${q.xpEarned} XP)` : 'Incomplete'}`
).join('\n') || '  No recent workouts'}

WEIGHT TREND (last 7):
${recentWeight.map((w) => `  [${w.date}] ${w.weight} kg`).join('\n') || '  No data'}

COACHING PRINCIPLES:
- Be direct and specific. No filler, no compliments unless earned.
- Reference the hunter's actual data when giving advice.
- For exercise prescriptions, give specific sets/reps/weights based on their goal and level.
- For nutrition, work with their actual macro targets and today's intake.
- If they missed workouts, acknowledge it directly — don't coddle.
- Suggest exercises from the right tier for their rank/goal.
- Sound like an elite trainer who respects the hunter — not a motivational poster.
- Keep responses concise but complete. Bullet points for plans.
- Use the SYSTEM aesthetic when appropriate (rank names, XP references) but don't overdo it.`
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <Bot size={16} className="text-blue-400" />
        </div>
      )}
      <div
        className="max-w-[85%] px-3 py-2.5 rounded-lg text-sm leading-relaxed"
        style={
          isUser
            ? { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', color: '#e2e8f0' }
            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#e2e8f0' }
        }
      >
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AICoach({ data }) {
  const { profile, todayQuest, todayTotals, weightLog, quests, settings } = data
  const [messages, setMessages] = useState(() => getChatHistory())
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const systemPrompt = buildSystemPrompt(profile, todayQuest, todayTotals, weightLog, quests)
      const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }))

      const headers = { 'Content-Type': 'application/json' }
      if (settings.apiKey) headers['X-API-Key'] = settings.apiKey

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: apiMessages, system: systemPrompt, max_tokens: 1024 }),
      })

      const json = await res.json()

      if (!res.ok) {
        const errMsg = typeof json.error === 'string' ? json.error : json.error?.message ?? `API error ${res.status}`
        throw new Error(errMsg)
      }

      const reply = json.content?.[0]?.text ?? 'No response.'
      const assistantMsg = { role: 'assistant', content: reply }
      const finalMessages = [...newMessages, assistantMsg]
      setMessages(finalMessages)
      saveChatHistory(finalMessages)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const hasApiKey = settings.apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-blue-400" />
          <span className="font-display text-sm tracking-widest text-slate-300">AI COACH</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-display tracking-wide"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            CLAUDE
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-0.5">
          Knows your full training history, nutrition, and stats.
        </p>
      </div>

      {/* No API key warning */}
      {!hasApiKey && (
        <div
          className="mx-4 mt-3 p-3 rounded-lg flex items-start gap-2 text-xs"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
        >
          <AlertCircle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <span className="text-yellow-200">
            No API key configured. Go to Settings → enter your Anthropic API key to enable AI coaching.
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🤖</div>
            <div className="font-display text-slate-400 tracking-wide text-sm">THE SYSTEM IS READY</div>
            <div className="text-xs text-slate-600 mt-2 leading-relaxed max-w-xs mx-auto">
              Ask about your next workout, nutrition adjustments, weak points, or training program.
            </div>
            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              {[
                "What should I do today?",
                "Analyze my recent performance",
                "How to improve my weakest stat?",
                "Fix my nutrition plan",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-blue-500/40 hover:text-blue-400 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {loading && (
          <div className="flex gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
            >
              <Bot size={16} className="text-blue-400" />
            </div>
            <div
              className="px-4 py-3 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            className="px-3 py-2 rounded-lg text-xs text-red-300 mb-4"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            Error: {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            placeholder="Ask your coach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading || !hasApiKey}
            style={{ flex: 1 }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || !hasApiKey}
            className="p-2.5 rounded-lg transition-all disabled:opacity-30"
            style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
