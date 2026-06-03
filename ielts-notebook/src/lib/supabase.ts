import { createClient } from '@supabase/supabase-js'

const STORAGE_KEY_URL = 'ielts_supabase_url'
const STORAGE_KEY_ANON = 'ielts_supabase_anon'

function getCredentials() {
  const url = localStorage.getItem(STORAGE_KEY_URL) || import.meta.env.VITE_SUPABASE_URL || ''
  const anon = localStorage.getItem(STORAGE_KEY_ANON) || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  return { url, anon }
}

export function saveCredentials(url: string, anon: string) {
  localStorage.setItem(STORAGE_KEY_URL, url)
  localStorage.setItem(STORAGE_KEY_ANON, anon)
}

export function hasCredentials(): boolean {
  const { url, anon } = getCredentials()
  return !!(url && anon)
}

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance
  const { url, anon } = getCredentials()
  if (!url || !anon) {
    throw new Error('Supabase 未配置')
  }
  supabaseInstance = createClient(url, anon)
  return supabaseInstance
}

/** 返回类型宽松的 Supabase 客户端（用于 insert/update 操作） */
export function db() {
  return getSupabase() as any
}
