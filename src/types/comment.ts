export interface Comment {
  id: string
  ticketId: string
  userId: string
  userName: string
  userRole: string
  comment: string
  createdDate: string
  createdTime: string
}

export type NewComment = Pick<Comment, 'ticketId' | 'comment'>
