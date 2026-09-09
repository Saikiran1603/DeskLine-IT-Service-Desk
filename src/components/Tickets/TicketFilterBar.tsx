import { Search } from 'lucide-react'
import type { Priority, Status } from '@/types/ticket'
import type { Category } from '@/types/category'
import type { User } from '@/types/user'
import type { SortOption } from '@/hooks/useTicketFilters'

const STATUSES: Status[] = ['Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Cancelled']
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical']

interface FilterBarProps {
  search: string
  onSearch: (v: string) => void
  status: Status | 'all'
  onStatus: (v: Status | 'all') => void
  priority: Priority | 'all'
  onPriority: (v: Priority | 'all') => void
  category: string | 'all'
  onCategory: (v: string | 'all') => void
  agentId: string | 'all'
  onAgent: (v: string | 'all') => void
  sort: SortOption
  onSort: (v: SortOption) => void
  categories: Category[]
  agents: User[]
  showAgentFilter: boolean
}

const selectClass = 'rounded border border-ink-200 bg-white px-2.5 py-2 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-signal-teal/40'

export function TicketFilterBar(props: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300" />
        <input
          value={props.search}
          onChange={(e) => props.onSearch(e.target.value)}
          placeholder="Search by ID, subject, requester, agent…"
          className="w-full rounded border border-ink-200 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-signal-teal/40"
        />
      </div>

      <select className={selectClass} value={props.status} onChange={(e) => props.onStatus(e.target.value as Status | 'all')}>
        <option value="all">All statuses</option>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select className={selectClass} value={props.priority} onChange={(e) => props.onPriority(e.target.value as Priority | 'all')}>
        <option value="all">All priorities</option>
        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>

      <select className={selectClass} value={props.category} onChange={(e) => props.onCategory(e.target.value)}>
        <option value="all">All categories</option>
        {props.categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
      </select>

      {props.showAgentFilter && (
        <select className={selectClass} value={props.agentId} onChange={(e) => props.onAgent(e.target.value)}>
          <option value="all">All agents</option>
          {props.agents.map((a) => <option key={a.id} value={a.id}>{a.fullName}</option>)}
        </select>
      )}

      <select className={selectClass} value={props.sort} onChange={(e) => props.onSort(e.target.value as SortOption)}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priority">Highest priority</option>
        <option value="updated">Recently updated</option>
      </select>
    </div>
  )
}
