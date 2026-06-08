import { HashRouter, useLocation } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import QuickNote from './components/Layout/QuickNote'
import KeepAlive from './components/Layout/KeepAlive'
import { hasCredentials } from './lib/supabase'

import Dashboard from './components/Review/DailyReview'
import SpeakingList from './components/Speaking/SpeakingList'
import TopicList from './components/Topics/TopicList'
import ExpressionList from './components/Expressions/ExpressionList'
import WordList from './components/Pronunciation/WordList'
import AIAnswerGenerator from './components/AI/AIAnswerGenerator'
import VocabUpgrader from './components/AI/VocabUpgrader'
import SetupPage from './components/Layout/SetupPage'
import QuickNotesPage from './components/Review/QuickNotesPage'

function AppContent() {
  const location = useLocation()
  const path = location.pathname
  const [searchQuery, setSearchQuery] = useState('')
  const [quickNoteOpen, setQuickNoteOpen] = useState(false)

  const handleQuickNoteSaved = useCallback(() => {
    // QuickNotesPage 在挂载时会自动 refetch
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickNote={() => setQuickNoteOpen(true)}
        />
        <main className="flex-1 p-6 bg-white">
          <KeepAlive active={path === '/'}>
            <Dashboard />
          </KeepAlive>
          <KeepAlive active={path.startsWith('/speaking')}>
            <SpeakingList searchQuery={searchQuery} />
          </KeepAlive>
          <KeepAlive active={path === '/topics'}>
            <TopicList searchQuery={searchQuery} />
          </KeepAlive>
          <KeepAlive active={path === '/expressions'}>
            <ExpressionList searchQuery={searchQuery} />
          </KeepAlive>
          <KeepAlive active={path === '/pronunciation'}>
            <WordList searchQuery={searchQuery} />
          </KeepAlive>
          <KeepAlive active={path === '/ai/answer'}>
            <AIAnswerGenerator />
          </KeepAlive>
          <KeepAlive active={path === '/ai/upgrade'}>
            <VocabUpgrader />
          </KeepAlive>
          <KeepAlive active={path === '/quick-notes'}>
            <QuickNotesPage />
          </KeepAlive>
          <KeepAlive active={path === '/settings'}>
            <SetupPage onConfigured={() => {}} />
          </KeepAlive>
        </main>
      </div>

      <QuickNote
        open={quickNoteOpen}
        onClose={() => setQuickNoteOpen(false)}
        onSaved={handleQuickNoteSaved}
      />
    </div>
  )
}

export default function App() {
  const [setupRequired, setSetupRequired] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hasCredentials()) {
      setSetupRequired(true)
    }
    setReady(true)
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
      <AppContent />
    </HashRouter>
  )
}
