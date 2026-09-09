import { AppShell } from '@/components/common/AppShell'
import { useAsync } from '@/hooks/useAsync'
import { ticketService } from '@/services/ticketService'
import { userService } from '@/services/userService'
import { LoadingState, ErrorState } from '@/components/common/States'
import type { Priority, Status, Ticket } from '@/types/ticket'

function groupCount<K extends string>(tickets: Ticket[], key: (t: Ticket) => K): Record<string, number> {
  return tickets.reduce((acc, t) => {
    const k = key(t)
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="mb-2.5">
      <div className="mb-1 flex justify-between text-xs text-ink-500">
        <span>{label}</span>
        <span className="font-medium text-ink-800">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-700">
        <div className="h-2 rounded-full bg-signal-teal" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const { data: tickets, isLoading, error, refetch } = useAsync(() => ticketService.getAll(), [])
  const { data: users } = useAsync(() => userService.getAll(), [])

  if (isLoading) return <AppShell title="Reports"><LoadingState label="Crunching numbers…" /></AppShell>
  if (error || !tickets) return <AppShell title="Reports"><ErrorState message={error ?? 'Failed to load report data.'} onRetry={refetch} /></AppShell>

  const byStatus = groupCount<Status>(tickets, (t) => t.status)
  const byPriority = groupCount<Priority>(tickets, (t) => t.priority)
  const byCategory = groupCount(tickets, (t) => t.category)

  const agentLoad = (users ?? [])
    .filter((u) => u.role === 'agent')
    .map((a) => ({ name: a.fullName, count: tickets.filter((t) => t.assignedAgentId === a.id).length }))
    .sort((a, b) => b.count - a.count)

  const maxStatus = Math.max(1, ...Object.values(byStatus))
  const maxPriority = Math.max(1, ...Object.values(byPriority))
  const maxCategory = Math.max(1, ...Object.values(byCategory))
  const maxAgent = Math.max(1, ...agentLoad.map((a) => a.count))

  return (
    <AppShell title="Reports">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Tickets by Status</h3>
          {Object.entries(byStatus).map(([k, v]) => <Bar key={k} label={k} value={v} max={maxStatus} />)}
        </div>
        <div className="rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Tickets by Priority</h3>
          {Object.entries(byPriority).map(([k, v]) => <Bar key={k} label={k} value={v} max={maxPriority} />)}
        </div>
        <div className="rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Tickets by Category</h3>
          {Object.entries(byCategory).map(([k, v]) => <Bar key={k} label={k} value={v} max={maxCategory} />)}
        </div>
        <div className="rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Agent Workload</h3>
          {agentLoad.length === 0 ? (
            <p className="text-sm text-ink-400">No support agents yet.</p>
          ) : (
            agentLoad.map((a) => <Bar key={a.name} label={a.name} value={a.count} max={maxAgent} />)
          )}
        </div>
      </div>
    </AppShell>
  )
}
