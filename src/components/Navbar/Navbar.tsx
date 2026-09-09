import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { RoleBadge } from '@/components/common/Badge'

export function Navbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  if (!user) return null

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-[15px] font-semibold text-ink-900">{title}</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-ink-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-xs font-semibold text-white">
            {user.fullName
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-ink-900">{user.fullName}</p>
          </div>
          <ChevronDown size={14} className="text-ink-400" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-ink-100 bg-white p-2 shadow-card">
              <div className="border-b border-ink-100 px-2 pb-2 mb-1">
                <p className="text-sm font-medium text-ink-900">{user.fullName}</p>
                <p className="text-xs text-ink-400 truncate">{user.email}</p>
                <div className="mt-1.5">
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/profile')
                }}
                className="w-full rounded px-2 py-1.5 text-left text-sm text-ink-600 hover:bg-ink-100"
              >
                My Profile
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-signal-rose hover:bg-signal-rose/10"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
