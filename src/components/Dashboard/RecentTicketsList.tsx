import { useNavigate } from 'react-router-dom'
import type { Ticket } from '@/types/ticket'
import { StatusBadge, PriorityBadge } from '@/components/common/Badge'
import { EmptyState } from '@/components/common/States'

export function RecentTicketsList({ tickets, title }: { tickets: Ticket[]; title: string }) {
  const navigate = useNavigate()
  return (
    <div className="rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-card">
      <div className="border-b border-ink-100 dark:border-ink-700 px-4 py-3">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">{title}</h3>
      </div>
      {tickets.length === 0 ? (
        <div className="p-4">
          <EmptyState title="Nothing here yet" description="Tickets will show up as they come in." />
        </div>
      ) : (
        <ul className="divide-y divide-ink-100 dark:divide-ink-700">
          {tickets.slice(0, 6).map((t) => (
            <li
              key={t.id}
              onClick={() => navigate(`/tickets/${t.id}`)}
              className="flex cursor-pointer flex-col gap-2 px-4 py-3 hover:bg-ink-50 dark:hover:bg-ink-800 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">{t.subject}</p>
                <p className="text-xs text-ink-400">
                  {t.id} · {t.createdByName}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:flex-none">
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
