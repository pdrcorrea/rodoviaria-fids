import { useMemo } from 'react'
import { Trip, DayType } from '@/types'

const HOLIDAYS: string[] = [
  '01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25',
]

function getDayType(date: Date): DayType {
  const day = date.getDay()
  const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  if (HOLIDAYS.includes(mmdd)) return 'holiday'
  if (day === 0) return 'sunday'
  if (day === 6) return 'saturday'
  return 'weekday'
}

/** Convert "HH:MM" to total minutes since midnight */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function useFilteredTrips(
  trips: Trip[],
  search = '',
  type?: 'departure' | 'arrival',
) {
  return useMemo(() => {
    const now = new Date()
    const dayType = getDayType(now)
    const nowMin = now.getHours() * 60 + now.getMinutes()

    return trips
      .filter((t) => t.active)
      .filter((t) => t.dayTypes.includes('daily') || t.dayTypes.includes(dayType))
      .filter((t) => (type ? t.type === type : true))
      .filter((t) => {
        const scheduled = toMinutes(t.scheduledTime)
        if (t.type === 'departure') {
          // show from 30 min ago up to 60 min in the future
          return scheduled >= nowMin - 30 && scheduled <= nowMin + 60
        } else {
          // arrivals: show from 30 min ago up to 60 min in the future
          return scheduled >= nowMin - 30 && scheduled <= nowMin + 60
        }
      })
      .filter((t) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          t.lineNumber.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.origin.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
  }, [trips, search, type])
}
