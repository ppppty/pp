import { useState } from 'react'
import { X } from 'lucide-react'
import { db } from '@/lib/supabase'
import type { QuickNoteInsert } from '@/types'

interface QuickNoteProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export default function QuickNote({ open, onClose, onSaved }: QuickNoteProps) {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      const supabase = db()
      const note: QuickNoteInsert = { content: content.trim(), category: '待整理' }
      await supabase.from('quick_notes').insert(note)
      setContent('')
      onSaved()
      onClose()
    } catch (err) {
      console.error('保存快捷笔记失败:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/20" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">快捷笔记</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <textarea
          className="form-textarea mb-3"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="快速记录想法、表达、错词...课后统一整理"
          autoFocus
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            回车保存，内容存入「待整理」分类
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving || !content.trim()}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
