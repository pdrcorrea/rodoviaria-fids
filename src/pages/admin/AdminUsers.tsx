import { useState } from 'react'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { User, UserRole } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  operator: 'Operador',
  viewer: 'Visualizador',
}

const emptyForm: Omit<User, 'id' | 'createdAt'> = {
  name: '', email: '', role: 'operator', active: true,
}

export default function AdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useData()
  const { currentUser } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState<string | null>(null)
  const [form, setForm]         = useState({ ...emptyForm })
  const [search, setSearch]     = useState('')

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm({ ...emptyForm })
    setEditId(null)
    setShowForm(true)
  }

  const openEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, role: u.role, active: u.active })
    setEditId(u.id)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) return
    if (editId) updateUser({ ...form, id: editId, createdAt: users.find((u) => u.id === editId)!.createdAt })
    else addUser(form)
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) return alert('Você não pode excluir seu próprio usuário.')
    if (confirm('Confirmar exclusão?')) deleteUser(id)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Usuários</h1>
          <p className="text-sm text-gray-500">{users.length} cadastrados</p>
        </div>
        <Button onClick={openAdd} className="bg-[#0a1628] hover:bg-[#1e3a5f]">
          <Plus className="w-4 h-4" /> Novo Usuário
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-[#0a1628] mb-4">
            {editId ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" />
            </div>
            <div className="space-y-1">
              <Label>E-mail</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-1">
              <Label>Perfil</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.active ? 'active' : 'inactive'} onValueChange={(v) => setForm({ ...form, active: v === 'active' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
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
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">E-mail</th>
              <th className="px-4 py-3 text-left">Perfil</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Criado em</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="info">{ROLE_LABELS[user.role]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.active ? 'success' : 'muted'}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{user.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(user)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-400">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  )
}
