export type Role = 'admin' | 'agent' | 'employee'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  fullName: string
  email: string
  password: string
  phone: string
  department: string
  role: Role
  status: UserStatus
  createdDate: string
}

export type NewUser = Omit<User, 'id' | 'createdDate'>
