import { api } from './api'
import type { ActivityEntry, NewTicket, Status, Ticket } from '@/types/ticket'
import type { User } from '@/types/user'

function nowIso() {
  return new Date().toISOString()
}

function makeActivity(actor: User, message: string): ActivityEntry {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: nowIso(),
    actorName: actor.fullName,
    actorRole: actor.role,
    message,
  }
}

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    const { data } = await api.get<Ticket[]>('/tickets', {
      params: { _sort: 'createdDate', _order: 'desc' },
    })
    return data
  },

  async getById(id: string): Promise<Ticket> {
    const { data } = await api.get<Ticket>(`/tickets/${id}`)
    return data
  },

  async create(input: NewTicket, creator: User): Promise<Ticket> {
    const timestamp = nowIso()
    const payload: Omit<Ticket, 'id'> = {
      ...input,
      createdBy: creator.id,
      createdByName: creator.fullName,
      assignedAgentId: null,
      assignedAgentName: null,
      status: 'Open',
      createdDate: timestamp,
      updatedDate: timestamp,
      dueDate: null,
      resolution: null,
      resolutionNotes: null,
      resolutionDate: null,
      activity: [
        {
          id: `act-${Date.now()}`,
          timestamp,
          actorName: creator.fullName,
          actorRole: creator.role,
          message: 'Ticket created',
        },
      ],
    }
    const { data } = await api.post<Ticket>('/tickets', payload)
    return data
  },

  async update(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    const { data } = await api.patch<Ticket>(`/tickets/${id}`, {
      ...updates,
      updatedDate: nowIso(),
    })
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/tickets/${id}`)
  },

  async addActivity(ticket: Ticket, actor: User, message: string): Promise<Ticket> {
    const entry = makeActivity(actor, message)
    return this.update(ticket.id, { activity: [...ticket.activity, entry] })
  },

  async changeStatus(ticket: Ticket, actor: User, newStatus: Status): Promise<Ticket> {
    const entry = makeActivity(actor, `Status changed to ${newStatus}`)
    return this.update(ticket.id, {
      status: newStatus,
      activity: [...ticket.activity, entry],
    })
  },

  async changePriority(ticket: Ticket, actor: User, priority: Ticket['priority']): Promise<Ticket> {
    const entry = makeActivity(actor, `Priority changed to ${priority}`)
    return this.update(ticket.id, { priority, activity: [...ticket.activity, entry] })
  },

  async assign(ticket: Ticket, actor: User, agent: User): Promise<Ticket> {
    const wasAssigned = Boolean(ticket.assignedAgentId)
    const entry = makeActivity(
      actor,
      wasAssigned ? `Reassigned to ${agent.fullName}` : `Assigned to ${agent.fullName}`,
    )
    return this.update(ticket.id, {
      assignedAgentId: agent.id,
      assignedAgentName: agent.fullName,
      status: ticket.status === 'Open' ? 'Assigned' : ticket.status,
      activity: [...ticket.activity, entry],
    })
  },

  async unassign(ticket: Ticket, actor: User): Promise<Ticket> {
    const entry = makeActivity(actor, `Unassigned from ${ticket.assignedAgentName ?? 'agent'}`)
    return this.update(ticket.id, {
      assignedAgentId: null,
      assignedAgentName: null,
      status: 'Open',
      activity: [...ticket.activity, entry],
    })
  },

  async resolve(
    ticket: Ticket,
    actor: User,
    resolution: string,
    resolutionNotes: string,
  ): Promise<Ticket> {
    const timestamp = nowIso()
    const entry = makeActivity(actor, 'Resolution added — ticket resolved')
    return this.update(ticket.id, {
      status: 'Resolved',
      resolution,
      resolutionNotes,
      resolutionDate: timestamp,
      activity: [...ticket.activity, entry],
    })
  },

  async close(ticket: Ticket, actor: User): Promise<Ticket> {
    const entry = makeActivity(actor, 'Ticket closed')
    return this.update(ticket.id, { status: 'Closed', activity: [...ticket.activity, entry] })
  },

  async cancel(ticket: Ticket, actor: User): Promise<Ticket> {
    const entry = makeActivity(actor, 'Ticket cancelled')
    return this.update(ticket.id, { status: 'Cancelled', activity: [...ticket.activity, entry] })
  },

  async reopen(ticket: Ticket, actor: User): Promise<Ticket> {
    const entry = makeActivity(actor, 'Ticket reopened')
    return this.update(ticket.id, {
      status: 'In Progress',
      activity: [...ticket.activity, entry],
    })
  },
}
