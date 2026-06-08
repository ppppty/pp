import { useState } from 'react'
import { X, Check, ExternalLink } from 'lucide-react'
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
  const [saved, setSaved] = useState(false)

  if (!open) return null

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      const supabase = db()
      const note: QuickNoteInsert = { content: content.trim(), category: '待整理' }
      await supabase.from('quick_notes').insert(note)
      setContent('')
      setSaved(true)
      onSaved()
    } catch (err) {
      console.error('保存快捷笔记失败:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (content.trim()) {
      if (!confirm('内容尚未保存，确定关闭吗？')) return
    }
    setSaved(false)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/20" onClick={handleClose}>
        <div
          className="bg-white rounded-xl shadow-xl border border-slate-100 w-full max-w-sm p-6 text-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Check size={24} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">已保存</h3>
          <p className="text-sm text-slate-500 mb-4">
            笔记已存入「快捷笔记」页面，课后可以统一整理到对应板块
          </p>
          <div className="flex items-center gap-2 justify-center">
            <a
              href="#/quick-notes"
              className="btn btn-primary btn-sm"
              onClick={() => { setSaved(false); onClose() }}
            >
              <ExternalLink size={14} />
              查看所有笔记
            </a>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSaved(false); onClose() }}>
              关闭
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/20" onClick={handleClose}>
      <div
        className="bg-white rounded-xl shadow-xl border border-slate-100 w-full max-w-lg p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">快捷笔记</h3>
          <button className="btn btn-ghost btn-sm" onClick={handleClose} aria-label="关闭">
            <X size={16} />
          </button>
        </div>

        <textarea
          className="form-textarea mb-3"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="快速记录想法、表达、错词...课后统一整理"
          autoFocus
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Enter 保存，Shift+Enter 换行
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
