import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Power, Search } from 'lucide-react'
import { AppShell } from '@/components/common/AppShell'
import { useAsync } from '@/hooks/useAsync'
import { userService } from '@/services/userService'
import { useToast } from '@/context/ToastContext'
import { LoadingState, ErrorState, EmptyState } from '@/components/common/States'
import { RoleBadge, UserStatusBadge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { UserForm } from '@/components/Users/UserForm'
import type { NewUser, User } from '@/types/user'

export default function UsersPage() {
  const { data: users, isLoading, error, refetch, setData } = useAsync(() => userService.getAll(), [])
  const { show } = useToast()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<User | null>(null)

  const filtered = useMemo(() => {
    if (!users) return []
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q),
    )
  }, [users, search])

  if (isLoading) return <AppShell title="Users"><LoadingState label="Loading users…" /></AppShell>
  if (error || !users) return <AppShell title="Users"><ErrorState message={error ?? 'Failed to load users.'} onRetry={refetch} /></AppShell>

  async function handleCreate(data: NewUser) {
    const created = await userService.create(data)
    setData([created, ...users!])
    setShowForm(false)
    show('User created successfully.')
  }

  async function handleUpdate(data: NewUser) {
    if (!editing) return
    const updated = await userService.update(editing.id, data)
    setData(users!.map((u) => (u.id === updated.id ? updated : u)))
    setEditing(null)
    show('User updated successfully.')
  }

  async function toggleStatus(u: User) {
    const updated = await userService.setStatus(u.id, u.status === 'active' ? 'inactive' : 'active')
    setData(users!.map((x) => (x.id === updated.id ? updated : x)))
    show(`User ${updated.status === 'active' ? 'activated' : 'deactivated'}.`)
  }

  async function handleDelete() {
    if (!deleting) return
    await userService.remove(deleting.id)
    setData(users!.filter((u) => u.id !== deleting.id))
    show('User deleted.')
  }

  return (
    <AppShell title="User Management">
      <div className="rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="relative w-full max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="w-full rounded border border-ink-200 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-signal-teal/40 dark:bg-ink-800 dark:border-ink-600 dark:text-ink-50 dark:placeholder:text-ink-500"
            />
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus size={15} /> Add User
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="p-4"><EmptyState title="No users found" description="Try a different search, or add a new user." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-ink-100 dark:border-ink-700 text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-ink-900 dark:text-ink-50">{u.fullName}</td>
                    <td className="px-4 py-3 text-ink-600 dark:text-ink-300">{u.email}</td>
                    <td className="px-4 py-3 text-ink-600 dark:text-ink-300">{u.department}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3"><UserStatusBadge status={u.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => toggleStatus(u)} title="Toggle status" className="rounded p-1.5 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800">
                          <Power size={15} />
                        </button>
                        <button onClick={() => setEditing(u)} title="Edit" className="rounded p-1.5 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleting(u)} title="Delete" className="rounded p-1.5 text-signal-rose hover:bg-signal-rose/10">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <Modal title="Add User" onClose={() => setShowForm(false)}>
          <UserForm submitLabel="Create User" onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          <UserForm initial={editing} submitLabel="Save Changes" onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {deleting && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${deleting.fullName}? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </AppShell>
  )
}
