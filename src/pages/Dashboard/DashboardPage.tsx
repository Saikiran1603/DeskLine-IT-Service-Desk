import {
  Inbox, UserCheck, Loader2, Clock, CheckCircle2, Archive, AlertOctagon, HelpCircle, Flame,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { AppShell } from '@/components/common/AppShell'
import { StatCard } from '@/components/Dashboard/StatCard'
import { RecentTicketsList } from '@/components/Dashboard/RecentTicketsList'
import { LoadingState, ErrorState } from '@/components/common/States'
import { useAsync } from '@/hooks/useAsync'
import { ticketService } from '@/services/ticketService'
import type { Ticket } from '@/types/ticket'

function count(tickets: Ticket[], pred: (t: Ticket) => boolean) {
  return tickets.filter(pred).length
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: tickets, isLoading, error, refetch } = useAsync(() => ticketService.getAll(), [])

  if (isLoading) return <AppShell title="Dashboard"><LoadingState label="Loading dashboard…" /></AppShell>
  if (error) return <AppShell title="Dashboard"><ErrorState message={error} onRetry={refetch} /></AppShell>
  if (!user || !tickets) return null

  if (user.role === 'admin') {
    const stats = [
      { label: 'Total Tickets', value: tickets.length, icon: Inbox, tone: 'default' as const },
      { label: 'Open', value: count(tickets, (t) => t.status === 'Open'), icon: HelpCircle, tone: 'default' as const },
      { label: 'Assigned', value: count(tickets, (t) => t.status === 'Assigned'), icon: UserCheck, tone: 'violet' as const },
      { label: 'In Progress', value: count(tickets, (t) => t.status === 'In Progress'), icon: Loader2, tone: 'teal' as const },
      { label: 'Pending', value: count(tickets, (t) => t.status === 'Pending'), icon: Clock, tone: 'amber' as const },
      { label: 'Resolved', value: count(tickets, (t) => t.status === 'Resolved'), icon: CheckCircle2, tone: 'moss' as const },
      { label: 'Closed', value: count(tickets, (t) => t.status === 'Closed'), icon: Archive, tone: 'default' as const },
      { label: 'Critical', value: count(tickets, (t) => t.priority === 'Critical'), icon: Flame, tone: 'rose' as const },
      { label: 'Unassigned', value: count(tickets, (t) => !t.assignedAgentId && t.status !== 'Cancelled' && t.status !== 'Closed'), icon: AlertOctagon, tone: 'rose' as const },
    ]
    return (
      <AppShell title="Admin Dashboard">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <RecentTicketsList title="Unassigned Tickets" tickets={tickets.filter((t) => !t.assignedAgentId && t.status !== 'Cancelled' && t.status !== 'Closed')} />
          <RecentTicketsList title="Critical Tickets" tickets={tickets.filter((t) => t.priority === 'Critical')} />
        </div>
      </AppShell>
    )
  }

  if (user.role === 'agent') {
    const mine = tickets.filter((t) => t.assignedAgentId === user.id)
    const stats = [
      { label: 'My Assigned Tickets', value: mine.length, icon: Inbox, tone: 'default' as const },
      { label: 'New', value: count(mine, (t) => t.status === 'Assigned'), icon: UserCheck, tone: 'violet' as const },
      { label: 'In Progress', value: count(mine, (t) => t.status === 'In Progress'), icon: Loader2, tone: 'teal' as const },
      { label: 'Pending', value: count(mine, (t) => t.status === 'Pending'), icon: Clock, tone: 'amber' as const },
      { label: 'Resolved', value: count(mine, (t) => t.status === 'Resolved'), icon: CheckCircle2, tone: 'moss' as const },
      { label: 'High Priority', value: count(mine, (t) => t.priority === 'High' || t.priority === 'Critical'), icon: Flame, tone: 'rose' as const },
    ]
    return (
      <AppShell title="Support Agent Dashboard">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
        <div className="mt-6">
          <RecentTicketsList title="My Assigned Tickets" tickets={mine} />
        </div>
      </AppShell>
    )
  }

  // employee
  const mine = tickets.filter((t) => t.createdBy === user.id)
  const stats = [
    { label: 'My Total Tickets', value: mine.length, icon: Inbox, tone: 'default' as const },
    { label: 'Open', value: count(mine, (t) => t.status === 'Open'), icon: HelpCircle, tone: 'default' as const },
    { label: 'In Progress', value: count(mine, (t) => t.status === 'In Progress' || t.status === 'Assigned'), icon: Loader2, tone: 'teal' as const },
    { label: 'Resolved', value: count(mine, (t) => t.status === 'Resolved'), icon: CheckCircle2, tone: 'moss' as const },
    { label: 'Closed', value: count(mine, (t) => t.status === 'Closed'), icon: Archive, tone: 'default' as const },
  ]
  return (
    <AppShell title="My Dashboard">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="mt-6">
        <RecentTicketsList title="My Tickets" tickets={mine} />
      </div>
    </AppShell>
  )
}
