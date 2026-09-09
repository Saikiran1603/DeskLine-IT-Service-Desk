import { useState, type FormEvent } from 'react'
import type { Category } from '@/types/category'
import type { ContactMethod, NewTicket, Priority } from '@/types/ticket'
import { TextField, TextAreaField, SelectField } from '@/components/common/FormField'
import { Button } from '@/components/common/Button'

interface TicketFormProps {
  categories: Category[]
  initial?: Partial<NewTicket>
  submitLabel: string
  onSubmit: (data: NewTicket) => Promise<void>
  onCancel: () => void
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical']
const CONTACT_METHODS: ContactMethod[] = ['Email', 'Phone', 'Chat']

export function TicketForm({ categories, initial, submitLabel, onSubmit, onCancel }: TicketFormProps) {
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [priority, setPriority] = useState<Priority | ''>(initial?.priority ?? '')
  const [contactMethod, setContactMethod] = useState<ContactMethod | ''>(initial?.contactMethod ?? 'Email')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const next: Record<string, string> = {}
    if (!subject.trim()) next.subject = 'Subject is required.'
    else if (subject.trim().length < 5) next.subject = 'Subject should be at least 5 characters.'
    if (!description.trim()) next.description = 'Description is required.'
    else if (description.trim().length < 15) next.description = 'Please describe the issue in at least 15 characters.'
    if (!category) next.category = 'Please select a category.'
    if (!priority) next.priority = 'Please select a priority.'
    if (!contactMethod) next.contactMethod = 'Please select a contact method.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit({
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority: priority as Priority,
        contactMethod: contactMethod as ContactMethod,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField
        label="Subject"
        placeholder="Short summary of the issue"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        error={errors.subject}
        required
      />
      <TextAreaField
        label="Description"
        placeholder="Describe what happened, when it started, and any error messages you saw."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          error={errors.category}
          placeholder="Select a category"
          options={categories.filter((c) => c.status === 'active').map((c) => ({ value: c.name, label: c.name }))}
          required
        />
        <SelectField
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          error={errors.priority}
          placeholder="Select a priority"
          options={PRIORITIES.map((p) => ({ value: p, label: p }))}
          required
        />
      </div>
      <SelectField
        label="Preferred Contact Method"
        value={contactMethod}
        onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
        error={errors.contactMethod}
        options={CONTACT_METHODS.map((c) => ({ value: c, label: c }))}
        required
      />

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
