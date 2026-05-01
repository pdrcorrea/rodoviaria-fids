import { WeatherData } from '@/types'

// Replace with a real API key from openweathermap.org (free tier)
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ''
const CITY = import.meta.env.VITE_WEATHER_CITY || 'Vila Velha,BR'

export async function fetchWeather(): Promise<WeatherData | null> {
  if (!API_KEY) {
    // Return mock data when no API key is provided
    return {
      temp: 28,
      description: 'Parcialmente nublado',
      icon: '02d',
      city: 'Vila Velha',
    }
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&appid=${API_KEY}&units=metric&lang=pt_br`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Weather fetch failed')
    const data = await res.json()
    return {
      temp: Math.round(data.main.temp),
      description:
        data.weather[0].description.charAt(0).toUpperCase() +
        data.weather[0].description.slice(1),
      icon: data.weather[0].icon,
      city: data.name,
    }
  } catch {
    return null
  }
}
