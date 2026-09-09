import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/common/AppShell'
import { TicketForm } from '@/components/Tickets/TicketForm'
import { useAsync } from '@/hooks/useAsync'
import { categoryService } from '@/services/categoryService'
import { ticketService } from '@/services/ticketService'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { LoadingState } from '@/components/common/States'
import type { NewTicket } from '@/types/ticket'

export default function CreateTicketPage() {
  const { user } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const { data: categories, isLoading } = useAsync(() => categoryService.getAll(), [])

  async function handleSubmit(data: NewTicket) {
    if (!user) return
    const ticket = await ticketService.create(data, user)
    show('Ticket created successfully.')
    navigate(`/tickets/${ticket.id}`)
  }

  return (
    <AppShell title="Create Ticket">
      <div className="mx-auto max-w-2xl rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 p-6 shadow-card">
        {isLoading || !categories ? (
          <LoadingState />
        ) : (
          <TicketForm
            categories={categories}
            submitLabel="Submit Ticket"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/tickets')}
          />
        )}
      </div>
    </AppShell>
  )
}
