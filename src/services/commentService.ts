import { api } from './api'
import type { Comment } from '@/types/comment'
import type { User } from '@/types/user'

export const commentService = {
  async getByTicket(ticketId: string): Promise<Comment[]> {
    const { data } = await api.get<Comment[]>('/comments', {
      params: { ticketId, _sort: 'createdDate', _order: 'asc' },
    })
    return data
  },

  async create(ticketId: string, text: string, user: User): Promise<Comment> {
    const now = new Date()
    const payload: Omit<Comment, 'id'> = {
      ticketId,
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      comment: text,
      createdDate: now.toISOString(),
      createdTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const { data } = await api.post<Comment>('/comments', payload)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/comments/${id}`)
  },
}
