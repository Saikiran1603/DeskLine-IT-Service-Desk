import { useMemo, useState } from 'react'
import type { Priority, Status, Ticket } from '@/types/ticket'

export type SortOption = 'newest' | 'oldest' | 'priority' | 'updated'

const PRIORITY_RANK: Record<Priority, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 }

export function useTicketFilters(tickets: Ticket[]) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [priority, setPriority] = useState<Priority | 'all'>('all')
  const [category, setCategory] = useState<string | 'all'>('all')
  const [agentId, setAgentId] = useState<string | 'all'>('all')
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const filtered = useMemo(() => {
    let result = [...tickets]
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.createdByName.toLowerCase().includes(q) ||
          (t.assignedAgentName ?? '').toLowerCase().includes(q),
      )
    }
    if (status !== 'all') result = result.filter((t) => t.status === status)
    if (priority !== 'all') result = result.filter((t) => t.priority === priority)
    if (category !== 'all') result = result.filter((t) => t.category === category)
    if (agentId !== 'all') result = result.filter((t) => t.assignedAgentId === agentId)

    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdDate.localeCompare(a.createdDate))
        break
      case 'oldest':
        result.sort((a, b) => a.createdDate.localeCompare(b.createdDate))
        break
      case 'priority':
        result.sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority])
        break
      case 'updated':
        result.sort((a, b) => b.updatedDate.localeCompare(a.updatedDate))
        break
    }
    return result
  }, [tickets, search, status, priority, category, agentId, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return {
    search, setSearch: (v: string) => { setSearch(v); setPage(1) },
    status, setStatus: (v: Status | 'all') => { setStatus(v); setPage(1) },
    priority, setPriority: (v: Priority | 'all') => { setPriority(v); setPage(1) },
    category, setCategory: (v: string | 'all') => { setCategory(v); setPage(1) },
    agentId, setAgentId: (v: string | 'all') => { setAgentId(v); setPage(1) },
    sort, setSort,
    page, setPage, totalPages, pageSize,
    results: paged,
    totalResults: filtered.length,
  }
}
