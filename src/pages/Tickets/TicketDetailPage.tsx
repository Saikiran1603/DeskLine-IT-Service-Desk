import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, UserPlus } from 'lucide-react'
import { AppShell } from '@/components/common/AppShell'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useAsync } from '@/hooks/useAsync'
import { ticketService } from '@/services/ticketService'
import { commentService } from '@/services/commentService'
import { userService } from '@/services/userService'
import { LoadingState, ErrorState } from '@/components/common/States'
import { StatusBadge, PriorityBadge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { SelectField } from '@/components/common/FormField'
import { ActivityTimeline } from '@/components/Tickets/ActivityTimeline'
import { CommentsSection } from '@/components/Comments/CommentsSection'
import { AssignmentModal } from '@/components/Tickets/AssignmentModal'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { Modal } from '@/components/common/Modal'
import { TextAreaField } from '@/components/common/FormField'
import { permissions } from '@/utils/permissions'
import type { Priority } from '@/types/ticket'

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()

  const { data: ticket, isLoading, error, refetch, setData: setTicket } = useAsync(
    () => ticketService.getById(id!),
    [id],
  )
  const { data: comments, refetch: refetchComments, setData: setComments } = useAsync(
    () => (id ? commentService.getByTicket(id) : Promise.resolve([])),
    [id],
  )
  const { data: users } = useAsync(() => userService.getAll(), [])

  const [showAssign, setShowAssign] = useState(false)
  const [showResolve, setShowResolve] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [resolution, setResolution] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [resolveError, setResolveError] = useState('')

  if (isLoading) return <AppShell title="Ticket"><LoadingState label="Loading ticket…" /></AppShell>
  if (error || !ticket) return <AppShell title="Ticket"><ErrorState message={error ?? 'Ticket not found.'} onRetry={refetch} /></AppShell>
  if (!user) return null

  if (!permissions.canViewTicket(user, ticket)) {
    return <AppShell title="Ticket"><ErrorState message="You don't have permission to view this ticket." /></AppShell>
  }

  const agents = (users ?? []).filter((u) => u.role === 'agent')
  const canEdit = permissions.canEditTicket(user, ticket)
  const canDelete = permissions.canDeleteTicket(user.role)
  const canAssign = permissions.canAssignTicket(user.role)
  const canChangePriority = permissions.canChangePriority(user, ticket)
  const statusActions = permissions.availableStatusActions(user, ticket)

  async function handleStatusChange(next: string) {
    if (!ticket) return
    if (next === 'Resolved') {
      setShowResolve(true)
      return
    }
    if (next === 'Closed') {
      const updated = await ticketService.close(ticket, user!)
      setTicket(updated)
      show('Ticket closed.')
      return
    }
    if (next === 'Cancelled') {
      const updated = await ticketService.cancel(ticket, user!)
      setTicket(updated)
      show('Ticket cancelled.')
      return
    }
    if (ticket.status === 'Resolved' && next === 'In Progress') {
      const updated = await ticketService.reopen(ticket, user!)
      setTicket(updated)
      show('Ticket reopened.')
      return
    }
    const updated = await ticketService.changeStatus(ticket, user!, next as any)
    setTicket(updated)
    show('Status updated.')
  }

  async function handlePriorityChange(p: Priority) {
    if (!ticket) return
    const updated = await ticketService.changePriority(ticket, user!, p)
    setTicket(updated)
    show('Priority updated.')
  }

  async function handleAddComment(text: string) {
    if (!id) return
    const c = await commentService.create(id, text, user!)
    setComments([...(comments ?? []), c])
    if (ticket) await ticketService.addActivity(ticket, user!, 'Comment added')
    show('Comment posted.')
  }

  async function handleAssign(agentId: string) {
    if (!ticket) return
    const agent = agents.find((a) => a.id === agentId)
    if (!agent) return
    const updated = await ticketService.assign(ticket, user!, agent)
    setTicket(updated)
    show(`Ticket assigned to ${agent.fullName}.`)
  }

  async function handleUnassign() {
    if (!ticket) return
    const updated = await ticketService.unassign(ticket, user!)
    setTicket(updated)
    show('Ticket unassigned.')
  }

  async function handleResolve() {
    if (!resolution.trim() || !resolutionNotes.trim()) {
      setResolveError('Both resolution and notes are required.')
      return
    }
    if (!ticket) return
    const updated = await ticketService.resolve(ticket, user!, resolution.trim(), resolutionNotes.trim())
    setTicket(updated)
    setShowResolve(false)
    setResolution('')
    setResolutionNotes('')
    setResolveError('')
    show('Ticket resolved.')
  }

  async function handleDelete() {
    if (!ticket) return
    await ticketService.remove(ticket.id)
    show('Ticket deleted.')
    navigate('/tickets')
  }

  return (
    <AppShell title={`Ticket ${ticket.id}`}>
      <button
        onClick={() => navigate('/tickets')}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft size={15} /> Back to tickets
      </button>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-md border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-ink-400">{ticket.id}</p>
                <h2 className="mt-0.5 text-lg font-semibold text-ink-900">{ticket.subject}</h2>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink-600">{ticket.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-100 pt-4 text-sm sm:grid-cols-4">
              <div><p className="text-xs text-ink-400">Created By</p><p className="font-medium text-ink-800">{ticket.createdByName}</p></div>
              <div><p className="text-xs text-ink-400">Assigned Agent</p><p className="font-medium text-ink-800">{ticket.assignedAgentName ?? '—'}</p></div>
              <div><p className="text-xs text-ink-400">Category</p><p className="font-medium text-ink-800">{ticket.category}</p></div>
              <div><p className="text-xs text-ink-400">Contact Method</p><p className="font-medium text-ink-800">{ticket.contactMethod}</p></div>
              <div><p className="text-xs text-ink-400">Created</p><p className="font-medium text-ink-800">{new Date(ticket.createdDate).toLocaleString()}</p></div>
              <div><p className="text-xs text-ink-400">Last Updated</p><p className="font-medium text-ink-800">{new Date(ticket.updatedDate).toLocaleString()}</p></div>
            </div>

            {ticket.resolution && (
              <div className="mt-4 rounded-md border border-signal-moss/30 bg-signal-moss/5 p-3">
                <p className="text-xs font-semibold text-signal-moss">Resolution</p>
                <p className="mt-1 text-sm text-ink-700">{ticket.resolution}</p>
                {ticket.resolutionNotes && <p className="mt-1 text-xs text-ink-500">{ticket.resolutionNotes}</p>}
                {ticket.resolutionDate && (
                  <p className="mt-1 text-xs text-ink-400">Resolved {new Date(ticket.resolutionDate).toLocaleString()}</p>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
              {statusActions.map((a) => (
                <Button key={a.label} variant="secondary" size="sm" onClick={() => handleStatusChange(a.next)}>
                  {a.label}
                </Button>
              ))}
              {canAssign && (
                <Button variant="secondary" size="sm" onClick={() => setShowAssign(true)}>
                  <UserPlus size={14} /> {ticket.assignedAgentId ? 'Reassign' : 'Assign'}
                </Button>
              )}
              {canEdit && (
                <Button variant="secondary" size="sm" onClick={() => navigate(`/tickets/${ticket.id}/edit`)}>
                  <Pencil size={14} /> Edit
                </Button>
              )}
              {canDelete && (
                <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
                  <Trash2 size={14} /> Delete
                </Button>
              )}
            </div>

            {canChangePriority && (
              <div className="mt-4 max-w-xs border-t border-ink-100 pt-4">
                <SelectField
                  label="Update Priority"
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                  options={['Low', 'Medium', 'High', 'Critical'].map((p) => ({ value: p, label: p }))}
                />
              </div>
            )}
          </div>

          <div className="rounded-md border border-ink-100 bg-white p-5 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Comments</h3>
            <CommentsSection
              comments={comments ?? []}
              onAdd={handleAddComment}
              canComment={permissions.canComment(user, ticket)}
            />
          </div>
        </div>

        <div className="rounded-md border border-ink-100 bg-white p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">Activity History</h3>
          <ActivityTimeline activity={ticket.activity} />
        </div>
      </div>

      {showAssign && (
        <AssignmentModal
          ticket={ticket}
          agents={agents}
          onAssign={handleAssign}
          onUnassign={handleUnassign}
          onClose={() => setShowAssign(false)}
        />
      )}

      {showResolve && (
        <Modal
          title="Resolve Ticket"
          onClose={() => setShowResolve(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowResolve(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleResolve}>Mark Resolved</Button>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <TextAreaField
              label="Resolution"
              placeholder="Brief summary, e.g. Network adapter was reset and reconnected to Wi-Fi."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              required
            />
            <TextAreaField
              label="Resolution Notes"
              placeholder="Additional detail for the record."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              required
            />
            {resolveError && <p className="text-xs font-medium text-signal-rose">{resolveError}</p>}
          </div>
        </Modal>
      )}

      {showDelete && (
        <ConfirmModal
          title="Delete Ticket"
          message={`Are you sure you want to delete "${ticket.subject}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </AppShell>
  )
}
