export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export type Status =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Pending'
  | 'Resolved'
  | 'Closed'
  | 'Cancelled'

export type ContactMethod = 'Email' | 'Phone' | 'Chat'

export interface ActivityEntry {
  id: string
  timestamp: string
  actorName: string
  actorRole: string
  message: string
}

export interface Ticket {
  id: string
  subject: string
  description: string
  createdBy: string // user id
  createdByName: string
  assignedAgentId: string | null
  assignedAgentName: string | null
  category: string
  priority: Priority
  status: Status
  contactMethod: ContactMethod
  createdDate: string
  updatedDate: string
  dueDate: string | null
  resolution: string | null
  resolutionNotes: string | null
  resolutionDate: string | null
  activity: ActivityEntry[]
}

export type NewTicket = Pick<
  Ticket,
  'subject' | 'description' | 'category' | 'priority' | 'contactMethod'
>
