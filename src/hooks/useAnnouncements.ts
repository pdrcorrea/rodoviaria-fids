import { useEffect, useRef } from 'react'
import { Trip, Company } from '@/types'
import { speak } from '@/services/tts'

export function useAnnouncements(
  trips: Trip[],
  companies: Company[],
  enabled: boolean,
) {
  const announced = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!enabled) return

    const boardingTrips = trips.filter(
      (t) => t.type === 'departure' && t.status === 'boarding',
    )

    boardingTrips.forEach((trip, index) => {
      if (announced.current.has(trip.id)) return
      announced.current.add(trip.id)

      const company =
        companies.find((c) => c.id === trip.companyId)?.name ?? 'empresa'

      const [h, m] = trip.scheduledTime.split(':')
      const timeText =
        m === '00'
          ? `${parseInt(h)} horas`
          : `${parseInt(h)} horas e ${parseInt(m)} minutos`

      const text =
        `Atenção, passageiros da ${company}, ` +
        `com destino a ${trip.destination}, ` +
        `no horário das ${timeText}. ` +
        `Embarque no carro da plataforma ${trip.platform}.`

      setTimeout(() => speak(text), index * 800)
    })

    // clean up trips that left boarding so they can be re-announced later
    const boardingIds = new Set(boardingTrips.map((t) => t.id))
    announced.current.forEach((id) => {
      if (!boardingIds.has(id)) announced.current.delete(id)
    })
  }, [trips, companies, enabled])
}
