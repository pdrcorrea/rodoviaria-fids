import { useState } from 'react'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useClock } from '@/hooks/useClock'
import { useFilteredTrips } from '@/hooks/useFilteredTrips'
import { Trip, TripStatus } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bus, Clock, LogOut, MonitorPlay, Check } from 'lucide-react'

const STATUS_OPTIONS: { value: TripStatus; label: string }[] = [
  { value: 'on_time',   label: 'No Horário' },
  { value: 'boarding',  label: 'Embarque Imediato' },
  { value: 'delayed',   label: 'Atrasado' },
  { value: 'departed',  label: 'Partiu' },
  { value: 'arrived',   label: 'Chegou' },
  { value: 'cancelled', label: 'Cancelado' },
]

interface EditState {
  status: TripStatus
  platform: string
  dirty: boolean
}

export default function OperatorPage() {
  const { trips, companies, updateTrip } = useData()
  const { currentUser, logout }          = useAuth()
  const navigate                          = useNavigate()
  const { time, dateStr }                 = useClock()

  // show ALL trips today (no search filter) so operator sees full picture
  const todayTrips = useFilteredTrips(trips, '', undefined)

  // local edit state per trip id
  const [edits, setEdits] = useState<Record<string, EditState>>(() =>
    Object.fromEntries(
      trips.map((t) => [t.id, { status: t.status, platform: t.platform, dirty: false }])
    )
  )

  const setField = (id: string, field: 'status' | 'platform', value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value, dirty: true },
    }))
  }

  const save = (trip: Trip) => {
    const e = edits[trip.id]
    if (!e) return
    updateTrip({ ...trip, status: e.status as TripStatus, platform: e.platform })
    setEdits((prev) => ({ ...prev, [trip.id]: { ...e, dirty: false } }))
  }

  const departures = todayTrips.filter((t) => t.type === 'departure')
  const arrivals   = todayTrips.filter((t) => t.type === 'arrival')

  const getCompany = (id: string) =>
    companies.find((c) => c.id === id)?.name ?? id

  const renderTable = (list: Trip[], label: string) => (
    <div className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
        {label} &mdash; {list.length} no painel
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0a1628] text-white text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Horário</th>
              <th className="px-4 py-3 text-left">Linha</th>
              <th className="px-4 py-3 text-left">Destino / Origem</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left w-52">Status</th>
              <th className="px-4 py-3 text-center w-28">Plataforma</th>
              <th className="px-4 py-3 text-center w-24">Salvar</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  Nenhum horário na janela atual.
                </td>
              </tr>
            )}
            {list.map((trip, idx) => {
              const e = edits[trip.id] ?? { status: trip.status, platform: trip.platform, dirty: false }
              return (
                <tr
                  key={trip.id}
                  className={`border-b border-gray-100 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } ${
                    e.status === 'boarding' ? 'ring-2 ring-inset ring-yellow-400' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono font-bold text-[#0a1628] text-base">
                    {trip.scheduledTime}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-600">{trip.lineNumber}</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-900">
                    {trip.type === 'departure' ? trip.destination : trip.origin}
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{getCompany(trip.companyId)}</td>

                  {/* Status selector */}
                  <td className="px-4 py-2">
                    <Select
                      value={e.status}
                      onValueChange={(v) => setField(trip.id, 'status', v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value} className="text-xs">
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Platform input */}
                  <td className="px-4 py-2 text-center">
                    <Input
                      value={e.platform}
                      onChange={(ev) => setField(trip.id, 'platform', ev.target.value)}
                      className="h-8 text-xs font-mono text-center w-16 mx-auto"
                    />
                  </td>

                  {/* Save button */}
                  <td className="px-4 py-2 text-center">
                    <Button
                      size="sm"
                      disabled={!e.dirty}
                      onClick={() => save(trip)}
                      className={`h-8 w-full text-xs ${
                        e.dirty
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {e.dirty ? 'Salvar' : 'OK'}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a1628] text-white sticky top-0 z-20 shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Painel do Operador</p>
              <p className="text-xs text-white/50 capitalize">{dateStr.split(', ').slice(0,2).join(', ')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-white/60" />
              <span className="font-mono font-bold tracking-widest text-lg">{time}</span>
            </div>

            <button
              onClick={() => navigate('/painel')}
              className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
            >
              <MonitorPlay className="w-4 h-4" />
              Painel Público
            </button>

            <button
              onClick={() => { logout(); navigate('/login') }}
              className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
          ⚡ Altere o <strong>status</strong> e a <strong>plataforma</strong> diretamente na tabela e clique em <strong>Salvar</strong>. As alterações refletem imediatamente no painel público. Linhas com <strong>Embarque Imediato</strong> ficam destacadas em amarelo.
        </div>

        {renderTable(departures, 'Partidas')}
        {renderTable(arrivals, 'Chegadas')}
      </div>
    </div>
  )
}
