import { useState } from 'react'
import useAppData from './hooks/useAppData.js'
import Onboarding from './components/Onboarding.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './components/Dashboard.jsx'
import QuestLog from './components/QuestLog.jsx'
import NutritionTracker from './components/NutritionTracker.jsx'
import WeightTracker from './components/WeightTracker.jsx'
import AICoach from './components/AICoach.jsx'
import StatsPanel from './components/StatsPanel.jsx'
import Settings from './components/Settings.jsx'
import Notification from './components/Notification.jsx'

export default function App() {
  const data = useAppData()
  const [tab, setTab] = useState('home')

  if (!data.initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <div className="font-display text-xl text-blue-400 tracking-widest">LEVELUP</div>
          <div className="text-xs text-slate-500 mt-2 animate-pulse">SYSTEM LOADING...</div>
        </div>
      </div>
    )
  }

  if (!data.profile) {
    return <Onboarding onComplete={data.setupProfile} />
  }

  const screens = {
    home: <Dashboard data={data} onNavigate={setTab} />,
    quest: <QuestLog data={data} />,
    nutrition: <NutritionTracker data={data} />,
    progress: <WeightTracker data={data} />,
    coach: <AICoach data={data} />,
    stats: <StatsPanel data={data} />,
    settings: <Settings data={data} />,
  }

  return (
    <Layout tab={tab} setTab={setTab}>
      {data.notification && <Notification notif={data.notification} />}
      {screens[tab] ?? screens.home}
    </Layout>
  )
}
