import { useState } from 'react'
import { useData } from '@/context/DataContext'
import { Trip, TripStatus, TripType, DayType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/StatusBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2, X, Check, Zap } from 'lucide-react'

const DAY_LABELS: Record<DayType, string> = {
  daily: 'Todos os dias',
  weekday: 'Dias úteis',
  saturday: 'Sábado',
  sunday: 'Domingo',
  holiday: 'Feriado',
}

const STATUS_OPTIONS: { value: TripStatus; label: string }[] = [
  { value: 'on_time',   label: 'No Horário' },
  { value: 'boarding',  label: 'Embarque Imediato' },
  { value: 'delayed',   label: 'Atrasado' },
  { value: 'departed',  label: 'Partiu' },
  { value: 'arrived',   label: 'Chegou' },
  { value: 'cancelled', label: 'Cancelado' },
]

type TripForm = Omit<Trip, 'id'>

const emptyForm: TripForm = {
  lineNumber: '', companyId: '', origin: '', destination: '',
  scheduledTime: '08:00', platform: '01', type: 'departure',
  status: 'on_time', dayTypes: ['weekday'], active: true,
}

export default function AdminLines() {
  const { trips, companies, addTrip, updateTrip, deleteTrip } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState<string | null>(null)
  const [form, setForm]         = useState<TripForm>({ ...emptyForm })
  const [search, setSearch]     = useState('')
  // quick-edit: only status + platform inline
  const [quickEditId, setQuickEditId] = useState<string | null>(null)
  const [qStatus, setQStatus]         = useState<TripStatus>('on_time')
  const [qPlatform, setQPlatform]     = useState('')

  const filtered = trips.filter(
    (t) =>
      t.lineNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.origin.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm({ ...emptyForm, companyId: companies[0]?.id ?? '' })
    setEditId(null)
    setShowForm(true)
    setQuickEditId(null)
  }

  const openEdit = (t: Trip) => {
    const { id, ...rest } = t
    setForm({ ...rest })
    setEditId(id)
    setShowForm(true)
    setQuickEditId(null)
  }

  const openQuickEdit = (t: Trip) => {
    setQuickEditId(t.id)
    setQStatus(t.status)
    setQPlatform(t.platform)
    setShowForm(false)
  }

  const saveQuickEdit = (trip: Trip) => {
    updateTrip({ ...trip, status: qStatus, platform: qPlatform })
    setQuickEditId(null)
  }

  const toggleDay = (day: DayType) => {
    setForm((prev) => ({
      ...prev,
      dayTypes: prev.dayTypes.includes(day)
        ? prev.dayTypes.filter((d) => d !== day)
        : [...prev.dayTypes, day],
    }))
  }

  const handleSave = () => {
    if (!form.lineNumber || !form.companyId || !form.origin || !form.destination) return
    if (editId) updateTrip({ ...form, id: editId })
    else addTrip(form)
    setShowForm(false)
  }

  const getCompanyName = (id: string) =>
    companies.find((c) => c.id === id)?.name ?? id

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Linhas & Operações</h1>
          <p className="text-sm text-gray-500">{trips.length} linhas cadastradas</p>
        </div>
        <Button onClick={openAdd} className="bg-[#0a1628] hover:bg-[#1e3a5f]">
          <Plus className="w-4 h-4" /> Nova Linha
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por linha, origem ou destino..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Full Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-[#0a1628] mb-4">
            {editId ? 'Editar Linha' : 'Nova Linha'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Número da Linha</Label>
              <Input value={form.lineNumber} onChange={(e) => setForm({ ...form, lineNumber: e.target.value })} placeholder="Ex: 1010" />
            </div>
            <div className="space-y-1">
              <Label>Empresa</Label>
              <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TripType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Partida</SelectItem>
                  <SelectItem value="arrival">Chegada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Origem</Label>
              <Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Cidade de origem" />
            </div>
            <div className="space-y-1">
              <Label>Destino</Label>
              <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Cidade de destino" />
            </div>
            <div className="space-y-1">
              <Label>Horário</Label>
              <Input type="time" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Plataforma</Label>
              <Input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="Ex: 01" />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TripStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Ativo</Label>
              <Select value={form.active ? 'yes' : 'no'} onValueChange={(v) => setForm({ ...form, active: v === 'yes' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Sim</SelectItem>
                  <SelectItem value="no">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label className="mb-2 block">Dias de Operação</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DAY_LABELS) as DayType[]).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    form.dayTypes.includes(day)
                      ? 'bg-[#0a1628] text-white border-[#0a1628]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-[#0a1628]'
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <Button onClick={handleSave} className="bg-[#0a1628] hover:bg-[#1e3a5f]">
              <Check className="w-4 h-4" /> Salvar
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              <X className="w-4 h-4" /> Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3 text-left">Linha</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Origem → Destino</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Horário</th>
              <th className="px-4 py-3 text-center">Plataforma</th>
              <th className="px-4 py-3 text-left">Dias</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((trip) => (
              <>
                <tr key={trip.id} className={`border-b border-gray-100 transition-colors ${
                  quickEditId === trip.id ? 'bg-yellow-50' : 'hover:bg-gray-50'
                }`}>
                  <td className="px-4 py-3 font-mono font-bold text-[#0a1628]">{trip.lineNumber}</td>
                  <td className="px-4 py-3">
                    <Badge variant={trip.type === 'departure' ? 'info' : 'success'}>
                      {trip.type === 'departure' ? 'Partida' : 'Chegada'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="font-medium">{trip.origin}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-medium">{trip.destination}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{getCompanyName(trip.companyId)}</td>
                  <td className="px-4 py-3 font-mono font-bold">{trip.scheduledTime}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0a1628] text-white text-xs font-bold">
                      {trip.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {trip.dayTypes.map((d) => (
                        <span key={d} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {DAY_LABELS[d]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={trip.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        title="Edição rápida (status e plataforma)"
                        className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        onClick={() =>
                          quickEditId === trip.id
                            ? setQuickEditId(null)
                            : openQuickEdit(trip)
                        }
                      >
                        <Zap className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(trip)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => { if (confirm('Confirmar exclusão?')) deleteTrip(trip.id) }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>

                {/* Quick-edit inline row */}
                {quickEditId === trip.id && (
                  <tr key={`qe-${trip.id}`} className="bg-yellow-50 border-b border-yellow-200">
                    <td colSpan={9} className="px-4 py-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Edição Rápida</span>

                        <div className="flex items-center gap-2">
                          <Label className="text-xs whitespace-nowrap">Status</Label>
                          <Select value={qStatus} onValueChange={(v) => setQStatus(v as TripStatus)}>
                            <SelectTrigger className="h-8 w-48 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-xs whitespace-nowrap">Plataforma</Label>
                          <Input
                            value={qPlatform}
                            onChange={(e) => setQPlatform(e.target.value)}
                            className="h-8 w-20 text-xs font-mono"
                          />
                        </div>

                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white h-8"
                          onClick={() => saveQuickEdit(trip)}
                        >
                          <Check className="w-3 h-3 mr-1" /> Confirmar
                        </Button>
                        <Button
                          size="sm" variant="outline" className="h-8"
                          onClick={() => setQuickEditId(null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-400">Nenhuma linha encontrada.</p>
        )}
      </div>
    </div>
  )
}
