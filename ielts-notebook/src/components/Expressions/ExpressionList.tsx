import { useState } from 'react'
import { Plus, Edit3, Trash2, Filter } from 'lucide-react'
import { db } from '@/lib/supabase'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { EXPRESSION_TYPE_LABELS, EXPRESSION_TYPE_OPTIONS } from '@/types'
import type { Expression, ExpressionInsert, ExpressionType } from '@/types'

interface ExpressionListProps {
  searchQuery?: string
}

export default function ExpressionList({ searchQuery = '' }: ExpressionListProps) {
  const { data: expressions, loading, refetch } = useSupabaseQuery<Expression>('expressions')
  const [filterType, setFilterType] = useState<string>('')
  const [editing, setEditing] = useState<Expression | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    expr_type: 'vocabulary' as ExpressionType,
    term: '',
    meaning: '',
    notes: '',
  })

  const filtered = expressions.filter(e => {
    if (filterType && e.expr_type !== filterType) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return e.term.toLowerCase().includes(q) || e.meaning.toLowerCase().includes(q)
    }
    return true
  })

  // 按类型分组
  const grouped: Record<string, Expression[]> = {}
  filtered.forEach(e => {
    const key = e.expr_type
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(e)
  })

  const resetForm = () => {
    setForm({ expr_type: 'vocabulary', term: '', meaning: '', notes: '' })
    setEditing(null)
    setShowEditor(false)
  }

  const handleSave = async () => {
    if (!form.term.trim()) return
    setSaving(true)
    try {
      const supabase = db()
      if (editing) {
        await supabase.from('expressions').update({
          expr_type: form.expr_type,
          term: form.term.trim(),
          meaning: form.meaning.trim(),
          notes: form.notes.trim(),
          updated_at: new Date().toISOString(),
        }).eq('id', editing.id)
      } else {
        const insert: ExpressionInsert = {
          expr_type: form.expr_type,
          term: form.term.trim(),
          meaning: form.meaning.trim(),
          notes: form.notes.trim(),
        }
        await supabase.from('expressions').insert(insert)
      }
      resetForm()
      refetch()
    } catch (err) {
      console.error('保存失败:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (e: Expression) => {
    setEditing(e)
    setForm({
      expr_type: e.expr_type,
      term: e.term,
      meaning: e.meaning,
      notes: e.notes,
    })
    setShowEditor(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这条表达吗？')) return
    try {
      const supabase = db()
      await supabase.from('expressions').delete().eq('id', id)
      refetch()
    } catch (err) {
      console.error('删除失败:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">表达库</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowEditor(true) }}>
          <Plus size={16} /> 添加表达
        </button>
      </div>

      {/* 类型筛选 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-slate-400" />
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!filterType ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          onClick={() => setFilterType('')}
        >
          全部
        </button>
        {EXPRESSION_TYPE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === opt.value ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            onClick={() => setFilterType(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 编辑器 */}
      {showEditor && (
        <div className="card border-brand-200 bg-brand-50/30">
          <h3 className="font-medium text-slate-800 mb-4">
            {editing ? '编辑表达' : '添加新表达'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="form-label">类型</label>
              <select className="form-select" value={form.expr_type} onChange={e => setForm({ ...form, expr_type: e.target.value as ExpressionType })}>
                {EXPRESSION_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">表达</label>
              <input className="form-input" value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} placeholder="如: a piece of cake..." />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">释义</label>
            <input className="form-input" value={form.meaning} onChange={e => setForm({ ...form, meaning: e.target.value })} placeholder="中文释义或英文解释..." />
          </div>
          <div className="mb-4">
            <label className="form-label">备注</label>
            <input className="form-input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="使用场景、搭配等..." />
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
          {expressions.length === 0 ? '还没有表达，点击「添加表达」开始积累' : '没有匹配的表达'}
        </div>
      ) : filterType ? (
        // 不分组显示
        <div className="space-y-2">
          {filtered.map(e => (
            <ExpressionCard key={e.id} expr={e} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        // 按类型分组显示
        <div className="space-y-6">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <h3 className="text-sm font-medium text-slate-500 mb-2">
                {EXPRESSION_TYPE_LABELS[type as ExpressionType] || type}
                <span className="text-slate-400 ml-1">({items.length})</span>
              </h3>
              <div className="space-y-2">
                {items.map(e => (
                  <ExpressionCard key={e.id} expr={e} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ExpressionCard({
  expr,
  onEdit,
  onDelete,
}: {
  expr: Expression
  onEdit: (e: Expression) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="card flex items-start gap-3 group">
      <div className="flex-1 min-w-0">
        <span className="block font-semibold text-slate-800">{expr.term}</span>
        {expr.meaning && (
          <p className="text-sm text-slate-500 mt-1.5">{expr.meaning}</p>
        )}
        {expr.notes && (
          <p className="text-xs text-slate-400 mt-0.5">{expr.notes}</p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(expr)}>
          <Edit3 size={14} />
        </button>
        <button className="btn btn-ghost btn-sm text-red-500" onClick={() => onDelete(expr.id)}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
