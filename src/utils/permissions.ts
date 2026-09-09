import type { Role } from '@/types/user'
import type { Status, Ticket } from '@/types/ticket'
import type { User } from '@/types/user'

export const permissions = {
  canViewAllTickets: (role: Role) => role === 'admin',
  canCreateTicket: (_role: Role) => true,
  canDeleteTicket: (role: Role) => role === 'admin',
  canAssignTicket: (role: Role) => role === 'admin',
  canManageUsers: (role: Role) => role === 'admin',
  canManageCategories: (role: Role) => role === 'admin',
  canViewReports: (role: Role) => role === 'admin',
  canAddResolution: (role: Role) => role === 'admin' || role === 'agent',

  canViewTicket(user: User, ticket: Ticket): boolean {
    if (user.role === 'admin') return true
    if (user.role === 'agent') return ticket.assignedAgentId === user.id
    return ticket.createdBy === user.id
  },

  canEditTicket(user: User, ticket: Ticket): boolean {
    if (user.role === 'admin') return true
    if (user.role === 'agent') return ticket.assignedAgentId === user.id
    return ticket.createdBy === user.id && ticket.status === 'Open'
  },

  canComment(user: User, ticket: Ticket): boolean {
    return this.canViewTicket(user, ticket)
  },

  /** Returns the set of status transitions a role may perform on a ticket right now. */
  availableStatusActions(user: User, ticket: Ticket): { label: string; next: Status }[] {
    const actions: { label: string; next: Status }[] = []
    const isOwner = ticket.createdBy === user.id
    const isAssignedAgent = ticket.assignedAgentId === user.id

    if (user.role === 'admin') {
      const all: Record<Status, Status[]> = {
        Open: ['Assigned', 'Cancelled'],
        Assigned: ['In Progress', 'Cancelled'],
        'In Progress': ['Pending', 'Resolved'],
        Pending: ['In Progress', 'Resolved'],
        Resolved: ['Closed'],
        Closed: [],
        Cancelled: [],
      }
      all[ticket.status].forEach((next) => actions.push({ label: next, next }))
      if (ticket.status === 'Resolved') actions.push({ label: 'Reopen', next: 'In Progress' })
      return actions
    }

    if (user.role === 'agent' && isAssignedAgent) {
      if (ticket.status === 'Assigned') actions.push({ label: 'Start Progress', next: 'In Progress' })
      if (ticket.status === 'In Progress') {
        actions.push({ label: 'Mark Pending', next: 'Pending' })
        actions.push({ label: 'Resolve', next: 'Resolved' })
      }
      if (ticket.status === 'Pending') actions.push({ label: 'Resume Progress', next: 'In Progress' })
      if (ticket.status === 'Resolved') actions.push({ label: 'Close', next: 'Closed' })
      return actions
    }

    if (user.role === 'employee' && isOwner) {
      if (ticket.status === 'Open') actions.push({ label: 'Cancel', next: 'Cancelled' })
      if (ticket.status === 'Resolved') actions.push({ label: 'Reopen', next: 'In Progress' })
      return actions
    }

    return actions
  },

  canChangePriority(user: User, ticket: Ticket): boolean {
    if (user.role === 'admin') return true
    if (user.role === 'agent') return ticket.assignedAgentId === user.id
    return false
  },
}
