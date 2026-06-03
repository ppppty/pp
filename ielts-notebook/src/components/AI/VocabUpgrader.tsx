import { useState } from 'react'
import { RefreshCw, Sparkles, Copy, AlertCircle } from 'lucide-react'
import { callDeepSeek, buildUpgradePrompt } from '@/lib/deepseek'

export default function VocabUpgrader() {
  const [input, setInput] = useState('')
  const [bandScore, setBandScore] = useState(7)
  const [upgrading, setUpgrading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const handleUpgrade = async () => {
    if (!input.trim()) return
    setUpgrading(true)
    setError('')
    setResult('')

    try {
      const prompt = buildUpgradePrompt(input.trim(), bandScore)
      const answer = await callDeepSeek(prompt)
      setResult(answer)
    } catch (err) {
      setError(err instanceof Error ? err.message : '升级失败')
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <RefreshCw size={24} className="text-brand-600" />
        <div>
          <h2 className="text-lg font-semibold text-slate-800">AI 词汇升级</h2>
          <p className="text-sm text-slate-500">输入中文或简单英文表达，AI 帮你升级为更地道的雅思口语表达</p>
        </div>
      </div>

      <div className="card space-y-4">
        {/* 输入 */}
        <div>
          <label className="form-label">你想表达的意思</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'可以输入中文想法，例如：\n"我觉得学英语很重要，因为可以帮助找到好工作"\n\n或者输入简单英文：\n"I think learning English is good for finding jobs"'}
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
          onClick={handleUpgrade}
          disabled={upgrading || !input.trim()}
        >
          {upgrading ? (
            <><Sparkles size={16} className="animate-pulse" /> 升级中...</>
          ) : (
            <><Sparkles size={16} /> 升级表达</>
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
              <span className="text-sm font-medium text-slate-600">升级结果</span>
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
