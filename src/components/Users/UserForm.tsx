import { useState, type FormEvent } from 'react'
import type { NewUser, Role } from '@/types/user'
import { TextField, SelectField } from '@/components/common/FormField'
import { Button } from '@/components/common/Button'

interface UserFormProps {
  initial?: Partial<NewUser>
  submitLabel: string
  onSubmit: (data: NewUser) => Promise<void>
  onCancel: () => void
}

const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'agent', label: 'Support Agent' },
  { value: 'employee', label: 'Employee' },
]

export function UserForm({ initial, submitLabel, onSubmit, onCancel }: UserFormProps) {
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [password, setPassword] = useState(initial?.password ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [department, setDepartment] = useState(initial?.department ?? '')
  const [role, setRole] = useState<Role | ''>(initial?.role ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = 'Full name is required.'
    if (!email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.'
    if (!password || password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (!phone.trim()) next.phone = 'Phone number is required.'
    else if (!/^[0-9+\-() ]{7,}$/.test(phone)) next.phone = 'Enter a valid phone number.'
    if (!department.trim()) next.department = 'Department is required.'
    if (!role) next.role = 'Please select a role.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        department: department.trim(),
        role: role as Role,
        status: initial?.status ?? 'active',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} required />
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
      <TextField label="Password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} hint="Minimum 6 characters." required />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} required />
        <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} error={errors.department} required />
      </div>
      <SelectField
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        error={errors.role}
        placeholder="Select a role"
        options={ROLES}
        required
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</Button>
      </div>
    </form>
  )
}
