import { Trip, Company } from '@/types'
import StatusBadge from './StatusBadge'
import { Plane, Bus } from 'lucide-react'

interface Props {
  trips: Trip[]
  companies: Company[]
  type: 'departure' | 'arrival'
}

export default function FIDSTable({ trips, companies, type }: Props) {
  const getCompany = (id: string) =>
    companies.find((c) => c.id === id)?.name ?? id

  if (trips.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-lg">
        Nenhum horário para este período.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#0a1628] text-white text-xs uppercase tracking-widest">
            <th className="px-4 py-3 text-left font-semibold">Horário</th>
            <th className="px-4 py-3 text-left font-semibold">Linha</th>
            <th className="px-4 py-3 text-left font-semibold">
              {type === 'departure' ? 'Destino' : 'Origem'}
            </th>
            <th className="px-4 py-3 text-left font-semibold">Empresa</th>
            <th className="px-4 py-3 text-center font-semibold">Plataforma</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, idx) => (
            <tr
              key={trip.id}
              className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                idx % 2 === 0 ? 'fids-row-even' : 'fids-row-odd'
              }`}
            >
              <td className="px-4 py-3 font-mono font-bold text-base text-[#0a1628]">
                {trip.scheduledTime}
              </td>
              <td className="px-4 py-3 font-mono text-gray-700">
                {trip.lineNumber}
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                <div className="flex items-center gap-2">
                  <Bus className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  {type === 'departure' ? trip.destination : trip.origin}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {getCompany(trip.companyId)}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0a1628] text-white text-xs font-bold">
                  {trip.platform}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={trip.status} blink />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
