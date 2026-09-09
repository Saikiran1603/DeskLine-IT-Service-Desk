import { api } from './api'
import type { Category, NewCategory } from '@/types/category'

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories')
    return data
  },

  async create(category: NewCategory): Promise<Category> {
    const { data } = await api.post<Category>('/categories', category)
    return data
  },

  async update(id: string, updates: Partial<Category>): Promise<Category> {
    const { data } = await api.patch<Category>(`/categories/${id}`, updates)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}
