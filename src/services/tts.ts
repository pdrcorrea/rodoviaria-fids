/**
 * Text-to-speech service.
 * Uses ElevenLabs API when VITE_ELEVENLABS_API_KEY is set,
 * otherwise falls back to Web Speech API (browser native).
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
// Default voice: "Charlotte" (pt-BR friendly). Change the ID in .env if desired.
const ELEVENLABS_VOICE_ID =
  import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'XB0fDUnXU5powFXDhCwa'

let audioQueue: HTMLAudioElement[] = []

function stopAll() {
  audioQueue.forEach((a) => { a.pause(); a.src = '' })
  audioQueue = []
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

async function speakElevenLabs(text: string): Promise<void> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.55, similarity_boost: 0.8 },
    }),
  })
  if (!res.ok) throw new Error(`ElevenLabs error: ${res.status}`)
  const blob = await res.blob()
  const src  = URL.createObjectURL(blob)
  const audio = new Audio(src)
  audioQueue.push(audio)
  audio.onended = () => URL.revokeObjectURL(src)
  audio.play()
}

function speakNative(text: string): void {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang    = 'pt-BR'
  utt.rate    = 0.88
  utt.pitch   = 1.0
  utt.volume  = 1
  // wait for voices to load (some browsers need this)
  const trySpeak = () => {
    const voices  = window.speechSynthesis.getVoices()
    const ptVoice =
      voices.find((v) => v.lang === 'pt-BR' && v.localService) ||
      voices.find((v) => v.lang.startsWith('pt-BR'))            ||
      voices.find((v) => v.lang.startsWith('pt'))
    if (ptVoice) utt.voice = ptVoice
    window.speechSynthesis.speak(utt)
  }
  if (window.speechSynthesis.getVoices().length) trySpeak()
  else window.speechSynthesis.onvoiceschanged = trySpeak
}

export async function speak(text: string): Promise<void> {
  stopAll()
  if (ELEVENLABS_API_KEY) {
    try {
      await speakElevenLabs(text)
      return
    } catch (e) {
      console.warn('ElevenLabs TTS failed, falling back to native:', e)
    }
  }
  speakNative(text)
}

export { stopAll }
