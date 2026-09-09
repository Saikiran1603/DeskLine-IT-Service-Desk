import { useNavigate } from 'react-router-dom'
import type { Ticket } from '@/types/ticket'
import { StatusBadge, PriorityBadge } from '@/components/common/Badge'
import { EmptyState } from '@/components/common/States'

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  const navigate = useNavigate()

  if (tickets.length === 0) {
    return (
      <EmptyState
        title="No tickets match your filters"
        description="Try adjusting your search or filters, or create a new ticket."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
            <th className="px-4 py-3 font-medium">Ticket</th>
            <th className="px-4 py-3 font-medium">Requester</th>
            <th className="px-4 py-3 font-medium">Agent</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {tickets.map((t) => (
            <tr
              key={t.id}
              onClick={() => navigate(`/tickets/${t.id}`)}
              className="cursor-pointer hover:bg-ink-50"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-ink-900">{t.subject}</p>
                <p className="text-xs text-ink-400">{t.id}</p>
              </td>
              <td className="px-4 py-3 text-ink-600">{t.createdByName}</td>
              <td className="px-4 py-3 text-ink-600">{t.assignedAgentName ?? '—'}</td>
              <td className="px-4 py-3 text-ink-600">{t.category}</td>
              <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
              <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
              <td className="px-4 py-3 text-ink-400">
                {new Date(t.updatedDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
