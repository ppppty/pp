import { useState } from 'react'
import { Trash2, StickyNote, ChevronDown, ChevronUp } from 'lucide-react'
import { db } from '@/lib/supabase'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { QuickNote } from '@/types'

export default function QuickNotesPage() {
  const { data: notes, loading, refetch } = useSupabaseQuery<QuickNote>('quick_notes')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这条笔记吗？')) return
    try {
      await db().from('quick_notes').delete().eq('id', id)
      if (expandedId === id) setExpandedId(null)
      refetch()
    } catch (err) {
      console.error('删除笔记失败:', err)
    }
  }

  const formatDate = (ts: string) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return '刚刚'
    if (mins < 60) return `${mins} 分钟前`
    if (hours < 24) return `${hours} 小时前`
    if (days < 7) return `${days} 天前`
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <StickyNote size={24} className="text-brand-600" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">快捷笔记</h2>
          <p className="text-sm text-slate-600">课堂随时记录，课后统一整理到对应板块</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">加载中...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          还没有快捷笔记，点击右上角「快捷笔记」开始记录
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => {
            const isExpanded = expandedId === note.id
            return (
              <div key={note.id} className="card">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : note.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-[1rem] text-slate-700 leading-relaxed ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}`}>
                      {note.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-400">{formatDate(note.created_at)}</span>
                      {note.category && (
                        <span className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{note.category}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <button
                      className="btn btn-ghost btn-sm text-red-400 hover:text-red-600"
                      onClick={(e) => { e.stopPropagation(); handleDelete(note.id) }}
                      aria-label="删除笔记"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="text-slate-300">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
