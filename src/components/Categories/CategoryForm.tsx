import { useState, type FormEvent } from 'react'
import type { NewCategory } from '@/types/category'
import { TextField, TextAreaField } from '@/components/common/FormField'
import { Button } from '@/components/common/Button'

interface CategoryFormProps {
  initial?: Partial<NewCategory>
  submitLabel: string
  onSubmit: (data: NewCategory) => Promise<void>
  onCancel: () => void
}

export function CategoryForm({ initial, submitLabel, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Category name is required.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), status: initial?.status ?? 'active' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField label="Category Name" value={name} onChange={(e) => setName(e.target.value)} error={error} required />
      <TextAreaField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</Button>
      </div>
    </form>
  )
}
