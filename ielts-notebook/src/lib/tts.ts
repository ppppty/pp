/**
 * Web Speech API 封装 — 英语单词/句子朗读，支持英音和美音
 */

export type Accent = 'uk' | 'us'

function getVoice(accent: Accent): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices()
  const langPrefix = accent === 'uk' ? 'en-GB' : 'en-US'

  // 优先选高质量语音
  const preferred = voices.find(
    v => v.lang.startsWith(langPrefix) && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
  )
  if (preferred) return preferred

  return voices.find(v => v.lang.startsWith(langPrefix)) || null
}

export function speak(text: string, accent: Accent = 'us', rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (!text.trim()) {
      resolve()
      return
    }

    speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text)

    const doSpeak = () => {
      const voice = getVoice(accent)
      if (voice) utter.voice = voice
      utter.lang = accent === 'uk' ? 'en-GB' : 'en-US'
      utter.rate = rate
      utter.pitch = 1

      utter.onend = () => resolve()
      utter.onerror = () => resolve()

      speechSynthesis.speak(utter)
    }

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.onvoiceschanged = null
        doSpeak()
      }
    } else {
      doSpeak()
    }
  })
}

export function stopSpeaking() {
  speechSynthesis.cancel()
}
