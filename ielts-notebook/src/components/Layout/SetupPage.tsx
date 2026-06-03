import { useState } from 'react'
import { saveCredentials, getSupabase, hasCredentials } from '@/lib/supabase'
import { Database, CheckCircle } from 'lucide-react'

interface SetupPageProps {
  onConfigured: () => void
}

export default function SetupPage({ onConfigured }: SetupPageProps) {
  const [url, setUrl] = useState(localStorage.getItem('ielts_supabase_url') || '')
  const [anon, setAnon] = useState(localStorage.getItem('ielts_supabase_anon') || '')
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const isConfigured = hasCredentials()

  const handleSave = async () => {
    setError('')
    if (!url.trim() || !anon.trim()) {
      setError('请填写 Supabase URL 和 Anon Key')
      return
    }
    setTesting(true)
    try {
      // 保存凭据
      saveCredentials(url.trim(), anon.trim())

      // 测试连接：尝试查询一条数据
      const supabase = getSupabase()
      const { error: testError } = await supabase.from('speaking_qa').select('id').limit(1)
      if (testError) {
        // 表不存在时会报错，检查是不是连接问题
        if (testError.message?.includes('relation') || testError.code === '42P01') {
          // 表还没建，但连接成功了
          setSuccess(true)
          setTimeout(() => onConfigured(), 800)
          return
        }
        throw testError
      }
      setSuccess(true)
      setTimeout(() => onConfigured(), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接失败，请检查 URL 和 Key')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database size={28} className="text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {isConfigured ? '更新 Supabase 配置' : '欢迎使用雅思口语笔记本'}
          </h1>
          <p className="text-slate-500 text-sm">
            请配置 Supabase 数据库连接。
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Project URL</label>
            <input
              type="text"
              className="form-input"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://xxxxxxxxxxxx.supabase.co"
            />
          </div>

          <div>
            <label className="form-label">Anon Key</label>
            <input
              type="password"
              className="form-input"
              value={anon}
              onChange={e => setAnon(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIs..."
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-3 flex items-center gap-2">
              <CheckCircle size={16} />
              连接成功！
            </div>
          )}

          <button
            className="btn btn-primary w-full justify-center py-2.5"
            onClick={handleSave}
            disabled={testing}
          >
            {testing ? '连接中...' : isConfigured ? '更新并重新连接' : '连接数据库'}
          </button>
        </div>

        <div className="mt-8 p-4 bg-slate-100 rounded-lg">
          <h3 className="text-sm font-medium text-slate-700 mb-2">设置步骤：</h3>
          <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
            <li>在 supabase.com 创建免费项目</li>
            <li>Settings → API：复制 Project URL 和 anon key</li>
            <li>粘贴到上方并点击连接</li>
            <li>在 SQL Editor 中执行 supabase/setup.sql 建表</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
