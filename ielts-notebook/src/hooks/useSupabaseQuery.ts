import { useState, useEffect, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'

/**
 * 通用 Supabase 查询 hook
 * - 自动处理加载/错误状态
 * - 依赖变更时自动重新查询
 */
export function useSupabaseQuery<T>(
  tableName: string,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = getSupabase()
      const { data: result, error: queryError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (queryError) throw queryError
      setData((result as T[]) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败')
      setData([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName, ...deps])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
