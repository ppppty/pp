import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Volume2,
  Library,
} from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { SpeakingQA, Expression, Pronunciation, TopicMaterial } from '@/types'

export default function DailyReview() {
  const navigate = useNavigate()
  const { data: questions } = useSupabaseQuery<SpeakingQA>('speaking_qa')
  const { data: expressions } = useSupabaseQuery<Expression>('expressions')
  const { data: words } = useSupabaseQuery<Pronunciation>('pronunciation')
  const { data: topics } = useSupabaseQuery<TopicMaterial>('topic_materials')

  const statCards = [
    {
      label: '串题',
      value: questions.length,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-50',
      onClick: () => navigate('/speaking'),
    },
    {
      label: '素材库',
      value: topics.length,
      icon: Library,
      color: 'text-emerald-600 bg-emerald-50',
      onClick: () => navigate('/topics'),
    },
    {
      label: '表达库',
      value: expressions.length,
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50',
      onClick: () => navigate('/expressions'),
    },
    {
      label: '发音本',
      value: words.length,
      icon: Volume2,
      color: 'text-amber-600 bg-amber-50',
      onClick: () => navigate('/pronunciation'),
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <LayoutDashboard size={20} />
        仪表盘
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map(card => (
          <div
            key={card.label}
            className="card cursor-pointer"
            onClick={card.onClick}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
              <card.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
