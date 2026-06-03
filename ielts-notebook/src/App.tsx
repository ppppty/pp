import { HashRouter, Routes, Route } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import QuickNote from './components/Layout/QuickNote'
import { hasCredentials } from './lib/supabase'

// 懒加载页面组件（后续步骤实现）
import Dashboard from './components/Review/DailyReview'
import SpeakingList from './components/Speaking/SpeakingList'
import TopicList from './components/Topics/TopicList'
import ExpressionList from './components/Expressions/ExpressionList'
import WordList from './components/Pronunciation/WordList'
import AIAnswerGenerator from './components/AI/AIAnswerGenerator'
import VocabUpgrader from './components/AI/VocabUpgrader'
import SetupPage from './components/Layout/SetupPage'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [quickNoteOpen, setQuickNoteOpen] = useState(false)
  const [setupRequired, setSetupRequired] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hasCredentials()) {
      setSetupRequired(true)
    }
    setReady(true)
  }, [])

  const handleQuickNoteSaved = useCallback(() => {
    // 触发刷新（后续用全局状态管理）
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400">加载中...</div>
      </div>
    )
  }

  if (setupRequired) {
    return (
      <HashRouter>
        <SetupPage onConfigured={() => {
          setSetupRequired(false)
        }} />
      </HashRouter>
    )
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-60 flex-1 flex flex-col">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuickNote={() => setQuickNoteOpen(true)}
          />
          <main className="flex-1 p-6 bg-slate-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/speaking" element={<SpeakingList searchQuery={searchQuery} />} />
              <Route path="/speaking/:id" element={<SpeakingList searchQuery={searchQuery} />} />
              <Route path="/topics" element={<TopicList searchQuery={searchQuery} />} />
              <Route path="/expressions" element={<ExpressionList searchQuery={searchQuery} />} />
              <Route path="/pronunciation" element={<WordList searchQuery={searchQuery} />} />
              <Route path="/ai/answer" element={<AIAnswerGenerator />} />
              <Route path="/ai/upgrade" element={<VocabUpgrader />} />
              <Route path="/settings" element={<SetupPage onConfigured={() => {}} />} />
            </Routes>
          </main>
        </div>
      </div>

      <QuickNote
        open={quickNoteOpen}
        onClose={() => setQuickNoteOpen(false)}
        onSaved={handleQuickNoteSaved}
      />
    </HashRouter>
  )
}
