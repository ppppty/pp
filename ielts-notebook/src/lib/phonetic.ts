import { PHONETIC_FALLBACK } from '@/data/phonetic-fallback'

const CACHE_KEY = 'ielts_phonetic_cache'
const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en'

interface DictPhonetic {
  text?: string
  audio?: string
}

interface DictEntry {
  word: string
  phonetic?: string
  phonetics?: DictPhonetic[]
}

export interface PhoneticResult {
  uk: string
  us: string
}

function getCache(): Record<string, PhoneticResult> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

function setCache(word: string, result: PhoneticResult) {
  const cache = getCache()
  cache[word.toLowerCase()] = result
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage 满了，忽略
  }
}

async function fetchFromAPI(word: string): Promise<PhoneticResult | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    const res = await fetch(`${API_BASE}/${encodeURIComponent(word)}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return null

    const data: DictEntry[] = await res.json()
    if (!data?.length) return null

    const phonetics = data[0].phonetics || []

    // 通过 audio URL 判断 UK/US 区域，比依赖数组顺序更可靠
    const ukEntry = phonetics.find(p => p.audio?.includes('-uk')) || phonetics.find(p => p.text)
    const usEntry = phonetics.find(p => p.audio?.includes('-us')) || (ukEntry ? phonetics.find(p => p !== ukEntry && p.text) : null)

    const uk = ukEntry?.text || data[0].phonetic || ''
    const us = usEntry?.text || ukEntry?.text || data[0].phonetic || ''

    return { uk, us }
  } catch {
    return null
  }
}

/**
 * 查询英音+美音音标
 * 三层兜底：API → localStorage缓存 → 本地预置词典
 */
export async function lookupPhonetic(word: string): Promise<PhoneticResult> {
  const key = word.toLowerCase().trim()
  if (!key) return { uk: '', us: '' }

  // 1. 尝试 API
  const apiResult = await fetchFromAPI(key)
  if (apiResult && (apiResult.uk || apiResult.us)) {
    setCache(key, apiResult)
    return apiResult
  }

  // 2. 查缓存
  const cache = getCache()
  if (cache[key]) return cache[key]

  // 3. 查本地词典
  if (PHONETIC_FALLBACK[key]) {
    const p = PHONETIC_FALLBACK[key]
    return { uk: p, us: p }
  }

  return { uk: '', us: '' }
}
