import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, ChevronDown, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { RoleBadge } from '@/components/common/Badge'

export function Navbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  if (!user) return null

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 dark:border-ink-700 bg-white/95 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-900/95 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-2 text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-800 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-[15px] font-semibold text-ink-900 dark:text-ink-50 dark:text-ink-50">{title}</h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="rounded p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-800"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-ink-100 dark:hover:bg-ink-800 dark:hover:bg-ink-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-xs font-semibold text-white dark:bg-ink-700">
              {user.fullName
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-ink-900 dark:text-ink-50 dark:text-ink-50">{user.fullName}</p>
            </div>
            <ChevronDown size={14} className="text-ink-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-ink-100 dark:border-ink-700 bg-white p-2 shadow-card dark:border-ink-700 dark:bg-ink-900">
                <div className="mb-1 border-b border-ink-100 dark:border-ink-700 px-2 pb-2 dark:border-ink-700">
                  <p className="text-sm font-medium text-ink-900 dark:text-ink-50 dark:text-ink-50">{user.fullName}</p>
                  <p className="truncate text-xs text-ink-400">{user.email}</p>
                  <div className="mt-1.5">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/profile')
                  }}
                  className="w-full rounded px-2 py-1.5 text-left text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-800"
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
      </div>
    </header>
  )
}
