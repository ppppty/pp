import { useState } from 'react'
import { Plus, Edit3, Trash2, Volume2, Loader2 } from 'lucide-react'
import { db } from '@/lib/supabase'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { useSpeech } from '@/hooks/useSpeech'
import { lookupPhonetic } from '@/lib/phonetic'
import type { Accent } from '@/lib/tts'
import type { Pronunciation } from '@/types'

interface WordListProps {
  searchQuery?: string
}

export default function WordList({ searchQuery = '' }: WordListProps) {
  const { data: words, loading, refetch } = useSupabaseQuery<Pronunciation>('pronunciation')
  const { play, isPlaying } = useSpeech()
  const [showEditor, setShowEditor] = useState(false)
  const [editing, setEditing] = useState<Pronunciation | null>(null)
  const [saving, setSaving] = useState(false)
  const [lookingUp, setLookingUp] = useState(false)

  const [form, setForm] = useState({
    word: '',
    phoneticUk: '',
    phoneticUs: '',
  })

  const filtered = words.filter(w => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return w.word.toLowerCase().includes(q) || w.phonetic.toLowerCase().includes(q)
  })

  const resetForm = () => {
    setForm({ word: '', phoneticUk: '', phoneticUs: '' })
    setEditing(null)
    setShowEditor(false)
  }

  const handleLookup = async () => {
    if (!form.word.trim()) return
    setLookingUp(true)
    try {
      const result = await lookupPhonetic(form.word.trim())
      setForm(prev => ({ ...prev, phoneticUk: result.uk, phoneticUs: result.us }))
    } catch (err) {
      console.error('查询音标失败:', err)
    } finally {
      setLookingUp(false)
    }
  }

  const handleSave = async () => {
    if (!form.word.trim()) return
    setSaving(true)
    try {
      const supabase = db()
      // 组合存储音标: UK /xxx/ | US /xxx/
      const combined = [form.phoneticUk && `UK ${form.phoneticUk}`, form.phoneticUs && `US ${form.phoneticUs}`].filter(Boolean).join('  |  ')

      if (editing) {
        await supabase.from('pronunciation').update({
          word: form.word.trim(),
          phonetic: combined,
          notes: '',
        }).eq('id', editing.id)
      } else {
        await supabase.from('pronunciation').insert({
          word: form.word.trim(),
          phonetic: combined,
          notes: '',
        })
      }
      resetForm()
      refetch()
    } catch (err) {
      console.error('保存失败:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (w: Pronunciation) => {
    setEditing(w)
    // 从存储的 combined 格式解析回 UK/US
    const ukMatch = w.phonetic.match(/UK\s+(\S+)/)
    const usMatch = w.phonetic.match(/US\s+(\S+)/)
    setForm({
      word: w.word,
      phoneticUk: ukMatch ? ukMatch[1] : '',
      phoneticUs: usMatch ? usMatch[1] : w.phonetic || '',
    })
    setShowEditor(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这个单词吗？')) return
    try {
      const supabase = db()
      await supabase.from('pronunciation').delete().eq('id', id)
      refetch()
    } catch (err) {
      console.error('删除失败:', err)
    }
  }

  const playButton = (word: string, accent: Accent) => (
    <button
      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        isPlaying(word, accent)
          ? 'bg-brand-500 text-white'
          : 'bg-slate-50 text-slate-600 hover:bg-brand-100 hover:text-brand-600'
      }`}
      onClick={() => play(word, accent)}
      title={accent === 'uk' ? '英音' : '美音'}
      aria-label={`朗读 ${word} ${accent === 'uk' ? '英音' : '美音'}`}
    >
      {isPlaying(word, accent) ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Volume2 size={14} />
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">发音本</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowEditor(true) }}>
          <Plus size={16} /> 添加单词
        </button>
      </div>

      {/* 编辑器 */}
      {showEditor && (
        <div className="card border-brand-200 bg-brand-50/30">
          <h3 className="font-medium text-slate-900 mb-4">
            {editing ? '编辑单词' : '添加单词'}
          </h3>
          <div className="mb-3">
            <label className="form-label">单词</label>
            <div className="flex items-center gap-2">
              <input
                className="form-input flex-1"
                value={form.word}
                onChange={e => setForm({ ...form, word: e.target.value })}
                placeholder="输入单词..."
              />
              <button
                className="btn btn-secondary btn-sm shrink-0"
                onClick={handleLookup}
                disabled={lookingUp || !form.word.trim()}
              >
                {lookingUp ? <Loader2 size={14} className="animate-spin" /> : '查音标'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="form-label">英音</label>
              <input
                className="form-input font-mono text-sm"
                value={form.phoneticUk}
                onChange={e => setForm({ ...form, phoneticUk: e.target.value })}
                placeholder="UK 音标"
              />
            </div>
            <div>
              <label className="form-label">美音</label>
              <input
                className="form-input font-mono text-sm"
                value={form.phoneticUs}
                onChange={e => setForm({ ...form, phoneticUs: e.target.value })}
                placeholder="US 音标"
              />
            </div>
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
          {words.length === 0 ? '还没有单词，点击「添加单词」开始' : '没有匹配的单词'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(w => {
            const ukMatch = w.phonetic.match(/UK\s+(\S+)/)
            const usMatch = w.phonetic.match(/US\s+(\S+)/)
            const phoneticUk = ukMatch ? ukMatch[1] : ''
            const phoneticUs = usMatch ? usMatch[1] : w.phonetic || ''

            return (
              <div key={w.id} className="card flex items-center gap-3 group">
                <span className="font-semibold text-[1.1875rem] text-slate-800 min-w-[100px]">{w.word}</span>

                <div className="flex-1 flex items-center gap-4 min-w-0">
                  {phoneticUk && (
                    <span className="text-[0.9375rem] text-slate-600 font-mono shrink-0">
                      UK {phoneticUk}
                    </span>
                  )}
                  {phoneticUs && (
                    <span className="text-[0.9375rem] text-slate-600 font-mono shrink-0">
                      US {phoneticUs}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {playButton(w.word, 'uk')}
                  {playButton(w.word, 'us')}
                  <button className="btn btn-ghost btn-sm sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={() => handleEdit(w)} aria-label={`编辑 ${w.word}`}>
                    <Edit3 size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm text-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(w.id)} aria-label={`删除 ${w.word}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
