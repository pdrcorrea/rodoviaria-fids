import { User, Company, Trip } from '@/types'

const KEYS = {
  users: 'fids_users',
  companies: 'fids_companies',
  trips: 'fids_trips',
  auth: 'fids_auth',
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// ── Seed ──────────────────────────────────────────────────────────
export function seedIfEmpty() {
  if (!localStorage.getItem(KEYS.users)) {
    const users: User[] = [
      {
        id: 'u1',
        name: 'Administrador',
        email: 'admin@rodoviaria.com',
        role: 'admin',
        active: true,
        createdAt: '2024-01-01',
      },
      {
        id: 'u2',
        name: 'Operador 1',
        email: 'op1@rodoviaria.com',
        role: 'operator',
        active: true,
        createdAt: '2024-03-15',
      },
    ]
    save(KEYS.users, users)
  }

  if (!localStorage.getItem(KEYS.companies)) {
    const companies: Company[] = [
      { id: 'c1', name: 'Viação Águia Branca', code: 'AB' },
      { id: 'c2', name: 'Expresso Kaissara', code: 'EK' },
      { id: 'c3', name: 'Itapemirim', code: 'IT' },
      { id: 'c4', name: 'Util', code: 'UT' },
    ]
    save(KEYS.companies, companies)
  }

  if (!localStorage.getItem(KEYS.trips)) {
    const trips: Trip[] = [
      {
        id: 't1', lineNumber: '1010', companyId: 'c1',
        origin: 'Vila Velha', destination: 'São Paulo',
        scheduledTime: '07:00', platform: '01',
        type: 'departure', status: 'on_time',
        dayTypes: ['weekday'], active: true,
      },
      {
        id: 't2', lineNumber: '1011', companyId: 'c1',
        origin: 'Vila Velha', destination: 'Rio de Janeiro',
        scheduledTime: '08:30', platform: '02',
        type: 'departure', status: 'boarding',
        dayTypes: ['daily'], active: true,
      },
      {
        id: 't3', lineNumber: '2020', companyId: 'c2',
        origin: 'Vila Velha', destination: 'Belo Horizonte',
        scheduledTime: '09:15', platform: '03',
        type: 'departure', status: 'delayed',
        dayTypes: ['weekday', 'saturday'], active: true,
      },
      {
        id: 't4', lineNumber: '3030', companyId: 'c3',
        origin: 'São Paulo', destination: 'Vila Velha',
        scheduledTime: '10:00', platform: '04',
        type: 'arrival', status: 'on_time',
        dayTypes: ['daily'], active: true,
      },
      {
        id: 't5', lineNumber: '4040', companyId: 'c4',
        origin: 'Rio de Janeiro', destination: 'Vila Velha',
        scheduledTime: '11:30', platform: '05',
        type: 'arrival', status: 'arrived',
        dayTypes: ['daily'], active: true,
      },
      {
        id: 't6', lineNumber: '1012', companyId: 'c1',
        origin: 'Vila Velha', destination: 'Salvador',
        scheduledTime: '14:00', platform: '01',
        type: 'departure', status: 'on_time',
        dayTypes: ['sunday', 'holiday'], active: true,
      },
      {
        id: 't7', lineNumber: '5050', companyId: 'c2',
        origin: 'Vitória', destination: 'Vila Velha',
        scheduledTime: '06:30', platform: '06',
        type: 'arrival', status: 'on_time',
        dayTypes: ['weekday'], active: true,
      },
    ]
    save(KEYS.trips, trips)
  }
}

// ── CRUD Helpers ──────────────────────────────────────────────────
export const usersService = {
  getAll: () => load<User[]>(KEYS.users, []),
  save: (users: User[]) => save(KEYS.users, users),
}

export const companiesService = {
  getAll: () => load<Company[]>(KEYS.companies, []),
  save: (companies: Company[]) => save(KEYS.companies, companies),
}

export const tripsService = {
  getAll: () => load<Trip[]>(KEYS.trips, []),
  save: (trips: Trip[]) => save(KEYS.trips, trips),
}

export const authService = {
  getSession: () => load<{ email: string; role: string } | null>(KEYS.auth, null),
  setSession: (data: { email: string; role: string }) => save(KEYS.auth, data),
  clearSession: () => localStorage.removeItem(KEYS.auth),
  login: (email: string, password: string): User | null => {
    const users = load<User[]>(KEYS.users, [])
    const user = users.find((u) => u.email === email && u.active)
    // demo: password = 'admin123' for all users
    if (user && password === 'admin123') return user
    return null
  },
}
