import { useState, useEffect } from 'react'
import { WeatherData } from '@/types'
import { fetchWeather } from '@/services/weather'

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    fetchWeather().then(setWeather)
    const interval = setInterval(() => fetchWeather().then(setWeather), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return weather
}
