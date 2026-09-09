import { useState, type ReactNode } from 'react'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { Navbar } from '@/components/Navbar/Navbar'

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar open={sidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={title} onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
