import { useState, useMemo, useRef, useCallback } from 'react'
import { Plus, Edit3, Trash2, ChevronDown, ChevronUp, Brain, FolderOpen, X, MessageSquare, Bookmark, Check, Highlighter } from 'lucide-react'
import { db } from '@/lib/supabase'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { PART_OPTIONS } from '@/types'
import type { SpeakingQA, SpeakingQAInsert, SpeakingAnnotation } from '@/types'
import AIGeneratePanel from './AIGeneratePanel'

interface SpeakingListProps {
  searchQuery?: string
}

interface QuestionGroup {
  topic: string
  questions: SpeakingQA[]
}

interface QAItem {
  key: string
  question: string
  answer: string
}

interface SelectionState {
  text: string
  x: number
  y: number
  questionId: string
  source: 'answer' | 'ai_answer'
}

let idCounter = 0
function nextKey() { return `qa_${++idCounter}` }

export default function SpeakingList({ searchQuery = '' }: SpeakingListProps) {
  const { data: questions, loading, refetch } = useSupabaseQuery<SpeakingQA>('speaking_qa')
  const [filterPart, setFilterPart] = useState<number | null>(null)
  const [filterTopic, setFilterTopic] = useState<string>('')
  const [editing, setEditing] = useState<SpeakingQA | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [aiPanelId, setAiPanelId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [selection, setSelection] = useState<SelectionState | null>(null)
  const [commentInput, setCommentInput] = useState('')
  const [commentingId, setCommentingId] = useState<string | null>(null)
  const [exprAdded, setExprAdded] = useState<string | null>(null)
  // 本地注解状态，避免 refetch 导致页面刷新
  const [annotationsByQ, setAnnotationsByQ] = useState<Record<string, SpeakingAnnotation[]>>({})

  const [form, setForm] = useState({
    part: 1 as 1 | 2 | 3,
    topic_tag: '',
    items: [{ key: nextKey(), question: '', answer: '' }] as QAItem[],
  })

  const isGroupMode = form.part === 1 || form.part === 3

  const existingTopics = useMemo(() => {
    const tags = [...new Set(questions
      .filter(q => !filterPart || q.part === filterPart)
      .map(q => q.topic_tag)
      .filter(Boolean))]
    return tags.sort()
  }, [questions, filterPart])

  const filtered = questions.filter(q => {
    if (filterPart && q.part !== filterPart) return false
    if (filterTopic && q.topic_tag !== filterTopic) return false
    if (searchQuery) {
      const qq = searchQuery.toLowerCase()
      return (
        q.question.toLowerCase().includes(qq) ||
        q.answer.toLowerCase().includes(qq) ||
        q.topic_tag.toLowerCase().includes(qq)
      )
    }
    return true
  })

  const grouped = useMemo(() => {
    const shouldGroup = filterPart === 1 || filterPart === 3
    if (!shouldGroup) return null

    const groups: Record<string, SpeakingQA[]> = {}
    const ungrouped: SpeakingQA[] = []

    filtered.forEach(q => {
      if (q.topic_tag) {
        if (!groups[q.topic_tag]) groups[q.topic_tag] = []
        groups[q.topic_tag].push(q)
      } else {
        ungrouped.push(q)
      }
    })

    const groupsArr: QuestionGroup[] = Object.entries(groups).map(([topic, qs]) => ({
      topic,
      questions: qs,
    }))

    return { groups: groupsArr, ungrouped }
  }, [filtered, filterPart])

  const shouldGroup = filterPart === 1 || filterPart === 3

  const resetForm = () => {
    setForm({
      part: (filterPart ?? 1) as 1 | 2 | 3,
      topic_tag: '',
      items: [{ key: nextKey(), question: '', answer: '' }],
    })
    setEditing(null)
    setShowEditor(false)
  }

  const handleSave = async () => {
    const validItems = form.items.filter(i => i.question.trim())
    if (validItems.length === 0) return
    setSaving(true)
    try {
      const supabase = db()
      if (editing) {
        await supabase.from('speaking_qa').update({
          part: form.part,
          question: form.items[0].question.trim(),
          answer: form.items[0].answer.trim(),
          topic_tag: form.topic_tag.trim(),
          updated_at: new Date().toISOString(),
        }).eq('id', editing.id)
      } else {
        const inserts = validItems.map(i => ({
          part: form.part,
          question: i.question.trim(),
          answer: i.answer.trim(),
          topic_tag: form.topic_tag.trim(),
        }))
        await supabase.from('speaking_qa').insert(inserts)
      }
      resetForm()
      refetch()
    } catch (err) {
      console.error('保存失败:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这道题目吗？')) return
    try {
      const supabase = db()
      await supabase.from('speaking_qa').delete().eq('id', id)
      if (expandedId === id) setExpandedId(null)
      if (aiPanelId === id) setAiPanelId(null)
      refetch()
    } catch (err) {
      console.error('删除失败:', err)
    }
  }

  const handleEdit = (q: SpeakingQA) => {
    setEditing(q)
    setForm({
      part: q.part,
      topic_tag: q.topic_tag,
      items: [{ key: nextKey(), question: q.question, answer: q.answer }],
    })
    setShowEditor(true)
  }

  const startNewGroup = (part?: number, topic?: string) => {
    setForm({
      part: (part ?? filterPart ?? 1) as 1 | 2 | 3,
      topic_tag: topic || '',
      items: [{ key: nextKey(), question: '', answer: '' }],
    })
    setEditing(null)
    setShowEditor(true)
  }

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { key: nextKey(), question: '', answer: '' }] })
  }

  const removeItem = (key: string) => {
    if (form.items.length <= 1) return
    setForm({ ...form, items: form.items.filter(i => i.key !== key) })
  }

  const updateItem = (key: string, field: 'question' | 'answer', value: string) => {
    setForm({
      ...form,
      items: form.items.map(i => i.key === key ? { ...i, [field]: value } : i),
    })
  }

  // === 划线注释功能 ===

  const handleTextSelect = (e: React.MouseEvent, questionId: string, source: 'answer' | 'ai_answer') => {
    // 用 requestAnimationFrame + setTimeout 确保浏览器完成选区渲染
    requestAnimationFrame(() => {
      setTimeout(() => {
        const sel = window.getSelection()
        if (!sel || !sel.toString().trim()) {
          if (!(e.target as HTMLElement).closest('.annotation-toolbar')) {
            setSelection(null)
            setCommentInput('')
          }
          return
        }

        const text = sel.toString().trim()
        if (!text) return

        const range = sel.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        setSelection({
          text,
          x: rect.left + rect.width / 2,
          y: rect.top - 8,
          questionId,
          source,
        })
        setCommentInput('')
        setCommentingId(null)
      }, 50)
    })
  }

  const handleAddAnnotation = async () => {
    if (!selection) return
    const q = questions.find(qq => qq.id === selection.questionId)
    if (!q) return

    const annotation: SpeakingAnnotation = {
      id: crypto.randomUUID(),
      selected_text: selection.text,
      comment: commentInput,
      created_at: new Date().toISOString(),
    }

    const existing = annotationsByQ[q.id] || q.annotations || []
    const updated = [...existing, annotation]
    // 立即更新本地状态（页面不刷新）
    setAnnotationsByQ(prev => ({ ...prev, [q.id]: updated }))
    setSelection(null)
    setCommentInput('')
    setCommentingId(null)

    // 后台异步保存到数据库
    db().from('speaking_qa').update({
      annotations: updated,
      updated_at: new Date().toISOString(),
    }).eq('id', q.id).then(() => {
      // 静默同步，不触发 refresh
    }).catch((err: Error) => {
      console.error('保存注释失败:', err)
    })
  }

  const handleAddToExpressions = async () => {
    if (!selection) return
    try {
      await db().from('expressions').insert({
        expr_type: 'vocabulary',
        term: selection.text,
        meaning: '',
        notes: '',
      })
      setExprAdded(selection.text)
      setTimeout(() => setExprAdded(null), 2000)
      setSelection(null)
    } catch (err) {
      console.error('添加到表达库失败:', err)
    }
  }

  // 合并本地注解和数据库注解
  const getAnnotations = (q: SpeakingQA) => {
    return annotationsByQ[q.id] || q.annotations || []
  }

  const handleDeleteAnnotation = async (questionId: string, annotId: string) => {
    const q = questions.find(qq => qq.id === questionId)
    if (!q) return
    const annotations = getAnnotations(q).filter(a => a.id !== annotId)
    // 立即更新本地
    setAnnotationsByQ(prev => ({ ...prev, [questionId]: annotations }))
    // 后台保存
    db().from('speaking_qa').update({
      annotations,
      updated_at: new Date().toISOString(),
    }).eq('id', questionId).catch((err: Error) => {
      console.error('删除注释失败:', err)
    })
  }

  /** 渲染带标注高亮的文本 */
  const renderHighlighted = (text: string, annotations: SpeakingAnnotation[]) => {
    if (!annotations.length) return <>{text}</>

    // 按文本位置排序，构建带标注的片段
    const sorted = [...annotations].sort((a, b) => {
      const ia = text.indexOf(a.selected_text)
      const ib = text.indexOf(b.selected_text)
      return ia - ib
    })

    const parts: Array<{ type: 'text' | 'mark'; content: string; annot?: SpeakingAnnotation }> = []
    let lastIdx = 0

    sorted.forEach(a => {
      const idx = text.indexOf(a.selected_text, lastIdx)
      if (idx === -1) return

      if (idx > lastIdx) {
        parts.push({ type: 'text', content: text.slice(lastIdx, idx) })
      }
      parts.push({ type: 'mark', content: a.selected_text, annot: a })
      lastIdx = idx + a.selected_text.length
    })

    if (lastIdx < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIdx) })
    }

    return (
      <>
        {parts.map((p, i) =>
          p.type === 'mark' && p.annot ? (
            <mark
              key={i}
              className="bg-amber-200/60 text-slate-800 rounded-sm cursor-help relative group/mark"
              title={p.annot.comment || '已标注'}
            >
              {p.content}
              {p.annot.comment && (
                <span className="absolute -top-7 left-0 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/mark:opacity-100 transition-opacity z-10">
                  {p.annot.comment}
                </span>
              )}
            </mark>
          ) : (
            <span key={i}>{p.content}</span>
          )
        )}
      </>
    )
  }

  const AnnotationToolbar = () => {
    if (!selection) return null

    return (
      <div
        className="annotation-toolbar fixed z-50 bg-white border border-slate-200 rounded-lg shadow-lg px-2 py-1.5 flex items-center gap-1"
        style={{
          left: `${Math.max(selection.x - 80, 10)}px`,
          top: `${Math.max(selection.y - 44, 10)}px`,
        }}
      >
        {commentingId === selection.questionId ? (
          <div className="flex items-center gap-1">
            <input
              className="form-input text-xs py-1 px-2 w-36"
              placeholder="输入评论..."
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddAnnotation() }}
              autoFocus
            />
            <button className="btn btn-primary btn-xs" onClick={handleAddAnnotation}>
              <Check size={12} />
            </button>
          </div>
        ) : (
          <>
            <button
              className="text-xs px-2 py-1 rounded hover:bg-amber-100 flex items-center gap-1 text-amber-600"
              onClick={handleAddAnnotation}
            >
              <Highlighter size={12} /> 划线
            </button>
            <span className="w-px h-4 bg-slate-200" />
            <button
              className="text-xs px-2 py-1 rounded hover:bg-slate-100 flex items-center gap-1 text-slate-600"
              onClick={() => setCommentingId(selection.questionId)}
            >
              <MessageSquare size={12} /> 评论
            </button>
            <span className="w-px h-4 bg-slate-200" />
            <button
              className="text-xs px-2 py-1 rounded hover:bg-brand-50 flex items-center gap-1 text-brand-600"
              onClick={handleAddToExpressions}
            >
              <Bookmark size={12} /> 加入表达库
            </button>
          </>
        )}
      </div>
    )
  }

  const QuestionCard = ({ q }: { q: SpeakingQA }) => (
    <div className="card">
      {/* 主行：选词时不触发折叠 */}
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => {
          // 如果有文字被选中，不触发折叠
          const sel = window.getSelection()
          if (sel && sel.toString().trim()) return
          setExpandedId(expandedId === q.id ? null : q.id)
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {!shouldGroup && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                q.part === 1 ? 'bg-blue-100 text-blue-700' :
                q.part === 2 ? 'bg-purple-100 text-purple-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                Part {q.part}
              </span>
            )}
            {q.topic_tag && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {q.topic_tag}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-800 line-clamp-2">
            {q.question}
          </p>
          {(!expandedId || expandedId !== q.id) && (
            <p className="text-xs text-slate-400 mt-1 truncate">
              {q.answer ? q.answer.slice(0, 80) + (q.answer.length > 80 ? '...' : '') : '暂无答案'}
            </p>
          )}
        </div>
        <div className="shrink-0 text-slate-400 mt-0.5">
          {expandedId === q.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expandedId === q.id && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {/* 你的答案 */}
          {q.answer && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">你的答案</p>
              <div
                className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed select-text"
                onMouseUp={(e) => handleTextSelect(e, q.id, 'answer')}
              >
                {renderHighlighted(q.answer, getAnnotations(q))}
              </div>
            </div>
          )}

          {/* AI 答案 */}
          {q.ai_answer && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">AI 参考答案</p>
              <div
                className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed select-text"
                onMouseUp={(e) => handleTextSelect(e, q.id, 'ai_answer')}
              >
                {renderHighlighted(q.ai_answer, getAnnotations(q))}
              </div>
            </div>
          )}

          {/* 已有标注列表 */}
          {getAnnotations(q).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">标注</p>
              {getAnnotations(q).map(a => (
                <div key={a.id} className="flex items-center gap-2 text-xs bg-amber-50 rounded px-2 py-1">
                  <span className="font-medium text-amber-700">"{a.selected_text}"</span>
                  {a.comment && (
                    <span className="text-slate-500">— {a.comment}</span>
                  )}
                  <button
                    className="ml-auto text-slate-300 hover:text-red-400"
                    onClick={() => handleDeleteAnnotation(q.id, a.id)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(q)}>
              <Edit3 size={14} /> 编辑
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={(e) => { e.stopPropagation(); setAiPanelId(aiPanelId === q.id ? null : q.id) }}
            >
              <Brain size={14} />
              {q.ai_answer ? '重新生成 AI 答案' : 'AI 生成答案'}
            </button>
            <button className="btn btn-ghost btn-sm text-red-500" onClick={() => handleDelete(q.id)}>
              <Trash2 size={14} /> 删除
            </button>
          </div>

          {aiPanelId === q.id && (
            <AIGeneratePanel
              questionId={q.id}
              question={q.question}
              part={q.part}
              onAnswerGenerated={() => refetch()}
            />
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <AnnotationToolbar />

      {/* 加入表达库成功提示 */}
      {exprAdded && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          <Check size={14} className="inline mr-1" />
          "{exprAdded}" 已加入表达库
        </div>
      )}

      {/* Part 切换 Tab */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {[{ value: null as number | null, label: '全部' }, ...PART_OPTIONS].map(opt => (
              <button
                key={opt.value ?? 0}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterPart === opt.value
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => { setFilterPart(opt.value); setFilterTopic('') }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {(filterPart === 1 || filterPart === 3) && existingTopics.length > 0 && (
            <select
              className="form-select w-auto text-sm"
              value={filterTopic}
              onChange={e => setFilterTopic(e.target.value)}
            >
              <option value="">全部 Topic</option>
              {existingTopics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
          {searchQuery && (
            <span className="text-xs text-slate-400">
              搜索: "{searchQuery}" ({filtered.length} 条结果)
            </span>
          )}
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => startNewGroup()}>
          <Plus size={16} />
          添加题目
        </button>
      </div>

      {/* 编辑器 */}
      {showEditor && (
        <div className="card border-brand-200 bg-brand-50/30">
          <h3 className="font-medium text-slate-800 mb-4">
            {editing ? '编辑题目' : (isGroupMode ? '添加题组' : '添加新题目')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="form-label">Part</label>
              <select
                className="form-select"
                value={form.part}
                onChange={e => {
                  const p = Number(e.target.value) as 1 | 2 | 3
                  setForm({ ...form, part: p })
                }}
              >
                {PART_OPTIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">
                {isGroupMode ? '题组名称' : 'Topic 标签'}
              </label>
              <div>
                <input
                  className="form-input"
                  value={form.topic_tag}
                  onChange={e => setForm({ ...form, topic_tag: e.target.value })}
                  placeholder={isGroupMode ? '如: Hometown, Weather, Study...' : '如: Environment...'}
                  list="topic-suggestions"
                />
                {existingTopics.length > 0 && (
                  <datalist id="topic-suggestions">
                    {existingTopics.map(t => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                )}
              </div>
              {isGroupMode && existingTopics.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mt-2">
                  {existingTopics.map(tag => (
                    <button
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 hover:bg-brand-100 hover:text-brand-600 transition-colors"
                      onClick={() => setForm({ ...form, topic_tag: tag })}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isGroupMode && !editing ? (
            <div className="space-y-3 mb-4">
              {form.items.map((item, idx) => (
                <div key={item.key} className="bg-white rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-400">第 {idx + 1} 题</span>
                    {form.items.length > 1 && (
                      <button
                        className="text-slate-300 hover:text-red-400 transition-colors"
                        onClick={() => removeItem(item.key)}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <textarea
                    className="form-textarea mb-2"
                    rows={1}
                    value={item.question}
                    onChange={e => updateItem(item.key, 'question', e.target.value)}
                    placeholder={`题目 ${idx + 1}...`}
                  />
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={item.answer}
                    onChange={e => updateItem(item.key, 'answer', e.target.value)}
                    placeholder={`答案（选填）...`}
                  />
                </div>
              ))}
              <button
                className="btn btn-ghost btn-sm w-full justify-center text-slate-400 hover:text-brand-600"
                onClick={addItem}
              >
                <Plus size={14} /> 添加一题
              </button>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              <div>
                <label className="form-label">题目</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={form.items[0]?.question || ''}
                  onChange={e => updateItem(form.items[0].key, 'question', e.target.value)}
                  placeholder="输入口语题目..."
                />
              </div>
              <div>
                <label className="form-label">你的答案</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={form.items[0]?.answer || ''}
                  onChange={e => updateItem(form.items[0].key, 'answer', e.target.value)}
                  placeholder="输入你的答案或思路要点..."
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : editing ? '更新' : `保存${isGroupMode ? ` (${form.items.filter(i => i.question.trim()).length} 题)` : ''}`}
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
          {questions.length === 0 ? '还没有题目，点击「添加题目」开始' : '没有匹配的题目'}
        </div>
      ) : shouldGroup && grouped ? (
        <div className="space-y-6">
          {grouped.groups.map(g => (
            <div key={g.topic}>
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen size={16} className="text-brand-500" />
                <span className="text-sm font-semibold text-slate-700">{g.topic}</span>
                <span className="text-xs text-slate-400">({g.questions.length} 题)</span>
                <button
                  className="btn btn-ghost btn-xs text-xs"
                  onClick={() => startNewGroup(filterPart!, g.topic)}
                >
                  <Plus size={12} /> 添加
                </button>
              </div>
              <div className="space-y-2">
                {g.questions.map(q => <QuestionCard key={q.id} q={q} />)}
              </div>
            </div>
          ))}
          {grouped.ungrouped.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen size={16} className="text-slate-300" />
                <span className="text-sm font-semibold text-slate-400">未分组</span>
              </div>
              <div className="space-y-2">
                {grouped.ungrouped.map(q => <QuestionCard key={q.id} q={q} />)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => <QuestionCard key={q.id} q={q} />)}
        </div>
      )}
    </div>
  )
}
