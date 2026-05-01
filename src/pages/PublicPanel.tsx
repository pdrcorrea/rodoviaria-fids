import { useState, useCallback } from 'react'
import { useData } from '@/context/DataContext'
import { useClock } from '@/hooks/useClock'
import { useWeather } from '@/hooks/useWeather'
import { useFilteredTrips } from '@/hooks/useFilteredTrips'
import FIDSTable from '@/components/FIDSTable'
import { Input } from '@/components/ui/input'
import {
  Bus,
  Search,
  Maximize2,
  Minimize2,
  Thermometer,
  Cloud,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'

export default function PublicPanel() {
  const { trips, companies } = useData()
  const { time, dateStr }    = useClock()
  const weather              = useWeather()
  const [search, setSearch]  = useState('')
  const [tab, setTab]        = useState<'departure' | 'arrival'>('departure')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const filteredTrips = useFilteredTrips(trips, search, tab)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="bg-[#0a1628] text-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight tracking-tight">RODOVIÁRIA</p>
                <p className="text-xs text-white/50 uppercase tracking-widest">Vila Velha - ES</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Buscar destino ou linha..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Right: Clock + Weather + Fullscreen */}
            <div className="flex items-center gap-5 flex-shrink-0">
              {weather && (
                <div className="flex items-center gap-1.5 text-white/80">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-sm font-semibold">{weather.temp}°C</span>
                  <span className="text-xs text-white/50 hidden sm:inline">{weather.description}</span>
                </div>
              )}

              <div className="text-right">
                <p className="font-mono font-bold text-2xl leading-none tracking-widest">{time}</p>
                <p className="text-xs text-white/50 capitalize mt-0.5 hidden sm:block">
                  {dateStr.split(', ').slice(0, 2).join(', ')}
                </p>
              </div>

              <button
                onClick={toggleFullscreen}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                title="Tela cheia"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex">
            {([
              { key: 'departure', label: 'Partidas', icon: ArrowUpRight },
              { key: 'arrival',   label: 'Chegadas', icon: ArrowDownLeft },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === key
                    ? 'border-[#0a1628] text-[#0a1628]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === key ? 'bg-[#0a1628] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {useFilteredTripsCount(trips, search, key)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-6">
        <FIDSTable trips={filteredTrips} companies={companies} type={tab} />
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-gray-50 border-t border-gray-200 py-3 px-6 text-center text-xs text-gray-400">
        Rodoviária de Vila Velha — Sistema FIDS © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

// Helper to compute tab counts without hook duplication
function useFilteredTripsCount(
  trips: ReturnType<typeof useData>['trips'],
  search: string,
  type: 'departure' | 'arrival'
): number {
  return useFilteredTrips(trips, search, type).length
}
