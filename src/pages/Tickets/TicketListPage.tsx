import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { AppShell } from '@/components/common/AppShell'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { useTicketFilters } from '@/hooks/useTicketFilters'
import { ticketService } from '@/services/ticketService'
import { categoryService } from '@/services/categoryService'
import { userService } from '@/services/userService'
import { LoadingState, ErrorState } from '@/components/common/States'
import { TicketFilterBar } from '@/components/Tickets/TicketFilterBar'
import { TicketTable } from '@/components/Tickets/TicketTable'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/common/Button'
import { permissions } from '@/utils/permissions'

export default function TicketListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: allTickets, isLoading: loadingTickets, error, refetch } = useAsync(() => ticketService.getAll(), [])
  const { data: categories } = useAsync(() => categoryService.getAll(), [])
  const { data: users } = useAsync(() => userService.getAll(), [])

  const scopedTickets = useMemo(() => {
    if (!allTickets || !user) return []
    if (user.role === 'admin') return allTickets
    if (user.role === 'agent') return allTickets.filter((t) => t.assignedAgentId === user.id)
    return allTickets.filter((t) => t.createdBy === user.id)
  }, [allTickets, user])

  const f = useTicketFilters(scopedTickets)
  const agents = useMemo(() => (users ?? []).filter((u) => u.role === 'agent'), [users])

  if (loadingTickets) return <AppShell title="Tickets"><LoadingState label="Loading tickets…" /></AppShell>
  if (error) return <AppShell title="Tickets"><ErrorState message={error} onRetry={refetch} /></AppShell>
  if (!user) return null

  const pageTitle = user.role === 'admin' ? 'All Tickets' : 'My Tickets'

  return (
    <AppShell title={pageTitle}>
      <div className="rounded-md border border-ink-100 bg-white shadow-card">
        <div className="flex items-center justify-between gap-3 p-4 pb-0">
          <p className="text-sm text-ink-400">{f.totalResults} ticket{f.totalResults !== 1 ? 's' : ''}</p>
          {permissions.canCreateTicket(user.role) && (
            <Button variant="primary" size="sm" onClick={() => navigate('/tickets/new')}>
              <Plus size={15} /> Create Ticket
            </Button>
          )}
        </div>
        <TicketFilterBar
          search={f.search} onSearch={f.setSearch}
          status={f.status} onStatus={f.setStatus}
          priority={f.priority} onPriority={f.setPriority}
          category={f.category} onCategory={f.setCategory}
          agentId={f.agentId} onAgent={f.setAgentId}
          sort={f.sort} onSort={f.setSort}
          categories={categories ?? []}
          agents={agents}
          showAgentFilter={user.role === 'admin'}
        />
        <TicketTable tickets={f.results} />
        <Pagination page={f.page} totalPages={f.totalPages} onChange={f.setPage} totalItems={f.totalResults} pageSize={f.pageSize} />
      </div>
    </AppShell>
  )
}
