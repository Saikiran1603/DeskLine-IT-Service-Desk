import type { Priority, Status } from '@/types/ticket'
import type { Role, UserStatus } from '@/types/user'

const STATUS_STYLES: Record<Status, string> = {
  Open: 'bg-ink-100 text-ink-700 border-ink-200',
  Assigned: 'bg-signal-violet/10 text-signal-violet border-signal-violet/30',
  'In Progress': 'bg-signal-teal/10 text-signal-tealDark border-signal-teal/30',
  Pending: 'bg-signal-amber/10 text-signal-amber border-signal-amber/30',
  Resolved: 'bg-signal-moss/10 text-signal-moss border-signal-moss/30',
  Closed: 'bg-ink-200 text-ink-600 border-ink-300',
  Cancelled: 'bg-signal-rose/10 text-signal-rose border-signal-rose/30',
}

const PRIORITY_STYLES: Record<Priority, string> = {
  Low: 'bg-ink-100 text-ink-600 border-ink-200',
  Medium: 'bg-signal-teal/10 text-signal-tealDark border-signal-teal/30',
  High: 'bg-signal-amber/10 text-signal-amber border-signal-amber/30',
  Critical: 'bg-signal-rose/10 text-signal-rose border-signal-rose/30',
}

const ROLE_STYLES: Record<Role, string> = {
  admin: 'bg-ink-900 text-white border-ink-900',
  agent: 'bg-signal-teal text-white border-signal-teal',
  employee: 'bg-ink-200 text-ink-700 border-ink-200',
}

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  agent: 'Support Agent',
  employee: 'Employee',
}

const USER_STATUS_STYLES: Record<UserStatus, string> = {
  active: 'bg-signal-moss/10 text-signal-moss border-signal-moss/30',
  inactive: 'bg-ink-200 text-ink-500 border-ink-300',
}

function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  return <Chip className={STATUS_STYLES[status]}>{status}</Chip>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Chip className={PRIORITY_STYLES[priority]}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: 'currentColor' }}
        aria-hidden
      />
      {priority}
    </Chip>
  )
}

export function RoleBadge({ role }: { role: Role }) {
  return <Chip className={ROLE_STYLES[role]}>{ROLE_LABELS[role]}</Chip>
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Chip className={USER_STATUS_STYLES[status]}>{status === 'active' ? 'Active' : 'Inactive'}</Chip>
}
