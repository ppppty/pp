import { useState } from 'react'
import { Brain, Copy, Sparkles, AlertCircle } from 'lucide-react'
import { callDeepSeek, buildAnswerPrompt } from '@/lib/deepseek'
import { db } from '@/lib/supabase'

interface AIGeneratePanelProps {
  questionId?: string
  question: string
  part: 1 | 2 | 3
  onAnswerGenerated?: (answer: string) => void
  onClose?: () => void
}

export default function AIGeneratePanel({ questionId, question, part, onAnswerGenerated, onClose }: AIGeneratePanelProps) {
  const [bandScore, setBandScore] = useState(7)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!question.trim()) return
    setGenerating(true)
    setError('')
    setResult('')

    try {
      const prompt = buildAnswerPrompt(question, part, bandScore)
      const answer = await callDeepSeek(prompt)
      setResult(answer)

      // 如果有关联的题目 ID，保存 AI 答案
      if (questionId) {
        const supabase = db()
        await supabase.from('speaking_qa').update({ ai_answer: answer }).eq('id', questionId)
        onAnswerGenerated?.(answer)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-brand-50 border-b border-brand-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-brand-600" />
          <span className="font-medium text-brand-700">AI 生成参考答案</span>
        </div>
        {onClose && (
          <button className="btn btn-ghost btn-sm text-brand-600" onClick={onClose}>关闭</button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* 题目预览 */}
        <div className="bg-slate-50 rounded-lg px-4 py-3">
          <p className="text-xs text-slate-400 mb-1">题目 (Part {part})</p>
          <p className="text-sm text-slate-700">{question || '请先输入题目'}</p>
        </div>

        {/* 分数选择 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">目标分数：</span>
          {[7, 7.5, 8].map(score => (
            <button
              key={score}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                bandScore === score
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => setBandScore(score)}
            >
              {score}
            </button>
          ))}
        </div>

        {/* 生成按钮 */}
        <button
          className="btn btn-primary w-full justify-center py-2.5"
          onClick={handleGenerate}
          disabled={generating || !question.trim()}
        >
          {generating ? (
            <>
              <Sparkles size={16} className="animate-pulse" />
              AI 正在生成...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              生成 Band {bandScore} 参考答案
            </>
          )}
        </button>

        {/* 错误提示 */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* 生成结果 */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">生成结果</span>
              <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                <Copy size={14} />
                复制
              </button>
            </div>
            <div className="prose prose-sm max-w-none bg-slate-50 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
