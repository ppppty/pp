import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Volume2,
  Library,
} from 'lucide-react'
import { useSupabaseCount } from '@/hooks/useSupabaseQuery'

export default function DailyReview() {
  const navigate = useNavigate()
  const { count: questionCount, loading: qLoading } = useSupabaseCount('speaking_qa')
  const { count: expressionCount, loading: eLoading } = useSupabaseCount('expressions')
  const { count: wordCount, loading: wLoading } = useSupabaseCount('pronunciation')
  const { count: topicCount, loading: tLoading } = useSupabaseCount('topic_materials')
  const isLoading = qLoading || eLoading || wLoading || tLoading

  const statCards = [
    {
      label: '串题',
      value: questionCount,
      icon: MessageSquare,
      color: 'text-slate-400 bg-slate-50',
      onClick: () => navigate('/speaking'),
    },
    {
      label: '主题素材',
      value: topicCount,
      icon: Library,
      color: 'text-brand-500 bg-brand-50',
      onClick: () => navigate('/topics'),
    },
    {
      label: '词汇表达',
      value: expressionCount,
      icon: Sparkles,
      color: 'text-brand-400 bg-brand-50',
      onClick: () => navigate('/expressions'),
    },
    {
      label: '发音本',
      value: wordCount,
      icon: Volume2,
      color: 'text-slate-400 bg-slate-50',
      onClick: () => navigate('/pronunciation'),
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <LayoutDashboard size={22} />
        仪表盘
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div
            key={card.label}
            className="card cursor-pointer"
            onClick={card.onClick}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon size={20} />
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 w-12 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-400 font-medium">{card.label}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
