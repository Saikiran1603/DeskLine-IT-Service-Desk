import { useState } from 'react'
import { Plus, Pencil, Trash2, Power } from 'lucide-react'
import { AppShell } from '@/components/common/AppShell'
import { useAsync } from '@/hooks/useAsync'
import { categoryService } from '@/services/categoryService'
import { useToast } from '@/context/ToastContext'
import { LoadingState, ErrorState, EmptyState } from '@/components/common/States'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { CategoryForm } from '@/components/Categories/CategoryForm'
import type { Category, NewCategory } from '@/types/category'

export default function CategoriesPage() {
  const { data: categories, isLoading, error, refetch, setData } = useAsync(() => categoryService.getAll(), [])
  const { show } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  if (isLoading) return <AppShell title="Categories"><LoadingState label="Loading categories…" /></AppShell>
  if (error || !categories) return <AppShell title="Categories"><ErrorState message={error ?? 'Failed to load categories.'} onRetry={refetch} /></AppShell>

  async function handleCreate(data: NewCategory) {
    const created = await categoryService.create(data)
    setData([...categories!, created])
    setShowForm(false)
    show('Category created successfully.')
  }

  async function handleUpdate(data: NewCategory) {
    if (!editing) return
    const updated = await categoryService.update(editing.id, data)
    setData(categories!.map((c) => (c.id === updated.id ? updated : c)))
    setEditing(null)
    show('Category updated successfully.')
  }

  async function toggleStatus(c: Category) {
    const updated = await categoryService.update(c.id, { status: c.status === 'active' ? 'inactive' : 'active' })
    setData(categories!.map((x) => (x.id === updated.id ? updated : x)))
    show(`Category ${updated.status === 'active' ? 'activated' : 'deactivated'}.`)
  }

  async function handleDelete() {
    if (!deleting) return
    await categoryService.remove(deleting.id)
    setData(categories!.filter((c) => c.id !== deleting.id))
    show('Category deleted.')
  }

  return (
    <AppShell title="Category Management">
      <div className="rounded-md border border-ink-100 bg-white shadow-card">
        <div className="flex items-center justify-between gap-3 p-4">
          <p className="text-sm text-ink-400">{categories.length} categories</p>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus size={15} /> Add Category
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="p-4"><EmptyState title="No categories yet" description="Add a category to start classifying tickets." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-medium text-ink-900">{c.name}</td>
                    <td className="px-4 py-3 text-ink-500">{c.description || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${c.status === 'active' ? 'border-signal-moss/30 bg-signal-moss/10 text-signal-moss' : 'border-ink-300 bg-ink-200 text-ink-500'}`}>
                        {c.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => toggleStatus(c)} title="Toggle status" className="rounded p-1.5 text-ink-500 hover:bg-ink-100">
                          <Power size={15} />
                        </button>
                        <button onClick={() => setEditing(c)} title="Edit" className="rounded p-1.5 text-ink-500 hover:bg-ink-100">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleting(c)} title="Delete" className="rounded p-1.5 text-signal-rose hover:bg-signal-rose/10">
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
        <Modal title="Add Category" onClose={() => setShowForm(false)}>
          <CategoryForm submitLabel="Create Category" onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Category" onClose={() => setEditing(null)}>
          <CategoryForm initial={editing} submitLabel="Save Changes" onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {deleting && (
        <ConfirmModal
          title="Delete Category"
          message={`Are you sure you want to delete "${deleting.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </AppShell>
  )
}
