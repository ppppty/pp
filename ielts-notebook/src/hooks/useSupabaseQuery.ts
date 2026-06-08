import { useState, useEffect, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'

/**
 * 通用 Supabase 查询 hook
 * - 自动处理加载/错误状态
 * - 依赖变更时自动重新查询
 */
export function useSupabaseQuery<T>(tableName: string, limit = 200) {
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
        .limit(limit)

      if (queryError) throw queryError
      setData((result as T[]) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [tableName, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/** 只查数量，不加载全部数据 */
export function useSupabaseCount(tableName: string) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCount = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { count: result, error: queryError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (queryError) throw queryError
      setCount(result || 0)
    } catch {
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [tableName])

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  return { count, loading, refetch: fetchCount }
}
