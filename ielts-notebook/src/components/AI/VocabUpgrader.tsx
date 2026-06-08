import { useState } from 'react'
import { RefreshCw, Sparkles, Copy, AlertCircle, Save, Bookmark } from 'lucide-react'
import { callDeepSeek, buildUpgradePrompt, cleanAiResponse } from '@/lib/deepseek'
import { db } from '@/lib/supabase'
import { EXPRESSION_TYPE_OPTIONS } from '@/types'
import type { ExpressionType } from '@/types'

export default function VocabUpgrader() {
  const [input, setInput] = useState('')
  const [bandScore, setBandScore] = useState(7)
  const [upgrading, setUpgrading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [saveTerm, setSaveTerm] = useState('')
  const [saveMeaning, setSaveMeaning] = useState('')
  const [saveType, setSaveType] = useState<ExpressionType>('phrase')
  const [savingExpr, setSavingExpr] = useState(false)
  const [savedExprMsg, setSavedExprMsg] = useState('')

  const handleUpgrade = async () => {
    if (!input.trim()) return
    setUpgrading(true)
    setError('')
    setResult('')
    setSavedExprMsg('')

    try {
      const prompt = buildUpgradePrompt(input.trim(), bandScore)
      const answer = await callDeepSeek(prompt)
      setResult(cleanAiResponse(answer))
      setSaveTerm(input.trim())
      setSaveMeaning('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '升级失败')
    } finally {
      setUpgrading(false)
    }
  }

  const handleSaveToExpressions = async () => {
    if (!saveTerm.trim()) return
    setSavingExpr(true)
    setSavedExprMsg('')
    try {
      await db().from('expressions').insert({
        expr_type: saveType,
        term: saveTerm.trim(),
        meaning: saveMeaning.trim(),
        notes: result.slice(0, 500),
      })
      setSavedExprMsg('已保存到词汇表达')
      setSaveTerm('')
      setSaveMeaning('')
    } catch (err) {
      console.error('保存失败:', err)
      setSavedExprMsg('保存失败')
    } finally {
      setSavingExpr(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <RefreshCw size={24} className="text-brand-600" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">AI 词汇升级</h2>
          <p className="text-sm text-slate-600">输入中文或简单英文表达，AI 帮你升级为更地道的雅思口语表达</p>
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
            <div className="prose prose-sm max-w-none bg-slate-50 rounded-lg p-5 whitespace-pre-wrap text-[1rem] leading-relaxed text-slate-600">
              {result}
            </div>

            {/* 保存到词汇表达 */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="flex items-center gap-2">
                <Bookmark size={16} className="text-brand-500" />
                <span className="text-sm font-medium text-slate-600">保存到词汇表达</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  className="form-select w-auto text-sm"
                  value={saveType}
                  onChange={e => setSaveType(e.target.value as ExpressionType)}
                >
                  {EXPRESSION_TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  className="form-input flex-1 min-w-[160px] text-sm"
                  value={saveTerm}
                  onChange={e => setSaveTerm(e.target.value)}
                  placeholder="升级后的表达..."
                />
                <input
                  className="form-input flex-1 min-w-[160px] text-sm"
                  value={saveMeaning}
                  onChange={e => setSaveMeaning(e.target.value)}
                  placeholder="中文释义（选填）..."
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveToExpressions}
                  disabled={savingExpr || !saveTerm.trim()}
                >
                  <Save size={14} />
                  {savingExpr ? '保存中...' : '保存'}
                </button>
              </div>
              {savedExprMsg && (
                <p className={`text-xs ${savedExprMsg.includes('失败') ? 'text-red-500' : 'text-green-600'}`}>
                  {savedExprMsg}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
