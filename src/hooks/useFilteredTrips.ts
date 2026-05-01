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

export function useFilteredTrips(trips: Trip[], search = '', type?: 'departure' | 'arrival') {
  return useMemo(() => {
    const dayType = getDayType(new Date())
    return trips
      .filter((t) => t.active)
      .filter((t) => t.dayTypes.includes('daily') || t.dayTypes.includes(dayType))
      .filter((t) => (type ? t.type === type : true))
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
