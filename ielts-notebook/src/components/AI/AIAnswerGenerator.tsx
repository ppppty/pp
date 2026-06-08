import { useState } from 'react'
import { Brain, Sparkles, Copy, AlertCircle, MessageSquare, Save } from 'lucide-react'
import { callDeepSeek, buildAnswerPrompt, cleanAiResponse } from '@/lib/deepseek'
import { db } from '@/lib/supabase'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { PART_OPTIONS } from '@/types'
import type { SpeakingQA } from '@/types'

export default function AIAnswerGenerator() {
  const { data: questions, refetch } = useSupabaseQuery<SpeakingQA>('speaking_qa')

  const [part, setPart] = useState<1 | 2 | 3>(1)
  const [question, setQuestion] = useState('')
  const [bandScore, setBandScore] = useState(7)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [savingToSpeaking, setSavingToSpeaking] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const partQuestions = questions.filter(q => q.part === part)

  const handleGenerate = async () => {
    if (!question.trim()) return
    setGenerating(true)
    setError('')
    setResult('')
    setSavedMsg('')

    try {
      const prompt = buildAnswerPrompt(question.trim(), part, bandScore)
      const answer = await callDeepSeek(prompt)
      setResult(cleanAiResponse(answer))
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveToSpeaking = async () => {
    if (!result || !question.trim()) return
    setSavingToSpeaking(true)
    setSavedMsg('')
    try {
      await db().from('speaking_qa').insert({
        part,
        question: question.trim(),
        answer: '',
        ai_answer: result,
        topic_tag: '',
      })
      setSavedMsg('已保存到串题板块')
      refetch()
    } catch (err) {
      console.error('保存失败:', err)
      setSavedMsg('保存失败')
    } finally {
      setSavingToSpeaking(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Brain size={24} className="text-brand-600" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">AI 生成参考答案</h2>
          <p className="text-sm text-slate-600">选择 Part 类型和题目，AI 为你生成高分口语答案</p>
        </div>
      </div>

      <div className="card space-y-4">
        {/* Part 选择 */}
        <div>
          <label className="form-label">Part 类型</label>
          <div className="flex gap-2">
            {PART_OPTIONS.map(p => (
              <button
                key={p.value}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  part === p.value ? 'bg-brand-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => setPart(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 从题库快速选择 */}
        {partQuestions.length > 0 && (
          <div>
            <label className="form-label">
              <MessageSquare size={14} className="inline mr-1" />
              从题库选择题目
            </label>
            <select
              className="form-select"
              value={question}
              onChange={e => { if (e.target.value) setQuestion(e.target.value) }}
            >
              <option value="">-- 选择已有题目 --</option>
              {partQuestions.map(q => (
                <option key={q.id} value={q.question}>{q.question}</option>
              ))}
            </select>
          </div>
        )}

        {/* 手动输入题目 */}
        <div>
          <label className="form-label">或手动输入题目</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="输入你需要 AI 回答的口语题目..."
          />
        </div>

        {/* 目标分数 */}
        <div>
          <label className="form-label">目标分数</label>
          <div className="flex gap-2">
            {[7, 7.5, 8].map(score => (
              <button
                key={score}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  bandScore === score ? 'bg-brand-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => setBandScore(score)}
              >
                Band {score}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary w-full justify-center py-2.5"
          onClick={handleGenerate}
          disabled={generating || !question.trim()}
        >
          {generating ? (
            <><Sparkles size={16} className="animate-pulse" /> AI 生成中...</>
          ) : (
            <><Sparkles size={16} /> 生成 Band {bandScore} 答案</>
          )}
        </button>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">生成结果</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(result)}>
                <Copy size={14} /> 复制
              </button>
            </div>
            <div className="prose prose-sm max-w-none bg-slate-50 rounded-lg p-5 whitespace-pre-wrap text-[1rem] leading-relaxed text-slate-600">
              {result}
            </div>

            {/* 保存到串题 */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <p className="text-sm font-medium text-slate-600">保存到串题板块</p>
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  className="form-select w-auto text-sm"
                  value={part}
                  onChange={e => setPart(Number(e.target.value) as 1 | 2 | 3)}
                >
                  {PART_OPTIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <input
                  className="form-input flex-1 min-w-[200px] text-sm"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="可修改题目文本..."
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveToSpeaking}
                  disabled={savingToSpeaking}
                >
                  <Save size={14} />
                  {savingToSpeaking ? '保存中...' : '保存到串题'}
                </button>
              </div>
              {savedMsg && (
                <p className={`text-xs ${savedMsg.includes('失败') ? 'text-red-500' : 'text-green-600'}`}>
                  {savedMsg}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
