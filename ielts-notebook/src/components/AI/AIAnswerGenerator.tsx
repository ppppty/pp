import { useState } from 'react'
import { Brain, Sparkles, Copy, AlertCircle, MessageSquare } from 'lucide-react'
import { callDeepSeek, buildAnswerPrompt } from '@/lib/deepseek'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { PART_OPTIONS } from '@/types'
import type { SpeakingQA } from '@/types'

export default function AIAnswerGenerator() {
  const { data: questions } = useSupabaseQuery<SpeakingQA>('speaking_qa')

  const [part, setPart] = useState<1 | 2 | 3>(1)
  const [question, setQuestion] = useState('')
  const [bandScore, setBandScore] = useState(7)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  // 筛选当前 Part 的题目供快速选择
  const partQuestions = questions.filter(q => q.part === part)

  const handleGenerate = async () => {
    if (!question.trim()) return
    setGenerating(true)
    setError('')
    setResult('')

    try {
      const prompt = buildAnswerPrompt(question.trim(), part, bandScore)
      const answer = await callDeepSeek(prompt)
      setResult(answer)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Brain size={24} className="text-brand-600" />
        <div>
          <h2 className="text-lg font-semibold text-slate-800">AI 生成参考答案</h2>
          <p className="text-sm text-slate-500">选择 Part 类型和题目，AI 为你生成高分口语答案</p>
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
                  part === p.value ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              value=""
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
                  bandScore === score ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            <div className="prose prose-sm max-w-none bg-slate-50 rounded-lg p-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
