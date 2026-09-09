import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '@/components/common/AppShell'
import { TicketForm } from '@/components/Tickets/TicketForm'
import { useAsync } from '@/hooks/useAsync'
import { categoryService } from '@/services/categoryService'
import { ticketService } from '@/services/ticketService'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { LoadingState, ErrorState } from '@/components/common/States'
import { permissions } from '@/utils/permissions'
import type { NewTicket } from '@/types/ticket'

export default function EditTicketPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const { data: categories, isLoading: loadingCategories } = useAsync(() => categoryService.getAll(), [])
  const { data: ticket, isLoading: loadingTicket, error } = useAsync(() => ticketService.getById(id!), [id])

  if (loadingCategories || loadingTicket) return <AppShell title="Edit Ticket"><LoadingState /></AppShell>
  if (error || !ticket || !categories) return <AppShell title="Edit Ticket"><ErrorState message={error ?? 'Ticket not found.'} /></AppShell>
  if (!user || !permissions.canEditTicket(user, ticket)) {
    return <AppShell title="Edit Ticket"><ErrorState message="You don't have permission to edit this ticket." /></AppShell>
  }

  async function handleSubmit(data: NewTicket) {
    await ticketService.update(ticket!.id, data)
    show('Ticket updated successfully.')
    navigate(`/tickets/${ticket!.id}`)
  }

  return (
    <AppShell title="Edit Ticket">
      <div className="mx-auto max-w-2xl rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 p-6 shadow-card">
        <TicketForm
          categories={categories}
          initial={ticket}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/tickets/${ticket.id}`)}
        />
      </div>
    </AppShell>
  )
}
