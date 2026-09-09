import { useState, type FormEvent } from 'react'
import type { Comment } from '@/types/comment'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/States'
import { RoleBadge } from '@/components/common/Badge'
import type { Role } from '@/types/user'

interface CommentsSectionProps {
  comments: Comment[]
  onAdd: (text: string) => Promise<void>
  canComment: boolean
}

export function CommentsSection({ comments, onAdd, canComment }: CommentsSectionProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) {
      setError('Comment cannot be empty.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await onAdd(text.trim())
      setText('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.length === 0 ? (
        <EmptyState title="No comments yet" description="Updates and discussion about this ticket will appear here." />
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-md border border-ink-100 bg-ink-50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-ink-900">{c.userName}</span>
                <RoleBadge role={c.userRole as Role} />
                <span className="ml-auto text-xs text-ink-400">
                  {new Date(c.createdDate).toLocaleDateString()} · {c.createdTime}
                </span>
              </div>
              <p className="text-sm text-ink-700 whitespace-pre-wrap">{c.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {canComment && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            className="w-full rounded border border-ink-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-signal-teal/40"
          />
          {error && <p className="text-xs font-medium text-signal-rose">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post Comment'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
