import { useNavigate } from 'react-router-dom'
import type { Ticket } from '@/types/ticket'
import { StatusBadge, PriorityBadge } from '@/components/common/Badge'
import { EmptyState } from '@/components/common/States'

export function RecentTicketsList({ tickets, title }: { tickets: Ticket[]; title: string }) {
  const navigate = useNavigate()
  return (
    <div className="rounded-md border border-ink-100 bg-white shadow-card">
      <div className="border-b border-ink-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      </div>
      {tickets.length === 0 ? (
        <div className="p-4">
          <EmptyState title="Nothing here yet" description="Tickets will show up as they come in." />
        </div>
      ) : (
        <ul className="divide-y divide-ink-100">
          {tickets.slice(0, 6).map((t) => (
            <li
              key={t.id}
              onClick={() => navigate(`/tickets/${t.id}`)}
              className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-ink-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900">{t.subject}</p>
                <p className="text-xs text-ink-400">
                  {t.id} · {t.createdByName}
                </p>
              </div>
              <div className="flex flex-none items-center gap-2">
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
