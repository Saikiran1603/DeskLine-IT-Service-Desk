import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  Users,
  Tags,
  BarChart3,
  UserCircle,
  PlusCircle,
  Router as RouterIcon,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number }>
}

export function Sidebar({ open }: { open: boolean }) {
  const { user } = useAuth()
  if (!user) return null

  const itemsByRole: Record<string, NavItem[]> = {
    admin: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/tickets', label: 'Tickets', icon: TicketIcon },
      { to: '/users', label: 'Users', icon: Users },
      { to: '/categories', label: 'Categories', icon: Tags },
      { to: '/reports', label: 'Reports', icon: BarChart3 },
      { to: '/profile', label: 'Profile', icon: UserCircle },
    ],
    agent: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/tickets', label: 'My Tickets', icon: TicketIcon },
      { to: '/profile', label: 'Profile', icon: UserCircle },
    ],
    employee: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/tickets/new', label: 'Create Ticket', icon: PlusCircle },
      { to: '/tickets', label: 'My Tickets', icon: TicketIcon },
      { to: '/profile', label: 'Profile', icon: UserCircle },
    ],
  }

  const items = itemsByRole[user.role] ?? []

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-60 flex-none border-r border-ink-100 bg-white transition-transform lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-ink-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-ink-900 text-white">
          <RouterIcon size={16} />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-ink-900">DeskLine</span>
      </div>
      <nav className="flex flex-col gap-0.5 p-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/tickets'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
