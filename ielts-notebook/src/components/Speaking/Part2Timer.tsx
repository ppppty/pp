import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'

type Phase = 'idle' | 'prep' | 'speaking' | 'done'

export default function Part2Timer() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [seconds, setSeconds] = useState(60) // 默认准备时间 60s
  const timerRef = useRef<number>(0)

  const prepTime = 60 // 1分钟准备
  const speakTime = 120 // 2分钟陈述

  const startPrep = useCallback(() => {
    setPhase('prep')
    setSeconds(prepTime)
  }, [])

  const stop = useCallback(() => {
    setPhase('idle')
    setSeconds(prepTime)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = window.setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          if (phase === 'prep') {
            setPhase('speaking')
            return speakTime
          }
          setPhase('done')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const isWarning = phase === 'speaking' && seconds <= 30

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-brand-500" />
          <span className="font-medium text-slate-700">Part 2 计时训练</span>
          {phase !== 'idle' && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              phase === 'prep' ? 'bg-amber-100 text-amber-700' :
              phase === 'speaking' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-600'
            }`}>
              {phase === 'prep' ? '准备阶段' : phase === 'speaking' ? '陈述阶段' : '完成'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {phase === 'idle' && (
            <button className="btn btn-primary btn-sm" onClick={startPrep}>
              <Play size={14} />
              开始练习
            </button>
          )}
          {(phase === 'prep' || phase === 'speaking') && (
            <button className="btn btn-secondary btn-sm" onClick={stop}>
              <Pause size={14} />
              停止
            </button>
          )}
          {(phase === 'done' || phase === 'idle') && (
            <button className="btn btn-ghost btn-sm" onClick={stop}>
              <RotateCcw size={14} />
              重置
            </button>
          )}
        </div>
      </div>

      {/* Timer display */}
      {(phase === 'prep' || phase === 'speaking') && (
        <div className={`mt-4 text-center py-6 rounded-xl ${
          phase === 'prep' ? 'bg-amber-50' : 'bg-green-50'
        }`}>
          <p className="text-xs text-slate-500 mb-1">
            {phase === 'prep' ? '准备时间 — 写下关键词' : '开始陈述'}
          </p>
          <p className={`text-5xl font-bold font-mono tracking-wider ${
            isWarning ? 'text-red-500 animate-pulse' :
            phase === 'prep' ? 'text-amber-600' : 'text-green-600'
          }`}>
            {formatTime(seconds)}
          </p>
          {phase === 'prep' && (
            <p className="text-xs text-slate-400 mt-2">
              还剩 {seconds} 秒，时间到后自动进入陈述阶段
            </p>
          )}
          {isWarning && (
            <p className="text-xs text-red-400 mt-2">
              还剩 30 秒，注意时间把控！
            </p>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="mt-4 text-center py-6 rounded-xl bg-slate-50">
          <p className="text-slate-500">练习完成！复盘一下你的表现</p>
        </div>
      )}
    </div>
  )
}
