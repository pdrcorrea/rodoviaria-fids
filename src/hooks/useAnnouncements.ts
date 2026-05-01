import { useEffect, useRef } from 'react'
import { Trip, Company } from '@/types'

/** Speaks a boarding announcement via Web Speech API (TTS). */
function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  // cancel any ongoing speech first
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'pt-BR'
  utt.rate = 0.92
  utt.pitch = 1.05
  utt.volume = 1
  // prefer a Portuguese voice if available
  const voices = window.speechSynthesis.getVoices()
  const ptVoice = voices.find(
    (v) => v.lang.startsWith('pt') && !v.name.toLowerCase().includes('google')
  ) || voices.find((v) => v.lang.startsWith('pt'))
  if (ptVoice) utt.voice = ptVoice
  window.speechSynthesis.speak(utt)
}

export function useAnnouncements(
  trips: Trip[],
  companies: Company[],
  enabled: boolean,
) {
  // keep track of which trip IDs we have already announced
  const announced = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!enabled) return

    const boardingTrips = trips.filter(
      (t) => t.type === 'departure' && t.status === 'boarding',
    )

    boardingTrips.forEach((trip) => {
      if (announced.current.has(trip.id)) return
      announced.current.add(trip.id)

      const company =
        companies.find((c) => c.id === trip.companyId)?.name ?? 'empresa'

      const text =
        `Atenção, passageiros da ${company}, ` +
        `com destino a ${trip.destination}, ` +
        `no horário das ${trip.scheduledTime.replace(':', ' horas e ')} minutos. ` +
        `Embarque no carro da plataforma ${trip.platform}.`

      // small delay so multiple announcements don't overlap immediately
      setTimeout(() => speak(text), 800)
    })

    // if a trip leaves boarding status, allow re-announcement next time
    const boardingIds = new Set(boardingTrips.map((t) => t.id))
    announced.current.forEach((id) => {
      if (!boardingIds.has(id)) announced.current.delete(id)
    })
  }, [trips, companies, enabled])
}
