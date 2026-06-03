import { useState, useCallback } from 'react'
import { speak, stopSpeaking, Accent } from '@/lib/tts'

export function useSpeech() {
  const [playing, setPlaying] = useState<string | null>(null)

  const play = useCallback(async (text: string, accent: Accent = 'us') => {
    const id = `${text}-${accent}`
    setPlaying(id)
    await speak(text, accent)
    setPlaying(null)
  }, [])

  const stop = useCallback(() => {
    stopSpeaking()
    setPlaying(null)
  }, [])

  const isPlaying = useCallback((text: string, accent: Accent = 'us') => {
    return playing === `${text}-${accent}`
  }, [playing])

  return { play, stop, playing, isPlaying }
}
