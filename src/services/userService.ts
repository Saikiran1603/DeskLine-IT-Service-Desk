import { api } from './api'
import type { NewUser, User } from '@/types/user'

export const userService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users')
    return data
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const { data } = await api.get<User[]>('/users', { params: { email } })
    return data[0]
  },

  async create(user: NewUser): Promise<User> {
    const payload: Omit<User, 'id'> = {
      ...user,
      createdDate: new Date().toISOString(),
    }
    const { data } = await api.post<User>('/users', payload)
    return data
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, updates)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },

  async setStatus(id: string, status: User['status']): Promise<User> {
    return this.update(id, { status })
  },
}
