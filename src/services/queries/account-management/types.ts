export interface Customer {
  firstName: string
  middleName: string
  lastName: string
  gender: string
  address: string
  city: string
  state: string
  country: string
  dateOfBirth: Date
  email?: string
  phoneNumber: string
  accountNumber: string
}

export interface CustomerDetails {
  firstName: string
  middleName: string
  lastName: string
  gender: string
  address: string
  city: string
  state: string
  country: string
  dateOfBirth: Date
  phoneNumber: string
  clearBalance: number
  accountNumber: string
  onAlat: boolean
  onUssd: boolean
  onAfb: string
  hasCard: boolean
}
