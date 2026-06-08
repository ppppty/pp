import { useState } from 'react'
import { Plus, Edit3, Trash2, Tag, X } from 'lucide-react'
import { db } from '@/lib/supabase'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { TopicMaterial, TopicMaterialInsert } from '@/types'

interface TopicListProps {
  searchQuery?: string
}

export default function TopicList({ searchQuery = '' }: TopicListProps) {
  const { data: topics, loading, refetch } = useSupabaseQuery<TopicMaterial>('topic_materials')
  const [editing, setEditing] = useState<TopicMaterial | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    tagInput: '',
    content: '',
  })

  // 收集所有已有标签
  const allTags = [...new Set(topics.flatMap(t => t.tags).filter(Boolean))]

  const filtered = topics.filter(t => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      t.content.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    )
  })

  const resetForm = () => {
    setForm({ tagInput: '', content: '' })
    setEditing(null)
    setShowEditor(false)
  }

  const handleSave = async () => {
    const tags = form.tagInput.split(/[,，]/).map(t => t.trim()).filter(Boolean)
    if (tags.length === 0 && !form.content.trim()) return
    setSaving(true)
    try {
      const supabase = db()
      if (editing) {
        await supabase.from('topic_materials').update({
          title: tags[0] || '素材',
          category: '',
          content: form.content.trim(),
          tags,
          updated_at: new Date().toISOString(),
        }).eq('id', editing.id)
      } else {
        const insert: TopicMaterialInsert = {
          title: tags[0] || '素材',
          category: '',
          content: form.content.trim(),
          tags,
        }
        await supabase.from('topic_materials').insert(insert)
      }
      resetForm()
      refetch()
    } catch (err) {
      console.error('保存失败:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (t: TopicMaterial) => {
    setEditing(t)
    setForm({
      tagInput: t.tags.join(', '),
      content: t.content,
    })
    setShowEditor(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这个素材吗？')) return
    try {
      const supabase = db()
      await supabase.from('topic_materials').delete().eq('id', id)
      refetch()
    } catch (err) {
      console.error('删除失败:', err)
    }
  }

  const addTagFromSuggestion = (tag: string) => {
    const currentTags = form.tagInput.split(/[,，]/).map(t => t.trim()).filter(Boolean)
    if (currentTags.includes(tag)) return
    setForm({ ...form, tagInput: [...currentTags, tag].join(', ') })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">主题素材</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowEditor(true) }}>
          <Plus size={16} /> 添加素材
        </button>
      </div>

      {/* 编辑器 */}
      {showEditor && (
        <div className="card border-brand-200 bg-brand-50/30">
          <h3 className="font-medium text-slate-900 mb-4">
            {editing ? '编辑素材' : '添加新素材'}
          </h3>
          <div className="mb-3">
            <label className="form-label">
              标签（逗号分隔，每个标签不含逗号）
            </label>
            <input
              className="form-input"
              value={form.tagInput}
              onChange={e => setForm({ ...form, tagInput: e.target.value })}
              placeholder="如: Technology, Environment, Education..."
            />
            {allTags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap mt-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 hover:bg-brand-100 hover:text-brand-600 transition-colors"
                    onClick={() => addTagFromSuggestion(tag)}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label">内容（支持 Markdown）</label>
            <textarea className="form-textarea" rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="输入素材内容..." />
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : editing ? '更新' : '保存'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={resetForm}>取消</button>
          </div>
        </div>
      )}

      {/* 列表 */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">加载中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          {topics.length === 0 ? '还没有素材，点击「添加素材」开始积累' : '没有匹配的素材'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(t => (
            <div key={t.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-wrap gap-1">
                  {t.tags.length > 0 ? t.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  )) : (
                    <span className="text-xs text-slate-400">无标签</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(t)} aria-label={`编辑 ${t.tags.join(', ') || '素材'}`}>
                    <Edit3 size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm text-red-500" onClick={() => handleDelete(t.id)} aria-label={`删除 ${t.tags.join(', ') || '素材'}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600 line-clamp-4 whitespace-pre-wrap mb-2">
                {t.content || '暂无内容'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
