import { useData } from '@/context/DataContext'
import { useClock } from '@/hooks/useClock'
import { Link } from 'react-router-dom'
import { Users, GitFork, Bus, Activity, Clock, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const { users, trips, companies } = useData()
  const { time, dateStr } = useClock()

  const activeTrips  = trips.filter((t) => t.active).length
  const activeUsers  = users.filter((u) => u.active).length
  const departures   = trips.filter((t) => t.type === 'departure' && t.active).length
  const arrivals     = trips.filter((t) => t.type === 'arrival' && t.active).length

  const stats = [
    { label: 'Usuários Ativos',    value: activeUsers,  icon: Users,    color: 'text-blue-600',  bg: 'bg-blue-50' },
    { label: 'Empresas Cadastradas', value: companies.length, icon: Bus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Partidas Ativas',    value: departures,   icon: GitFork,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Chegadas Ativas',    value: arrivals,     icon: Activity, color: 'text-amber-600',  bg: 'bg-amber-50' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0a1628] text-white px-4 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          <span className="font-mono font-bold text-lg tracking-widest">{time}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-[#0a1628]">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          to="/admin/usuarios"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-[#0a1628]">Gestão de Usuários</p>
                <p className="text-xs text-gray-400">{activeUsers} usuários ativos</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        <Link
          to="/admin/linhas"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <GitFork className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-[#0a1628]">Gestão de Operações</p>
                <p className="text-xs text-gray-400">{activeTrips} linhas ativas</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
