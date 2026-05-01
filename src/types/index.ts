export type UserRole = 'admin' | 'operator' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
}

export interface Company {
  id: string
  name: string
  code: string
}

export type DayType = 'weekday' | 'saturday' | 'sunday' | 'holiday' | 'daily'
export type TripType = 'departure' | 'arrival'
export type TripStatus =
  | 'on_time'
  | 'boarding'
  | 'delayed'
  | 'departed'
  | 'arrived'
  | 'cancelled'

export interface Trip {
  id: string
  lineNumber: string
  companyId: string
  origin: string
  destination: string
  scheduledTime: string
  platform: string
  type: TripType
  status: TripStatus
  dayTypes: DayType[]
  active: boolean
}

export interface WeatherData {
  temp: number
  description: string
  icon: string
  city: string
}
