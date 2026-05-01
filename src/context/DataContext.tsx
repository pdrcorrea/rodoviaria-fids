import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { User, Company, Trip } from '@/types'
import {
  usersService,
  companiesService,
  tripsService,
} from '@/services/localStorage'
import { nanoid } from './nanoid'

interface DataContextType {
  users: User[]
  companies: Company[]
  trips: Trip[]
  refreshUsers: () => void
  refreshCompanies: () => void
  refreshTrips: () => void
  addUser: (u: Omit<User, 'id' | 'createdAt'>) => void
  updateUser: (u: User) => void
  deleteUser: (id: string) => void
  addCompany: (c: Omit<Company, 'id'>) => void
  updateCompany: (c: Company) => void
  deleteCompany: (id: string) => void
  addTrip: (t: Omit<Trip, 'id'>) => void
  updateTrip: (t: Trip) => void
  deleteTrip: (id: string) => void
}

const DataContext = createContext<DataContextType>(null!)

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => usersService.getAll())
  const [companies, setCompanies] = useState<Company[]>(() =>
    companiesService.getAll()
  )
  const [trips, setTrips] = useState<Trip[]>(() => tripsService.getAll())

  const refreshUsers = useCallback(() => setUsers(usersService.getAll()), [])
  const refreshCompanies = useCallback(
    () => setCompanies(companiesService.getAll()),
    []
  )
  const refreshTrips = useCallback(() => setTrips(tripsService.getAll()), [])

  // Users
  const addUser = (u: Omit<User, 'id' | 'createdAt'>) => {
    const updated = [
      ...users,
      { ...u, id: nanoid(), createdAt: new Date().toISOString().slice(0, 10) },
    ]
    usersService.save(updated)
    setUsers(updated)
  }
  const updateUser = (u: User) => {
    const updated = users.map((x) => (x.id === u.id ? u : x))
    usersService.save(updated)
    setUsers(updated)
  }
  const deleteUser = (id: string) => {
    const updated = users.filter((x) => x.id !== id)
    usersService.save(updated)
    setUsers(updated)
  }

  // Companies
  const addCompany = (c: Omit<Company, 'id'>) => {
    const updated = [...companies, { ...c, id: nanoid() }]
    companiesService.save(updated)
    setCompanies(updated)
  }
  const updateCompany = (c: Company) => {
    const updated = companies.map((x) => (x.id === c.id ? c : x))
    companiesService.save(updated)
    setCompanies(updated)
  }
  const deleteCompany = (id: string) => {
    const updated = companies.filter((x) => x.id !== id)
    companiesService.save(updated)
    setCompanies(updated)
  }

  // Trips
  const addTrip = (t: Omit<Trip, 'id'>) => {
    const updated = [...trips, { ...t, id: nanoid() }]
    tripsService.save(updated)
    setTrips(updated)
  }
  const updateTrip = (t: Trip) => {
    const updated = trips.map((x) => (x.id === t.id ? t : x))
    tripsService.save(updated)
    setTrips(updated)
  }
  const deleteTrip = (id: string) => {
    const updated = trips.filter((x) => x.id !== id)
    tripsService.save(updated)
    setTrips(updated)
  }

  return (
    <DataContext.Provider
      value={{
        users,
        companies,
        trips,
        refreshUsers,
        refreshCompanies,
        refreshTrips,
        addUser,
        updateUser,
        deleteUser,
        addCompany,
        updateCompany,
        deleteCompany,
        addTrip,
        updateTrip,
        deleteTrip,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
