import { useState, type FormEvent } from 'react'
import { AppShell } from '@/components/common/AppShell'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { userService } from '@/services/userService'
import { TextField } from '@/components/common/FormField'
import { Button } from '@/components/common/Button'
import { RoleBadge, UserStatusBadge } from '@/components/common/Badge'

export default function ProfilePage() {
  const { user } = useAuth()
  const { show } = useToast()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [department, setDepartment] = useState(user?.department ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  if (!user) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = 'Full name is required.'
    if (!phone.trim()) next.phone = 'Phone number is required.'
    if (!department.trim()) next.department = 'Department is required.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      await userService.update(user.id, { fullName: fullName.trim(), phone: phone.trim(), department: department.trim() })
      show('Profile updated successfully.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell title="My Profile">
      <div className="mx-auto max-w-xl rounded-md border border-ink-100 dark:border-ink-700 bg-white dark:border-ink-700 dark:bg-ink-900 p-6 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-800 text-lg font-semibold text-white">
            {user.fullName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-ink-900 dark:text-ink-50">{user.fullName}</p>
            <div className="mt-1 flex gap-2">
              <RoleBadge role={user.role} />
              <UserStatusBadge status={user.status} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <TextField label="Email" value={user.email} disabled hint="Contact your admin to change your email." />
          <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} required />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} required />
            <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} error={errors.department} required />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save Changes'}</Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
